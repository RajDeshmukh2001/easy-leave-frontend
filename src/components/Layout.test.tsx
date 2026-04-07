import { render } from '@testing-library/react';
import { describe, test } from 'vitest';
import Layout from './Layout';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';

const renderLayout = () => {
  render(
    <AuthProvider>
      <MemoryRouter>
        <Layout />
      </MemoryRouter>
    </AuthProvider>,
  );
};

describe('Leave Component', () => {
  test('renders Leave component content', () => {
    renderLayout();
  });
});
