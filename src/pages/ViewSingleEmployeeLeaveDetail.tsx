import { fetchYears } from '@/api/employeesLeaveBalance.api';
import FilterDropdown from '@/components/FilterDropdown';
import Loading from '@/components/Loading';
import Table from '@/components/Table';
import { Button } from '@/components/ui/button';
import useLeaves from '@/hooks/useLeaves';
import type { LeaveResponse } from '@/types/leaves';
import { ArrowLeft } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function ViewSingleEmployeeLeaveDetail(): React.JSX.Element {
  const { id } = useParams();
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
    async function loadYears() {
      const data = await fetchYears();
      setYears(data);
      setSelectedYear(data[0] || new Date().getFullYear().toString());
    }
    loadYears();
  }, []);

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
        <h2 className="text-xl md:text-2xl font-semibold">
          {leaves?.length && `${leaves[0].employeeName}`}
        </h2>
        <FilterDropdown
          options={years}
          value={selectedYear}
          onChange={(val) => setSelectedYear(val)}
        />
      </div>
      <div></div>
      <div className="flex flex-col min-h-0 w-full mb-5 md:mt-2 rounded-2xl shadow-xs border border-neutral-200">
        <div className="bg-sidebar/98 py-2 px-1 rounded-t-2xl ">
          <h1 className="text-xl md:text-2xl text-sidebar-foreground font-bold mb-4 px-4 py-2">
            All Leaves
          </h1>
        </div>
        {loading && <Loading />}
        {error && <p className="p-3 text-red-700">{error}</p>}
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

export default ViewSingleEmployeeLeaveDetail;
