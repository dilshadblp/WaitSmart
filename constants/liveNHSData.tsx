// ============================================================
// Live NHS data provider — single source of truth.
// Monthly updates: edit nhs-live-stats.json on GitHub.
// Never edit this file or nhsData.ts again.
// ============================================================
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { CONFIG } from './config';
import { DATA_SOURCE, NHS_RTT_DATA, SpecialtyData } from './nhsData';

const CACHE_KEY = 'nhs_full_data_cache_v1';

export type NHSLiveData = {
  lastUpdated: string;
  dataPeriod: string;
  source: string;
  sourceUrl: string;
  totalWaiting: number;
  nationalMedian: number;
  percentWithin18Weeks: number;
  over18Weeks: number;
  rttData: Record<string, SpecialtyData>;
};

const FALLBACK: NHSLiveData = {
  lastUpdated: 'bundled',
  dataPeriod: DATA_SOURCE.period,
  source: DATA_SOURCE.name,
  sourceUrl: DATA_SOURCE.url,
  totalWaiting: DATA_SOURCE.totalWaiting,
  nationalMedian: DATA_SOURCE.nationalMedian,
  percentWithin18Weeks: 65,
  over18Weeks: 2530000,
  rttData: NHS_RTT_DATA,
};

function isValid(json: any): boolean {
  return (
    json &&
    typeof json.totalWaiting === 'number' &&
    typeof json.nationalMedian === 'number' &&
    typeof json.dataPeriod === 'string' &&
    json.rttData &&
    typeof json.rttData === 'object' &&
    Object.keys(json.rttData).length > 0 &&
    Object.values(json.rttData).every(
      (s: any) => Array.isArray(s.hospitals) && s.hospitals.length > 0
    )
  );
}

async function loadNHSData(): Promise<NHSLiveData> {
  try {
    const res = await fetch(CONFIG.NHS_STATS_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (!isValid(json)) throw new Error('Invalid data shape');
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(json));
    return json as NHSLiveData;
  } catch {
    const cached = await AsyncStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (isValid(parsed)) return parsed as NHSLiveData;
      } catch {}
    }
    return FALLBACK;
  }
}

const NHSDataContext = createContext<NHSLiveData>(FALLBACK);

export function NHSDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<NHSLiveData>(FALLBACK);
  useEffect(() => {
    let mounted = true;
    loadNHSData().then(d => { if (mounted) setData(d); });
    return () => { mounted = false; };
  }, []);
  return <NHSDataContext.Provider value={data}>{children}</NHSDataContext.Provider>;
}

export function useNHSData() {
  const data = useContext(NHSDataContext);
  return {
    ...data,
    specialtyNames: Object.keys(data.rttData),
    allHospitalNames: Array.from(
      new Set(Object.values(data.rttData).flatMap(s => s.hospitals.map(h => h.name)))
    ).sort(),
  };
}