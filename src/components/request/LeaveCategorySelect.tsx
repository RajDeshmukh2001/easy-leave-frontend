import useLeaveCategories from '@/hooks/useLeaveCategories';
import SelectField from '../form/SelectField';

const LeaveCategorySelect = ({ required = false }: { required?: boolean }): React.JSX.Element => {
  const { categories, loading, error } = useLeaveCategories();
  const categoryOptions = categories.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  return (
    <SelectField
      name="leaveCategoryId"
      id="leaveCategoryId"
      label="Leave Category"
      required={required}
      options={categoryOptions}
      loading={loading}
      error={error}
      placeholder="Select a category"
    />
  );
};

export default LeaveCategorySelect;
