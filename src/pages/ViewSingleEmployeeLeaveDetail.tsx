import { fetchYears } from '@/api/employeesLeaveBalance.api';
import FilterDropdown from '@/components/FilterDropdown';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ViewSingleEmployeeLeaveDetail(): React.JSX.Element {
  const [years, setYears] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('');

  const navigate = useNavigate();
  useEffect(() => {
    async function loadYears() {
      const data = await fetchYears();
      setYears(data);
      setSelectedYear(data[0] || new Date().getFullYear().toString());
    }
    loadYears();
  }, []);

  return (
    <div className="w-full h-screen flex flex-col p-4">
      <Button variant="outline" className="w-max mb-4" onClick={() => navigate(-1)}>
        <ArrowLeft /> Back
      </Button>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-semibold">Priyansh Saxena</h2>
        <FilterDropdown
          options={years}
          value={selectedYear}
          onChange={(val) => setSelectedYear(val)}
        />
      </div>
    </div>
  );
}

export default ViewSingleEmployeeLeaveDetail;
