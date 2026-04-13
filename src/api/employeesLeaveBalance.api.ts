import type { ApiResponse } from '@/types/response';
import type { EmployeeLeaveRecord, SingleEmployeeLeaveRecord } from '@/types/employeeLeaveBalance';
import axiosInstance from './axiosInstance';
import type { PageResponse } from '@/types/pageResponse';
import type { ApiResponse } from '@/types/response';

export const fetchYears = async (): Promise<string[]> => {
  const { data } = await axiosInstance.get<ApiResponse<string[]>>('/api/annual-leaves/years');
  if (!data.success) {
    throw new Error(data.message || 'Failed to fetch years');
  }
  return data.data;
};

export const fetchEmployeesLeaveRecord = async (
  year: string,
  page = 0,
): Promise<PageResponse<EmployeeLeaveRecord>> => {
  const { data } = await axiosInstance.get<ApiResponse<PageResponse<EmployeeLeaveRecord>>>(
    `/api/annual-leaves?year=${year}&page=${page}&size=20`,
  );
  if (!data.success) throw new Error(data.message || 'Failed to fetch employees');
  return data.data;
};

export const fetchSingleEmployeeLeaveRecord = async (
  userId: string | undefined,
  year: string,
): Promise<SingleEmployeeLeaveRecord[]> => {
  const { data } = await axiosInstance.get<ApiResponse<SingleEmployeeLeaveRecord[]>>(
    `/api/users/${userId}/leave-balance?year=${year}`,
  );
  if (!data.success) throw new Error(data.message || 'Failed to fetch employees');
  return data.data;
};
