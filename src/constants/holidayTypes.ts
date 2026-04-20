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
