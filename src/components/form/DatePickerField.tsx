import { useFormikContext, ErrorMessage } from 'formik';
import type { DateRange } from 'react-day-picker';
import DatePicker from '../DatePicker';

type DatePickerFieldProps = {
  name: string;
  label: string;
  value: DateRange | undefined;
  mode?: 'range' | 'single';
  className?: string;
};

const DatePickerField = ({
  name,
  label,
  value,
  mode,
  className,
}: DatePickerFieldProps): React.JSX.Element => {
  const { setFieldValue } = useFormikContext<Record<string, unknown>>();

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="date-range-picker" id="date-range-label">
        {label}
      </label>
      <DatePicker
        date={value}
        setDate={(newDate) => setFieldValue(name, newDate)}
        mode={mode}
        className={className ?? 'w-full cursor-pointer'}
      />
      <ErrorMessage name={name} component="p" className="text-sm text-red-700" />
    </div>
  );
};

export default DatePickerField;
