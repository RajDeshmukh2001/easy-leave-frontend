import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Employees from './AllEmployeesLeaveBalance';
import * as employeesApi from '../api/employeesLeaveBalance.api';
import * as useEmployeesLeaveBalanceHook from '../hooks/useEmployeesLeaveBalance';
import type { EmployeeLeaveRecord } from '../types/employeeLeaveBalance';

const mockEmployees: EmployeeLeaveRecord[] = [
  {
    employeeId: '1',
    employeeName: 'Rakshit Saxena',
    totalLeavesAvailable: 20,
    leavesTaken: 5,
    leavesRemaining: 15,
  },
  {
    employeeId: '2',
    employeeName: 'Rahul Sharma',
    totalLeavesAvailable: 18,
    leavesTaken: 3,
    leavesRemaining: 15,
  },
];

const defaultHookValue = {
  employees: mockEmployees,
  loading: false,
  error: null,
  hasMore: false,
  loadMore: vi.fn(),
};

vi.mock('../api/employeesLeaveBalance.api', () => ({
  fetchYears: vi.fn().mockResolvedValue(['2026', '2025', '2024']),
}));

vi.mock('@/hooks/useEmployeesLeaveBalance', () => ({
  default: vi.fn().mockReturnValue({
    employees: [],
    loading: false,
    error: null,
    hasMore: false,
    loadMore: vi.fn(),
  }),
}));

const renderEmployeesPage = () => {
  render(
    <MemoryRouter>
      <Employees />
    </MemoryRouter>,
  );
};

describe('Employees Page Component', () => {
  beforeEach(() => {
    vi.mocked(employeesApi.fetchYears).mockResolvedValue(['2026', '2025', '2024']);
    vi.mocked(useEmployeesLeaveBalanceHook.default).mockReturnValue(defaultHookValue);
  });

  test('renders page header', () => {
    renderEmployeesPage();
    expect(screen.getByText('All Employees')).toBeInTheDocument();
    expect(screen.getByText('View employees leave records')).toBeInTheDocument();
  });

  test('renders filter dropdown after years load', async () => {
    renderEmployeesPage();
    await waitFor(() => {
      expect(screen.getByDisplayValue('2026')).toBeInTheDocument();
    });
  });

  test('should fallback to current year when no years returned', async () => {
    vi.mocked(employeesApi.fetchYears).mockResolvedValue([]);
    renderEmployeesPage();
    await waitFor(() => {
      expect(useEmployeesLeaveBalanceHook.default).toHaveBeenCalledWith(
        new Date().getFullYear().toString(),
      );
    });
  });

  test('shows loading state', () => {
    vi.mocked(useEmployeesLeaveBalanceHook.default).mockReturnValue({
      ...defaultHookValue,
      loading: true,
    });
    renderEmployeesPage();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('renders employee names after loading', async () => {
    renderEmployeesPage();
    await waitFor(() => {
      expect(screen.getByText('Rakshit Saxena')).toBeInTheDocument();
      expect(screen.getByText('Rahul Sharma')).toBeInTheDocument();
    });
  });

  test('renders table columns', async () => {
    renderEmployeesPage();
    await waitFor(() => {
      expect(screen.getByRole('columnheader', { name: 'Employee' })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: 'Total Annual Leaves' })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: 'Leaves Taken' })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: 'Leaves Remaining' })).toBeInTheDocument();
    });
  });

  test('shows error message on failure', async () => {
    vi.mocked(useEmployeesLeaveBalanceHook.default).mockReturnValue({
      ...defaultHookValue,
      error: 'Failed to fetch employees',
    });
    renderEmployeesPage();
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch employees')).toBeInTheDocument();
    });
  });

  test('shows no employees message when list is empty', async () => {
    vi.mocked(useEmployeesLeaveBalanceHook.default).mockReturnValue({
      ...defaultHookValue,
      employees: [],
    });
    renderEmployeesPage();
    await waitFor(() => {
      expect(screen.getByText('No employee found')).toBeInTheDocument();
    });
  });

  test('renders Load More button when hasMore is true', async () => {
    vi.mocked(useEmployeesLeaveBalanceHook.default).mockReturnValue({
      ...defaultHookValue,
      hasMore: true,
    });
    renderEmployeesPage();
    await waitFor(() => {
      expect(screen.getByText('Load More')).toBeInTheDocument();
    });
  });

  test('does not render Load More button when hasMore is false', async () => {
    renderEmployeesPage();
    await waitFor(() => {
      expect(screen.queryByText('Load More')).not.toBeInTheDocument();
    });
  });

  test('calls loadMore when Load More button is clicked', async () => {
    const loadMore = vi.fn();
    vi.mocked(useEmployeesLeaveBalanceHook.default).mockReturnValue({
      ...defaultHookValue,
      hasMore: true,
      loadMore,
    });
    renderEmployeesPage();
    await userEvent.click(screen.getByText('Load More'));
    expect(loadMore).toHaveBeenCalledTimes(1);
  });

  test('updates selected year when dropdown changes', async () => {
    renderEmployeesPage();
    await waitFor(() => {
      expect(screen.getByDisplayValue('2026')).toBeInTheDocument();
    });
    const dropdown = screen.getByDisplayValue('2026');
    await userEvent.selectOptions(dropdown, '2025');
    await waitFor(() => {
      expect(useEmployeesLeaveBalanceHook.default).toHaveBeenCalledWith('2025');
    });
  });

  test('shows leaves remaining in red when value is zero or negative', async () => {
    const employeesWithZeroBalance: EmployeeLeaveRecord[] = [
      {
        employeeId: '1',
        employeeName: 'Rakshit Saxena',
        totalLeavesAvailable: 20,
        leavesTaken: 20,
        leavesRemaining: 0,
      },
    ];

    vi.mocked(useEmployeesLeaveBalanceHook.default).mockReturnValue({
      ...defaultHookValue,
      employees: employeesWithZeroBalance,
    });

    renderEmployeesPage();

    await waitFor(() => {
      expect(screen.getByText('Rakshit Saxena')).toBeInTheDocument();
    });

    const leavesRemainingCell = screen.getByText('0');

    expect(leavesRemainingCell).toHaveClass('text-red-600');
  });
});
