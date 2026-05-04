import TableHeader from '@/components/TableHeader';
import PageHeader from '../components/PageHeader';
import Table from '../components/Table';
import type { LeaveResponse } from '../types/leaves';
import Loading from '@/components/Loading';
import useLeaves from '@/hooks/useLeaves';
import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { getEmployeeDashboardMetrics } from '@/api/dashboard.api';
import type { EmployeeDashboardMetrics } from '@/types/dashboard';
import DashboardMetricsCard from '@/components/DashboardMetricsCard';
import { CalendarDays, CheckCircle, Clock, Hourglass } from 'lucide-react';

function Dashboard(): React.JSX.Element {
  const {
    leaves,
    loading: upcomingLeaveLoading,
    error: upcomingLeaveError,
  } = useLeaves({ status: 'upcoming', scope: 'self' });
  const navigate = useNavigate();

  const [metricsData, setMetricsData] = useState<EmployeeDashboardMetrics | null>(null);
  const [loadingDashboardMetric, setLoadingDashboardMetric] = useState(false);
  const [errorDashboardMetric, setErrorDashboardMetric] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async (): Promise<void> => {
      setLoadingDashboardMetric(true);
      setErrorDashboardMetric(null);
      try {
        const data = await getEmployeeDashboardMetrics();
        setMetricsData(data);
      } catch (err) {
        setErrorDashboardMetric(
          err instanceof Error ? err.message : 'Failed to fetch dashboard metrics',
        );
      } finally {
        setLoadingDashboardMetric(false);
      }
    };
    fetchMetrics();
  }, []);

  const reversedLeaves = useMemo(() => [...leaves].reverse(), [leaves]);

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

  if (loadingDashboardMetric) {
    return (
      <div className="w-full h-screen flex justify-center items-center p-4">
        <Loading />
      </div>
    );
  }
  if (errorDashboardMetric) {
    return (
      <div className="w-full h-screen flex justify-center items-center flex-col p-4">
        <p className="p-3 text-red-700">{errorDashboardMetric}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col p-4 ">
      <PageHeader
        pageTitle="Dashboard"
        pageSubtitle="Welcome to your dashboard! Here you can find an overview of your Leaves"
      />
      <div className="grid grid-cols-2 w-full gap-5 md:grid-cols-4 my-2">
        <DashboardMetricsCard
          title="Total Annual Leave"
          value={metricsData?.totalAnnualLeaves || 0}
          icon={<CalendarDays />}
        />
        <DashboardMetricsCard
          title="Annual Leave Taken"
          value={metricsData?.leavesTaken || 0}
          icon={<CheckCircle />}
        />
        <DashboardMetricsCard
          title="Annual Leave Remaining"
          value={metricsData?.remainingAnnualLeaves || 0}
          icon={<Clock />}
        />
        <DashboardMetricsCard
          title="Pending Request"
          value={metricsData?.pendingRequests || 0}
          icon={<Hourglass />}
        />
      </div>
      <div className="flex flex-col min-h-0 w-full mb-5 md:mt-2 rounded-2xl shadow-xs border border-neutral-200">
        <TableHeader title="Upcoming Leaves" />
        {upcomingLeaveLoading ? (
          <div className="w-full flex justify-center items-center p-4">
            <Loading />
          </div>
        ) : upcomingLeaveError ? (
          <p className="p-3 text-red-700">{upcomingLeaveError}</p>
        ) : (
          <Table
            data={reversedLeaves}
            columns={columns}
            message="No upcoming leave records found."
            getRowKey={getRowKey}
            onRowClick={handleRowClick}
          />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
