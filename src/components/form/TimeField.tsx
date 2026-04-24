import { Field } from 'formik';

type TimeFieldProps = {
  name: string;
  id: string;
  label: string;
  disabled?: boolean;
  value?: string;
  className?: string;
  required?: boolean;
};

const TimeField = ({
  name,
  id,
  label,
  disabled = false,
  value,
  className,
  required = false,
}: TimeFieldProps): React.JSX.Element => {
  return (
    <div className="flex flex-1 flex-col">
      <label htmlFor={id}>
        {label} {required && <span className="text-red-700">*</span>}
      </label>
      <Field
        type="time"
        id={id}
        name={name}
        disabled={disabled}
        {...(value !== undefined && { value })}
        className={`px-3 py-2 rounded-lg border border-neutral-300 bg-gray-100 text-sm ${className}`}
      />
    </div>
  );
};

export default TimeField;
