import { useCallback, useEffect, useState } from 'react';
import { fetchLeaves } from '../api/leave.api';
import type { LeaveScope, LeaveStatus } from '@/constants/LeaveStatus';
import type { LeaveResponse } from '@/types/leaves';

type UseLeavesReturn = {
  leaves: LeaveResponse[];
  loading: boolean;
  error: string | null;
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

  const loadLeaves = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchLeaves({ status, scope, empId, year });
      setLeaves(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load your leaves');
    } finally {
      setLoading(false);
    }
  }, [status, scope, empId, year]);

  useEffect(() => {
    loadLeaves();
  }, [loadLeaves]);

  return { leaves, loading, error, refreshLeaves: loadLeaves };
}

export default useLeaves;
