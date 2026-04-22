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
import { fetchUserDetails, type UserDetails } from '@/api/user.api';
import { getInitials } from '@/utils/getNameInitials';
import FilterDropdown from '@/components/FilterDropdown';

function SingleEmployeeLeaveDetails(): React.JSX.Element {
  const { id } = useParams();
  const [leavesRecord, setLeavesRecord] = useState<SingleEmployeeLeaveRecord[] | null>(null);
  const [leavesRecordLoading, setLeavesRecordLoading] = useState(false);
  const [leavesRecordError, setLeavesRecordError] = useState<string | null>(null);

  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [userDetailsLoading, setUserDetailsLoading] = useState(false);
  const [userDetailsError, setUserDetailsError] = useState<string | null>(null);

  const { selectedYear, years, setSelectedYear } = useFetchYears();
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

  useEffect(() => {
    const fetchUser = async () => {
      setUserDetailsLoading(true);
      setUserDetailsError(null);
      try {
        const data = await fetchUserDetails(id);
        setUserDetails(data);
      } catch (error) {
        setUserDetailsError(
          error instanceof Error ? error.message : 'Failed to fetch user details',
        );
      } finally {
        setUserDetailsLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const columns = [
    {
      header: 'Type',
      render: (leavesRecord: SingleEmployeeLeaveRecord) => leavesRecord.leaveType,
    },
    {
      header: 'Total Leaves',
      render: (leavesRecord: SingleEmployeeLeaveRecord) => leavesRecord.totalLeavesAvailable,
    },
    {
      header: 'Leaves Taken',
      render: (leavesRecord: SingleEmployeeLeaveRecord) => leavesRecord.leavesTaken,
    },
    {
      header: 'Leaves Remaining',
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

  if (leavesRecordLoading || leavesDetailsLoading || userDetailsLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center p-4">
        <Loading />
      </div>
    );
  }

  if (leavesRecordError || leavesDetailsError || userDetailsError) {
    return (
      <div className="w-full h-screen flex justify-center items-center flex-col p-4">
        <p className="p-3 text-red-700">
          {leavesRecordError || leavesDetailsError || userDetailsError}
        </p>
        <Button variant="outline" className="w-max mb-4" onClick={() => navigate(-1)}>
          <ArrowLeft /> Back
        </Button>
      </div>
    );
  }
  return (
    <div className="w-full flex flex-col p-4 space-y-6">
      <Button variant="outline" className="w-max" onClick={() => navigate(-1)}>
        <ArrowLeft /> Back
      </Button>

      <div className="flex items-center justify-between flex-col md:flex-row gap-y-2.5">
        <div className="w-full flex items-center gap-2.5 md:gap-4">
          <h1 className="text-lg md:text-xl text-(--technogise-blue) font-extrabold h-12 w-12 md:h-14 md:w-14 flex items-center justify-center bg-(--technogise-blue)/10 rounded-full">
            {getInitials(userDetails?.name)}
          </h1>

          <div>
            <h1 className="text-base md:text-lg font-bold text-foreground">{userDetails?.name}</h1>
            <h3 className="text-sm text-muted-foreground">{userDetails?.email}</h3>
          </div>
        </div>

        <div className="flex justify-end w-full">
          <FilterDropdown
            options={years}
            value={selectedYear}
            onChange={(value) => setSelectedYear(value)}
          />
        </div>
      </div>

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
      <div className="flex flex-col max-h-175 min-h-0 w-full mb-5 md:mt-2 rounded-2xl shadow-xs border border-neutral-200">
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
