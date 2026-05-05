import type { HolidayRequest } from '@/types/holiday';
import React from 'react';
import Badge from './Badge';

type Props = {
  holiday: HolidayRequest;
};

function HolidayCard({ holiday }: Props): React.JSX.Element {
  const formattedDate = new Date(holiday.date).toLocaleDateString('en-IN', {
    day: 'numeric',
  });

  const formattedMonth = new Date(holiday.date).toLocaleDateString('en-IN', {
    month: 'short',
  });

  const isFixed = holiday.type === 'FIXED';

  return (
    <div className="flex items-center justify-between rounded-2xl border border-gray-300 hover:border-(--technogise-blue) bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex flex-col font-semibold text-s text-center p-1 text-accent-foreground">
        <p>{formattedDate}</p>
        <p>{formattedMonth}</p>
      </div>
      <p className="text-center">{holiday.name}</p>
      <Badge
        name={holiday.type}
        style={
          isFixed
            ? 'bg-blue-100 text-blue-700 border border-blue-200'
            : 'bg-orange-100 text-orange-700 border border-orange-200'
        }
      />
    </div>
  );
}

export default HolidayCard;
