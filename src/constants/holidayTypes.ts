type HolidayOptions = {
  value: string;
  label: string;
};

export const HOLIDAY_TYPES: HolidayOptions[] = [
  {
    value: 'FIXED',
    label: 'Fixed',
  },
  {
    value: 'OPTIONAL',
    label: 'Optional',
  },
];

export type HolidayListOptions = 'all' | 'FIXED' | 'OPTIONAL';
export const HOLIDAY_LIST_OPTIONS = ['all', 'FIXED', 'OPTIONAL'];
