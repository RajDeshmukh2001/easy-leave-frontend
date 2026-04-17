import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import Leave from './Leave';
import * as leaveApi from '../api/leave.api';
import type { LeaveResponse } from '../types/leaves';

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
    reason: 'Personal work',
  },
];

const renderLeavePage = () => {
  render(
    <MemoryRouter>
      <Leave />
    </MemoryRouter>,
  );
};

describe('Leave Page Component', () => {
  beforeEach(() => {
    vi.spyOn(leaveApi, 'fetchLeaves').mockResolvedValue(mockLeaves);
  });

  test('renders page header', () => {
    renderLeavePage();
    expect(screen.getByText('Leaves')).toBeInTheDocument();
    expect(screen.getByText('View and manage your leaves')).toBeInTheDocument();
  });

  test('renders My Leaves heading', () => {
    renderLeavePage();
    expect(screen.getByText('My Leaves')).toBeInTheDocument();
  });

  test('renders filter dropdown with all status options', () => {
    renderLeavePage();
    expect(screen.getByDisplayValue('All')).toBeInTheDocument();
  });

  test('shows loading state initially', () => {
    renderLeavePage();
    expect(screen.getByText('Loading...', { selector: 'p' })).toBeInTheDocument();
  });

  test('renders leave data after loading', async () => {
    renderLeavePage();
    await waitFor(() => {
      expect(screen.getByText('Annual Leave')).toBeInTheDocument();
    });
  });

  test('renders table columns', async () => {
    renderLeavePage();
    await waitFor(() => {
      expect(screen.getByRole('columnheader', { name: 'Type' })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: 'Date' })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: 'Duration' })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: 'Status' })).toBeInTheDocument();
    });
  });

  test('shows error message on API failure', async () => {
    vi.spyOn(leaveApi, 'fetchLeaves').mockRejectedValue(new Error('Failed to fetch leaves'));
    renderLeavePage();
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch leaves')).toBeInTheDocument();
    });
  });

  test('calls fetchLeaves with upcoming status on filter change', async () => {
    const spy = vi.spyOn(leaveApi, 'fetchLeaves').mockResolvedValue(mockLeaves);
    renderLeavePage();
    const dropdown = screen.getByDisplayValue('All');
    await userEvent.selectOptions(dropdown, 'upcoming');
    await waitFor(() => {
      expect(spy).toHaveBeenCalledWith({ status: 'upcoming', scope: 'self' });
    });
  });

  test('shows Ongoing status for leave today', async () => {
    const todayLeave: LeaveResponse[] = [
      {
        ...mockLeaves[0],
        date: new Date().toISOString().split('T')[0],
      },
    ];
    vi.spyOn(leaveApi, 'fetchLeaves').mockResolvedValue(todayLeave);
    renderLeavePage();
    await waitFor(() => {
      expect(screen.getByText('Ongoing')).toBeInTheDocument();
    });
  });

  test('shows Completed leave ', async () => {
    const todayLeave: LeaveResponse[] = [
      {
        ...mockLeaves[0],
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      },
    ];
    vi.spyOn(leaveApi, 'fetchLeaves').mockResolvedValue(todayLeave);
    renderLeavePage();
    await waitFor(() => {
      expect(screen.getByText('Completed')).toBeInTheDocument();
    });
  });

  test('renders ApplyLeaveForm component', async () => {
    renderLeavePage();
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Submit Leave' })).toBeInTheDocument();
    });
  });

  test('navigates to leave detail page when a row is clicked', async () => {
    const mockNavigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    renderLeavePage();

    await waitFor(() => expect(screen.getByText('Annual Leave')).toBeInTheDocument());

    await userEvent.click(screen.getByText('Annual Leave'));

    expect(mockNavigate).toHaveBeenCalledWith('/leave/1');
  });

  test('does not navigate when leave date is in the past', async () => {
    const mockNavigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    const pastLeave: LeaveResponse[] = [
      {
        ...mockLeaves[0],
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      },
    ];

    vi.spyOn(leaveApi, 'fetchLeaves').mockResolvedValue(pastLeave);

    renderLeavePage();

    await waitFor(() => {
      expect(screen.getByText('Annual Leave')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText('Annual Leave'));

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
