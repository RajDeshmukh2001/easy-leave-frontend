import React from 'react';
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from 'formik';
import { Button } from './ui/button';
import { addHours } from '@/utils/time';
import type { LeaveFormValues } from '@/types/leaveForm';
import { validateLeaveForm } from '@/utils/leaveForm.validation';
import { FULL_DAY_DURATION_HOURS, HALF_DAY_DURATION_HOURS } from '@/constants/leaveForm';
import SelectField from './form/SelectField';
import useLeaveCategories from '@/hooks/useLeaveCategories';
import DatePickerField from './form/DatePickerField';

type LeaveFormProps = {
  initialValues: LeaveFormValues;
  onSubmit: (
    values: LeaveFormValues,
    helpers: FormikHelpers<LeaveFormValues>,
  ) => void | Promise<void>;
  submitLabel?: string;
  datePickerMode?: 'range' | 'single';
};

const LeaveForm = ({
  initialValues,
  onSubmit,
  submitLabel = 'Submit Leave',
  datePickerMode = 'range',
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
          />

          <DatePickerField
            name="dateRange"
            label="Date Range"
            mode={datePickerMode}
            value={values.dateRange}
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
                disabled
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
            <ErrorMessage
              name="description"
              component="p"
              data-testid="errors-description-input"
              className="text-sm text-red-700"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-(--technogise-blue) cursor-pointer py-5"
          >
            {submitLabel}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default LeaveForm;
