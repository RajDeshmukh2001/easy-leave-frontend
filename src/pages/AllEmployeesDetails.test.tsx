import { MemoryRouter } from 'react-router-dom';
import AllEmployeeDetails from './AllEmployeesDetails';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import * as userApi from '@/api/employee.api';
import useAuthUser from '@/hooks/useAuthUser';
import type { UserResponse } from '@/types/Users';
import { vi } from 'vitest';
import { toast } from 'react-hot-toast';

vi.mock('react-hot-toast', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

vi.mock('@/hooks/useAuthUser');
const mockedUseAuthUser = vi.mocked(useAuthUser);
const mockEmployees: UserResponse[] = [
  { id: '1', name: 'Priyansh Saxena', email: 'priyansh.saxena@technogise.com', role: 'ADMIN' },
  { id: '2', name: 'Raj', email: 'raj@technogise.com', role: 'EMPLOYEE' },
];
const mockNextEmployees: UserResponse[] = [
  { id: '3', name: 'jatin', email: 'jatin@technogise.com', role: 'ADMIN' },
  { id: '4', name: 'rakshit', email: 'rakshit@technogise.com', role: 'EMPLOYEE' },
];

const renderEmployeeDetails = () => {
  return render(
    <MemoryRouter>
      <AllEmployeeDetails />
    </MemoryRouter>,
  );
};

describe('AllEmployeeDetails Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseAuthUser.mockReturnValue({
      user: {
        id: '1',
        name: 'Admin User',
        email: 'admin@test.com',
        role: 'ADMIN',
      },
      setUser: vi.fn(),
      loading: false,
      error: null,
      fetchCurrentUser: vi.fn(),
    });

    vi.spyOn(userApi, 'getEmployees').mockResolvedValue({
      content: mockEmployees,
      last: true,
      number: 0,
      totalPages: 1,
    });
  });

  test('renders table columns', async () => {
    renderEmployeeDetails();
    await waitFor(() => {
      expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: 'Email' })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: 'Role' })).toBeInTheDocument();
    });
  });

  test('renders employees data', async () => {
    renderEmployeeDetails();

    await waitFor(() => {
      expect(screen.getByRole('cell', { name: 'Priyansh Saxena' })).toBeInTheDocument();
      expect(screen.getByRole('cell', { name: 'Raj' })).toBeInTheDocument();
    });
  });

  test('renders error message on API failure', async () => {
    vi.spyOn(userApi, 'getEmployees').mockRejectedValue(new Error('Failed to fetch employees'));
    renderEmployeeDetails();
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch employees')).toBeInTheDocument();
    });
  });

  test('renders error message on network error', async () => {
    vi.spyOn(userApi, 'getEmployees').mockRejectedValue('Failed to load employees');
    renderEmployeeDetails();
    await waitFor(() => {
      expect(screen.getByText('Failed to load employees')).toBeInTheDocument();
    });
  });

  test('renders "Load More" button and loads more employees', async () => {
    vi.spyOn(userApi, 'getEmployees')
      .mockResolvedValueOnce({
        content: mockEmployees,
        last: false,
        number: 0,
        totalPages: 2,
      })
      .mockResolvedValueOnce({
        content: mockNextEmployees,
        last: true,
        number: 1,
        totalPages: 2,
      });

    renderEmployeeDetails();

    await waitFor(() => {
      expect(screen.getByText('Load More')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Load More'));

    await waitFor(() => {
      expect(screen.getByRole('cell', { name: 'jatin' })).toBeInTheDocument();
      expect(screen.getByRole('cell', { name: 'rakshit' })).toBeInTheDocument();
    });
  });

  test('updates role when dropdown changes', async () => {
    vi.spyOn(userApi, 'updateUserRole').mockResolvedValue(undefined);
    renderEmployeeDetails();
    const select = await screen.findAllByRole('combobox');
    fireEvent.change(select[1], { target: { value: 'MANAGER' } });

    await waitFor(() => {
      expect(userApi.updateUserRole).toHaveBeenCalledWith({
        employeeId: '2',
        role: 'MANAGER',
      });
    });
  });

  test('shows error when user tries to update own role', async () => {
    renderEmployeeDetails();
    const selects = await screen.findAllByRole('combobox');
    fireEvent.change(selects[0], { target: { value: 'MANAGER' } });
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("You can't change your own role");
    });
  });

  test('shows API error message when updateUserRole throws Error', async () => {
    vi.spyOn(userApi, 'updateUserRole').mockRejectedValue(new Error('API Failed'));
    renderEmployeeDetails();
    const selects = await screen.findAllByRole('combobox');
    fireEvent.change(selects[1], { target: { value: 'MANAGER' } });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('API Failed');
    });
  });

  test('shows fallback error message when updateUserRole throws non-error', async () => {
    vi.spyOn(userApi, 'updateUserRole').mockRejectedValue('Some random error');
    renderEmployeeDetails();
    const selects = await screen.findAllByRole('combobox');
    fireEvent.change(selects[1], { target: { value: 'MANAGER' } });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to update role');
    });
  });
});
