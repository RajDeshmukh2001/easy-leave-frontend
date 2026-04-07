import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { AppSidebar } from './AppSidebar';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';

// Mock useAuthUser hook
vi.mock('@/hooks/useAuthUser', () => ({
  default: vi.fn(),
}));

import useAuthUser from '@/hooks/useAuthUser';
import type { Role } from '@/types/auth';
import { SidebarProvider } from './ui/sidebar';

const renderAppSidebar = (role?: string) => {
  vi.mocked(useAuthUser).mockReturnValue({
    user: role ? { id: '1', name: 'Test User', email: 'test@test.com', role: role as Role } : null,
    setUser: vi.fn(),
    loading: false,
    error: null,
    fetchCurrentUser: vi.fn().mockResolvedValue(undefined),
  });

  render(
    <AuthProvider>
      <SidebarProvider>
        <MemoryRouter>
          <AppSidebar />
        </MemoryRouter>
      </SidebarProvider>
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
});
