import type { ManagerDashboardMetrics } from '@/types/dashboard';
import axiosInstance from './axiosInstance';

export const getManagerDashboardMetrics = async (): Promise<ManagerDashboardMetrics> => {
  const { data } = await axiosInstance.get('/api/dashboard/manager');
  if (!data.success) {
    throw new Error(data.message || 'Failed to fetch dashboard metrics');
  }
  console.log('Dashboard Metrics:', data.data);
  return data.data;
};
