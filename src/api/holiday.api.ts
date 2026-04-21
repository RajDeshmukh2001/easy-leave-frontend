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
