import { renderHook, act } from '@testing-library/react';
import { vi, describe, test, expect, beforeEach, type MockedFunction } from 'vitest';
import { useRaiseRequest } from '@/hooks/useRaiseRequest';
import { raiseRequest } from '@/api/request.api';
import toast from 'react-hot-toast';
import type { RaiseRequestFormValues, RaiseRequestResponse } from '@/types/request';
import type { FormikHelpers } from 'formik';

vi.mock('@/api/request.api');
vi.mock('react-hot-toast');
vi.mock('@/utils/time', () => ({
  getDatesBetween: vi.fn(() => ['2026-04-24']),
}));

const raiseRequestMock = raiseRequest as MockedFunction<typeof raiseRequest>;

const mockResetForm = vi.fn();
const mockHelpers = {
  resetForm: mockResetForm,
} as unknown as FormikHelpers<RaiseRequestFormValues>;

const mockPastLeaveValues: RaiseRequestFormValues = {
  requestType: 'PAST_LEAVE',
  leaveCategoryId: '123',
  dateRange: { from: new Date(2026, 2, 10), to: undefined },
  duration: 'FULL_DAY',
  startTime: '10:00',
  description: 'Vacation',
};

const mockCompOffValues: RaiseRequestFormValues = {
  requestType: 'COMPENSATORY_OFF',
  leaveCategoryId: '',
  dateRange: { from: new Date(2026, 3, 18), to: undefined },
  duration: 'FULL_DAY',
  startTime: '10:00',
  description: 'Worked on Saturday',
};

const mockRaiseRequestResponse: RaiseRequestResponse = {
  id: '123',
  requestType: 'PAST_LEAVE',
  dates: ['2026-04-24'],
  duration: 'FULL_DAY',
  status: 'PENDING',
};

describe('useRaiseRequest', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('calls raiseRequest with PAST_LEAVE type', async () => {
    raiseRequestMock.mockResolvedValueOnce(mockRaiseRequestResponse);

    const { result } = renderHook(() => useRaiseRequest());
    await act(async () => {
      await result.current.handleSubmit(mockPastLeaveValues, mockHelpers);
    });

    expect(raiseRequestMock).toHaveBeenCalledWith(
      expect.objectContaining({
        requestType: 'PAST_LEAVE',
        leaveCategoryId: '123',
        description: 'Vacation',
      }),
    );
    expect(toast.success).toHaveBeenCalledWith('Request raised successfully');
    expect(mockResetForm).toHaveBeenCalledOnce();
  });

  test('calls raiseRequest without leaveCategoryId for COMPENSATORY_OFF', async () => {
    raiseRequestMock.mockResolvedValueOnce(mockRaiseRequestResponse);

    const { result } = renderHook(() => useRaiseRequest());
    await act(async () => {
      await result.current.handleSubmit(mockCompOffValues, mockHelpers);
    });

    expect(raiseRequestMock).toHaveBeenCalledWith(
      expect.not.objectContaining({ leaveCategoryId: expect.anything() }),
    );
    expect(toast.success).toHaveBeenCalledWith('Request raised successfully');
    expect(mockResetForm).toHaveBeenCalledOnce();
  });

  test('shows server error message on axios error with message', async () => {
    raiseRequestMock.mockRejectedValueOnce({
      isAxiosError: true,
      response: { data: { message: 'Duplicate request exists' } },
    });

    const { result } = renderHook(() => useRaiseRequest());
    await act(async () => {
      await result.current.handleSubmit(mockPastLeaveValues, mockHelpers);
    });

    expect(toast.error).toHaveBeenCalledWith('Duplicate request exists');
    expect(mockResetForm).not.toHaveBeenCalled();
  });

  test('shows fallback message when axios error has no response message', async () => {
    raiseRequestMock.mockRejectedValueOnce({
      isAxiosError: true,
      response: { data: {} },
    });

    const { result } = renderHook(() => useRaiseRequest());
    await act(async () => {
      await result.current.handleSubmit(mockPastLeaveValues, mockHelpers);
    });

    expect(toast.error).toHaveBeenCalledWith('Failed to raise request');
    expect(mockResetForm).not.toHaveBeenCalled();
  });
});
