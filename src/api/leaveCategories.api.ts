import type { LeaveCategoryResponse } from '../types/leaves';
import axiosInstance from './axiosinstance';

export const fetchLeaveCategories = async (): Promise<LeaveCategoryResponse[]> => {
  const { data } = await axiosInstance.get('/api/leave-categories');
  if (!data.success) {
    console.error('Error fetching leave categories:', data.message);
    throw new Error(data.message || 'Failed to fetch leave categories');
  }
  return data.data;
};
