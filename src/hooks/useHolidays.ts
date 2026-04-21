import { useEffect, useState } from 'react';
import type { HolidayListResponse } from '@/types/holiday';
import { fetchHolidays } from '@/api/holiday.api';

type UseHolidaysReturn = {
  holidays: HolidayListResponse[];
  loading: boolean;
  error: string | null;
  loadHolidays: () => Promise<void>;
};

function useHolidays(): UseHolidaysReturn {
  const [holidays, setHolidays] = useState<HolidayListResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadHolidays() {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchHolidays();
      setHolidays(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to fetch holidays');
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHolidays();
  }, []);

  return { holidays, loading, error, loadHolidays };
}

export default useHolidays;
