type DurationType = 'FULL_DAY' | 'HALF_DAY';

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
  duration: DurationType;
  startTime: string;
  description: string | undefined;
};

export type LeaveApplicationResponse = {
  id: string;
  date: string;
  leaveCategoryName: string;
  duration: DurationType;
  startTime: string | null;
  description: string | null;
};

export type LeaveCategoryResponse = {
  id: string;
  name: string;
};
