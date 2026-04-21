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

export type HolidayResponse = HolidayRequest & {
  id: string;
};

export type HolidayListResponse = {
  id: string;
  name: string;
  date: string;
  type: HolidayType;
};
