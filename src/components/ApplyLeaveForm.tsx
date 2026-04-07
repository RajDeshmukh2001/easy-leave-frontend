import React from 'react';
import type { FormikHelpers } from 'formik';
import { toast } from 'react-hot-toast';
import { applyLeave } from '@/api/leave.api';
import type { LeaveApplicationRequest } from '@/types/leaves';
import { getDatesBetween } from '@/utils/time';
import { isAxiosError } from 'axios';
import useLeaveCategories from '@/hooks/useLeaveCategories';

import LeaveForm, { type LeaveFormValues } from './LeaveForm';

const initialValues: LeaveFormValues = {
  leaveCategoryId: '',
  dateRange: undefined,
  startTime: '10:00',
  duration: 'FULL_DAY',
  description: '',
};

const ApplyLeaveForm = ({
  refreshLeaves,
}: {
  refreshLeaves: () => Promise<void>;
}): React.JSX.Element => {
  const { categories, loading, error } = useLeaveCategories();

  const handleSubmit = async (
    values: LeaveFormValues,
    { resetForm }: FormikHelpers<LeaveFormValues>,
  ): Promise<void> => {
    const leaveData: LeaveApplicationRequest = {
      leaveCategoryId: values.leaveCategoryId,
      dates: getDatesBetween(values.dateRange),
      duration: values.duration,
      startTime: values.startTime,
      description: values.description,
    };

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

  return (
    <LeaveForm
      initialValues={initialValues}
      onSubmit={handleSubmit}
      categories={categories}
      categoriesLoading={loading}
      categoriesError={error}
    />
  );
};

export default ApplyLeaveForm;
