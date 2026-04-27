import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { FormikHelpers } from 'formik';
import type { RaiseRequestFormValues } from '@/types/request';
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

describe('ApplyRaiseRequestForm', () => {
  const mockResetForm = vi.fn();
  const mockUser = userEvent.setup();

  const testFormValues: RaiseRequestFormValues = {
    requestType: 'VACATION' as RaiseRequestFormValues['requestType'],
    leaveCategoryId: '123',
    dateRange: undefined,
    duration: 'FULL_DAY' as RaiseRequestFormValues['duration'],
    startTime: '10:00',
    description: 'Test description',
  };

  beforeEach(() => {
    vi.clearAllMocks();
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
            onClick={() => {
              if (onSubmit) {
                onSubmit(testFormValues, {
                  resetForm: mockResetForm,
                } as unknown as FormikHelpers<RaiseRequestFormValues>);
              }
            }}
          >
            Submit
          </button>
        </div>
      ),
    );
  });

  test('renders the raise request form correctly', () => {
    render(<ApplyRaiseRequestForm />);
    expect(screen.getByTestId('raise-request-form')).toBeInTheDocument();
  });

  describe('handleSubmit', () => {
    test('submits form with correct data and resets form on success', async () => {
      mockRaiseRequest.mockResolvedValue(undefined!);
      mockGetDatesBetween.mockReturnValue(['2026-04-24']);

      render(<ApplyRaiseRequestForm />);
      await mockUser.click(screen.getByTestId('submit-button'));

      expect(mockGetDatesBetween).toHaveBeenCalledWith(undefined, false);
      expect(mockRaiseRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          requestType: 'VACATION',
          duration: 'FULL_DAY',
          startTime: '10:00',
          description: 'Test description',
        }),
      );
      expect(mockToastSuccess).toHaveBeenCalledWith('Request raised successfully');
      expect(mockResetForm).toHaveBeenCalled();
    });

    test('displays API error message on submission failure', async () => {
      const axiosError = {
        isAxiosError: true,
        response: { data: { message: 'Quota exceeded' } },
      };
      mockRaiseRequest.mockRejectedValue(axiosError as unknown as Error);

      render(<ApplyRaiseRequestForm />);
      await mockUser.click(screen.getByTestId('submit-button'));

      await waitFor(() => {
        expect(mockToastError).toHaveBeenCalledWith('Quota exceeded');
      });
    });

    test('displays error message when submission fails with nonaxios error', async () => {
      mockRaiseRequest.mockRejectedValue(new Error('Network error'));

      render(<ApplyRaiseRequestForm />);
      await mockUser.click(screen.getByTestId('submit-button'));

      await waitFor(() => {
        expect(mockToastError).toHaveBeenCalledWith('Unexpected Error Occurred');
      });
    });
  });

  describe('request types', () => {
    test('includes leaveCategoryId in payload when requestType is PAST_LEAVE', async () => {
      const pastLeaveValues: RaiseRequestFormValues = {
        ...testFormValues,
        requestType: 'PAST_LEAVE' as RaiseRequestFormValues['requestType'],
      };

      mockRaiseRequestForm.mockImplementationOnce(
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
              onClick={() => {
                if (onSubmit) {
                  onSubmit(pastLeaveValues, {
                    resetForm: mockResetForm,
                  } as unknown as FormikHelpers<RaiseRequestFormValues>);
                }
              }}
            >
              Submit
            </button>
          </div>
        ),
      );

      mockRaiseRequest.mockResolvedValue(undefined!);
      mockGetDatesBetween.mockReturnValue(['2026-04-24']);

      render(<ApplyRaiseRequestForm />);
      await mockUser.click(screen.getByTestId('submit-button'));
      expect(mockRaiseRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          requestType: 'PAST_LEAVE',
          leaveCategoryId: '123',
        }),
      );
    });
  });
});
