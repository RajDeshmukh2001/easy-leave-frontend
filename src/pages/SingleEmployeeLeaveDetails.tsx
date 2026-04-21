import { fetchSingleEmployeeLeaveRecord } from '@/api/employeesLeaveBalance.api';
import Loading from '@/components/Loading';
import Table from '@/components/Table';
import type { SingleEmployeeLeaveRecord } from '@/types/employeeLeaveBalance';
import { Button } from '@/components/ui/button';
import useLeaves from '@/hooks/useLeaves';
import type { LeaveResponse } from '@/types/leaves';
import { ArrowLeft } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useFetchYears from '@/hooks/useFetchYears';

function SingleEmployeeLeaveDetails(): React.JSX.Element {
  const { id } = useParams();
  const [leavesRecord, setLeavesRecord] = useState<SingleEmployeeLeaveRecord[] | null>(null);
  const [leavesRecordloading, setLeavesRecordLoading] = useState(false);
  const [leavesRecordError, setLeavesRecordError] = useState<string | null>(null);

  const { selectedYear } = useFetchYears();
  const {
    leaves: leavesDetails,
    loading: leavesDetailsLoading,
    error: leavesDetailsError,
  } = useLeaves({
    status: 'all',
    scope: 'organization',
    empId: id,
    year: selectedYear,
  });

  const navigate = useNavigate();
  useEffect(() => {
    const fetchLeavesRecord = async () => {
      setLeavesRecordLoading(true);
      setLeavesRecordError(null);
      try {
        const data = await fetchSingleEmployeeLeaveRecord(id, selectedYear);
        setLeavesRecord(data);
      } catch (error) {
        setLeavesRecordError(
          error instanceof Error ? error.message : 'Failed to fetch leave record',
        );
      } finally {
        setLeavesRecordLoading(false);
      }
    };
    fetchLeavesRecord();
  }, [id, selectedYear]);

  const columns = [
    {
      header: 'Leave Type',
      render: (leavesRecord: SingleEmployeeLeaveRecord) => leavesRecord.leaveType,
    },
    {
      header: 'Leave Available',
      render: (leavesRecord: SingleEmployeeLeaveRecord) => leavesRecord.totalLeavesAvailable,
    },
    {
      header: 'Leaves Taken',
      render: (leavesRecord: SingleEmployeeLeaveRecord) => leavesRecord.leavesTaken,
    },
    {
      header: 'Leave Remaining',
      render: (leavesRecord: SingleEmployeeLeaveRecord) => leavesRecord.leavesRemaining,
    },
  ];
  const leavesColumns = [
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

  if (leavesRecordloading || leavesDetailsLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center p-4">
        <Loading />
      </div>
    );
  }
  if (leavesRecordError || leavesDetailsError) {
    return (
      <div className="w-full h-screen flex justify-center items-center flex-col p-4">
        <p className="p-3 text-red-700">{leavesRecordError || leavesDetailsError}</p>
        <Button variant="outline" className="w-max mb-4" onClick={() => navigate(-1)}>
          <ArrowLeft /> Back
        </Button>
      </div>
    );
  }
  return (
    <div className="w-full flex flex-col p-4">
      <Button variant="outline" className="w-max mb-4" onClick={() => navigate(-1)}>
        <ArrowLeft /> Back
      </Button>
      <div className="flex flex-col max-h-150 min-h-0 w-full mb-5 md:mt-2 rounded-2xl shadow-xs border border-neutral-200">
        <div className="bg-sidebar/98 py-2 px-1 rounded-t-2xl ">
          <h1 className="text-xl md:text-2xl text-sidebar-foreground font-bold mb-4 px-4 py-2">
            Leaves Record
          </h1>
        </div>
        {leavesRecord && (
          <Table
            data={leavesRecord}
            columns={columns}
            message="No leave records found."
            getRowKey={(leavesRecord: SingleEmployeeLeaveRecord) => leavesRecord.leaveId}
          />
        )}
      </div>
      <div className="flex flex-col max-h-150 min-h-0 w-full mb-5 md:mt-2 rounded-2xl shadow-xs border border-neutral-200">
        <div className="bg-sidebar/98 py-2 px-1 rounded-t-2xl ">
          <h1 className="text-xl md:text-2xl text-sidebar-foreground font-bold mb-4 px-4 py-2">
            All Leaves
          </h1>
        </div>
        {leavesDetails && (
          <Table
            data={leavesDetails}
            columns={leavesColumns}
            message="No leave records found."
            getRowKey={(leave: LeaveResponse) => leave.id}
          />
        )}
      </div>
    </div>
  );
}

export default SingleEmployeeLeaveDetails;
