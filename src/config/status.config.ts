import type { RequestStatus } from '@/constants/request';

type StatusConfig = {
  label: string;
  style: string;
};

export const REQUEST_STATUS_CONFIG: Record<RequestStatus, StatusConfig> = {
  PENDING: {
    label: 'Pending',
    style: 'bg-blue-100 text-blue-700',
  },
  REJECTED: {
    label: 'Rejected',
    style: 'bg-gray-100 text-gray-600',
  },
  APPROVED: {
    label: 'Approved',
    style: 'bg-green-100 text-green-700',
  },
  ALL: {
    label: 'All',
    style: 'bg-gray-50 text-gray-500',
  },
};
