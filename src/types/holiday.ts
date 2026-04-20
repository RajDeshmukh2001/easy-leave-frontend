import type { DateRange } from 'react-day-picker';

export type HolidayType = 'FIXED' | 'OPTIONAL';

export type Holiday = {
  name: string;
  type: HolidayType;
  date: DateRange | undefined;
};
