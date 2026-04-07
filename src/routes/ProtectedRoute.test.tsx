import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '@/routes/ProtectedRoute';
import useAuthUser from '@/hooks/useAuthUser';

vi.mock('@/hooks/useAuthUser');

const renderRoutes = () => {
  render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <Routes>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <div>Easy Leave</div>
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<div>Login Page</div>} />
      </Routes>
    </MemoryRouter>,
  );
};

describe('ProtectedRoute tests', () => {
  test('shows loading when loading is true', () => {
    vi.mocked(useAuthUser).mockReturnValue({
      user: null,
      loading: true,
      error: null,
      setUser: vi.fn(),
      fetchCurrentUser: vi.fn(),
    });

    renderRoutes();

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('redirects to / when user is not authenticated', async () => {
    vi.mocked(useAuthUser).mockReturnValue({
      user: null,
      loading: false,
      error: null,
      setUser: vi.fn(),
      fetchCurrentUser: vi.fn(),
    });

    renderRoutes();

    expect(await screen.findByText(/login page/i)).toBeInTheDocument();
    expect(screen.queryByText(/easy leave/i)).not.toBeInTheDocument();
  });

  test('renders children when user is authenticated', () => {
    vi.mocked(useAuthUser).mockReturnValue({
      user: { id: 'uuid', name: 'Raj', email: 'raj@technogise.com', role: 'EMPLOYEE' },
      loading: false,
      error: null,
      setUser: vi.fn(),
      fetchCurrentUser: vi.fn(),
    });

    renderRoutes();

    expect(screen.getByText(/easy leave/i)).toBeInTheDocument();
  });

  test('redirects when user does not have required role', async () => {
    vi.mocked(useAuthUser).mockReturnValue({
      user: { id: 'uuid', name: 'Raj', email: 'raj@technogise.com', role: 'EMPLOYEE' },
      loading: false,
      error: null,
      setUser: vi.fn(),
      fetchCurrentUser: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/manager-dashboard']}>
        <Routes>
          <Route
            path="/manager-dashboard"
            element={
              <ProtectedRoute allowedRoles={['MANAGER']}>
                <div>Manager Page</div>
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText(/login page/i)).toBeInTheDocument();
  });
});
