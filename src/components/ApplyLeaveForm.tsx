import React, { useState } from 'react';
import { Formik, Form, type FormikHelpers } from 'formik';
import { Button } from './ui/button';
import { applyLeave } from '@/api/leave.api';
import type { LeaveApplication } from '@/types/leave.type';
import type { DateRange } from 'react-day-picker';
import { addDays, format, eachDayOfInterval } from 'date-fns';
import DatePicker from './ui/DatePicker';
import { LEAVE_CATEGORIES } from '@/constants/leave';

type ApplyLeaveFormValues = {
  dates: string[];
};

const initialValues: ApplyLeaveFormValues = {
  dates: [],
};

const expandDateRange = (range: DateRange | undefined): string[] => {
  if (!range?.from) return [];
  const end = range.to ?? range.from;
  return eachDayOfInterval({ start: range.from, end }).map((d) =>
    format(d, 'yyyy-MM-dd'),
  );
};

const ApplyLeaveForm = (): React.JSX.Element => {
  const today = new Date();
  const defaultNumberOfDaysSelected = 2;

  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
    to: addDays(
      new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      defaultNumberOfDaysSelected - 1,
    ),
  });

  const onSubmit = async (
    _values: ApplyLeaveFormValues,
    { resetForm }: FormikHelpers<ApplyLeaveFormValues>,
  ) => {
    const expandedDates = expandDateRange(date);

    if (expandedDates.length === 0) {
      console.error('No dates selected');
      return;
    }

    const payload: LeaveApplication = {
      leaveCategoryId: LEAVE_CATEGORIES[0].id,
      dates: expandedDates,
      duration: 'FULL_DAY',
      startTime: '10:00',
      description: 'Leave',
    };

    try {
      const response = await applyLeave(payload);
      console.log('Leave application submitted successfully:', response);
      resetForm();
    } catch (error) {
      console.error('Error submitting leave application:', error);
    }
  };

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      {({ isSubmitting }) => (
        <Form>

          <DatePicker date={date} setDate={setDate} className="w-full cursor-pointer" />

          <Button
            type="submit"
            className="w-full bg-(--technogise-blue) cursor-pointer py-5"
            disabled={isSubmitting}
          >
            Submit Leave
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default ApplyLeaveForm;