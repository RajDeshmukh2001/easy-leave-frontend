import { renderHook, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import useLeaveCategories from './useLeaveCategories';
import * as leaveCategoryApi from '../api/leaveCategories.api';
import type { LeaveCategoryResponse } from '../types/leaveCategory';

const mockCategories: LeaveCategoryResponse[] = [
  {
    id: '1',
    name: 'Annual Leave',
  },
  {
    id: '2',
    name: 'Bereavement Leave',
  },
];

describe('useLeaveCategories hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should fetch leave categories successfully', async () => {
    vi.spyOn(leaveCategoryApi, 'fetchLeaveCategories').mockResolvedValue(mockCategories);

    const { result } = renderHook(() => useLeaveCategories());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.categories).toEqual(mockCategories);
    expect(result.current.error).toBeNull();
  });

  test('should set error when API call fails', async () => {
    vi.spyOn(leaveCategoryApi, 'fetchLeaveCategories').mockRejectedValue(
      new Error('failed to fetch categories'),
    );

    const { result } = renderHook(() => useLeaveCategories());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('failed to fetch categories');
    expect(result.current.categories).toEqual([]);
  });

  test('should allow manual reload of leave categories', async () => {
    vi.spyOn(leaveCategoryApi, 'fetchLeaveCategories').mockResolvedValue(mockCategories);

    const { result } = renderHook(() => useLeaveCategories());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.categories).toEqual(mockCategories);

    await result.current.loadLeaveCategories();

    expect(leaveCategoryApi.fetchLeaveCategories).toHaveBeenCalledTimes(2);
  });

  test('should not set error when rejected value is not an Error instance', async () => {
    vi.spyOn(leaveCategoryApi, 'fetchLeaveCategories').mockRejectedValue('unexpected failure');

    const { result } = renderHook(() => useLeaveCategories());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeNull();
    expect(result.current.categories).toEqual([]);
  });
});
