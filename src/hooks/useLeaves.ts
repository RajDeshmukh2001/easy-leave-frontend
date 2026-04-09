import { useEffect, useState } from 'react';
import { fetchLeaves } from '../api/leave.api';
import type { LeaveScope, LeaveStatus } from '@/constants/LeaveStatus';
import type { LeaveResponse } from '@/types/leaves';

type UseLeavesReturn = {
  leaves: LeaveResponse[];
  loading: boolean;
  error: string | null;
  refreshLeaves: () => Promise<void>;
};

function useLeaves(status: LeaveStatus, scope: LeaveScope): UseLeavesReturn {
  const [leaves, setLeaves] = useState<LeaveResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadLeaves() {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchLeaves({ status, scope });
      setLeaves(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load your leaves');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLeaves();
  }, [status, scope]);

  return { leaves, loading, error, refreshLeaves: loadLeaves };
}

export default useLeaves;
