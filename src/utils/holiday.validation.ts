import type { Holiday } from '@/types/holiday';
import type { FormikErrors } from 'formik';

export const validateHolidayForm = (values: Holiday): FormikErrors<Holiday> => {
  const errors: FormikErrors<Holiday> = {};

  if (!values.type) {
    errors.type = 'Holiday type is required';
  }

  if (!values.name.trim()) {
    errors.name = 'Holiday name is required';
  }

  if (values.name.trim().length > 50) {
    errors.name = 'Holiday name must be less than 50 characters';
  }

  if (!values.date || !values.date.from) {
    errors.date = 'Please choose a date';
  }

  return errors;
};
