import type { User } from '@/types/user';
import axiosInstance from './axiosInstance';
import type { ApiResponse } from '@/types/response';

export const getAuthenticatedUser = async (): Promise<User> => {
  const { data } = await axiosInstance.get<ApiResponse<User>>(`/api/auth/me`);
  if (!data.success) {
    console.error('Error fetching current user:', data.message);

    throw new Error(data.message || 'Failed to fetch current user');
  }
  return data.data;
};

export const logout = async (): Promise<void> => {
  const { data } = await axiosInstance.post<ApiResponse<void>>('/api/auth/logout');
  if (!data.success) {
    console.error('Error logging out:', data.message);
    throw new Error(data.message || 'Logout failed');
  }
};
