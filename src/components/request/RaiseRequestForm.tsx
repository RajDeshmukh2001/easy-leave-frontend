import { Formik, Form, type FormikHelpers } from 'formik';
import { useEffect, useRef } from 'react';
import type { Matcher } from 'react-day-picker';
import SelectField from '../form/SelectField';
import DatePickerField from '../form/DatePickerField';
import TimeField from '../form/TimeField';
import TextareaField from '../form/TextareaField';
import { Button } from '../ui/button';
import useLeaveCategories from '@/hooks/useLeaveCategories';
import type { RaiseRequestFormValues } from '@/types/request';
import { validateRaiseRequestForm } from '@/utils/raiseRequestForm';
import { addHours } from '@/utils/time';
import { FULL_DAY_DURATION_HOURS, HALF_DAY_DURATION_HOURS } from '@/constants/leaveForm';
import { subDays } from 'date-fns';

const now = new Date();
const thirtyDays = subDays(now, 30);

const pastLeaveDisabled: Matcher[] = [
  { before: thirtyDays },
  { after: subDays(now, 1) },
  { dayOfWeek: [0, 6] },
];

const compOffDisabled: Matcher[] = [
  { before: thirtyDays },
  { after: subDays(now, 1) },
  { dayOfWeek: [1, 2, 3, 4, 5] },
];

const LeaveCategorySelect = (): React.JSX.Element => {
  const { categories, loading, error } = useLeaveCategories();

  return (
    <SelectField
      name="leaveCategoryId"
      id="leaveCategoryId"
      label="Leave Category"
      options={categories.map((c) => ({ value: c.id, label: c.name }))}
      loading={loading}
      error={error}
      placeholder="Select a category"
    />
  );
};

const RaiseRequestFormFields = ({
  isSubmitting,
  values,
  setFieldValue,
}: {
  isSubmitting: boolean;
  values: RaiseRequestFormValues;
  setFieldValue: FormikHelpers<RaiseRequestFormValues>['setFieldValue'];
}): React.JSX.Element => {
  const isPastLeave = values.requestType === 'PAST_LEAVE';

  const prevRequestType = useRef(values.requestType);
  useEffect(() => {
    if (prevRequestType.current !== values.requestType) {
      setFieldValue('leaveCategoryId', '');
      setFieldValue('dateRange', undefined);
      setFieldValue('description', '');
      prevRequestType.current = values.requestType;
    }
  }, [values.requestType, setFieldValue]);

  return (
    <Form className="flex flex-col gap-4 p-4 w-full">
      <SelectField
        name="requestType"
        id="requestType"
        label="Request Type"
        options={[
          { value: 'PAST_LEAVE', label: 'Past Leave' },
          { value: 'COMPENSATORY_OFF', label: 'Compensatory Off' },
        ]}
        placeholder="Select request type"
      />

      {isPastLeave && <LeaveCategorySelect />}

      {values.requestType !== '' && (
        <>
          <DatePickerField
            name="dateRange"
            label="Leave Date(s)"
            mode={isPastLeave ? 'range' : 'single'}
            value={values.dateRange}
            disabledDays={isPastLeave ? pastLeaveDisabled : compOffDisabled}
          />

          <SelectField
            name="duration"
            id="duration"
            label="Duration"
            options={[
              { value: 'FULL_DAY', label: 'Full Day' },
              { value: 'HALF_DAY', label: 'Half Day' },
            ]}
          />

          <div className="flex justify-between gap-3">
            <TimeField name="startTime" id="startTime" label="Start Time" />

            <TimeField
              name="endTime"
              id="endTime"
              label="End Time"
              disabled
              value={
                values.duration === 'FULL_DAY'
                  ? addHours(values.startTime, FULL_DAY_DURATION_HOURS)
                  : addHours(values.startTime, HALF_DAY_DURATION_HOURS)
              }
            />
          </div>
        </>
      )}

      <TextareaField
        name="description"
        id="description"
        label="Reason"
        placeholder={'Provide a reason for your request...'}
      />

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-(--technogise-blue) cursor-pointer py-5"
      >
        Raise Request
      </Button>
    </Form>
  );
};

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
