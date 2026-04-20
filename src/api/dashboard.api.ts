import type { ManagerDashboardMetrics } from '@/types/dashboard';
import axiosInstance from './axiosInstance';
import type { ApiResponse } from '@/types/response';

export const getManagerDashboardMetrics = async (): Promise<ManagerDashboardMetrics> => {
  const { data } =
    await axiosInstance.get<ApiResponse<ManagerDashboardMetrics>>('/api/dashboard/manager');
  if (!data.success) {
    throw new Error(data.message || 'Failed to fetch dashboard metrics');
  }
  return data.data;
};
