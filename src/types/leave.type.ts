export type LeaveApplication = {
  leaveCategoryId: string;
  dates: string[];
  duration: 'FULL_DAY' | 'HALF_DAY';
  startTime: string;
  description: string;
};
