import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import DatePicker from './DatePicker';
import { format } from 'date-fns';

// Monday, April 6, 2026
const mockFrom = new Date(2026, 3, 6);

// Friday, April 10, 2026
const mockTo = new Date(2026, 3, 10);

describe('DatePicker', () => {
  test('displays only the start date when only from is provided', () => {
    render(<DatePicker date={{ from: mockFrom, to: undefined }} setDate={vi.fn()} />);
    expect(screen.getByText(format(mockFrom, 'LLL dd, y'))).toBeInTheDocument();
  });

  test('displays full range when both "from" and "to" are provided', () => {
    render(<DatePicker date={{ from: mockFrom, to: mockTo }} setDate={vi.fn()} />);

    const expected = `${format(mockFrom, 'LLL dd, y')} - ${format(mockTo, 'LLL dd, y')}`;
    expect(screen.getByText(expected)).toBeInTheDocument();
  });
});
