import type { RequestDuration, RequestStatus, RequestType } from '@/constants/Request';

export type RequestResponse = {
  id: string;
  date: string;
  description: string;
  employeeName: string;
  leaveCategory?: string;
  status: RequestStatus;
  type: RequestType;
  duration: RequestDuration;
  appliedDate: string;
};
