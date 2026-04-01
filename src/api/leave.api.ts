import type { ApiResponse } from '@/types/response';
import axiosInstance from './axiosInstance';
import type { LeaveScope, LeaveStatus } from '../constants/LeaveStatus';
import type { LeaveResponse } from '../types/leaves';
import type { LeaveApplication } from '@/types/leave.type';

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


export const applyLeave = async (leaveData: LeaveApplication): Promise<LeaveApplication> => {
  try {
    const response = await axiosInstance.post('/api/leaves', leaveData);
    return response.data.data;
  } catch (error) {
    console.error('Error applying for leave:', error);
    throw error;
  }
};
