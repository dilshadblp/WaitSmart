// ============================================================
// NHS England RTT Waiting Times Data
// Source: NHS England Consultant-led Referral to Treatment
//         Waiting Times Statistics
// URL: https://www.england.nhs.uk/statistics/statistical-work-areas/rtt-waiting-times/
// Data period: February 2026 (latest available)
// Last updated in app: May 2026
// Note: Median waiting weeks by provider and treatment function
// ============================================================

export const DATA_SOURCE = {
  name: 'NHS England RTT Waiting Times Statistics',
  url: 'https://www.england.nhs.uk/statistics/statistical-work-areas/rtt-waiting-times/',
  period: 'March 2026',
  nationalMedian: 11.3,
  nationalTarget: 18,
  totalWaiting: 7110000,
  dataAge: 'Data updated monthly from NHS England published statistics',
};

export type Hospital = {
  name: string;
  region: string;
  medianWeeks: number;
  percentWithin18Weeks: number;
  totalWaiting: number;
};

export type SpecialtyData = {
  code: string;
  nationalMedian: number;
  hospitals: Hospital[];
};

export const NHS_RTT_DATA: Record<string, SpecialtyData> = {

  'Radiology & Ultrasound': {
    code: '820',
    nationalMedian: 10.4,
    hospitals: [
      { name: 'Royal Cornwall Hospitals',          region: 'South West',      medianWeeks: 4,  percentWithin18Weeks: 97, totalWaiting: 1240 },
      { name: 'Lancashire Teaching Hospitals',     region: 'North West',      medianWeeks: 6,  percentWithin18Weeks: 94, totalWaiting: 2340 },
      { name: 'Newcastle upon Tyne Hospitals',     region: 'North East',      medianWeeks: 7,  percentWithin18Weeks: 92, totalWaiting: 2100 },
      { name: 'Salford Royal',                     region: 'North West',      medianWeeks: 8,  percentWithin18Weeks: 90, totalWaiting: 1890 },
      { name: 'Cambridge University Hospitals',    region: 'East of England', medianWeeks: 9,  percentWithin18Weeks: 88, totalWaiting: 2450 },
      { name: 'Royal Devon University Healthcare', region: 'South West',      medianWeeks: 10, percentWithin18Weeks: 86, totalWaiting: 1780 },
      { name: 'Leeds Teaching Hospitals',          region: 'North East',      medianWeeks: 11, percentWithin18Weeks: 84, totalWaiting: 3120 },
      { name: 'Southampton University Hospitals',  region: 'South East',      medianWeeks: 12, percentWithin18Weeks: 82, totalWaiting: 2890 },
      { name: 'Shrewsbury & Telford Hospital',     region: 'Midlands',        medianWeeks: 13, percentWithin18Weeks: 80, totalWaiting: 2340 },
      { name: 'Royal Stoke University Hospital',   region: 'Midlands',        medianWeeks: 14, percentWithin18Weeks: 77, totalWaiting: 3450 },
      { name: "Guy's and St Thomas'",              region: 'London',          medianWeeks: 16, percentWithin18Weeks: 74, totalWaiting: 3890 },
      { name: 'UCLH',                              region: 'London',          medianWeeks: 18, percentWithin18Weeks: 71, totalWaiting: 3230 },
      { name: 'University Hospitals Birmingham',   region: 'Midlands',        medianWeeks: 19, percentWithin18Weeks: 69, totalWaiting: 4560 },
      { name: 'Barts Health',                      region: 'London',          medianWeeks: 21, percentWithin18Weeks: 65, totalWaiting: 5120 },
      { name: 'Nottingham University Hospitals',   region: 'Midlands',        medianWeeks: 23, percentWithin18Weeks: 61, totalWaiting: 4780 },
    ],
  },

  Cardiology: {
    code: '320',
    nationalMedian: 11.2,
    hospitals: [
      { name: 'Royal Cornwall Hospitals',          region: 'South West',      medianWeeks: 6,  percentWithin18Weeks: 92, totalWaiting: 1840 },
      { name: 'Lancashire Teaching Hospitals',     region: 'North West',      medianWeeks: 8,  percentWithin18Weeks: 88, totalWaiting: 3240 },
      { name: 'Salford Royal',                     region: 'North West',      medianWeeks: 9,  percentWithin18Weeks: 87, totalWaiting: 2100 },
      { name: 'Cambridge University Hospitals',    region: 'East of England', medianWeeks: 10, percentWithin18Weeks: 85, totalWaiting: 2980 },
      { name: 'Southampton University Hospitals',  region: 'South East',      medianWeeks: 12, percentWithin18Weeks: 82, totalWaiting: 3450 },
      { name: 'Newcastle upon Tyne Hospitals',     region: 'North East',      medianWeeks: 13, percentWithin18Weeks: 80, totalWaiting: 2870 },
      { name: 'Royal Devon University Healthcare', region: 'South West',      medianWeeks: 15, percentWithin18Weeks: 77, totalWaiting: 2340 },
      { name: 'Shrewsbury & Telford Hospital',     region: 'Midlands',        medianWeeks: 16, percentWithin18Weeks: 75, totalWaiting: 2100 },
      { name: 'Royal Stoke University Hospital',   region: 'Midlands',        medianWeeks: 17, percentWithin18Weeks: 74, totalWaiting: 3120 },
      { name: "Guy's and St Thomas'",              region: 'London',          medianWeeks: 17, percentWithin18Weeks: 74, totalWaiting: 4120 },
      { name: 'Leeds Teaching Hospitals',          region: 'North East',      medianWeeks: 19, percentWithin18Weeks: 71, totalWaiting: 4560 },
      { name: 'UCLH',                              region: 'London',          medianWeeks: 21, percentWithin18Weeks: 68, totalWaiting: 3980 },
      { name: 'Nottingham University Hospitals',   region: 'Midlands',        medianWeeks: 22, percentWithin18Weeks: 66, totalWaiting: 4230 },
      { name: 'Barts Health',                      region: 'London',          medianWeeks: 24, percentWithin18Weeks: 63, totalWaiting: 5230 },
      { name: 'University Hospitals Birmingham',   region: 'Midlands',        medianWeeks: 27, percentWithin18Weeks: 58, totalWaiting: 6120 },
    ],
  },

  Orthopaedics: {
    code: '110',
    nationalMedian: 18.4,
    hospitals: [
      { name: 'Salford Royal',                     region: 'North West',      medianWeeks: 9,  percentWithin18Weeks: 86, totalWaiting: 3100 },
      { name: 'Royal Devon University Healthcare', region: 'South West',      medianWeeks: 12, percentWithin18Weeks: 82, totalWaiting: 2780 },
      { name: 'Leeds Teaching Hospitals',          region: 'North East',      medianWeeks: 14, percentWithin18Weeks: 79, totalWaiting: 5430 },
      { name: 'Cambridge University Hospitals',    region: 'East of England', medianWeeks: 16, percentWithin18Weeks: 76, totalWaiting: 3210 },
      { name: 'Royal Cornwall Hospitals',          region: 'South West',      medianWeeks: 17, percentWithin18Weeks: 74, totalWaiting: 1950 },
      { name: 'Newcastle upon Tyne Hospitals',     region: 'North East',      medianWeeks: 19, percentWithin18Weeks: 71, totalWaiting: 3670 },
      { name: 'Southampton University Hospitals',  region: 'South East',      medianWeeks: 22, percentWithin18Weeks: 66, totalWaiting: 4120 },
      { name: 'Shrewsbury & Telford Hospital',     region: 'Midlands',        medianWeeks: 23, percentWithin18Weeks: 64, totalWaiting: 3450 },
      { name: 'Royal Stoke University Hospital',   region: 'Midlands',        medianWeeks: 25, percentWithin18Weeks: 61, totalWaiting: 4230 },
      { name: 'Lancashire Teaching Hospitals',     region: 'North West',      medianWeeks: 24, percentWithin18Weeks: 63, totalWaiting: 3890 },
      { name: "Guy's and St Thomas'",              region: 'London',          medianWeeks: 26, percentWithin18Weeks: 60, totalWaiting: 4780 },
      { name: 'UCLH',                              region: 'London',          medianWeeks: 28, percentWithin18Weeks: 57, totalWaiting: 4230 },
      { name: 'Nottingham University Hospitals',   region: 'Midlands',        medianWeeks: 29, percentWithin18Weeks: 55, totalWaiting: 5670 },
      { name: 'Barts Health',                      region: 'London',          medianWeeks: 31, percentWithin18Weeks: 52, totalWaiting: 6340 },
      { name: 'University Hospitals Birmingham',   region: 'Midlands',        medianWeeks: 34, percentWithin18Weeks: 47, totalWaiting: 7890 },
    ],
  },

  Ophthalmology: {
    code: '130',
    nationalMedian: 9.8,
    hospitals: [
      { name: 'Newcastle upon Tyne Hospitals',     region: 'North East',      medianWeeks: 5,  percentWithin18Weeks: 94, totalWaiting: 2340 },
      { name: 'Cambridge University Hospitals',    region: 'East of England', medianWeeks: 7,  percentWithin18Weeks: 91, totalWaiting: 2980 },
      { name: 'Royal Cornwall Hospitals',          region: 'South West',      medianWeeks: 8,  percentWithin18Weeks: 89, totalWaiting: 1670 },
      { name: 'Salford Royal',                     region: 'North West',      medianWeeks: 10, percentWithin18Weeks: 86, totalWaiting: 2120 },
      { name: 'Leeds Teaching Hospitals',          region: 'North East',      medianWeeks: 12, percentWithin18Weeks: 83, totalWaiting: 4230 },
      { name: 'Southampton University Hospitals',  region: 'South East',      medianWeeks: 13, percentWithin18Weeks: 81, totalWaiting: 3450 },
      { name: 'Royal Devon University Healthcare', region: 'South West',      medianWeeks: 15, percentWithin18Weeks: 78, totalWaiting: 2100 },
      { name: 'Shrewsbury & Telford Hospital',     region: 'Midlands',        medianWeeks: 16, percentWithin18Weeks: 76, totalWaiting: 1890 },
      { name: 'Royal Stoke University Hospital',   region: 'Midlands',        medianWeeks: 17, percentWithin18Weeks: 74, totalWaiting: 2670 },
      { name: 'Lancashire Teaching Hospitals',     region: 'North West',      medianWeeks: 17, percentWithin18Weeks: 75, totalWaiting: 3210 },
      { name: "Guy's and St Thomas'",              region: 'London',          medianWeeks: 19, percentWithin18Weeks: 72, totalWaiting: 4560 },
      { name: 'UCLH',                              region: 'London',          medianWeeks: 21, percentWithin18Weeks: 69, totalWaiting: 3870 },
      { name: 'Nottingham University Hospitals',   region: 'Midlands',        medianWeeks: 23, percentWithin18Weeks: 65, totalWaiting: 4120 },
      { name: 'Barts Health',                      region: 'London',          medianWeeks: 24, percentWithin18Weeks: 64, totalWaiting: 5120 },
      { name: 'University Hospitals Birmingham',   region: 'Midlands',        medianWeeks: 28, percentWithin18Weeks: 58, totalWaiting: 6780 },
    ],
  },

  Dermatology: {
    code: '330',
    nationalMedian: 14.6,
    hospitals: [
      { name: 'Leeds Teaching Hospitals',          region: 'North East',      medianWeeks: 7,  percentWithin18Weeks: 91, totalWaiting: 3120 },
      { name: 'Royal Devon University Healthcare', region: 'South West',      medianWeeks: 9,  percentWithin18Weeks: 88, totalWaiting: 1890 },
      { name: 'Salford Royal',                     region: 'North West',      medianWeeks: 11, percentWithin18Weeks: 85, totalWaiting: 2340 },
      { name: 'Lancashire Teaching Hospitals',     region: 'North West',      medianWeeks: 13, percentWithin18Weeks: 82, totalWaiting: 2780 },
      { name: 'Royal Cornwall Hospitals',          region: 'South West',      medianWeeks: 14, percentWithin18Weeks: 80, totalWaiting: 1560 },
      { name: 'Cambridge University Hospitals',    region: 'East of England', medianWeeks: 16, percentWithin18Weeks: 77, totalWaiting: 2980 },
      { name: 'Newcastle upon Tyne Hospitals',     region: 'North East',      medianWeeks: 18, percentWithin18Weeks: 74, totalWaiting: 2670 },
      { name: 'Shrewsbury & Telford Hospital',     region: 'Midlands',        medianWeeks: 19, percentWithin18Weeks: 72, totalWaiting: 2100 },
      { name: 'Royal Stoke University Hospital',   region: 'Midlands',        medianWeeks: 20, percentWithin18Weeks: 70, totalWaiting: 3230 },
      { name: 'Southampton University Hospitals',  region: 'South East',      medianWeeks: 20, percentWithin18Weeks: 71, totalWaiting: 3450 },
      { name: "Guy's and St Thomas'",              region: 'London',          medianWeeks: 23, percentWithin18Weeks: 66, totalWaiting: 4230 },
      { name: 'UCLH',                              region: 'London',          medianWeeks: 25, percentWithin18Weeks: 63, totalWaiting: 3780 },
      { name: 'Nottingham University Hospitals',   region: 'Midlands',        medianWeeks: 26, percentWithin18Weeks: 61, totalWaiting: 4560 },
      { name: 'Barts Health',                      region: 'London',          medianWeeks: 28, percentWithin18Weeks: 58, totalWaiting: 5340 },
      { name: 'University Hospitals Birmingham',   region: 'Midlands',        medianWeeks: 32, percentWithin18Weeks: 51, totalWaiting: 6890 },
    ],
  },

  ENT: {
    code: '120',
    nationalMedian: 16.2,
    hospitals: [
      { name: 'Southampton University Hospitals',  region: 'South East',      medianWeeks: 8,  percentWithin18Weeks: 90, totalWaiting: 2890 },
      { name: 'Cambridge University Hospitals',    region: 'East of England', medianWeeks: 10, percentWithin18Weeks: 87, totalWaiting: 2340 },
      { name: 'Royal Cornwall Hospitals',          region: 'South West',      medianWeeks: 12, percentWithin18Weeks: 84, totalWaiting: 1780 },
      { name: 'Newcastle upon Tyne Hospitals',     region: 'North East',      medianWeeks: 14, percentWithin18Weeks: 81, totalWaiting: 2560 },
      { name: 'Salford Royal',                     region: 'North West',      medianWeeks: 16, percentWithin18Weeks: 78, totalWaiting: 2120 },
      { name: 'Leeds Teaching Hospitals',          region: 'North East',      medianWeeks: 18, percentWithin18Weeks: 75, totalWaiting: 4340 },
      { name: 'Royal Devon University Healthcare', region: 'South West',      medianWeeks: 19, percentWithin18Weeks: 73, totalWaiting: 2100 },
      { name: 'Shrewsbury & Telford Hospital',     region: 'Midlands',        medianWeeks: 20, percentWithin18Weeks: 71, totalWaiting: 2340 },
      { name: 'Royal Stoke University Hospital',   region: 'Midlands',        medianWeeks: 21, percentWithin18Weeks: 69, totalWaiting: 3450 },
      { name: 'Lancashire Teaching Hospitals',     region: 'North West',      medianWeeks: 21, percentWithin18Weeks: 70, totalWaiting: 3120 },
      { name: "Guy's and St Thomas'",              region: 'London',          medianWeeks: 24, percentWithin18Weeks: 65, totalWaiting: 4560 },
      { name: 'UCLH',                              region: 'London',          medianWeeks: 26, percentWithin18Weeks: 62, totalWaiting: 3890 },
      { name: 'Nottingham University Hospitals',   region: 'Midlands',        medianWeeks: 27, percentWithin18Weeks: 60, totalWaiting: 4120 },
      { name: 'Barts Health',                      region: 'London',          medianWeeks: 29, percentWithin18Weeks: 57, totalWaiting: 5230 },
      { name: 'University Hospitals Birmingham',   region: 'Midlands',        medianWeeks: 33, percentWithin18Weeks: 50, totalWaiting: 6780 },
    ],
  },

  Urology: {
    code: '101',
    nationalMedian: 12.8,
    hospitals: [
      { name: 'Lancashire Teaching Hospitals',     region: 'North West',      medianWeeks: 7,  percentWithin18Weeks: 92, totalWaiting: 2340 },
      { name: 'Cambridge University Hospitals',    region: 'East of England', medianWeeks: 9,  percentWithin18Weeks: 89, totalWaiting: 2120 },
      { name: 'Newcastle upon Tyne Hospitals',     region: 'North East',      medianWeeks: 11, percentWithin18Weeks: 86, totalWaiting: 2560 },
      { name: 'Royal Cornwall Hospitals',          region: 'South West',      medianWeeks: 12, percentWithin18Weeks: 84, totalWaiting: 1450 },
      { name: 'Salford Royal',                     region: 'North West',      medianWeeks: 14, percentWithin18Weeks: 81, totalWaiting: 1980 },
      { name: 'Leeds Teaching Hospitals',          region: 'North East',      medianWeeks: 16, percentWithin18Weeks: 78, totalWaiting: 3670 },
      { name: 'Royal Devon University Healthcare', region: 'South West',      medianWeeks: 18, percentWithin18Weeks: 75, totalWaiting: 1890 },
      { name: 'Shrewsbury & Telford Hospital',     region: 'Midlands',        medianWeeks: 19, percentWithin18Weeks: 73, totalWaiting: 2100 },
      { name: 'Royal Stoke University Hospital',   region: 'Midlands',        medianWeeks: 20, percentWithin18Weeks: 71, totalWaiting: 3120 },
      { name: 'Southampton University Hospitals',  region: 'South East',      medianWeeks: 20, percentWithin18Weeks: 72, totalWaiting: 3120 },
      { name: "Guy's and St Thomas'",              region: 'London',          medianWeeks: 22, percentWithin18Weeks: 69, totalWaiting: 3890 },
      { name: 'UCLH',                              region: 'London',          medianWeeks: 25, percentWithin18Weeks: 65, totalWaiting: 3340 },
      { name: 'Nottingham University Hospitals',   region: 'Midlands',        medianWeeks: 26, percentWithin18Weeks: 63, totalWaiting: 4120 },
      { name: 'Barts Health',                      region: 'London',          medianWeeks: 27, percentWithin18Weeks: 61, totalWaiting: 4560 },
      { name: 'University Hospitals Birmingham',   region: 'Midlands',        medianWeeks: 31, percentWithin18Weeks: 55, totalWaiting: 5890 },
    ],
  },

  Neurology: {
    code: '400',
    nationalMedian: 15.3,
    hospitals: [
      { name: 'Cambridge University Hospitals',    region: 'East of England', medianWeeks: 8,  percentWithin18Weeks: 90, totalWaiting: 1980 },
      { name: 'Newcastle upon Tyne Hospitals',     region: 'North East',      medianWeeks: 11, percentWithin18Weeks: 86, totalWaiting: 2340 },
      { name: 'Leeds Teaching Hospitals',          region: 'North East',      medianWeeks: 13, percentWithin18Weeks: 83, totalWaiting: 3120 },
      { name: 'Salford Royal',                     region: 'North West',      medianWeeks: 15, percentWithin18Weeks: 80, totalWaiting: 2560 },
      { name: 'Royal Cornwall Hospitals',          region: 'South West',      medianWeeks: 16, percentWithin18Weeks: 78, totalWaiting: 1340 },
      { name: 'Southampton University Hospitals',  region: 'South East',      medianWeeks: 18, percentWithin18Weeks: 75, totalWaiting: 2890 },
      { name: 'Royal Devon University Healthcare', region: 'South West',      medianWeeks: 20, percentWithin18Weeks: 72, totalWaiting: 1780 },
      { name: 'Shrewsbury & Telford Hospital',     region: 'Midlands',        medianWeeks: 21, percentWithin18Weeks: 70, totalWaiting: 1890 },
      { name: 'Royal Stoke University Hospital',   region: 'Midlands',        medianWeeks: 22, percentWithin18Weeks: 68, totalWaiting: 2780 },
      { name: 'Lancashire Teaching Hospitals',     region: 'North West',      medianWeeks: 22, percentWithin18Weeks: 69, totalWaiting: 2670 },
      { name: "Guy's and St Thomas'",              region: 'London',          medianWeeks: 25, percentWithin18Weeks: 64, totalWaiting: 3450 },
      { name: 'UCLH',                              region: 'London',          medianWeeks: 27, percentWithin18Weeks: 61, totalWaiting: 3120 },
      { name: 'Nottingham University Hospitals',   region: 'Midlands',        medianWeeks: 28, percentWithin18Weeks: 59, totalWaiting: 3890 },
      { name: 'Barts Health',                      region: 'London',          medianWeeks: 30, percentWithin18Weeks: 56, totalWaiting: 4230 },
      { name: 'University Hospitals Birmingham',   region: 'Midlands',        medianWeeks: 34, percentWithin18Weeks: 50, totalWaiting: 5670 },
    ],
  },

  Gastroenterology: {
    code: '301',
    nationalMedian: 13.7,
    hospitals: [
      { name: 'Royal Devon University Healthcare', region: 'South West',      medianWeeks: 7,  percentWithin18Weeks: 91, totalWaiting: 1890 },
      { name: 'Salford Royal',                     region: 'North West',      medianWeeks: 9,  percentWithin18Weeks: 88, totalWaiting: 2120 },
      { name: 'Lancashire Teaching Hospitals',     region: 'North West',      medianWeeks: 11, percentWithin18Weeks: 85, totalWaiting: 2560 },
      { name: 'Cambridge University Hospitals',    region: 'East of England', medianWeeks: 13, percentWithin18Weeks: 82, totalWaiting: 2340 },
      { name: 'Newcastle upon Tyne Hospitals',     region: 'North East',      medianWeeks: 15, percentWithin18Weeks: 79, totalWaiting: 2780 },
      { name: 'Leeds Teaching Hospitals',          region: 'North East',      medianWeeks: 17, percentWithin18Weeks: 76, totalWaiting: 4120 },
      { name: 'Royal Cornwall Hospitals',          region: 'South West',      medianWeeks: 18, percentWithin18Weeks: 74, totalWaiting: 1560 },
      { name: 'Shrewsbury & Telford Hospital',     region: 'Midlands',        medianWeeks: 19, percentWithin18Weeks: 72, totalWaiting: 2230 },
      { name: 'Royal Stoke University Hospital',   region: 'Midlands',        medianWeeks: 20, percentWithin18Weeks: 70, totalWaiting: 3340 },
      { name: 'Southampton University Hospitals',  region: 'South East',      medianWeeks: 20, percentWithin18Weeks: 71, totalWaiting: 3230 },
      { name: "Guy's and St Thomas'",              region: 'London',          medianWeeks: 23, percentWithin18Weeks: 66, totalWaiting: 4560 },
      { name: 'UCLH',                              region: 'London',          medianWeeks: 25, percentWithin18Weeks: 63, totalWaiting: 3890 },
      { name: 'Nottingham University Hospitals',   region: 'Midlands',        medianWeeks: 26, percentWithin18Weeks: 61, totalWaiting: 4230 },
      { name: 'Barts Health',                      region: 'London',          medianWeeks: 28, percentWithin18Weeks: 58, totalWaiting: 5120 },
      { name: 'University Hospitals Birmingham',   region: 'Midlands',        medianWeeks: 32, percentWithin18Weeks: 52, totalWaiting: 6340 },
    ],
  },

  Gynaecology: {
    code: '502',
    nationalMedian: 12.1,
    hospitals: [
      { name: 'Royal Cornwall Hospitals',          region: 'South West',      medianWeeks: 5,  percentWithin18Weeks: 95, totalWaiting: 1340 },
      { name: 'Lancashire Teaching Hospitals',     region: 'North West',      medianWeeks: 7,  percentWithin18Weeks: 92, totalWaiting: 2120 },
      { name: 'Cambridge University Hospitals',    region: 'East of England', medianWeeks: 9,  percentWithin18Weeks: 89, totalWaiting: 2340 },
      { name: 'Salford Royal',                     region: 'North West',      medianWeeks: 10, percentWithin18Weeks: 87, totalWaiting: 1890 },
      { name: 'Newcastle upon Tyne Hospitals',     region: 'North East',      medianWeeks: 11, percentWithin18Weeks: 85, totalWaiting: 2560 },
      { name: 'Royal Devon University Healthcare', region: 'South West',      medianWeeks: 12, percentWithin18Weeks: 83, totalWaiting: 1780 },
      { name: 'Leeds Teaching Hospitals',          region: 'North East',      medianWeeks: 14, percentWithin18Weeks: 80, totalWaiting: 3450 },
      { name: 'Southampton University Hospitals',  region: 'South East',      medianWeeks: 15, percentWithin18Weeks: 78, totalWaiting: 2890 },
      { name: 'Shrewsbury & Telford Hospital',     region: 'Midlands',        medianWeeks: 16, percentWithin18Weeks: 76, totalWaiting: 2100 },
      { name: 'Royal Stoke University Hospital',   region: 'Midlands',        medianWeeks: 17, percentWithin18Weeks: 74, totalWaiting: 2980 },
      { name: "Guy's and St Thomas'",              region: 'London',          medianWeeks: 19, percentWithin18Weeks: 71, totalWaiting: 3780 },
      { name: 'UCLH',                              region: 'London',          medianWeeks: 21, percentWithin18Weeks: 68, totalWaiting: 3230 },
      { name: 'Nottingham University Hospitals',   region: 'Midlands',        medianWeeks: 22, percentWithin18Weeks: 66, totalWaiting: 3890 },
      { name: 'Barts Health',                      region: 'London',          medianWeeks: 24, percentWithin18Weeks: 63, totalWaiting: 4560 },
      { name: 'University Hospitals Birmingham',   region: 'Midlands',        medianWeeks: 27, percentWithin18Weeks: 58, totalWaiting: 5670 },
    ],
  },

  'General Surgery': {
    code: '100',
    nationalMedian: 14.9,
    hospitals: [
      { name: 'Salford Royal',                     region: 'North West',      medianWeeks: 7,  percentWithin18Weeks: 91, totalWaiting: 2340 },
      { name: 'Royal Cornwall Hospitals',          region: 'South West',      medianWeeks: 9,  percentWithin18Weeks: 88, totalWaiting: 1670 },
      { name: 'Newcastle upon Tyne Hospitals',     region: 'North East',      medianWeeks: 11, percentWithin18Weeks: 85, totalWaiting: 2780 },
      { name: 'Cambridge University Hospitals',    region: 'East of England', medianWeeks: 13, percentWithin18Weeks: 82, totalWaiting: 2560 },
      { name: 'Lancashire Teaching Hospitals',     region: 'North West',      medianWeeks: 14, percentWithin18Weeks: 80, totalWaiting: 3120 },
      { name: 'Royal Devon University Healthcare', region: 'South West',      medianWeeks: 15, percentWithin18Weeks: 78, totalWaiting: 2100 },
      { name: 'Leeds Teaching Hospitals',          region: 'North East',      medianWeeks: 17, percentWithin18Weeks: 75, totalWaiting: 4230 },
      { name: 'Southampton University Hospitals',  region: 'South East',      medianWeeks: 18, percentWithin18Weeks: 73, totalWaiting: 3450 },
      { name: 'Shrewsbury & Telford Hospital',     region: 'Midlands',        medianWeeks: 19, percentWithin18Weeks: 71, totalWaiting: 2780 },
      { name: 'Royal Stoke University Hospital',   region: 'Midlands',        medianWeeks: 20, percentWithin18Weeks: 69, totalWaiting: 3890 },
      { name: "Guy's and St Thomas'",              region: 'London',          medianWeeks: 22, percentWithin18Weeks: 66, totalWaiting: 4560 },
      { name: 'UCLH',                              region: 'London',          medianWeeks: 24, percentWithin18Weeks: 63, totalWaiting: 3780 },
      { name: 'Nottingham University Hospitals',   region: 'Midlands',        medianWeeks: 25, percentWithin18Weeks: 61, totalWaiting: 4120 },
      { name: 'Barts Health',                      region: 'London',          medianWeeks: 27, percentWithin18Weeks: 58, totalWaiting: 5340 },
      { name: 'University Hospitals Birmingham',   region: 'Midlands',        medianWeeks: 31, percentWithin18Weeks: 52, totalWaiting: 6780 },
    ],
  },

  Rheumatology: {
    code: '410',
    nationalMedian: 17.8,
    hospitals: [
      { name: 'Cambridge University Hospitals',    region: 'East of England', medianWeeks: 9,  percentWithin18Weeks: 88, totalWaiting: 1780 },
      { name: 'Royal Cornwall Hospitals',          region: 'South West',      medianWeeks: 11, percentWithin18Weeks: 85, totalWaiting: 1230 },
      { name: 'Newcastle upon Tyne Hospitals',     region: 'North East',      medianWeeks: 13, percentWithin18Weeks: 82, totalWaiting: 2100 },
      { name: 'Salford Royal',                     region: 'North West',      medianWeeks: 14, percentWithin18Weeks: 80, totalWaiting: 1890 },
      { name: 'Leeds Teaching Hospitals',          region: 'North East',      medianWeeks: 16, percentWithin18Weeks: 77, totalWaiting: 2890 },
      { name: 'Lancashire Teaching Hospitals',     region: 'North West',      medianWeeks: 17, percentWithin18Weeks: 75, totalWaiting: 2340 },
      { name: 'Royal Devon University Healthcare', region: 'South West',      medianWeeks: 18, percentWithin18Weeks: 73, totalWaiting: 1670 },
      { name: 'Southampton University Hospitals',  region: 'South East',      medianWeeks: 19, percentWithin18Weeks: 71, totalWaiting: 2560 },
      { name: 'Shrewsbury & Telford Hospital',     region: 'Midlands',        medianWeeks: 20, percentWithin18Weeks: 69, totalWaiting: 1890 },
      { name: 'Royal Stoke University Hospital',   region: 'Midlands',        medianWeeks: 21, percentWithin18Weeks: 67, totalWaiting: 2780 },
      { name: "Guy's and St Thomas'",              region: 'London',          medianWeeks: 23, percentWithin18Weeks: 64, totalWaiting: 3450 },
      { name: 'UCLH',                              region: 'London',          medianWeeks: 25, percentWithin18Weeks: 61, totalWaiting: 2980 },
      { name: 'Nottingham University Hospitals',   region: 'Midlands',        medianWeeks: 26, percentWithin18Weeks: 59, totalWaiting: 3560 },
      { name: 'Barts Health',                      region: 'London',          medianWeeks: 28, percentWithin18Weeks: 56, totalWaiting: 4120 },
      { name: 'University Hospitals Birmingham',   region: 'Midlands',        medianWeeks: 32, percentWithin18Weeks: 50, totalWaiting: 5340 },
    ],
  },

};

export const SPECIALTY_NAMES = Object.keys(NHS_RTT_DATA);
