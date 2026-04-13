import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import useEmployeesLeaveBalance from './useEmployeesLeaveBalance';
import * as employeesApi from '../api/employeesLeaveBalance.api';
import type { EmployeeLeaveRecord } from '../types/employeeLeaveBalance';
import type { PageResponse } from '../types/pageResponse';

const mockEmployee: EmployeeLeaveRecord = {
  employeeId: 'ccee7fc2-b916-4f44-b2a9-bac14f97f20a',
  employeeName: 'Rakshit Saxena',
  totalLeavesAvailable: 24,
  leavesTaken: 0,
  leavesRemaining: 24,
};

const mockPageResponse = (last = true): PageResponse<EmployeeLeaveRecord> => ({
  content: [mockEmployee],
  last,
  first: true,
  totalPages: last ? 1 : 2,
  totalElements: last ? 1 : 2,
  number: 0,
  size: 20,
});

describe('useEmployeesLeaveBalance hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should fetch employees successfully', async () => {
    vi.spyOn(employeesApi, 'fetchEmployeesLeaveBalance').mockResolvedValue(mockPageResponse());
    const { result } = renderHook(() => useEmployeesLeaveBalance('2026'));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.employees).toEqual([mockEmployee]);
    expect(result.current.error).toBeNull();
  });

  test('should set hasMore false when last page', async () => {
    vi.spyOn(employeesApi, 'fetchEmployeesLeaveBalance').mockResolvedValue(mockPageResponse(true));
    const { result } = renderHook(() => useEmployeesLeaveBalance('2026'));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.hasMore).toBe(false);
  });

  test('should set hasMore true when more pages exist', async () => {
    vi.spyOn(employeesApi, 'fetchEmployeesLeaveBalance').mockResolvedValue(mockPageResponse(false));
    const { result } = renderHook(() => useEmployeesLeaveBalance('2026'));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.hasMore).toBe(true);
  });

  test('should set error on API failure', async () => {
    vi.spyOn(employeesApi, 'fetchEmployeesLeaveBalance').mockRejectedValue(
      new Error('Failed to fetch employees'),
    );
    const { result } = renderHook(() => useEmployeesLeaveBalance('2026'));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('Failed to fetch employees');
    expect(result.current.employees).toEqual([]);
  });

  test('should not fetch when year is empty', () => {
    const spy = vi.spyOn(employeesApi, 'fetchEmployeesLeaveBalance');
    renderHook(() => useEmployeesLeaveBalance(''));
    expect(spy).not.toHaveBeenCalled();
  });

  test('should append employees on loadMore', async () => {
    vi.spyOn(employeesApi, 'fetchEmployeesLeaveBalance').mockResolvedValue(mockPageResponse(false));
    const { result } = renderHook(() => useEmployeesLeaveBalance('2026'));
    await waitFor(() => expect(result.current.loading).toBe(false));
    act(() => result.current.loadMore());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.employees).toHaveLength(2);
  });

  test('should reset employees when year changes', async () => {
    vi.spyOn(employeesApi, 'fetchEmployeesLeaveBalance').mockResolvedValue(mockPageResponse());
    const { result, rerender } = renderHook(({ year }) => useEmployeesLeaveBalance(year), {
      initialProps: { year: '2026' },
    });
    await waitFor(() => expect(result.current.loading).toBe(false));
    rerender({ year: '2025' });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.employees).toEqual([mockEmployee]);
  });

  test('should set generic error when API fails with non-Error value', async () => {
    vi.spyOn(employeesApi, 'fetchEmployeesLeaveBalance').mockRejectedValue('unknown error');
    const { result } = renderHook(() => useEmployeesLeaveBalance('2026'));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('Something went wrong');
  });
});
