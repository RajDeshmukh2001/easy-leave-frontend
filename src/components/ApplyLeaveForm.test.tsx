import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import ApplyLeaveForm from './ApplyLeaveForm';

describe('ApplyLeaveForm', () => {
  const refreshLeaves = vi.fn();

  test('renders all form fields', async () => {
    render(<ApplyLeaveForm refreshLeaves={refreshLeaves} />);
    await waitFor(() => {
      expect(screen.getByLabelText('Date Range')).toBeInTheDocument();
      expect(screen.getByLabelText('Duration')).toBeInTheDocument();
      expect(screen.getByLabelText('Start Time')).toBeInTheDocument();
      expect(screen.getByLabelText('End Time')).toBeInTheDocument();
      expect(screen.getByLabelText('Reason')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Submit Leave' })).toBeInTheDocument();
    });
  });
});
