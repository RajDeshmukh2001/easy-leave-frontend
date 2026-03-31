import { render, screen } from '@testing-library/react';
import App from './App';
import { describe, test } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

const renderApp = () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );
};

describe('App Component', () => {
  test('renders App component content', () => {
    renderApp();

    expect(screen.getByRole('heading', { name: /easyleave/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign in with google/i })).toBeInTheDocument();
  });
});
