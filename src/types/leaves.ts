export type LeaveDuration = 'FULL_DAY' | 'HALF_DAY';

export type LeaveResponse = {
  id: string;
  date: string;
  employeeName: string;
  type: string;
  duration: LeaveDuration;
  startTime: string;
  applyOn: string;
  reason: string;
};

export type LeaveApplicationRequest = {
  leaveCategoryId: string;
  dates: string[];
  duration: LeaveDuration;
  startTime: string;
  description: string | undefined;
};

export type LeaveApplicationResponse = {
  id: string;
  date: string;
  leaveCategoryName: string;
  duration: LeaveDuration;
  startTime: string | null;
  description: string | null;
};

export type updateLeaveRequest = {
  leaveCategoryId: string;
  date: string;
  duration: LeaveDuration;
  startTime: string;
  description: string | undefined;
};
