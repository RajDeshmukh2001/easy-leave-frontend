import type { RaiseRequestFormValues } from '@/types/request';
import type { FormikErrors } from 'formik';

export const validateRaiseRequestForm = (
  values: RaiseRequestFormValues,
): FormikErrors<RaiseRequestFormValues> => {
  const errors: FormikErrors<RaiseRequestFormValues> = {};

  if (values.requestType === 'PAST_LEAVE') {
    if (!values.leaveCategoryId) {
      errors.leaveCategoryId = 'Select a leave category';
    }
  }

  if (!values.dateRange || !values.dateRange.from) {
    errors.dateRange = 'Select a date';
  }

  if (!values.description.trim()) {
    errors.description = 'Reason is required';
  }

  if (values.description.length > 1000) {
    errors.description = 'Reason cannot be over 1000 characters';
  }

  if (!values.duration) {
    errors.duration = 'Select duration';
  }

  return errors;
};
