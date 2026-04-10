import { fetchLeaveById } from '@/api/leave.api';
import LeaveForm from '@/components/LeaveForm';
import Loading from '@/components/Loading';
import PageHeader from '@/components/PageHeader';
import useLeaveCategories from '@/hooks/useLeaveCategories';
import type { LeaveFormValues } from '@/types/leaveForm';
import type { LeaveResponse } from '@/types/leaves';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const LeaveDetails = (): React.JSX.Element => {
  const [leave, setLeave] = useState<LeaveResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();
  const { categories } = useLeaveCategories();

  const fetchLeaveDetails = async (id: string | undefined) => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchLeaveById(id);
      setLeave(data);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveDetails(id);
  }, [id]);

  const handleUpdateLeave = async (values: LeaveFormValues) => {
    console.log(values);
  };

  if (loading) {
    return <Loading />;
  }

  if (error || !leave) {
    return (
      <div className="text-center py-6 text-xl font-bold tracking-tight text-foreground">
        Leave not found
      </div>
    );
  }

  const matchedCategory = categories.find((category) => category.name === leave.type);

  const updateLeaveInitialValues: LeaveFormValues = {
    leaveCategoryId: matchedCategory?.id || '',
    dateRange: { from: new Date(leave.date), to: new Date(leave.date) },
    duration: leave.duration,
    startTime: leave.startTime,
    description: leave.reason,
  };

  return (
    <div className="w-full p-3">
      <PageHeader pageTitle="Leave Details" pageSubtitle="View and manage your leave details" />

      <div className="max-w-1/2 flex bg-white rounded-2xl shadow-xs border border-neutral-200 h-full">
        <LeaveForm
          initialValues={updateLeaveInitialValues}
          onSubmit={handleUpdateLeave}
          submitLabel="Update Leave"
          datePickerMode="single"
        />
      </div>
    </div>
  );
};

export default LeaveDetails;
