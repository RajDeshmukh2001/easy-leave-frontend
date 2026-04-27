import type { FormikHelpers } from 'formik';
import { toast } from 'react-hot-toast';
import type { RaiseRequestFormValues, RaiseRequestPayload } from '@/types/request';
import { raiseRequest } from '@/api/request.api';
import { getDatesBetween } from '@/utils/time';
import RaiseRequestForm from './RaiseRequestForm';
import type { RequestType } from '@/constants/request';

const initialValues: RaiseRequestFormValues = {
  requestType: '',
  leaveCategoryId: '',
  dateRange: undefined,
  duration: 'FULL_DAY',
  startTime: '10:00',
  description: '',
};

const ApplyRaiseRequestForm = (): React.JSX.Element => {
  const handleSubmit = async (
    values: RaiseRequestFormValues,
    { resetForm }: FormikHelpers<RaiseRequestFormValues>,
  ): Promise<void> => {
    const isPastLeave = values.requestType === 'PAST_LEAVE';

    const payload: RaiseRequestPayload = {
      requestType: values.requestType as RequestType,
      dates: getDatesBetween(values.dateRange, values.requestType === 'COMPENSATORY_OFF'),
      duration: values.duration,
      startTime: values.startTime,
      description: values.description,
      ...(isPastLeave && { leaveCategoryId: values.leaveCategoryId }),
    };

    try {
      await raiseRequest(payload);
      toast.success('Request raised successfully');
      resetForm();
    } catch (error) {
      const err = error as { isAxiosError?: boolean; response?: { data?: { message?: string } } };
      const message = err.response?.data?.message || 'Failed to raise request';
      toast.error(err.isAxiosError ? message : 'Unexpected Error Occurred');
    }
  };

  return <RaiseRequestForm initialValues={initialValues} onSubmit={handleSubmit} />;
};

export default ApplyRaiseRequestForm;
