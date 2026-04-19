import type { UserResponse } from '@/types/Users';
import axiosInstance from './axiosInstance';
import type { Role } from '@/types/auth';
import type { ApiResponse } from '@/types/response';

type EmployeeParams = {
  page?: number;
  size?: number;
};

type UpdateRoleParams = {
  employeeId: string;
  role: Role;
};
export type EmployeeApiResponse = {
  content: UserResponse[];
  last: boolean;
  totalPages: number;
  number: number;
};

export const getEmployees = async (params: EmployeeParams): Promise<EmployeeApiResponse> => {
  const { data } = await axiosInstance.get('/api/users', { params });

  if (!data.success) {
    throw new Error(data.message || 'Failed to fetch employees');
  }

  return data.data;
};

export const updateUserRole = async (params: UpdateRoleParams): Promise<void> => {
  const { data } = await axiosInstance.patch<ApiResponse<null>>('/api/users/role', {
    employeeId: params.employeeId,
    role: params.role,
  });

  if (!data.success) {
    throw new Error(data.message || 'Failed to update role');
  }
};
