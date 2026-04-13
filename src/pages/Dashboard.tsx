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
        <span className="text-gray-600 truncate block max-w-50">{leave.reason}</span>
      ),
    },
  ];

  return (
    <div className="w-full h-screen flex flex-col p-4">
      <PageHeader
        pageTitle="Dashboard"
        pageSubtitle={`Welcome to your dashboard! Here you can find an overview of your Leaves`}
      />
      <div className="flex flex-col min-h-0 w-full mb-5 rounded-2xl shadow-xs border border-neutral-200">
        <div className="bg-sidebar/98 py-2 px-1 rounded-t-2xl ">
          <h1 className="text-xl md:text-2xl  text-sidebar-foreground font-bold mb-4 px-4 py-2">
            Upcoming Leaves
          </h1>
        </div>

        {loading && <Loading />}
        {error && <p className="p-3 text-red-700">{error}</p>}
        {!loading && !error && (
          <Table
            data={[...leaves].reverse()}
            columns={columns}
            message="No upcoming leave records found."
            getRowKey={(leave: LeaveResponse) => leave.id}
          />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
