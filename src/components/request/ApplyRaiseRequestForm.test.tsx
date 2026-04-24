import { renderHook, act } from '@testing-library/react';
import { raiseRequest } from '@/api/request.api';
import toast from 'react-hot-toast';
import type { MockedFunction } from 'vitest';
import { useRaiseRequest } from '@/hooks/useRaiseRequest';

vi.mock('@/api/request.api');
vi.mock('react-hot-toast');

const raiseRequestMock = raiseRequest as MockedFunction<typeof raiseRequest>;

describe('useRaiseRequest Hook', () => {
  const mockResetForm = vi.fn();
  const mockHelpers = { resetForm: mockResetForm } as any;
  beforeEach(() => {
    vi.clearAllMocks();
    mockResetForm.mockClear();
  });

  const dummyValues = {
    requestType: 'PAST_LEAVE',
    leaveCategoryId: 'category_1',
    dateRange: { start: '2024-01-01', end: '2024-01-02' },
    duration: 'FULL_DAY',
    startTime: '10:00',
    description: 'Sick leave',
  };

  test('successfully raise a request and reset form', async () => {
    raiseRequestMock.mockResolvedValueOnce({ data: { success: true } } as any);

    const { result } = renderHook(() => useRaiseRequest());

    await act(async () => {
      await result.current.handleSubmit(dummyValues as any, mockHelpers);
    });

    expect(raiseRequestMock).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith('Request raised successfully');
    expect(mockResetForm).toHaveBeenCalled();
  });

  test('catches an Axios error and shows the server message', async () => {
    raiseRequestMock.mockRejectedValueOnce({
      isAxiosError: true,
      response: {
        data: { message: 'Insufficient leave balance' },
      },
    });

    const { result } = renderHook(() => useRaiseRequest());

    await act(async () => {
      await result.current.handleSubmit(dummyValues as any, mockHelpers);
    });

    expect(toast.error).toHaveBeenCalledWith('Insufficient leave balance');
    expect(mockResetForm).not.toHaveBeenCalled();
  });

  test('catches error when the API fails unexpectedly', async () => {
    raiseRequestMock.mockRejectedValueOnce(new Error('Network Crash'));

    const { result } = renderHook(() => useRaiseRequest());

    await act(async () => {
      await result.current.handleSubmit(dummyValues as any, mockHelpers);
    });

    expect(toast.error).toHaveBeenCalledWith('Unexpected Error Occurred');
  });
});
