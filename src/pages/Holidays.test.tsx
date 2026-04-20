import type { HolidayRequest, HolidayResponse } from '@/types/holiday';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import * as addHolidayApi from '@/api/holiday.api';
import Holidays from './Holidays';
import userEvent from '@testing-library/user-event';
import toast from 'react-hot-toast';
import type { DateRange } from 'react-day-picker';

const mockHolidayRequest: HolidayRequest = {
  name: 'Diwali',
  type: 'FIXED',
  date: '2026-03-02',
};

const mockHolidayResponse: HolidayResponse = {
  id: '1',
  name: 'Diwali',
  type: 'FIXED',
  date: '2026-03-02',
};

vi.mock('react-hot-toast', () => {
  const toast = {
    success: vi.fn(),
    error: vi.fn(),
  };

  return {
    default: toast,
    toast,
  };
});

vi.mock('@/components/DatePicker', () => ({
  default: ({ setDate }: { setDate: (range: DateRange | undefined) => void }) => (
    <button
      id="date-range-picker"
      aria-labelledby="date-range-label"
      type="button"
      onClick={() =>
        setDate({
          from: new Date('2026-03-02'),
          to: new Date('2026-03-02'),
        })
      }
    >
      Date
    </button>
  ),
}));

const renderAddHolidayForm = () => {
  render(<Holidays />);
};

describe('Add Holiday', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(addHolidayApi, 'addHoliday').mockResolvedValue(mockHolidayResponse);
  });

  test('renders all add holiday form fields', async () => {
    renderAddHolidayForm();

    expect(await screen.findByLabelText('Holiday Type')).toBeInTheDocument();
    expect(screen.getByLabelText('Holiday Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Date')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add Holiday' })).toBeInTheDocument();
  });

  test('display required field validation errors', async () => {
    renderAddHolidayForm();

    await screen.findByLabelText('Holiday Type');

    await userEvent.click(screen.getByRole('button', { name: 'Add Holiday' }));

    expect(
      screen.getByText('Holiday name can only contain letters and spaces'),
    ).toBeInTheDocument();
    expect(screen.getByText('Please choose a date')).toBeInTheDocument();
  });

  test('does not submit form when date is not selected', async () => {
    renderAddHolidayForm();

    const nameInput = screen.getByLabelText('Holiday Name');
    await userEvent.type(nameInput, 'Diwali');

    await userEvent.click(screen.getByRole('button', { name: 'Add Holiday' }));

    await waitFor(() => {
      expect(addHolidayApi.addHoliday).not.toHaveBeenCalled();
    });
  });

  test('submits form with correct data', async () => {
    renderAddHolidayForm();

    await userEvent.click(screen.getByRole('button', { name: 'Date' }));

    const nameInput = screen.getByLabelText('Holiday Name');
    fireEvent.change(nameInput, { target: { value: 'Diwali' } });

    await userEvent.click(screen.getByRole('button', { name: 'Add Holiday' }));
    expect(addHolidayApi.addHoliday).toHaveBeenCalledWith(mockHolidayRequest);
    expect(toast.success).toHaveBeenCalled();
  });

  test('displays API error message on submission failure', async () => {
    const errorMessage = 'Holiday already exists in the current year';
    const axiosError = {
      isAxiosError: true,
      response: { data: { message: errorMessage } },
    };
    vi.spyOn(addHolidayApi, 'addHoliday').mockRejectedValue(axiosError);

    renderAddHolidayForm();

    await userEvent.click(screen.getByRole('button', { name: 'Date' }));

    const nameInput = screen.getByLabelText('Holiday Name');
    fireEvent.change(nameInput, { target: { value: 'Diwali' } });

    await userEvent.click(screen.getByRole('button', { name: 'Add Holiday' }));
    expect(toast.error).toHaveBeenCalledWith(errorMessage);
  });

  test('displays generic error message when submission fails with non-axios error', async () => {
    vi.spyOn(addHolidayApi, 'addHoliday').mockRejectedValue(new Error('Network failure'));

    renderAddHolidayForm();

    await userEvent.click(screen.getByRole('button', { name: 'Date' }));

    const nameInput = screen.getByLabelText('Holiday Name');
    fireEvent.change(nameInput, { target: { value: 'Diwali' } });

    await userEvent.click(screen.getByRole('button', { name: 'Add Holiday' }));
    expect(toast.error).toHaveBeenCalledWith('Unexpected Error Occurred');
  });

  test('displays fallback message when axios error has no response message', async () => {
    const axiosError = {
      isAxiosError: true,
      response: { data: {} },
    };
    vi.spyOn(addHolidayApi, 'addHoliday').mockRejectedValue(axiosError);

    renderAddHolidayForm();

    await userEvent.click(screen.getByRole('button', { name: 'Date' }));

    const nameInput = screen.getByLabelText('Holiday Name');
    fireEvent.change(nameInput, { target: { value: 'Diwali' } });

    await userEvent.click(screen.getByRole('button', { name: 'Add Holiday' }));
    expect(toast.error).toHaveBeenCalledWith('Failed to add holiday');
  });

  test('shows error when name exceeds 50 characters', async () => {
    renderAddHolidayForm();

    const nameInput = screen.getByLabelText('Holiday Name');
    await userEvent.type(nameInput, 'a'.repeat(51));

    await userEvent.click(screen.getByRole('button', { name: 'Add Holiday' }));

    expect(
      await screen.findByText('Holiday name must be less than 50 characters'),
    ).toBeInTheDocument();
  });

  test('shows error when type is missing', async () => {
    renderAddHolidayForm();

    const select = screen.getByLabelText('Holiday Type');
    await userEvent.selectOptions(select, '');

    const nameInput = screen.getByLabelText('Holiday Name');
    await userEvent.type(nameInput, 'Diwali');

    await userEvent.click(screen.getByRole('button', { name: 'Add Holiday' }));

    expect(await screen.findByText('Holiday type is required')).toBeInTheDocument();
  });
});
