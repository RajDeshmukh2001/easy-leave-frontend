import type { HolidayRequest, HolidayResponse } from '@/types/holiday';
import axiosInstance from './axiosInstance';
import type { ApiResponse } from '@/types/response';

export const addHoliday = async (values: HolidayRequest): Promise<HolidayResponse> => {
  const { data } = await axiosInstance.post<ApiResponse<HolidayResponse>>(`/api/holidays`, values);

  if (!data.success) {
    throw new Error(data.message || 'Failed to add holiday');
  }
  return data.data;
};

export const fetchHolidays = async ({ type }: { type?: string }): Promise<HolidayResponse[]> => {
  const params: Record<string, string> = {};

  if (type && type !== 'all') {
    params.type = type;
  }

  const { data } = await axiosInstance.get<ApiResponse<HolidayResponse[]>>('/api/holidays', {
    params,
  });

  if (!data.success) {
    console.error('Error fetching holidays:', data.message);
    throw new Error(data.message || 'Failed to fetch holidays');
  }

  return data.data;
};
