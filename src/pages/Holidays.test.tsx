import type { HolidayRequest, HolidayResponse } from '@/types/holiday';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import * as holidaysApi from '@/api/holiday.api';
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

const mockHolidaysList: HolidayResponse[] = [
  {
    id: '1',
    name: 'Republic Day',
    date: '2026-01-26',
    type: 'FIXED',
  },
];

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

const renderHolidayPage = () => {
  render(<Holidays />);
};

describe('Add Holiday', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(holidaysApi, 'addHoliday').mockResolvedValue(mockHolidayResponse);
  });

  test('renders all add holiday form fields', async () => {
    renderHolidayPage();

    expect(await screen.findByLabelText('Holiday Type')).toBeInTheDocument();
    expect(screen.getByLabelText('Holiday Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Date')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add Holiday' })).toBeInTheDocument();
  });

  test('display required field validation errors', async () => {
    renderHolidayPage();

    await screen.findByLabelText('Holiday Type');

    await userEvent.click(screen.getByRole('button', { name: 'Add Holiday' }));

    expect(screen.getByText('Holiday name is required')).toBeInTheDocument();
    expect(screen.getByText('Please choose a date')).toBeInTheDocument();
  });

  test('does not submit form when date is not selected', async () => {
    renderHolidayPage();

    const nameInput = screen.getByLabelText('Holiday Name');
    await userEvent.type(nameInput, 'Diwali');

    await userEvent.click(screen.getByRole('button', { name: 'Add Holiday' }));

    await waitFor(() => {
      expect(holidaysApi.addHoliday).not.toHaveBeenCalled();
    });
  });

  test('submits form with correct data', async () => {
    renderHolidayPage();

    await userEvent.click(screen.getByRole('button', { name: 'Date' }));

    const nameInput = screen.getByLabelText('Holiday Name');
    fireEvent.change(nameInput, { target: { value: 'Diwali' } });

    await userEvent.click(screen.getByRole('button', { name: 'Add Holiday' }));
    expect(holidaysApi.addHoliday).toHaveBeenCalledWith(mockHolidayRequest);
    expect(toast.success).toHaveBeenCalled();
  });

  test('displays API error message on submission failure', async () => {
    const errorMessage = 'Holiday already exists in the current year';
    const axiosError = {
      isAxiosError: true,
      response: { data: { message: errorMessage } },
    };
    vi.spyOn(holidaysApi, 'addHoliday').mockRejectedValue(axiosError);

    renderHolidayPage();

    await userEvent.click(screen.getByRole('button', { name: 'Date' }));

    const nameInput = screen.getByLabelText('Holiday Name');
    fireEvent.change(nameInput, { target: { value: 'Diwali' } });

    await userEvent.click(screen.getByRole('button', { name: 'Add Holiday' }));
    expect(toast.error).toHaveBeenCalledWith(errorMessage);
  });

  test('displays generic error message when submission fails with non-axios error', async () => {
    vi.spyOn(holidaysApi, 'addHoliday').mockRejectedValue(new Error('Network failure'));

    renderHolidayPage();

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
    vi.spyOn(holidaysApi, 'addHoliday').mockRejectedValue(axiosError);

    renderHolidayPage();

    await userEvent.click(screen.getByRole('button', { name: 'Date' }));

    const nameInput = screen.getByLabelText('Holiday Name');
    fireEvent.change(nameInput, { target: { value: 'Diwali' } });

    await userEvent.click(screen.getByRole('button', { name: 'Add Holiday' }));
    expect(toast.error).toHaveBeenCalledWith('Failed to add holiday');
  });

  test('shows error when name exceeds 50 characters', async () => {
    renderHolidayPage();

    const nameInput = screen.getByLabelText('Holiday Name');
    await userEvent.type(nameInput, 'a'.repeat(51));

    await userEvent.click(screen.getByRole('button', { name: 'Add Holiday' }));

    expect(
      await screen.findByText('Holiday name must be less than 50 characters'),
    ).toBeInTheDocument();
  });

  test('shows error when type is missing', async () => {
    renderHolidayPage();

    const select = screen.getByLabelText('Holiday Type');
    await userEvent.selectOptions(select, '');

    const nameInput = screen.getByLabelText('Holiday Name');
    await userEvent.type(nameInput, 'Diwali');

    await userEvent.click(screen.getByRole('button', { name: 'Add Holiday' }));

    expect(await screen.findByText('Holiday type is required')).toBeInTheDocument();
  });

  test('shows error for invalid name format', async () => {
    renderHolidayPage();

    const nameInput = screen.getByLabelText('Holiday Name');
    await userEvent.type(nameInput, 'Diwali123');

    await userEvent.click(screen.getByRole('button', { name: 'Add Holiday' }));

    expect(
      await screen.findByText('Holiday name can only contain letters and spaces'),
    ).toBeInTheDocument();
  });
});

describe('Holiday Table', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(holidaysApi, 'fetchHolidays').mockResolvedValue(mockHolidaysList);
  });

  test('renders holiday table columns', async () => {
    render(<Holidays />);

    expect(await screen.findByText('Holiday Name')).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Holiday Name' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Date' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Type' })).toBeInTheDocument();
  });

  test('displays error message when API call fails', async () => {
    vi.spyOn(holidaysApi, 'fetchHolidays').mockRejectedValue(new Error('Failed to fetch holidays'));

    render(<Holidays />);

    expect(await screen.findByText('Failed to fetch holidays')).toBeInTheDocument();
  });

  test('calls fetchHolidays with correct type when holidayType state changes', async () => {
    const spy = vi.spyOn(holidaysApi, 'fetchHolidays').mockResolvedValue(mockHolidaysList);
    render(<Holidays />);

    const dropdown = await screen.getByDisplayValue('All');
    await userEvent.selectOptions(dropdown, 'FIXED');
    await waitFor(() => {
      expect(spy).toHaveBeenCalledWith({ type: 'FIXED' });
    });
  });

  test('reloads the holiday list after adding a new holiday', async () => {
    const loadHolidaysSpy = vi
      .spyOn(holidaysApi, 'fetchHolidays')
      .mockResolvedValue(mockHolidaysList);
    vi.spyOn(holidaysApi, 'addHoliday').mockResolvedValue(mockHolidayResponse);

    render(<Holidays />);

    const nameInput = await screen.findByLabelText('Holiday Name');
    fireEvent.change(nameInput, { target: { value: 'Diwali' } });
    await userEvent.click(screen.getByRole('button', { name: 'Date' }));
    await userEvent.click(screen.getByRole('button', { name: 'Add Holiday' }));

    await waitFor(() => {
      expect(loadHolidaysSpy).toHaveBeenCalled();
    });
  });
});
