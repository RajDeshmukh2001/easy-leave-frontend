import { useCallback, useEffect, useState } from 'react';
import type { RequestScope, RequestStatus } from '@/constants/Request';
import type { RequestResponse } from '@/types/request';
import { fetchRequests } from '@/api/request.api';

type UseRequestReturn = {
  requests: RequestResponse[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  refreshRequests: () => Promise<void>;
};

type UseRequestProps = {
  status: RequestStatus;
  scope: RequestScope;
  page: number;
};

function useRequest({ status, scope, page }: UseRequestProps): UseRequestReturn {
  const [requests, setRequests] = useState<RequestResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const loadRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchRequests({ status, scope, page });
      setRequests((prev) => {
        if (page === 0) return result.content;
        const existingIds = new Set(prev.map((request) => request.id));
        const newItems = result.content.filter((request) => !existingIds.has(request.id));
        return [...prev, ...newItems];
      });
      setHasMore(!result.last);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load your requests');
    } finally {
      setLoading(false);
    }
  }, [status, scope, page]);

  useEffect(() => {
    setRequests([]);
    setHasMore(true);
  }, [status, scope]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  return { requests, loading, error, hasMore, refreshRequests: loadRequests };
}

export default useRequest;
