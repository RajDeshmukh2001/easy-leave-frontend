import { addHoliday } from '@/api/holiday.api';
import FilterDropdown from '@/components/FilterDropdown';
import DatePickerField from '@/components/form/DatePickerField';
import SelectField from '@/components/form/SelectField';
import Loading from '@/components/Loading';
import PageHeader from '@/components/PageHeader';
import Table from '@/components/Table';
import TableHeader from '@/components/TableHeader';
import { Button } from '@/components/ui/button';
import {
  HOLIDAY_LIST_OPTIONS,
  HOLIDAY_TYPES,
  type HolidayListOptions,
} from '@/constants/holidayTypes';
import useHolidays from '@/hooks/useHolidays';
import type { HolidayFromValues, HolidayRequest, HolidayResponse } from '@/types/holiday';
import { validateHolidayForm } from '@/utils/holiday.validation';
import { isAxiosError } from 'axios';
import { format } from 'date-fns';
import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from 'formik';
import { useState } from 'react';
import toast from 'react-hot-toast';

const initialValues: HolidayFromValues = {
  name: '',
  type: 'FIXED',
  date: undefined,
};

const holidayTableColumns = [
  {
    header: 'Name',
    render: (holiday: HolidayResponse) => (
      <span className="font-medium text-gray-800">{holiday.name}</span>
    ),
  },
  {
    header: 'Date',
    render: (holiday: HolidayResponse) => (
      <span className="font-medium text-gray-800">
        {new Date(holiday.date).toLocaleDateString()}
      </span>
    ),
  },
  {
    header: 'Type',
    render: (holiday: HolidayResponse) => (
      <span className="font-medium text-gray-800">{holiday.type}</span>
    ),
  },
];

const Holidays = (): React.JSX.Element => {
  const [holidayType, setHolidayType] = useState<HolidayListOptions>('all');
  const { holidays, loading, error, loadHolidays } = useHolidays(holidayType);

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
      loadHolidays();
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
        <div className="flex flex-1 flex-col rounded-2xl mb-5 max-h-150 md:max-h-fit shadow-xs border border-neutral-200">
          <div className="flex justify-between items-center bg-white p-2 rounded-2xl">
            <TableHeader
              title="All Holidays"
              dropDownFilter={
                <FilterDropdown
                  options={HOLIDAY_LIST_OPTIONS}
                  value={holidayType}
                  onChange={(val) => setHolidayType(val as HolidayListOptions)}
                />
              }
            />
          </div>
          {loading && <Loading />}
          {error && <p className="p-3 text-red-700">{error}</p>}
          {!loading && !error && (
            <Table
              data={holidays}
              columns={holidayTableColumns}
              message="No holidays found."
              getRowKey={(holiday: HolidayResponse) => holiday.id}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Holidays;
