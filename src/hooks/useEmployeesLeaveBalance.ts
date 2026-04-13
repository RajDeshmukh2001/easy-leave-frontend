import { useState, useEffect } from 'react';
import type { EmployeeLeaveRecord } from '../types/employeeLeaveBalance';
import { fetchEmployeesLeaveBalance } from '@/api/employeesLeaveBalance.api';
import type { PageResponse } from '@/types/pageResponse';

function useEmployeesLeaveBalance(year: string): {
  employees: EmployeeLeaveRecord[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
} {
  const [employees, setEmployees] = useState<EmployeeLeaveRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setEmployees([]);
    setPage(0);
    setHasMore(true);
    setError(null);
  }, [year]);

  useEffect(() => {
    if (!year) return;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data: PageResponse<EmployeeLeaveRecord> = await fetchEmployeesLeaveBalance(
          year,
          page,
        );
        setEmployees((prev) => (page === 0 ? data.content : [...prev, ...data.content]));
        setHasMore(!data.last);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [year, page]);

  const loadMore = () => setPage((prev) => prev + 1);

  return { employees, loading, error, hasMore, loadMore };
}

export default useEmployeesLeaveBalance;
