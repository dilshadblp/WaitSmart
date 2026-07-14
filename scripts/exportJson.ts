import * as fs from 'fs';
import { DATA_SOURCE, NHS_RTT_DATA } from '../constants/nhsData';

const output = {
  lastUpdated: 'June 2026',
  dataPeriod: 'April 2026',
  source: DATA_SOURCE.name,
  sourceUrl: DATA_SOURCE.url,
  totalWaiting: 7220000,
  nationalMedian: 11.9,
  percentWithin18Weeks: 65,
  over18Weeks: 2530000,
  nextUpdateDue: 'July 2026',
  rttData: NHS_RTT_DATA,
};

fs.writeFileSync('nhs-live-stats.json', JSON.stringify(output, null, 2));
console.log('✓ nhs-live-stats.json written with', Object.keys(NHS_RTT_DATA).length, 'specialties');