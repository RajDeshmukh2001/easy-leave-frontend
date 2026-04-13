import { render } from '@testing-library/react';
import { describe, test } from 'vitest';
import Layout from './Layout';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { TooltipProvider } from './ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';

vi.mock('@/hooks/use-mobile', () => ({
  useIsMobile: vi.fn(),
}));

const renderLayout = () => {
  render(
    <AuthProvider>
      <TooltipProvider>
        <MemoryRouter>
          <Layout />
        </MemoryRouter>
      </TooltipProvider>
    </AuthProvider>,
  );
};

vi.mocked(useIsMobile).mockReturnValue(false);

describe('Leave Component', () => {
  test('renders Leave component content', () => {
    renderLayout();
  });
});

describe('Layout Component', () => {
  test('renders Layout component content', () => {
    renderLayout();
  });

  test('renders mobile trigger when on mobile', () => {
    vi.mocked(useIsMobile).mockReturnValue(true);
    renderLayout();
  });
});
