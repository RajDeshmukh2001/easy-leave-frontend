import type { EmployeeLeaveRecord } from '@/types/employees';
import axiosInstance from './axiosInstance';
import type { PageResponse } from '@/types/pageResponse';

export const fetchYears = async (): Promise<string[]> => {
  const { data } = await axiosInstance.get('/api/annual-leaves/years');
  if (!data.success) {
    console.error('Error fetching years:', data.message);
    throw new Error(data.message || 'Failed to fetch years');
  }
  return data.data;
};
export const fetchEmployees = async (
  year: string,
  page: number = 0,
): Promise<PageResponse<EmployeeLeaveRecord>> => {
  const { data } = await axiosInstance.get(`/api/annual-leaves?year=${year}&page=${page}&size=20`);
  if (!data.success) throw new Error(data.message || 'Failed to fetch employees');
  return data.data;
};
