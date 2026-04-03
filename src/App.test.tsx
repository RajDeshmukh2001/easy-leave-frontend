import { render, screen } from '@testing-library/react';
import App from './App';
import { describe, test } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

vi.mock('@/api/auth.api', () => ({
  getAuthenticatedUser: vi.fn().mockRejectedValue(new Error('Unauthorized')),
}));

const renderApp = () => {
  render(
    <MemoryRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MemoryRouter>,
  );
};

describe('App Component', () => {
  test('renders App component content', async () => {
    renderApp();

    expect(await screen.findByText(/easyleave/i)).toBeInTheDocument();
    expect(await screen.findByText(/sign in with google/i)).toBeInTheDocument();
  });
});
