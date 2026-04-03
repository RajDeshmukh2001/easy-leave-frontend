import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import useAuthUser from '@/hooks/useAuthUser';
import PublicRoute from './PublicRoute';

vi.mock('@/hooks/useAuthUser');

const renderRoutes = () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <div>Login Page</div>
            </PublicRoute>
          }
        />
        <Route path="/dashboard" element={<div>Dashboard</div>} />
      </Routes>
    </MemoryRouter>,
  );
};

describe('ProtectedRoute', () => {
  test('redirects to /dashboard when user is already authenticated', async () => {
    vi.mocked(useAuthUser).mockReturnValue({
      user: { id: 'uuid', name: 'Raj', email: 'raj@technogise.com', role: 'EMPLOYEE' },
      loading: false,
      error: null,
      setUser: vi.fn(),
      fetchCurrentUser: vi.fn(),
    });

    renderRoutes();

    expect(await screen.findByText(/dashboard/i)).toBeInTheDocument();
    expect(screen.queryByText(/login page/i)).not.toBeInTheDocument();
  });
});
