import { Field, ErrorMessage } from 'formik';

type SelectOption = {
  value: string;
  label: string;
};

type SelectFieldProps = {
  name: string;
  id: string;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  error?: string | null;
  required?: boolean;
};

const SelectField = ({
  name,
  id,
  label,
  options,
  placeholder = 'Select an option',
  disabled = false,
  loading = false,
  error = null,
  required = false,
}: SelectFieldProps): React.JSX.Element => {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id}>
        {label} {required && <span className="text-red-700">*</span>}
      </label>
      {error && <p className="text-sm text-red-700">{error}</p>}
      <Field
        as="select"
        name={name}
        id={id}
        disabled={disabled || loading}
        className="rounded-md border border-gray-300 bg-gray-50 p-2 cursor-pointer text-sm"
        data-testid="leave-category"
      >
        <option value="">{loading ? 'Loading...' : placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Field>
      <ErrorMessage name={name} component="p" className="text-sm text-red-700" />
    </div>
  );
};

export default SelectField;
