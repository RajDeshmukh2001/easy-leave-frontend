import TableHeader from '@/components/TableHeader';
import PageHeader from '../components/PageHeader';
import Table from '../components/Table';
import type { LeaveResponse } from '../types/leaves';
import Loading from '@/components/Loading';
import useLeaves from '@/hooks/useLeaves';
import { useNavigate } from 'react-router-dom';

function Dashboard(): React.JSX.Element {
  const { leaves, loading, error } = useLeaves({ status: 'upcoming', scope: 'self' });
  const navigate = useNavigate();

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
  ];
  const handleRowClick = (leave: LeaveResponse): void => {
    navigate(`/leave/${leave.id}`);
  };

  const getRowKey = (leave: LeaveResponse): string | number => {
    return leave.id;
  };

  const reversedLeaves = [...leaves].reverse();

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center p-4">
        <Loading />
      </div>
    );
  }
  if (error) {
    return (
      <div className="w-full h-screen flex justify-center items-center flex-col p-4">
        <p className="p-3 text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col p-4 ">
      <PageHeader
        pageTitle="Dashboard"
        pageSubtitle="Welcome to your dashboard! Here you can find an overview of your Leaves"
      />
      <div className="flex flex-col min-h-0 w-full mb-5 md:mt-2 rounded-2xl shadow-xs border border-neutral-200">
        <TableHeader title="Upcoming Leaves" />
        <Table
          data={reversedLeaves}
          columns={columns}
          message="No upcoming leave records found."
          getRowKey={getRowKey}
          onRowClick={handleRowClick}
        />
      </div>
    </div>
  );
}

export default Dashboard;
