import React from 'react';
import { Formik, Form, type FormikHelpers, Field, ErrorMessage, type FormikErrors } from 'formik';
import { toast } from 'react-hot-toast';
import { Button } from './ui/button';
import { applyLeave } from '@/api/leave.api';
import type { LeaveApplicationRequest } from '@/types/leaves';
import type { DateRange } from 'react-day-picker';
import { format, eachDayOfInterval } from 'date-fns';
import DatePicker from './ui/DatePicker';
import { isAxiosError } from 'axios';
import useLeaveCategories from '@/hooks/useLeaveCategories';

type LeaveFormValues = {
  leaveCategoryId: string;
  dateRange: DateRange | undefined;
  startTime: string;
  duration: 'FULL_DAY' | 'HALF_DAY';
  description: string;
};

const initialValues: LeaveFormValues = {
  leaveCategoryId: '',
  dateRange: undefined,
  startTime: '10:00',
  duration: 'FULL_DAY',
  description: '',
};

const FULL_DAY_DURATION_HOURS = 8;
const HALF_DAY_DURATION_HOURS = 4;

const getDatesBetween = (range: DateRange | undefined): string[] => {
  const noDatesSelected = !range || !range.from;
  if (noDatesSelected) return [];

  const startDate = range.from;
  const endDate = range.to ?? range.from;
  const allDays = eachDayOfInterval({ start: startDate!, end: endDate! });

  const weekdays = allDays.filter((day) => day.getDay() !== 0 && day.getDay() !== 6);
  const formattedDays = weekdays.map((day) => format(day, 'yyyy-MM-dd'));

  return formattedDays;
};

const validate = (values: LeaveFormValues) => {
  const errors: FormikErrors<LeaveFormValues> = {};

  if (!values.leaveCategoryId) {
    errors.leaveCategoryId = 'Leave category is required';
  }

  if (!values.dateRange || !values.dateRange.from) {
    errors.dateRange = 'Please enter a date';
  }

  if (values.description.trim() === '') {
    errors.description = 'Description is required';
  }

  if (values.description.length > 1000) {
    errors.description = 'Description cannot be over 1000 characters';
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

    const leaveData: LeaveApplicationRequest = {
      leaveCategoryId: values.leaveCategoryId,
      dates,
      duration: values.duration,
      startTime: values.startTime,
      description: values.description,
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

  const addHours = (timeString: string, noOfHours: number): string => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours) + noOfHours);
    date.setMinutes(parseInt(minutes));
    return date.toTimeString().slice(0, 5);
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
              className="rounded-md border border-gray-300 bg-gray-50 p-2 cursor-pointer text-sm"
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

          <div className="flex flex-col gap-1">
            <label htmlFor="dateRange">Date Range</label>
            <DatePicker
              date={values.dateRange}
              setDate={(newDateRange) => setFieldValue('dateRange', newDateRange)}
              className="w-full cursor-pointer"
            />
            <ErrorMessage name="dateRange" component="p" className="text-sm text-red-700" />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="duration">Duration</label>
            <Field
              as="select"
              name="duration"
              id="duration"
              className="px-3 py-2 rounded-lg border bg-gray-50 border-neutral-300 text-sm cursor-pointer"
            >
              <option value="FULL_DAY">Full Day</option>
              <option value="HALF_DAY">Half Day</option>
            </Field>
          </div>

          <div className="flex justify-between gap-3">
            <div className="flex flex-1 flex-col">
              <label htmlFor="startTime">Start Time</label>
              <Field
                type="time"
                id="startTime"
                name="startTime"
                className="px-3 py-2 rounded-lg border border-neutral-300 bg-gray-50 text-sm cursor-pointer"
              />
            </div>

            <div className="flex flex-1 flex-col">
              <label htmlFor="endTime">End Time</label>
              <Field
                type="time"
                id="endTime"
                name="endTime"
                value={
                  values.duration === 'FULL_DAY'
                    ? addHours(values.startTime, FULL_DAY_DURATION_HOURS)
                    : addHours(values.startTime, HALF_DAY_DURATION_HOURS)
                }
                className="px-3 py-2 rounded-lg border border-neutral-300 bg-gray-100 text-sm cursor-not-allowed"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="description">Reason</label>
            <Field
              as="textarea"
              id="description"
              name="description"
              placeholder="Reason for taking leave..."
              rows="4"
              className="px-3 py-2 rounded-lg border border-neutral-300 bg-gray-50 text-sm"
            />
            <ErrorMessage name="description" component="p" className="text-sm text-red-700" />
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
