export type LeaveResponse = {
  id: string;
  date: string;
  employeeName: string;
  type: string;
  duration: 'FULL_DAY' | 'HALF_DAY';
  startTime: string;
  applyOn: string;
  reason: string;
};

export type LeaveApplicationRequest = {
  leaveCategoryId: string;
  dates: string[];
  duration: 'FULL_DAY' | 'HALF_DAY';
  startTime: string;
  description: string | undefined;
};

export type LeaveCategoryResponse = {
  id: string;
  name: string;
};
