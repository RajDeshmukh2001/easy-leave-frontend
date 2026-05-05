import { useCallback, useEffect, useState } from 'react';
import { fetchLeaves } from '../api/leave.api';
import type { LeaveScope, LeaveStatus } from '@/constants/LeaveStatus';
import type { LeaveResponse } from '@/types/leaves';
import type { PageResponse } from '@/types/pageResponse';

type UseLeavesReturn = {
  leaves: LeaveResponse[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  refreshLeaves: () => Promise<void>;
  hasMore: boolean;
  loadMore: () => void;
};

type UseLeavesProps = {
  status: LeaveStatus;
  scope: LeaveScope;
  empId?: string;
  year?: string;
  size?: number;
  sort?: string;
  sortDir?: 'asc' | 'desc';
};

function useLeaves({
  status,
  scope,
  empId,
  year,
  size,
  sort,
  sortDir,
}: UseLeavesProps): UseLeavesReturn {
  const [leaves, setLeaves] = useState<LeaveResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const loadLeaves = useCallback(async () => {
    try {
      if (page === 0) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      const data: PageResponse<LeaveResponse> = await fetchLeaves({
        status,
        scope,
        empId,
        year,
        page,
        size,
        sort,
        sortDir,
      });
      setLeaves((prev) => (page === 0 ? data.content : [...prev, ...data.content]));
      setHasMore(!data.last);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load your leaves');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [status, scope, empId, year, page, size, sort, sortDir]);

  useEffect(() => {
    loadLeaves();
  }, [loadLeaves]);

  const loadMore = () => setPage((prev) => prev + 1);

  return { leaves, loading, loadingMore, error, refreshLeaves: loadLeaves, hasMore, loadMore };
}

export default useLeaves;
