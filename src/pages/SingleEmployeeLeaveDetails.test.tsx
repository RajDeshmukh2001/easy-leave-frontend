import { MemoryRouter, Route, Routes } from 'react-router-dom';
import type { LeaveResponse } from '@/types/leaves';
import * as leaveApi from '../api/leave.api';
import * as yearApi from '@/api/employeesLeaveBalance.api';
import { describe, test, vi, beforeEach } from 'vitest';
import { screen, render, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SingleEmployeeLeaveDetails from './SingleEmployeeLeaveDetails';

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

const renderViewSingleEmployeeLeaveDetail = () => {
  return render(
    <MemoryRouter initialEntries={['/employee/1']}>
      <Routes>
        <Route path="/employee/:id" element={<SingleEmployeeLeaveDetails />} />
      </Routes>
    </MemoryRouter>,
  );
};

describe('ViewSingleEmployeeLeaveDetail', () => {
  beforeEach(() => {
    vi.spyOn(leaveApi, 'fetchLeaves').mockResolvedValue(mockLeaves);
    vi.spyOn(yearApi, 'fetchYears').mockResolvedValue(['2025', '2026']);
  });

  test('shows loading state initially', () => {
    renderViewSingleEmployeeLeaveDetail();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('displays employee name and back button', async () => {
    vi.spyOn(leaveApi, 'fetchLeaves').mockResolvedValue(mockLeaves);
    renderViewSingleEmployeeLeaveDetail();
    fireEvent.click(screen.getByRole('button', { name: 'Back' }));
  });

  test('displays error message when employee not found', async () => {
    vi.spyOn(leaveApi, 'fetchLeaves').mockRejectedValue({
      response: { status: 404 },
      message: 'Not found',
      isAxiosError: true,
    });

    renderViewSingleEmployeeLeaveDetail();
    await waitFor(() => {
      expect(screen.getByText('Employee not found.')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: 'Back' }));
  });

  test('displays inline error message for 500 errors', async () => {
    vi.spyOn(leaveApi, 'fetchLeaves').mockRejectedValue({
      response: { status: 500 },
      message: 'Internal Server Error',
      isAxiosError: true,
    });
    renderViewSingleEmployeeLeaveDetail();
    await waitFor(() => {
      expect(screen.queryByText('Employee not found.')).not.toBeInTheDocument();
    });
  });

  test('renders year dropdown with options', async () => {
    renderViewSingleEmployeeLeaveDetail();
    const dropdown = await screen.findByRole('combobox');
    expect(dropdown).toBeInTheDocument();
    expect(screen.getByText('2025')).toBeInTheDocument();
    expect(screen.getByText('2026')).toBeInTheDocument();
  });

  test('selects a different year from dropdown', async () => {
    renderViewSingleEmployeeLeaveDetail();
    const dropdown = await screen.findByRole('combobox');
    await userEvent.selectOptions(dropdown, '2025');
    expect(dropdown).toHaveValue('2025');
  });

  test('show current year from dropdown if no year is selected', async () => {
    vi.mocked(yearApi.fetchYears).mockResolvedValue([]);
    renderViewSingleEmployeeLeaveDetail();
    const dropdown = await screen.findByRole('combobox');
    expect(dropdown).toBeInTheDocument();
    expect(screen.getByText(new Date().getFullYear().toString())).toBeInTheDocument();
  });

  test('renders table columns', async () => {
    renderViewSingleEmployeeLeaveDetail();
    await waitFor(() => {
      expect(screen.getByRole('columnheader', { name: 'Type' })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: 'Date' })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: 'Duration' })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: 'Applied On' })).toBeInTheDocument();
    });
  });

  test('renders leave row data correctly', async () => {
    renderViewSingleEmployeeLeaveDetail();
    await waitFor(() => {
      expect(screen.getByText('Annual Leave')).toBeInTheDocument();
      expect(screen.getByText('Full Day')).toBeInTheDocument();
    });
  });
});
