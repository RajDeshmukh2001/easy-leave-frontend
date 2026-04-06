import type { UserResponse } from "@/types/Users";
import axiosInstance from "./axiosInstance";

type EmployeeParams = {
  page?: number;
  size?: number;
};

export type EmployeeApiResponse = {
  content: UserResponse[];
  last: boolean;
  totalPages: number;
  number: number;
};

export const getEmployees = async ( params: EmployeeParams ): Promise<EmployeeApiResponse> => {
  const { data } = await axiosInstance.get('/api/users', { params });

  if (!data.success) {
    throw new Error(data.message || 'Failed to fetch employees');
  }

  return data.data;
};