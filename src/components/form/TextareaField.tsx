import { Field, ErrorMessage } from 'formik';

type TextareaFieldProps = {
  name: string;
  id: string;
  label: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
};

const TextareaField = ({
  name,
  id,
  label,
  placeholder = '',
  rows = 4,
  required = false,
}: TextareaFieldProps): React.JSX.Element => {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id}>
        {label}
        {required && <span className="text-red-700">*</span>}
      </label>
      <Field
        as="textarea"
        id={id}
        name={name}
        placeholder={placeholder}
        rows={rows}
        className="px-3 py-2 rounded-lg border border-neutral-300 bg-gray-50 text-sm"
      />
      <ErrorMessage
        name={name}
        component="p"
        className="text-sm text-red-700"
        data-testid="errors-description-input"
      />
    </div>
  );
};

export default TextareaField;
