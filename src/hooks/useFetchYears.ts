import { fetchYears } from '@/api/employeesLeaveBalance.api';
import { useEffect, useState } from 'react';

type UseFetchYearsProp = {
  years: string[];
  selectedYear: string;
  setSelectedYear: React.Dispatch<React.SetStateAction<string>>;
};

const useFetchYears = (): UseFetchYearsProp => {
  const [years, setYears] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('');

  useEffect(() => {
    async function loadYears() {
      const data = await fetchYears();
      setYears(data);
      setSelectedYear(new Date().getFullYear().toString());
    }
    loadYears();
  }, []);

  return { years, selectedYear, setSelectedYear };
};

export default useFetchYears;
