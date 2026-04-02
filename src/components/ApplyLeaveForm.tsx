import React from 'react';
import { Formik, Form, type FormikHelpers, Field, ErrorMessage, type FormikErrors } from 'formik';
import { toast } from 'react-hot-toast';
import { Button } from './ui/button';
import { applyLeave } from '@/api/leave.api';
import type { LeaveApplication } from '@/types/leave.type';
import type { DateRange } from 'react-day-picker';
import { format, eachDayOfInterval } from 'date-fns';
import DatePicker from './ui/DatePicker';
import { isAxiosError } from 'axios';
import useLeaveCategories from '@/hooks/useLeaveCategories';

type LeaveFormValues = {
  leaveCategoryId: string;
  dateRange: DateRange | undefined;
};

const initialValues: LeaveFormValues = {
  leaveCategoryId: '',
  dateRange: undefined,
};

const getDatesBetween = (range: DateRange | undefined): string[] => {
  const noDatesSelected = !range || !range.from;
  if (noDatesSelected) return [];

  const startDate = range.from;
  const endDate = range.to ?? range.from;
  const allDays = eachDayOfInterval({ start: startDate!, end: endDate! });
  const formattedDays = allDays.map((day) => format(day, 'yyyy-MM-dd'));

  return formattedDays;
};

const validate = (values: LeaveFormValues) => {
  const errors: FormikErrors<LeaveFormValues> = {};

  if (!values.leaveCategoryId) {
    errors.leaveCategoryId = 'Leave category is required';
  }

  return errors;
};

const ApplyLeaveForm = ({ refresh }: { refresh: () => Promise<void> }): React.JSX.Element => {
  const { categories, loading: categoriesLoading, error: categoriesError } = useLeaveCategories();

  const handleSubmit = async (
    values: LeaveFormValues,
    { resetForm }: FormikHelpers<LeaveFormValues>,
  ): Promise<void> => {
    const dates = getDatesBetween(values.dateRange);

    const leaveData: LeaveApplication = {
      leaveCategoryId: values.leaveCategoryId,
      dates,
      duration: 'FULL_DAY',
      startTime: '10:00',
      description: 'Leave',
    };

    try {
      await applyLeave(leaveData);
      toast.success('Leave submitted successfully!');
      await refresh();
      resetForm();
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Leave Application submission failed');
      } else {
        toast.error('Unexpected Error Occurred');
      }
    }
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit} validate={validate}>
      {({ isSubmitting, values, setFieldValue }) => (
        <Form className="flex flex-col gap-4 p-4 w-full">
          <div className="flex flex-col gap-1">
            <label htmlFor="leaveCategory">Leave Category</label>
            {categoriesError && <p className="text-sm text-red-700">{categoriesError}</p>}
            <Field
              as="select"
              name="leaveCategoryId"
              id="leaveCategoryId"
              disabled={categoriesLoading}
              className="rounded-md border border-gray-300 p-2 cursor-pointer"
            >
              <option value="">
                {categoriesLoading ? 'Loading categories...' : 'Select a category'}
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Field>
            <ErrorMessage name="leaveCategoryId" component="p" className="text-sm text-red-700" />
          </div>

          <div>
            <label>Date Range</label>
            <DatePicker
              date={values.dateRange}
              setDate={(newDateRange) => setFieldValue('dateRange', newDateRange)}
              className="w-full cursor-pointer"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-(--technogise-blue) cursor-pointer py-5"
          >
            Submit Leave
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default ApplyLeaveForm;
