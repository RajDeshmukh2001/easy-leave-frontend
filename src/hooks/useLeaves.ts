import { useEffect, useState } from 'react';
import { fetchLeaves } from '../api/leave.api';
import type { LeaveScope, LeaveStatus } from '@/constants/LeaveStatus';
import type { LeaveResponse } from '@/types/leaves';
import axios from 'axios';

type UseLeavesReturn = {
  leaves: LeaveResponse[];
  loading: boolean;
  error: string | null;
  errorStatus: number | null;
  refreshLeaves: () => Promise<void>;
};

type UseLeavesProps = {
  status: LeaveStatus;
  scope: LeaveScope;
  empId?: string;
  year?: string;
};

function useLeaves({ status, scope, empId, year }: UseLeavesProps): UseLeavesReturn {
  const [leaves, setLeaves] = useState<LeaveResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);
  console.log(empId);
  console.log(year);
  console.log(status);
  console.log(scope);

  async function loadLeaves() {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchLeaves({ status, scope, empId, year });
      setLeaves(data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setErrorStatus(err.response?.status || null);
        setError(err.response?.data?.message || 'Failed to load your leaves');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to load your leaves');
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLeaves();
  }, [status, scope, empId, year]);

  return { leaves, loading, error, errorStatus, refreshLeaves: loadLeaves };
}

export default useLeaves;
