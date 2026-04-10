import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import LeaveDetails from '@/pages/LeaveDetails';
import * as api from '@/api/leave.api';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import type { LeaveResponse } from '@/types/leaves';

vi.mock('@/api/leave.api');

const mockLeave: LeaveResponse = {
  id: '1',
  date: '2026-04-06',
  employeeName: 'Raj',
  type: 'Annual Leave',
  duration: 'FULL_DAY',
  startTime: '09:00:00',
  applyOn: '2026-04-06T10:00:00',
  reason: 'Personal work',
};

vi.mock('@/hooks/useLeaveCategories', () => ({
  default: () => ({
    categories: [{ id: 'cat-1', name: 'Annual Leave' }],
  }),
}));

const renderWithRouter = () => {
  return render(
    <MemoryRouter initialEntries={['/leave/1']}>
      <Routes>
        <Route path="/leave/:id" element={<LeaveDetails />} />
      </Routes>
    </MemoryRouter>,
  );
};

describe('LeaveDetails Page Component', () => {
  beforeEach(() => {
    vi.spyOn(api, 'fetchLeaveById').mockResolvedValue(mockLeave);
  });

  test('renders page header', async () => {
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Leave Details')).toBeInTheDocument();
      expect(screen.getByText('View and manage your leave details')).toBeInTheDocument();
    });
  });

  test('shows loading initially', () => {
    renderWithRouter();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('renders page after data is fetched', async () => {
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Leave Details')).toBeInTheDocument();
    });
  });

  test('shows error when API fails', async () => {
    vi.spyOn(api, 'fetchLeaveById').mockRejectedValue(new Error('Failed to fetch leave'));

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Leave not found')).toBeInTheDocument();
    });
  });

  test('populates leaveCategoryId when category matches leave type', async () => {
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Leave Details')).toBeInTheDocument();
    });
    expect(screen.getByDisplayValue('Annual Leave')).toBeInTheDocument();
  });
});
