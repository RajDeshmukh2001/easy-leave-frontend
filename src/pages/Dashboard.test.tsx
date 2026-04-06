import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, test, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Dashboard from './Dashboard'
import * as leaveApi from '../api/leave.api'
import type { LeaveResponse } from '../types/leaves'

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

const renderDashboard = () => {
  render(
    <MemoryRouter>
      <Dashboard />
    </MemoryRouter>
  )
}

describe('Dashboard Component', () => {

  beforeEach(() => {
    vi.spyOn(leaveApi, 'fetchLeaves').mockResolvedValue(mockLeaves)
  })

  test('renders page header', () => {
    renderDashboard()
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Welcome to your dashboard! Here you can find an overview of your Leaves')).toBeInTheDocument()
  })

  test('renders Upcoming Leaves heading', () => {
    renderDashboard()
    expect(screen.getByText('Upcoming Leaves')).toBeInTheDocument()
  })

  test('shows loading state initially', () => {
    renderDashboard()
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  test('renders table columns', async () => {
    renderDashboard()
    await waitFor(() => {
      expect(screen.getByText('Type')).toBeInTheDocument()
      expect(screen.getByText('Date')).toBeInTheDocument()
      expect(screen.getByText('Duration')).toBeInTheDocument()
      expect(screen.getByText('Applied On')).toBeInTheDocument()
      expect(screen.getByText('Reason')).toBeInTheDocument()
    })
  })

  test('calls fetchLeaves with upcoming status and self scope', async () => {
    const spy = vi.spyOn(leaveApi, 'fetchLeaves').mockResolvedValue(mockLeaves)
    renderDashboard()
    await waitFor(() => {
      expect(spy).toHaveBeenCalledWith({ status: 'upcoming', scope: 'self' })
    })
  })

  test('shows error message on API failure', async () => {
    vi.spyOn(leaveApi, 'fetchLeaves').mockRejectedValue(new Error('Failed to fetch leaves'))
    renderDashboard()
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch leaves')).toBeInTheDocument()
    })
  })
})