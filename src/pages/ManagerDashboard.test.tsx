import { MemoryRouter } from "react-router-dom";
import ManagerDashboard from "./ManagerDashboard";
import { render, screen, waitFor } from "@testing-library/react";
import type { LeaveResponse } from "@/types/leaves";
import * as leaveApi from '../api/leave.api'

const renderManagerDashboard = () => {
  return render(
    <MemoryRouter>
      <ManagerDashboard />
    </MemoryRouter>
  );
}

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
]

describe("ManagerDashboard", () => {
  beforeEach(() => {
    vi.spyOn(leaveApi, 'fetchLeaves').mockResolvedValue(mockLeaves)
  })

  test('renders page header', () => {
    renderManagerDashboard()
    expect(screen.getByText('Manager Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Team leave overview at a glance')).toBeInTheDocument()
  })
  test('renders Currently on Leave and Upcoming Leaves sections', () => {
    renderManagerDashboard()
    expect(screen.getByText('Currently on Leave')).toBeInTheDocument()
    expect(screen.getByText('Upcoming Leaves')).toBeInTheDocument()
  })
  test('calls fetchLeaves with upcoming status and organization scope', async () => {
    const spy = vi.spyOn(leaveApi, 'fetchLeaves').mockResolvedValue(mockLeaves)
    renderManagerDashboard()
    await waitFor(() => {
      expect(spy).toHaveBeenCalledWith({ status: 'upcoming', scope: 'organization' })
    })
  })
});