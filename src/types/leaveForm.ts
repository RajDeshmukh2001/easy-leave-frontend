import type { DateRange } from 'react-day-picker';
import type { LeaveDuration } from './leaves';

export type LeaveFormValues = {
  leaveCategoryId: string;
  holidayId: string;
  dateRange: DateRange | undefined;
  startTime: string;
  duration: LeaveDuration;
  description: string;
};
