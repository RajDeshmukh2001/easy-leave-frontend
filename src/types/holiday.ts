import type { DateRange } from 'react-day-picker';

export type HolidayType = 'FIXED' | 'OPTIONAL';

export type HolidayFromValues = {
  name: string;
  type: HolidayType;
  date: DateRange | undefined;
};

export type HolidayRequest = Pick<HolidayFromValues, 'name' | 'type'> & {
  date: string;
};

export type HolidayResponse = HolidayFromValues & {
  id: string;
};
