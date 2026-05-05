import { screen, render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import NotFound from './NotFound';
import userEvent from '@testing-library/user-event';

const renderNotFound = () => {
  render(
    <MemoryRouter initialEntries={['/non-existent-route']}>
      <Routes>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MemoryRouter>,
  );
};

describe('NotFound page', () => {
  test('renders NotFound component for non-existent route', async () => {
    renderNotFound();

    expect(await screen.findByText(/404/i)).toBeInTheDocument();
    expect(await screen.findByText(/Page Not Found/i)).toBeInTheDocument();
    expect(
      screen.getByText(/We could not find the page you were looking for./i),
    ).toBeInTheDocument();

    const backToHomeButton = screen.getByRole('button', { name: /Back To Home/i });
    expect(backToHomeButton).toBeInTheDocument();
  });

  test('navigates back to home when "Back To Home" button is clicked', async () => {
    renderNotFound();

    const backToHomeButton = screen.getByRole('button', { name: /Back To Home/i });
    await userEvent.click(backToHomeButton);

    expect(window.location.pathname).toBe('/');
  });
});
