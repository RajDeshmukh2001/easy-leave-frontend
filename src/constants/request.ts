export type RequestScope = 'SELF' | 'ORGANIZATION';
export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'ALL';
export type RequestType = 'PAST_LEAVE' | 'COMPENSATORY_OFF' | 'ALL';
export type RequestDuration = 'FULL_DAY' | 'HALF_DAY';
export const REQUEST_STATUS_OPTIONS: RequestStatus[] = ['ALL', 'PENDING', 'APPROVED', 'REJECTED'];
