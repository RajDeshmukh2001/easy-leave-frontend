import React from 'react';
import { Formik, Form, type FormikHelpers } from 'formik';
import { Button } from '@/components/ui/button';
import { addHours } from '@/utils/time';
import type { LeaveFormValues } from '@/types/leaveForm';
import { validateLeaveForm } from '@/utils/leaveForm';
import { FULL_DAY_DURATION_HOURS, HALF_DAY_DURATION_HOURS } from '@/constants/leaveForm';
import SelectField from '@/components/form/SelectField';
import useLeaveCategories from '@/hooks/useLeaveCategories';
import DatePickerField from '@/components/form/DatePickerField';
import TextareaField from '@/components/form/TextareaField';
import TimeField from '@/components/form/TimeField';

type LeaveFormProps = {
  initialValues: LeaveFormValues;
  onSubmit: (
    values: LeaveFormValues,
    helpers: FormikHelpers<LeaveFormValues>,
  ) => void | Promise<void>;
  submitLabel?: string;
  datePickerMode?: 'range' | 'single';
  handleCancelLeave?: () => void;
  cancelLabel?: string;
};

const LeaveForm = ({
  initialValues,
  onSubmit,
  submitLabel = 'Submit Leave',
  datePickerMode = 'range',
  handleCancelLeave,
  cancelLabel = 'Cancel Leave',
}: LeaveFormProps): React.JSX.Element => {
  const { categories, loading, error } = useLeaveCategories();

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} validate={validateLeaveForm}>
      {({ isSubmitting, values }) => (
        <Form className="flex flex-col gap-4 p-4 w-full">
          <SelectField
            name="leaveCategoryId"
            id="leaveCategoryId"
            label="Leave Category"
            options={categories.map((category) => ({ value: category.id, label: category.name }))}
            loading={loading}
            error={error}
            placeholder="Select a category"
            required={true}
          />

          <DatePickerField
            name="dateRange"
            label="Date"
            mode={datePickerMode}
            value={values.dateRange}
            required={true}
          />

          <SelectField
            name="duration"
            id="duration"
            label="Duration"
            options={[
              { value: 'FULL_DAY', label: 'Full Day' },
              { value: 'HALF_DAY', label: 'Half Day' },
            ]}
            required={true}
          />

          <div className="flex justify-between gap-3">
            <TimeField name="startTime" id="startTime" label="Start Time" required={true} />

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

          <TextareaField
            name="description"
            id="description"
            label="Reason"
            placeholder="Reason for taking leave..."
            required={true}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-(--technogise-blue) cursor-pointer py-5"
          >
            {submitLabel}
          </Button>

          {handleCancelLeave && (
            <Button
              className="w-full cursor-pointer py-5"
              type="button"
              variant="destructive"
              onClick={handleCancelLeave}
            >
              {cancelLabel}
            </Button>
          )}
        </Form>
      )}
    </Formik>
  );
};

export default LeaveForm;
