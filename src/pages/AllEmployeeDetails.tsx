import { getEmployees } from '@/api/employee.api';
import Loading from '@/components/Loading';
import PageHeader from '@/components/PageHeader'
import Table from '@/components/Table';
import type { UserResponse } from '@/types/Users';
import React, { useEffect, useState } from 'react'

function AllEmployeeDetails(): React.JSX.Element {
  const [employee, setEmployee] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEmployees() {
      try {
        setLoading(true);
        setError(null);
        const data = await getEmployees({ page: 0, size: 20 });
        setEmployee(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load employees');
      } finally {
        setLoading(false);
      }
    }

    loadEmployees();
  }, []);

  const columns = [
    { header: 'Name', render: (employee: UserResponse) => employee.name },
    { header: 'Email', render: (employee: UserResponse) => <p className='text-gray-500'>{employee.email}</p> },
    { header: 'Role', render: (employee: UserResponse) => { return employee.role.toLowerCase().split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '); } },
  ];

  return (
    <div className="w-full h-screen p-3">
      <PageHeader
        pageTitle="Employees"
        pageSubtitle="Manage all employees and their roles" />
      <div className='flex w-full rounded-2xl shadow-xs border border-neutral-200'>
        {loading && <Loading />}
        {error && <p className="p-3 text-red-700">{error}</p>}
        {!loading && !error && <Table data={employee} columns={columns} message='No employee Found' />}
      </div>
    </div>
  )
}

export default AllEmployeeDetails
