import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { AppSidebar } from './AppSidebar';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import useAuthUser from '@/hooks/useAuthUser';
import { TooltipProvider } from './ui/tooltip';
import { Toaster } from 'react-hot-toast';
import { logout } from '@/api/auth.api';
import userEvent from '@testing-library/user-event';
import type { Role } from '@/types/auth';

vi.mock('@/hooks/useAuthUser', () => ({
  default: vi.fn(),
}));

const setOpenMobile = vi.fn();

vi.mock('@/hooks/use-sidebar', () => ({
  useSidebar: vi.fn(() => ({
    state: 'expanded' as const,
    open: true,
    setOpen: vi.fn(),
    openMobile: false,
    setOpenMobile,
    isMobile: false,
    toggleSidebar: vi.fn(),
  })),
}));

vi.mock('@/hooks/useAuthUser', () => ({
  default: vi.fn(),
}));
vi.mock('@/api/auth.api', () => ({
  logout: vi.fn(),
}));

const renderAppSidebar = (role?: string, setUser = vi.fn()) => {
  vi.mocked(useAuthUser).mockReturnValue({
    user: role ? { id: '1', name: 'Test User', email: 'test@test.com', role: role as Role } : null,
    setUser,
    loading: false,
    error: null,
    fetchCurrentUser: vi.fn().mockResolvedValue(undefined),
  });

  render(
    <AuthProvider>
      <TooltipProvider>
        <MemoryRouter>
          <Toaster />
          <AppSidebar />
        </MemoryRouter>
      </TooltipProvider>
    </AuthProvider>,
  );
};

describe('AppSidebar Component', () => {
  test('renders employee nav items for a non-manager user', () => {
    renderAppSidebar();

    expect(screen.getByText('EasyLeave')).toBeInTheDocument();
    expect(screen.getByText('Employee')).toBeInTheDocument();
    expect(screen.queryByText('Manager')).not.toBeInTheDocument();
  });

  test('renders manager nav items when user role is MANAGER', () => {
    renderAppSidebar('MANAGER');

    expect(screen.getByText('Manager')).toBeInTheDocument();
  });

  test('renders admin nav items when user role is ADMIN', () => {
    renderAppSidebar('ADMIN');

    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  test('sets setOpenMobile(false) when a sidebar nav item is clicked', () => {
    renderAppSidebar();

    fireEvent.click(screen.getAllByRole('link')[0]);

    expect(setOpenMobile).toHaveBeenCalledWith(false);
  });

  test('renders logout button', () => {
    renderAppSidebar();

    expect(screen.getByText('Logout')).toBeInTheDocument();
  });
  test('calls logout and clears user on successful logout', async () => {
    const setUser = vi.fn();
    vi.mocked(logout).mockResolvedValue(undefined);
    renderAppSidebar('EMPLOYEE', setUser);

    await userEvent.click(screen.getByText('Logout'));

    expect(logout).toHaveBeenCalled();
    expect(setUser).toHaveBeenCalledWith(null);
  });

  test('shows error toast when logout fails', async () => {
    vi.mocked(logout).mockRejectedValue(new Error('Network error'));
    renderAppSidebar();

    await userEvent.click(screen.getByText('Logout'));

    expect(await screen.findByText('Something went wrong. Please try again')).toBeInTheDocument();
  });
});
