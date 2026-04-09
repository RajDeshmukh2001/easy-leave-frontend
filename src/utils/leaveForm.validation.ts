import type { FormikErrors } from 'formik';
import type { LeaveFormValues } from '@/types/leaveForm';
export const validateLeaveForm = (values: LeaveFormValues): FormikErrors<LeaveFormValues> => {
  const errors: FormikErrors<LeaveFormValues> = {};

  if (!values.leaveCategoryId) {
    errors.leaveCategoryId = 'Leave category is required';
  }

  if (!values.dateRange || !values.dateRange.from) {
    errors.dateRange = 'Please choose a date';
  }

  if (!values.description.trim()) {
    errors.description = 'Reason is required';
  }

  if (values.description.length > 1000) {
    errors.description = 'Reason cannot be over 1000 characters';
  }

  return errors;
};
