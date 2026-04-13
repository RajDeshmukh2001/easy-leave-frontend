import { renderHook, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import useLeaves from './useLeaves';
import * as leaveApi from '../api/leave.api';
import type { LeaveResponse } from '../types/leaves';
import axios from 'axios';

const mockLeaves: LeaveResponse[] = [
  {
    id: '1',
    type: 'Annual Leave',
    duration: 'FULL_DAY',
    date: '2026-10-01',
    applyOn: '2026-09-01',
    employeeName: 'Priyansh Saxena',
    startTime: '09:00',
    reason: 'Personal work',
  },
];

describe('useLeaves hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should fetch leaves successfully', async () => {
    vi.spyOn(leaveApi, 'fetchLeaves').mockResolvedValue(mockLeaves);
    const { result } = renderHook(() => useLeaves({ status: 'all', scope: 'self' }));
    expect(result.current.loading).toBe(true);
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.leaves).toEqual(mockLeaves);
    expect(result.current.error).toBeNull();
  });

  test('should set error when API call fails with Error object', async () => {
    vi.spyOn(leaveApi, 'fetchLeaves').mockRejectedValue(new Error('failed to fetch'));
    const { result } = renderHook(() => useLeaves({ status: 'all', scope: 'self' }));
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.error).toBe('failed to fetch');
  });

  test('should set generic error when API call fails with non-Error value', async () => {
    vi.spyOn(leaveApi, 'fetchLeaves').mockRejectedValue('Failed to load your leaves');
    const { result } = renderHook(() => useLeaves({ status: 'all', scope: 'self' }));
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.error).toBe('Failed to load your leaves');
    expect(result.current.leaves).toEqual([]);
  });

  test('should set error and errorStatus when API call fails with AxiosError', async () => {
    const axiosError = new axios.AxiosError('Request failed', '500', undefined, undefined, {
      status: 500,
      data: { message: 'Internal server error' },
    } as any);

    vi.spyOn(leaveApi, 'fetchLeaves').mockRejectedValue(axiosError);
    const { result } = renderHook(() => useLeaves({ status: 'all', scope: 'self' }));
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Internal server error');
    expect(result.current.errorStatus).toBe(500);
    expect(result.current.leaves).toEqual([]);
  });

  test('should set errorStatus to null when AxiosError has no response', async () => {
    const axiosError = new axios.AxiosError(
      'Network Error',
      'ERR_NETWORK',
      undefined,
      undefined,
      undefined,
    );

    vi.spyOn(leaveApi, 'fetchLeaves').mockRejectedValue(axiosError);

    const { result } = renderHook(() => useLeaves({ status: 'all', scope: 'self' }));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.errorStatus).toBeNull();
    expect(result.current.error).toBe('Failed to load your leaves');
  });
});
