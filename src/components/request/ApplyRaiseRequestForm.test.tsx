import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { FormikHelpers } from 'formik';
import type { RaiseRequestFormValues, RaiseRequestResponse } from '@/types/request';
import ApplyRaiseRequestForm from './ApplyRaiseRequestForm';
import RaiseRequestForm from './RaiseRequestForm';
import { raiseRequest } from '@/api/request.api';
import { getDatesBetween } from '@/utils/time';
import toast from 'react-hot-toast';

vi.mock('@/api/request.api');
vi.mock('./RaiseRequestForm');
vi.mock('@/utils/time');
vi.mock('react-hot-toast');

const mockRaiseRequest = vi.mocked(raiseRequest);
const mockGetDatesBetween = vi.mocked(getDatesBetween);
const mockToastSuccess = vi.mocked(toast.success);
const mockToastError = vi.mocked(toast.error);
const mockRaiseRequestForm = vi.mocked(RaiseRequestForm);
const mockRefreshRequests = vi.fn();

const mockResetForm = vi.fn();

const mockRaiseRequestResponse: RaiseRequestResponse[] = [
  {
    id: '123',
    requestType: 'PAST_LEAVE',
    leaveCategoryName: 'Annual Leave',
    date: '2026-03-10',
    startTime: '10:00:00',
    duration: 'FULL_DAY',
    description: 'Sick leave',
    status: 'PENDING',
  },
];

const baseFormValues: RaiseRequestFormValues = {
  requestType: 'COMPENSATORY_OFF',
  leaveCategoryId: '123',
  dateRange: undefined,
  duration: 'FULL_DAY',
  startTime: '10:00',
  description: 'Worked on Saturday for client',
};

const renderWithFormValues = (values: RaiseRequestFormValues) => {
  mockRaiseRequestForm.mockImplementation(
    ({
      onSubmit,
    }: {
      onSubmit: (
        values: RaiseRequestFormValues,
        helpers: FormikHelpers<RaiseRequestFormValues>,
      ) => void;
    }) => (
      <div data-testid="raise-request-form">
        <button
          data-testid="submit-button"
          onClick={() =>
            onSubmit(values, {
              resetForm: mockResetForm,
            } as unknown as FormikHelpers<RaiseRequestFormValues>)
          }
        >
          Submit
        </button>
      </div>
    ),
  );
  render(<ApplyRaiseRequestForm refreshRequests={mockRefreshRequests} />);
};

describe('ApplyRaiseRequestForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockResetForm.mockClear();
    mockGetDatesBetween.mockReturnValue(['2026-04-19']);
    mockRaiseRequest.mockResolvedValue(mockRaiseRequestResponse);
  });

  test('renders the raise request form', () => {
    renderWithFormValues(baseFormValues);
    expect(screen.getByTestId('raise-request-form')).toBeInTheDocument();
  });

  describe('handleSubmit', () => {
    test('submits COMPENSATORY_OFF with correct payload and resets form on success', async () => {
      renderWithFormValues(baseFormValues);
      await userEvent.click(screen.getByTestId('submit-button'));

      expect(mockGetDatesBetween).toHaveBeenCalledWith(undefined, true);
      expect(mockRaiseRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          requestType: 'COMPENSATORY_OFF',
          duration: 'FULL_DAY',
          startTime: '10:00',
          description: 'Worked on Saturday for client',
        }),
      );
      expect(mockToastSuccess).toHaveBeenCalledWith('Request raised successfully');
      expect(mockResetForm).toHaveBeenCalled();
    });

    test('submits PAST_LEAVE with leaveCategoryId in payload', async () => {
      renderWithFormValues({
        ...baseFormValues,
        requestType: 'PAST_LEAVE',
        description: 'Forgot to log sick leave',
      });
      await userEvent.click(screen.getByTestId('submit-button'));

      expect(mockGetDatesBetween).toHaveBeenCalledWith(undefined, false);
      expect(mockRaiseRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          requestType: 'PAST_LEAVE',
          leaveCategoryId: '123',
          description: 'Forgot to log sick leave',
        }),
      );
    });

    test('does not include leaveCategoryId in payload for COMPENSATORY_OFF', async () => {
      renderWithFormValues(baseFormValues);
      await userEvent.click(screen.getByTestId('submit-button'));

      expect(mockRaiseRequest).toHaveBeenCalledWith(
        expect.not.objectContaining({ leaveCategoryId: expect.anything() }),
      );
    });

    test('displays API error message on submission failure', async () => {
      mockRaiseRequest.mockRejectedValue({
        isAxiosError: true,
        response: { data: { message: 'A request already exists for this date' } },
      });

      renderWithFormValues(baseFormValues);
      await userEvent.click(screen.getByTestId('submit-button'));

      await waitFor(() => {
        expect(mockToastError).toHaveBeenCalledWith('A request already exists for this date');
      });
    });

    test('displays fallback message when axios error has no response message', async () => {
      mockRaiseRequest.mockRejectedValue({
        isAxiosError: true,
        response: { data: {} },
      });

      renderWithFormValues(baseFormValues);
      await userEvent.click(screen.getByTestId('submit-button'));

      await waitFor(() => {
        expect(mockToastError).toHaveBeenCalledWith('Failed to raise request');
      });
    });

    test('displays generic error message on non-axios error', async () => {
      mockRaiseRequest.mockRejectedValue(new Error('Network failure'));

      renderWithFormValues(baseFormValues);
      await userEvent.click(screen.getByTestId('submit-button'));

      await waitFor(() => {
        expect(mockToastError).toHaveBeenCalledWith('Unexpected Error Occurred');
      });
    });
  });
});
