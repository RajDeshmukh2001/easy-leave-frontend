import { getEmployees, updateUserRole } from '@/api/employee.api';
import Loading from '@/components/Loading';
import PageHeader from '@/components/PageHeader';
import Table from '@/components/Table';
import { ROLES } from '@/constants/userRole';
import useAuthUser from '@/hooks/useAuthUser';
import type { Role } from '@/types/auth';
import type { UserResponse } from '@/types/Users';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

function AllEmployeesDetails(): React.JSX.Element {
  const { user } = useAuthUser();
  const [employees, setEmployees] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const formatRole = (role: string) => role.charAt(0) + role.slice(1).toLowerCase();

  useEffect(() => {
    loadEmployees(page);
  }, [page]);

  const handleRoleChange = async (userId: string, newRole: Role) => {
    if (userId === user?.id) {
      toast.error("You can't change your own role");
      return;
    }
    try {
      setUpdatingId(userId);
      await updateUserRole({ employeeId: userId, role: newRole });
      setEmployees((prev) =>
        prev.map((emp) => (emp.id === userId ? { ...emp, role: newRole } : emp)),
      );
      toast.success('Role updated successfully');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update role');
    } finally {
      setUpdatingId(null);
    }
  };

  const loadEmployees = async (currentPage: number) => {
    try {
      setLoading(true);
      setError(null);

      const res = await getEmployees({ page: currentPage, size: 20 });
      setEmployees((prev) => {
        if (currentPage === 0) return res.content;
        const existingIds = new Set(prev.map((e) => e.id));
        const newItems = res.content.filter((e) => !existingIds.has(e.id));
        return [...prev, ...newItems];
      });
      setHasMore(!res.last);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { header: 'Name', render: (employee: UserResponse) => employee.name },
    {
      header: 'Email',
      render: (employee: UserResponse) => <p className="text-gray-500">{employee.email}</p>,
    },
    {
      header: 'Role',
      render: (employee: UserResponse) => (
        <select
          value={employee.role}
          disabled={updatingId === employee.id || employee.id === user?.id}
          onChange={(e) => handleRoleChange(employee.id, e.target.value as Role)}
          className="border cursor-pointer rounded px-2 py-1 bg-white"
        >
          {ROLES.map((role) => (
            <option key={role} value={role}>
              {formatRole(role)}
            </option>
          ))}
        </select>
      ),
    },
  ];

  if (loading && page === 0) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }
  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col p-4">
      <PageHeader pageTitle="Employees" pageSubtitle="Manage all employees and their roles" />

      <div className="flex flex-col min-h-0 w-full mb-5 md:mt-2 rounded-2xl shadow-xs border border-neutral-200">
        <div className="bg-sidebar/98 py-2 px-1 rounded-t-2xl ">
          <h1 className="text-xl md:text-2xl text-sidebar-foreground font-bold mb-4 px-4 py-2">
            All Employees
          </h1>
        </div>
        <Table
          data={employees}
          columns={columns}
          message="No employee Found"
          getRowKey={(employee: UserResponse) => employee.id}
        />
      </div>
      <div className="flex justify-center items-center p-4">
        {hasMore && (
          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={loading}
            className="px-4 py-2 bg-sidebar hover:bg-sidebar/80 text-white rounded-md disabled:opacity-50"
          >
            {loading ? <Loading /> : 'Load More'}
          </button>
        )}
      </div>
    </div>
  );
}

export default AllEmployeesDetails;
