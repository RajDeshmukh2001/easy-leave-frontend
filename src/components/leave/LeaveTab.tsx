import React, { useState } from 'react';
import type { LeaveResponse } from '@/types/leaves';
import { STATUS_OPTIONS, type LeaveStatus } from '@/constants/LeaveStatus';
import useLeaves from '@/hooks/useLeaves';
import Badge from '@/components/Badge';
import { useNavigate } from 'react-router-dom';
import ApplyLeaveForm from '@/components/leave/ApplyLeaveForm';
import FilterableTableSection from '../FilterableTableSection';

function LeaveTab(): React.JSX.Element {
  const [status, setStatus] = useState<LeaveStatus>('all');
  const navigate = useNavigate();

  const { leaves, loading, error, refreshLeaves } = useLeaves({ status, scope: 'self' });

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
      header: 'Status',
      render: (leave: LeaveResponse) => {
        const date = new Date(leave.date);
        const today = new Date();
        if (date > today) return <Badge name={'Upcoming'} style="bg-green-100 text-green-700" />;
        if (date.toDateString() === today.toDateString())
          return <Badge name={'Ongoing'} style="bg-blue-100 text-blue-700" />;
        return <Badge name={'Completed'} style="bg-gray-100 text-gray-600" />;
      },
    },
  ];

  const handleRowClick = (leave: LeaveResponse): void => {
    if (new Date(leave.date) > new Date()) {
      navigate(`/leave/${leave.id}`);
    }
  };

  return (
    <div className="w-full md:h-screen flex flex-col p-4">
      <div className="flex flex-col flex-1 min-h-0 h-fit md:flex-row gap-6 mt-2">
        <div className="flex h-fit md:w-1/3 bg-white rounded-2xl shadow-xs border border-neutral-200">
          <ApplyLeaveForm refreshLeaves={refreshLeaves} />
        </div>
        <FilterableTableSection
          title="My Leaves"
          data={leaves}
          columns={columns}
          loading={loading}
          error={error}
          filterOptions={STATUS_OPTIONS}
          filterValue={status}
          onFilterChange={(val) => setStatus(val as LeaveStatus)}
          getRowKey={(leave: LeaveResponse) => leave.id}
          onRowClick={handleRowClick}
          emptyMessage="No leave records found."
        />
      </div>
    </div>
  );
}

export default LeaveTab;
