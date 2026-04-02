import React from 'react';
import { Formik, Form, type FormikHelpers } from 'formik';
import { toast } from 'react-hot-toast';
import { Button } from './ui/button';
import { applyLeave } from '@/api/leave.api';
import type { LeaveApplication } from '@/types/leave.type';
import type { DateRange } from 'react-day-picker';
import { format, eachDayOfInterval } from 'date-fns';
import DatePicker from './ui/DatePicker';
import { isAxiosError } from 'axios';

type LeaveFormValues = {
  dateRange: DateRange | undefined;
};

const initialValues: LeaveFormValues = {
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

const ApplyLeaveForm = ({ refresh }: { refresh: () => Promise<void> }): React.JSX.Element => {
  const handleSubmit = async (
    values: LeaveFormValues,
    { resetForm }: FormikHelpers<LeaveFormValues>,
  ): Promise<void> => {
    const dates = getDatesBetween(values.dateRange);

    const leaveData: LeaveApplication = {
      leaveCategoryId: import.meta.env.VITE_ANNUAL_LEAVE_CATEGORY_ID,
      dates,
      duration: 'FULL_DAY',
      startTime: '10:00',
      description: 'Leave',
    };

    try {
      await applyLeave(leaveData);
      await refresh();
      toast.success('Leave submitted successfully!');
      resetForm();
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data || 'Leave Application submission failed');
      } else {
        toast.error('Unexpected Error Occurred');
      }
    }
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {({ isSubmitting, values, setFieldValue }) => (
        <Form className="flex flex-col gap-4 p-4 w-full">
          <label>Date Range</label>
          <DatePicker
            date={values.dateRange}
            setDate={(newDateRange) => setFieldValue('dateRange', newDateRange)}
            className="w-full cursor-pointer"
          />

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
