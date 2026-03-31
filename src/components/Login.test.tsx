import { render, screen } from '@testing-library/react';
import Login from './Login';
import { describe, expect, test } from 'vitest';

const renderComponent = () => {
  render(<Login />);
};

describe('Login Component', () => {
  test('renders EasyLeave title', () => {
    renderComponent();
    expect(screen.getByText('EasyLeave')).toBeInTheDocument();
  });

  test('renders Google sign in link with correct href and Google Logo', () => {
    render(<Login />);

    const link = screen.getByRole('link', {
      name: /sign in with google/i,
    });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', import.meta.env.VITE_OAUTH_GOOGLE_URI);

    const image = screen.getByAltText('Google Logo');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'GoogleLogo.png');
  });
});
