import type { RequestResponse } from '@/types/request';
import * as requestApi from '@/api/request.api';
import { renderHook, waitFor } from '@testing-library/react';
import useRequest from './useRequest';
import { vi } from 'vitest';

const mockRequests: RequestResponse[] = [
  {
    id: '1',
    date: '2026-04-20',
    description: 'Sick leave',
    employeeName: 'Priyansh Saxena',
    status: 'PENDING',
    type: 'PAST_LEAVE',
    duration: 'FULL_DAY',
    appliedDate: '2026-04-21',
  },
];

const mockNextRequests: RequestResponse[] = [
  {
    id: '2',
    date: '2026-03-20',
    description: 'Annual leave',
    employeeName: 'Pruthivraj Deshmukh',
    status: 'PENDING',
    type: 'PAST_LEAVE',
    duration: 'FULL_DAY',
    appliedDate: '2026-03-21',
  },
];

type PageResponse<T> = {
  content: T[];
  first: boolean;
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
};

const mockPageResponse: PageResponse<RequestResponse> = {
  content: mockRequests,
  first: true,
  last: true,
  totalPages: 1,
  totalElements: 1,
  size: 20,
  number: 0,
};

describe('useRequest hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should fetch requests successfully', async () => {
    vi.spyOn(requestApi, 'fetchRequests').mockResolvedValue(mockPageResponse);

    const { result } = renderHook(() => useRequest({ status: 'PENDING', scope: 'SELF', page: 0 }));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.requests).toEqual(mockRequests);
    expect(result.current.error).toBeNull();
    expect(result.current.hasMore).toBe(false);
  });

  test('should load more requests when page changes', async () => {
    const fetchSpy = vi
      .spyOn(requestApi, 'fetchRequests')
      .mockResolvedValueOnce({
        content: mockRequests,
        last: false,
        number: 0,
        totalPages: 2,
        totalElements: 2,
        size: 1,
        first: true,
      })
      .mockResolvedValueOnce({
        content: mockNextRequests,
        last: true,
        number: 1,
        totalPages: 2,
        totalElements: 2,
        size: 1,
        first: false,
      });

    let page = 0;

    const { result, rerender } = renderHook(
      ({ page }) => useRequest({ status: 'PENDING', scope: 'SELF', page }),
      { initialProps: { page } },
    );
    await waitFor(() => {
      expect(result.current.requests.length).toBe(1);
    });
    expect(result.current.hasMore).toBe(true);
    page = 1;
    rerender({ page });
    await waitFor(() => {
      expect(result.current.requests.length).toBe(2);
    });

    expect(fetchSpy).toHaveBeenCalledTimes(2);
    expect(result.current.requests).toEqual([...mockRequests, ...mockNextRequests]);
    expect(result.current.hasMore).toBe(false);
  });

  test('should set error when API call fails with Error object', async () => {
    vi.spyOn(requestApi, 'fetchRequests').mockRejectedValue(new Error('failed to fetch'));

    const { result } = renderHook(() => useRequest({ status: 'ALL', scope: 'SELF', page: 0 }));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('failed to fetch');
    expect(result.current.requests).toEqual([]);
  });

  test('should set generic error when API call fails with non-Error value', async () => {
    vi.spyOn(requestApi, 'fetchRequests').mockRejectedValue('Failed to load your requests');

    const { result } = renderHook(() => useRequest({ status: 'ALL', scope: 'SELF', page: 0 }));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Failed to load your requests');
    expect(result.current.requests).toEqual([]);
  });
});
