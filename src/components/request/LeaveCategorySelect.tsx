import useLeaveCategories from '@/hooks/useLeaveCategories';
import SelectField from '../form/SelectField';

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

export default LeaveCategorySelect;
