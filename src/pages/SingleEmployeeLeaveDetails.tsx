import { fetchSingleEmployeeLeaveRecord } from '@/api/employeesLeaveBalance.api';
import Loading from '@/components/Loading';
import Table from '@/components/Table';
import useFetchYears from '@/hooks/useFetchYears';
import type { SingleEmployeeLeaveRecord } from '@/types/employeeLeaveBalance';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import useLeaves from '@/hooks/useLeaves';
import type { LeaveResponse } from '@/types/leaves';
import { ArrowLeft } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function SingleEmployeeLeaveDetails(): React.JSX.Element {
  const { id } = useParams();
  const [leavesRecord, setLeavesRecord] = useState<SingleEmployeeLeaveRecord[] | null>(null);
  const [leavesRecordloading, setLeavesRecordLoading] = useState(false);
  const [leavesRecordError, setLeavesRecordError] = useState<string | null>(null);

  const { selectedYear } = useFetchYears();
  const [years, setYears] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('');
  const { leaves, loading, errorStatus, error } = useLeaves({
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
    async function loadYears() {
      const data = await fetchYears();
      if (data?.length > 0) {
        setYears(data);
        setSelectedYear(data[0]);
      } else {
        const currentYear = new Date().getFullYear().toString();
        setYears([currentYear]);
        setSelectedYear(currentYear);
      }
    };

    fetchLeavesRecord();
    loadYears();
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


  if (errorStatus === 404 || errorStatus === 500) {
    return (
      <div className="w-full h-screen flex justify-center items-center flex-col p-4">
        <p className="p-3 text-red-700">Employee not found.</p>
        <Button variant="outline" className="w-max mb-4" onClick={() => navigate(-1)}>
          <ArrowLeft /> Back
        </Button>
      </div>
    );
  }
  return (
    <div className="w-full h-screen flex flex-col p-4">
      <Button variant="outline" className="w-max mb-4" onClick={() => navigate(-1)}>
        <ArrowLeft /> Back
      </Button>
      <div className="flex justify-between mb-4">
        <FilterDropdown
          options={years}
          value={selectedYear}
          onChange={(val) => setSelectedYear(val)}
        />
      </div>
      <div className="flex flex-col min-h-0 w-full mb-5 md:mt-2 rounded-2xl shadow-xs border border-neutral-200">
              <div className="bg-sidebar/98 py-2 px-1 rounded-t-2xl ">
                <h1 className="text-xl md:text-2xl text-sidebar-foreground font-bold mb-4 px-4 py-2">
                  Leaves Record
                </h1>
              </div>
              {leavesRecordloading && <Loading />}
              {leavesRecordError && <p className="p-3 text-red-700">{leavesRecordError}</p>}
              {!leavesRecordloading && !leavesRecordError && leavesRecord && (
                <Table
                  data={leavesRecord}
                  columns={columns}
                  message="No upcoming leave records found."
                  getRowKey={(leavesRecord: SingleEmployeeLeaveRecord) => leavesRecord.leaveId}
                />
              )}
            </div>
      <div className="flex flex-col min-h-0 w-full mb-5 md:mt-2 rounded-2xl shadow-xs border border-neutral-200">
              <div className="bg-sidebar/98 py-2 px-1 rounded-t-2xl ">
                <h1 className="text-xl md:text-2xl text-sidebar-foreground font-bold mb-4 px-4 py-2">
                  All Leaves
                </h1>
              </div>
              {loading && <Loading />}
              {!loading && !error && (
                <Table
                  data={leaves}
                  columns={columns}
                  message="No upcoming leave records found."
                  getRowKey={(leave: LeaveResponse) => leave.id}
                />
              )}
            </div>
    </div>
  );
}

export default SingleEmployeeLeaveDetails;
