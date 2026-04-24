import type { RequestStatus, RequestType } from '@/constants/request';
import type { LeaveDuration } from './leaves';

export type RequestResponse = {
  id: string;
  date: string;
  description: string;
  employeeName: string;
  leaveCategory?: string;
  status: RequestStatus;
  type: RequestType;
  duration: LeaveDuration;
  appliedDate: string;
};
