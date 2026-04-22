import { useCallback, useEffect, useState } from 'react';
import type { HolidayListResponse } from '@/types/holiday';
import { fetchHolidays } from '@/api/holiday.api';
import type { HolidayListOptions } from '@/constants/holidayTypes';

type UseHolidaysReturn = {
  holidays: HolidayListResponse[];
  loading: boolean;
  error: string | null;
  loadHolidays: () => Promise<void>;
};

function useHolidays(type: HolidayListOptions): UseHolidaysReturn {
  const [holidays, setHolidays] = useState<HolidayListResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadHolidays = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchHolidays({ type });
      setHolidays(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch holidays');
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    loadHolidays();
  }, [loadHolidays]);

  return { holidays, loading, error, loadHolidays };
}

export default useHolidays;
