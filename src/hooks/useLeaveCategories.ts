import { useEffect, useState } from 'react';
import type { LeaveCategoryResponse } from '@/types/leaves';
import { fetchLeaveCategories } from '@/api/leaveCategories.api';

type UseLeaveCategoryReturn = {
  categories: LeaveCategoryResponse[];
  loading: boolean;
  error: string | null;
  loadLeaveCategories: () => Promise<void>;
};

function useLeaveCategories(): UseLeaveCategoryReturn {
  const [categories, setCategories] = useState<LeaveCategoryResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadLeaveCategories() {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchLeaveCategories();
      setCategories(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLeaveCategories();
  }, []);

  return { categories, loading, error, loadLeaveCategories };
}

export default useLeaveCategories;
