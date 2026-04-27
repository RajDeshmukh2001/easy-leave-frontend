import { REQUEST_PAGE_SIZE, type RequestProps, type RequestResponse } from '@/types/request';
import type { ApiResponse } from '@/types/response';
import axiosInstance from './axiosInstance';
import type { PageResponse } from '@/types/pageResponse';

export const fetchRequests = async ({
  scope = 'SELF',
  status,
  page,
}: RequestProps): Promise<PageResponse<RequestResponse>> => {
  const params: Record<string, string | number> = { scope, page, size: REQUEST_PAGE_SIZE };
  if (status && status !== 'ALL') {
    params.status = status;
  }

  const { data } = await axiosInstance.get<ApiResponse<PageResponse<RequestResponse>>>(
    '/api/requests',
    { params },
  );

  if (!data.success) {
    throw new Error(data.message || 'Failed to fetch requests');
  }

  return data.data;
};
