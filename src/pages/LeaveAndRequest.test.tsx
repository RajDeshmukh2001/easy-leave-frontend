import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import LeaveAndRequest from '@/pages/LeaveAndRequest';
import * as leaveApi from '@/api/leave.api';
import type { LeaveResponse } from '@/types/leaves';

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

const renderLeaveAndRequest = () => {
  render(
    <MemoryRouter>
      <LeaveAndRequest />
    </MemoryRouter>,
  );
};

describe('LeaveAndRequest Page', () => {
  beforeEach(() => {
    vi.spyOn(leaveApi, 'fetchLeaves').mockResolvedValue(mockLeaves);
  });

  test('renders page header', () => {
    renderLeaveAndRequest();
    expect(screen.getByText('Leaves')).toBeInTheDocument();
    expect(screen.getByText('Submit a new leave or raise a request')).toBeInTheDocument();
  });

  test('renders Leave and Raise Request tab buttons', () => {
    renderLeaveAndRequest();
    expect(screen.getByRole('button', { name: 'Leave' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Raise Request' })).toBeInTheDocument();
  });

  test('shows LeaveTab by default', async () => {
    renderLeaveAndRequest();
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Submit Leave' })).toBeInTheDocument();
    });
  });

  test('does not show request tab content by default', () => {
    renderLeaveAndRequest();
    expect(screen.queryByText('Request Tab')).not.toBeInTheDocument();
  });

  test('shows request tab content when Raise Request tab is clicked', async () => {
    renderLeaveAndRequest();
    await userEvent.click(screen.getByRole('button', { name: 'Raise Request' }));
    expect(screen.getByText('Request Tab')).toBeInTheDocument();
  });

  test('hides LeaveTab when Raise Request tab is clicked', async () => {
    renderLeaveAndRequest();
    await userEvent.click(screen.getByRole('button', { name: 'Raise Request' }));
    expect(screen.queryByRole('button', { name: 'Submit Leave' })).not.toBeInTheDocument();
  });
});
