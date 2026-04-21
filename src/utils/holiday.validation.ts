import type { HolidayFromValues } from '@/types/holiday';
import type { FormikErrors } from 'formik';

export const validateHolidayForm = (values: HolidayFromValues): FormikErrors<HolidayFromValues> => {
  const errors: FormikErrors<HolidayFromValues> = {};
  const name = values.name?.trim();
  const nameRegex = /^[a-zA-Z\s]+$/;

  if (!values.type) {
    errors.type = 'Holiday type is required';
  }

  if (!name) {
    errors.name = 'Holiday name is required';
  } else if (name.length > 50) {
    errors.name = 'Holiday name must be less than 50 characters';
  } else if (!nameRegex.test(name)) {
    errors.name = 'Holiday name can only contain letters and spaces';
  }

  if (!values.date?.from) {
    errors.date = 'Please choose a date';
  }

  return errors;
};
