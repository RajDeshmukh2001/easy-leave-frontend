import PageHeader from '../components/PageHeader';
import Table from '../components/Table';
import type { LeaveResponse } from '../types/leaves';
import Loading from '@/components/Loading';
import useLeaves from '@/hooks/useLeaves';

function Dashboard(): React.JSX.Element {
  const { leaves, loading, error } = useLeaves('upcoming', 'self');

  const columns = [
    {
      header: 'Type',
      render: (leave: LeaveResponse) => (
        <span className="font-medium text-gray-800">{leave.type}</span>
      ),
    },
    { header: 'Date', render: (leave: LeaveResponse) => new Date(leave.date).toLocaleDateString() },
    {
      header: 'Duration',
      render: (leave: LeaveResponse) =>
        leave.duration
          .split('_')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' '),
    },
    {
      header: 'Applied On',
      render: (leave: LeaveResponse) => new Date(leave.applyOn).toLocaleDateString(),
    },
    {
      header: 'Reason',
      render: (leave: LeaveResponse) => (
        <span className="text-gray-600 line-clamp-1 w-50">{leave.reason}</span>
      ),
    },
  ];

  return (
    <div className="w-full h-screen flex flex-col p-3">
      <PageHeader
        pageTitle="Dashboard"
        pageSubtitle="Welcome to your dashboard! Here you can find an overview of your Leaves"
      />
      <div className="flex flex-col flex-1 min-h-0 w-full rounded-2xl bg-muted shadow-xs border border-neutral-200">
        <h1 className="text-2xl font-bold mb-4 p-3">Upcoming Leaves</h1>
        {loading && <Loading />}
        {error && <p className="p-3 text-red-700">{error}</p>}
        {!loading && !error && (
          <Table
            data={[...leaves].reverse()}
            columns={columns}
            message="No upcoming leave records found."
          />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
