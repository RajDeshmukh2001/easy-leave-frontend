import { renderHook, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import useHolidays from './useHolidays';
import * as holidayApi from '../api/holiday.api';
import type { HolidayListResponse } from '@/types/holiday';

const mockHolidays: HolidayListResponse[] = [
  {
    id: '1',
    name: 'Republic Day',
    date: '2026-01-26',
    type: 'FIXED',
  },
  {
    id: '2',
    name: 'Independence Day',
    date: '2026-08-15',
    type: 'FIXED',
  },
];

describe('useHolidays hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should fetch and return holidays', async () => {
    vi.spyOn(holidayApi, 'fetchHolidays').mockResolvedValue(mockHolidays);
    const { result } = renderHook(() => useHolidays('all'));

    expect(result.current.loading).toBe(true);
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.holidays).toEqual(mockHolidays);
    expect(result.current.error).toBeNull();
  });

  test('should set error when API call fails with Error object', async () => {
    vi.spyOn(holidayApi, 'fetchHolidays').mockRejectedValue(new Error('Failed to fetch holidays'));
    const { result } = renderHook(() => useHolidays('all'));

    expect(result.current.loading).toBe(true);
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.holidays).toEqual([]);
    expect(result.current.error).toEqual('Failed to fetch holidays');
  });

  test('should set generic error when API call fails with non-Error value', async () => {
    vi.spyOn(holidayApi, 'fetchHolidays').mockRejectedValue('Unknown Error');
    const { result } = renderHook(() => useHolidays('all'));

    expect(result.current.loading).toBe(true);
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.holidays).toEqual([]);
    expect(result.current.error).toEqual('Failed to fetch holidays');
  });
});
