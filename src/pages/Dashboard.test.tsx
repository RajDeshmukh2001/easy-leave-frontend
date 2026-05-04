import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import * as leaveApi from '../api/leave.api';
import * as dashboardApi from '@/api/dashboard.api';
import type { LeaveResponse } from '../types/leaves';
import userEvent from '@testing-library/user-event';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

const mockLeaves: LeaveResponse[] = [
  {
    id: '1',
    type: 'Annual Leave',
    duration: 'FULL_DAY',
    date: '2026-10-01',
    applyOn: '2026-09-01',
    employeeName: 'Priyansh Saxena',
    startTime: '09:00',
    reason: 'Vacation',
  },
];

const mockMetrics = {
  totalAnnualLeaves: 20,
  leavesTaken: 5,
  remainingAnnualLeaves: 15,
  pendingRequests: 2,
};

const renderDashboard = () => {
  render(
    <MemoryRouter>
      <Dashboard />
    </MemoryRouter>,
  );
};

describe('Dashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(leaveApi, 'fetchLeaves').mockResolvedValue(mockLeaves);
    vi.spyOn(dashboardApi, 'getEmployeeDashboardMetrics').mockResolvedValue(mockMetrics);
  });

  test('renders page header', async () => {
    renderDashboard();
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(
        screen.getByText('Welcome to your dashboard! Here you can find an overview of your Leaves'),
      ).toBeInTheDocument();
    });
  });

  test('renders Upcoming Leaves heading', async () => {
    renderDashboard();
    await waitFor(() => {
      expect(screen.getByText('Upcoming Leaves')).toBeInTheDocument();
    });
  });

  test('shows upcoming leaves loading state', async () => {
    vi.spyOn(leaveApi, 'fetchLeaves').mockImplementation(() => new Promise(() => {}));
    renderDashboard();
    expect(await screen.findByText('Upcoming Leaves')).toBeInTheDocument();
    expect(screen.getAllByText('Loading...').length).toBeGreaterThan(0);
  });

  test('renders table columns', async () => {
    renderDashboard();
    await waitFor(() => {
      expect(screen.getByText('Type')).toBeInTheDocument();
      expect(screen.getByText('Date')).toBeInTheDocument();
      expect(screen.getByText('Duration')).toBeInTheDocument();
      expect(screen.getByText('Applied On')).toBeInTheDocument();
    });
  });

  test('calls fetchLeaves with upcoming status and self scope', async () => {
    const spy = vi.spyOn(leaveApi, 'fetchLeaves').mockResolvedValue(mockLeaves);
    renderDashboard();
    await waitFor(() => {
      expect(spy).toHaveBeenCalledWith({ status: 'upcoming', scope: 'self' });
    });
  });

  test('shows error message on API failure', async () => {
    vi.spyOn(leaveApi, 'fetchLeaves').mockRejectedValue(new Error('Failed to fetch leaves'));
    renderDashboard();
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch leaves')).toBeInTheDocument();
    });
  });

  test('navigates to leave detail page when a row is clicked', async () => {
    const mockNavigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    renderDashboard();
    await waitFor(() => expect(screen.getByText('Annual Leave')).toBeInTheDocument());
    await userEvent.click(screen.getByText('Annual Leave'));
    expect(mockNavigate).toHaveBeenCalledWith('/leave/1');
  });

  test('Should show metric details', async () => {
    renderDashboard();

    expect(await screen.findByText('Total Annual Leave')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();

    expect(screen.getByText('Annual Leave Taken')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();

    expect(screen.getByText('Annual Leave Remaining')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();

    expect(screen.getByText('Pending Request')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  test('shows error message when dashboard metrics API fails', async () => {
    vi.spyOn(dashboardApi, 'getEmployeeDashboardMetrics').mockRejectedValue(
      new Error('Failed to fetch dashboard metrics'),
    );
    renderDashboard();
    expect(await screen.findByText('Failed to fetch dashboard metrics')).toBeInTheDocument();
  });

  test('shows fallback error message when dashboard metrics API throws non-error value', async () => {
    vi.spyOn(dashboardApi, 'getEmployeeDashboardMetrics').mockRejectedValue('unknown error');
    renderDashboard();
    expect(await screen.findByText('Failed to fetch dashboard metrics')).toBeInTheDocument();
  });
});
