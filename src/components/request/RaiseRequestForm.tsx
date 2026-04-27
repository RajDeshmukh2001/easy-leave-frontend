import { Formik, type FormikHelpers } from 'formik';
import type { RaiseRequestFormValues } from '@/types/request';
import { validateRaiseRequestForm } from '@/utils/raiseRequestForm';
import RaiseRequestFormFields from './RaiseRequestFormFields';

type RaiseRequestFormProps = {
  initialValues: RaiseRequestFormValues;
  onSubmit: (
    values: RaiseRequestFormValues,
    helpers: FormikHelpers<RaiseRequestFormValues>,
  ) => void | Promise<void>;
};

const RaiseRequestForm = ({
  initialValues,
  onSubmit,
}: RaiseRequestFormProps): React.JSX.Element => {
  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} validate={validateRaiseRequestForm}>
      {({ isSubmitting, values, setFieldValue }) => (
        <RaiseRequestFormFields
          isSubmitting={isSubmitting}
          values={values}
          setFieldValue={setFieldValue}
        />
      )}
    </Formik>
  );
};

export default RaiseRequestForm;
