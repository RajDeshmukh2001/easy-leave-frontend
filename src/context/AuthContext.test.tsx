import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider } from '@/context/AuthContext';
import useAuthUser from '@/hooks/useAuthUser';
import * as authApi from '@/api/auth.api';
import { vi } from 'vitest';

vi.mock('@/api/auth.api');

const mockedGetUser = vi.mocked(authApi.getAuthenticatedUser);

const TestComponent = () => {
  const { user, loading, error } = useAuthUser();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <div>User: {user?.name}</div>;
};

describe('AuthContext test', () => {
  it('should fetch and set user on success', async () => {
    mockedGetUser.mockResolvedValue({
      id: 'dc742bb8-5a17-4084-8669-42d2286353c4',
      name: 'Raj',
      email: 'raj@technogise.com',
      role: 'EMPLOYEE',
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText('User: Raj')).toBeInTheDocument());
  });

  it('should handle error properly', async () => {
    mockedGetUser.mockRejectedValue(new Error('Failed'));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await waitFor(() => expect(screen.getByText('Error: Failed')).toBeInTheDocument());
  });

  it('should handle unknown error properly', async () => {
    mockedGetUser.mockRejectedValue('Some random error');

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await waitFor(() =>
      expect(screen.getByText('Error: Something went wrong')).toBeInTheDocument(),
    );
  });
});
