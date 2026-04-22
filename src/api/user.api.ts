import type { ApiResponse } from '@/types/response';
import axiosInstance from './axiosInstance';

export type UserDetails = {
  email: string;
  name: string;
};

export const fetchUserDetails = async (userId: string | undefined): Promise<UserDetails> => {
  const { data } = await axiosInstance.get<ApiResponse<UserDetails>>(`/api/users/${userId}`);

  if (!data.success) {
    throw new Error(data.message || 'Failed to fetch user details');
  }
  return data.data;
};
