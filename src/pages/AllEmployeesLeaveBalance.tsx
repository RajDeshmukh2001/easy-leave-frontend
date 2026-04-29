import React, { useEffect, useState } from 'react';
import Table from '../components/Table';
import PageHeader from '../components/PageHeader';
import Loading from '@/components/Loading';
import useEmployeesLeaveBalance from '@/hooks/useEmployeesLeaveBalance';
import type { EmployeeLeaveRecord } from '../types/employeeLeaveBalance';
import FilterDropdown from '@/components/FilterDropdown';
import { fetchYears } from '@/api/employeesLeaveBalance.api';
import { useNavigate } from 'react-router-dom';

function AllEmployeesLeaveBalance(): React.JSX.Element {
  const [years, setYears] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('');
  const { employees, loading, error, hasMore, loadMore } = useEmployeesLeaveBalance(selectedYear);

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
      header: 'Employee',
      render: (emp: EmployeeLeaveRecord) => emp.employeeName,
    },
    {
      header: 'Total Annual Leaves',
      render: (emp: EmployeeLeaveRecord) => emp.totalLeavesAvailable,
    },
    {
      header: 'Leaves Taken',
      render: (emp: EmployeeLeaveRecord) => emp.leavesTaken,
    },
    {
      header: 'Leaves Remaining',
      render: (emp: EmployeeLeaveRecord) => (
        <span className={emp.leavesRemaining <= 0 ? 'text-red-600' : ''}>
          {emp.leavesRemaining}
        </span>
      ),
    },
  ];
  const handleRowClick = (employee: EmployeeLeaveRecord): void => {
    navigate(`/manager/employees/${employee.employeeId}`);
  };

  const getRowKey = (employee: EmployeeLeaveRecord): string | number => {
    return employee.employeeId;
  };

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
    <div className="w-full flex flex-col h-screen p-3">
      <PageHeader pageTitle="All Employees" pageSubtitle="View employees leave records" />
      <div className="flex overflow-y-scroll flex-col w-full rounded-2xl shadow-2xs border border-neutral-200">
        <div className="flex bg-white items-center rounded-t-2xl justify-between p-3">
          <div className="flex justify-end w-full">
            <FilterDropdown
              options={years}
              value={selectedYear}
              onChange={(val) => setSelectedYear(val)}
            />
          </div>
        </div>
        <Table
          data={employees}
          columns={columns}
          message="No employee found"
          getRowKey={getRowKey}
          onRowClick={handleRowClick}
          hasMore={hasMore}
          onLoadMore={loadMore}
        />
      </div>
    </div>
  );
}

export default AllEmployeesLeaveBalance;
