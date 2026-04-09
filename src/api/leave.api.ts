import type { ApiResponse } from '@/types/response';
import axiosInstance from './axiosInstance';
import type { LeaveScope, LeaveStatus } from '../constants/LeaveStatus';
import type { LeaveApplicationResponse, LeaveResponse } from '../types/leaves';
import type { LeaveApplicationRequest } from '@/types/leaves';

type Props = {
  status?: LeaveStatus;
  scope: LeaveScope;
};

export const fetchLeaves = async ({ status, scope = 'self' }: Props): Promise<LeaveResponse[]> => {
  const params: Record<string, string> = { scope };
  if (status && status !== 'all') params.status = status;

  const { data } = await axiosInstance.get<ApiResponse<LeaveResponse[]>>('/api/leaves', { params });
  if (!data.success) {
    console.error('Error fetching leaves:', data.message);
    throw new Error(data.message || 'Failed to fetch leaves');
  }
  return data.data;
};

export const applyLeave = async (
  leaveData: LeaveApplicationRequest,
): Promise<LeaveApplicationResponse[]> => {
  const { data } = await axiosInstance.post('/api/leaves', leaveData);
  if (!data.success) {
    console.error('Error applying for leave:', data.message);
    throw new Error(data.message || 'Failed to apply for leave');
  }
  return data.data;
};
