import type { RequestScope, RequestStatus, RequestType } from '@/constants/request';
import type { LeaveDuration } from './leaves';
import type { DateRange } from 'react-day-picker';

export const REQUEST_PAGE_SIZE = 20;

export type RequestProps = {
  scope: RequestScope;
  status?: RequestStatus;
  page: number;
};

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
}

export type RaiseRequestFormValues = {
  requestType: RequestType | '';
  leaveCategoryId: string;
  dateRange: DateRange | undefined;
  duration: LeaveDuration;
  startTime: string;
  description: string;
};

export type RaiseRequestPayload = {
  requestType: RequestType;
  dates: string[];
  startTime: string;
  duration: LeaveDuration;
  description: string;
  leaveCategoryId?: string;
};

export type RaiseRequestResponse = {
  id: string;
  requestType: RequestType;
  dates: string[];
  duration: LeaveDuration;
  status: RequestStatus;
};
