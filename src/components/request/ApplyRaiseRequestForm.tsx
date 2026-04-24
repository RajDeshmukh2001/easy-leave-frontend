import { useRaiseRequest } from '@/hooks/useRaiseRequest';
import RaiseRequestForm from './RaiseRequestForm';

import type { RaiseRequestFormValues } from '@/types/request';

const initialValues: RaiseRequestFormValues = {
  requestType: '',
  leaveCategoryId: '',
  dateRange: undefined,
  duration: 'FULL_DAY',
  startTime: '10:00',
  description: '',
};

const ApplyRaiseRequestForm = (): React.JSX.Element => {
  const { handleSubmit } = useRaiseRequest();
  return <RaiseRequestForm initialValues={initialValues} onSubmit={handleSubmit} />;
};

export default ApplyRaiseRequestForm;
