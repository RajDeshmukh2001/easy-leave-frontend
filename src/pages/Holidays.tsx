import { addHoliday } from '@/api/holiday.api';
import DatePickerField from '@/components/form/DatePickerField';
import SelectField from '@/components/form/SelectField';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { HOLIDAY_TYPES } from '@/constants/holidayTypes';
import type { HolidayFromValues, HolidayRequest } from '@/types/holiday';
import { validateHolidayForm } from '@/utils/holiday.validation';
import { isAxiosError } from 'axios';
import { format } from 'date-fns';
import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from 'formik';
import toast from 'react-hot-toast';

const initialValues: HolidayFromValues = {
  name: '',
  type: 'FIXED',
  date: undefined,
};

const Holidays = (): React.JSX.Element => {
  const handleSubmit = async (
    values: HolidayFromValues,
    { resetForm }: FormikHelpers<HolidayFromValues>,
  ): Promise<void> => {
    const holidayData: HolidayRequest = {
      name: values.name,
      type: values.type,
      date: format(values.date!.from!, 'yyyy-MM-dd'),
    };

    try {
      await addHoliday(holidayData);
      toast.success('Holiday added successfully!');
      resetForm();
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Failed to add holiday');
      } else {
        toast.error('Unexpected Error Occurred');
      }
    }
  };

  return (
    <div className="w-full md:h-screen flex flex-col p-4">
      <PageHeader pageTitle="Holidays" pageSubtitle="Add and view holidays" />
      <div className="flex flex-col flex-1 min-h-0 h-fit md:flex-row gap-6 mt-2">
        <div className="flex h-fit md:w-1/3 bg-white rounded-2xl shadow-xs border border-neutral-200">
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validate={validateHolidayForm}
          >
            {({ isSubmitting, values }) => (
              <Form className="flex flex-col gap-4 p-4 w-full">
                <SelectField
                  name="type"
                  id="holiday-type"
                  label="Holiday Type"
                  options={HOLIDAY_TYPES.map((type) => ({
                    value: type.value,
                    label: type.label,
                  }))}
                  placeholder="Select holiday type"
                />

                <div className="flex flex-col gap-1">
                  <label htmlFor="holiday-name">Holiday Name</label>
                  <Field
                    as="input"
                    name="name"
                    id="holiday-name"
                    placeholder="Enter holiday name"
                    className="px-3 py-2 rounded-md border border-neutral-300 bg-gray-50 text-sm"
                  />
                  <ErrorMessage name="name" component="p" className="text-sm text-red-700" />
                </div>

                <DatePickerField name="date" label="Date" mode="single" value={values.date} />

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-(--technogise-blue) cursor-pointer py-5"
                >
                  Add Holiday
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Holidays;
