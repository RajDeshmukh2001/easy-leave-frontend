import { getEmployees } from '@/api/employee.api';
import Loading from '@/components/Loading';
import PageHeader from '@/components/PageHeader';
import Table from '@/components/Table';
import type { UserResponse } from '@/types/Users';
import React, { useEffect, useState } from 'react';

function AllEmployeeDetails(): React.JSX.Element {
  const [employee, setEmployee] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadEmployees(page);
  }, [page]);

  const loadEmployees = async (currentPage: number) => {
    try {
      setLoading(true);
      setError(null);

      const res = await getEmployees({page: currentPage, size: 20 });
      setEmployee(prev => currentPage === 0 ? res.content : [...prev, ...res.content]);
      setHasMore(!res.last);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { header: 'Name', render: (employee: UserResponse) => employee.name },
    { header: 'Email', render: (employee: UserResponse) => ( <p className="text-gray-500">{employee.email}</p> ) },
    {
      header: 'Role',
      render: (employee: UserResponse) =>
        employee.role
          .toLowerCase()
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' '),
    },
  ];

  return (
    <div className="w-full h-screen p-3">
      <PageHeader
        pageTitle="Employees"
        pageSubtitle="Manage all employees and their roles"
      />

      <div className="flex w-full rounded-2xl shadow-xs border border-neutral-200">
        {loading && page === 0 && <div className='w-full text-center p-4'><Loading /></div>}
        {error && <p className="p-3 text-red-700">{error}</p>}
        {!error && (
          <Table
            data={employee}
            columns={columns}
            message="No employee Found"
          />
        )}
      </div>

      <div className="flex justify-center items-center p-4">
        {hasMore ? (
          <button
            onClick={() => setPage(prev => prev + 1)}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
          >
            {loading ? <Loading /> : 'Load More'}
          </button>
        ) : (
          <p className="text-gray-500">No more employees</p>
        )}
      </div>
    </div>
  );
}

export default AllEmployeeDetails;