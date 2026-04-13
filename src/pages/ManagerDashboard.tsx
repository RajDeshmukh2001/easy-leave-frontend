import { getManagerDashboardMetrics } from '@/api/dashboard.api';
import DashboardMetricsCard from '@/components/DashboardMetricsCard';
import LeaveCardItem from '@/components/LeaveCardItem';
import Loading from '@/components/Loading';
import PageHeader from '@/components/PageHeader';
import useLeaves from '@/hooks/useLeaves';
import type { ManagerDashboardMetrics } from '@/types/dashboard';
import { CalendarCheck, CalendarFold, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';

function ManagerDashboard(): React.JSX.Element {
  const {
    leaves: upcomingLeaves,
    loading: upcomingLeavesLoading,
    error: upcomingLeavesError,
  } = useLeaves({ status: 'upcoming', scope: 'organization' });
  const {
    leaves: ongoingLeaves,
    loading: ongoingLeavesLoading,
    error: ongoingLeavesError,
  } = useLeaves({ status: 'ongoing', scope: 'organization' });

  const [metricsData, setMetricsData] = useState<ManagerDashboardMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async (): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const data = await getManagerDashboardMetrics();
        setMetricsData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch dashboard metrics');
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  return (
    <div className="w-full h-screen flex flex-col p-6 bg-gray-50">
      <PageHeader pageTitle="Manager Dashboard" pageSubtitle="Team leave overview at a glance" />
      <div className="grid grid-cols-2 w-full gap-6 md:grid-cols-3 mt-2">
        {loading ? (
          <div className="flex justify-center items-center w-full col-span-2">
            <Loading />
          </div>
        ) : error ? (
          <p className="text-sm text-red-500 col-span-2">{error}</p>
        ) : (
          <>
            <DashboardMetricsCard
              title="Total Employees"
              value={metricsData?.totalEmployees || 0}
              icon={<Users />}
            />
            <DashboardMetricsCard
              title="On Leave Today"
              value={metricsData?.totalEmployeesOnLeaveToday || 0}
              icon={<CalendarCheck />}
            />
            <DashboardMetricsCard
              title="On Leave Tomorrow"
              value={metricsData?.totalEmployeesOnLeaveTomorrow || 0}
              icon={<CalendarFold />}
            />
          </>
        )}
      </div>
      <div className="flex flex-col flex-1 min-h-0 md:flex-row gap-6 mt-6">
        <div className="flex flex-col md:w-1/2 bg-white rounded-2xl p-5 border border-gray-200 shadow-sm h-100 md:h-auto md:flex-1">
          <h2 className="font-bold text-lg mb-4 text-gray-800">Currently on Leave</h2>
          <div className="flex-1 overflow-y-auto flex flex-col gap-3">
            {ongoingLeavesLoading && (
              <div className="flex justify-center items-center w-full h-full">
                <Loading />
              </div>
            )}
            {ongoingLeavesError && <p className="text-sm text-red-500">{ongoingLeavesError}</p>}
            {!ongoingLeavesLoading &&
              !ongoingLeavesError &&
              (ongoingLeaves.length === 0 ? (
                <p className="text-sm w-full flex justify-center items-center h-full text-gray-500">
                  No Employee On Leave Today
                </p>
              ) : (
                ongoingLeaves.map((leave) => (
                  <LeaveCardItem
                    key={leave.id}
                    title={leave.employeeName}
                    description={leave.duration
                      .split('_')
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                      .join(' ')}
                    badgeName={leave.type}
                    style="bg-warning/5 border border-warning/10"
                  />
                ))
              ))}
          </div>
        </div>
        <div className="flex flex-col md:w-1/2 bg-white rounded-2xl p-5 border border-gray-200 shadow-sm h-100 md:h-auto md:flex-1">
          <h2 className="font-bold text-lg mb-4 text-gray-800">Upcoming Leaves</h2>
          <div className="flex-1 overflow-y-auto flex flex-col gap-3">
            {upcomingLeavesLoading && (
              <div className="flex justify-center items-center h-full w-full">
                <Loading />
              </div>
            )}
            {upcomingLeavesError && <p className="text-sm text-red-500">{upcomingLeavesError}</p>}
            {!upcomingLeavesLoading &&
              !upcomingLeavesError &&
              (upcomingLeaves.length === 0 ? (
                <p className="text-sm w-full flex justify-center items-center h-full text-gray-500">
                  No Upcoming/Schedule leave
                </p>
              ) : (
                [...upcomingLeaves]
                  .reverse()
                  .map((leave) => (
                    <LeaveCardItem
                      key={leave.id}
                      title={leave.employeeName}
                      description={leave.date}
                      badgeName={leave.type}
                      style="bg-muted"
                    />
                  ))
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default ManagerDashboard;
