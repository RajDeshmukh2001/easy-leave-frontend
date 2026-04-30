import React from 'react';
import type { FormikHelpers } from 'formik';
import { toast } from 'react-hot-toast';
import { applyLeave } from '@/api/leave.api';
import type { LeaveApplicationRequest } from '@/types/leaves';
import { getDatesBetween } from '@/utils/time';
import { isAxiosError } from 'axios';
import LeaveForm from '@/components/leave/LeaveForm';
import type { LeaveFormValues } from '@/types/leaveForm';
import useHolidays from '@/hooks/useHolidays';

const initialValues: LeaveFormValues = {
  leaveCategoryId: '',
  holidayId: '',
  dateRange: undefined,
  startTime: '10:00',
  duration: 'FULL_DAY',
  description: '',
  leaveType: 'regular',
};

const ApplyLeaveForm = ({
  refreshLeaves,
}: {
  refreshLeaves: () => Promise<void>;
}): React.JSX.Element => {
  const { holidays } = useHolidays('OPTIONAL');

  const handleSubmit = async (
    values: LeaveFormValues,
    { resetForm }: FormikHelpers<LeaveFormValues>,
  ) => {
    let leaveData: LeaveApplicationRequest;

    if (values.leaveType === 'holiday') {
      const selectedHoliday = holidays.find((holiday) => holiday.id === values.holidayId);
      leaveData = {
        holidayId: values.holidayId,
        dates: [selectedHoliday!.date],
        description: selectedHoliday!.name,
        duration: 'FULL_DAY',
        startTime: values.startTime,
      };
    } else {
      leaveData = {
        leaveCategoryId: values.leaveCategoryId,
        dates: getDatesBetween(values.dateRange),
        duration: values.duration,
        startTime: values.startTime,
        description: values.description,
      };
    }

    try {
      await applyLeave(leaveData);
      toast.success('Leave submitted successfully!');
      await refreshLeaves();
      resetForm();
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Leave Application submission failed');
      } else {
        toast.error('Unexpected Error Occurred');
      }
    }
  };

  return <LeaveForm initialValues={initialValues} onSubmit={handleSubmit} />;
};

export default ApplyLeaveForm;
