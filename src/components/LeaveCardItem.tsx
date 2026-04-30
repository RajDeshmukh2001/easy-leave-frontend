import React from 'react';
import Badge from './Badge';

type LeaveCardItemProp = {
  title: string;
  duration: string;
  date?: string;
  badgeName: string;
  style?: string;
};
export default function LeaveCardItem({
  title,
  duration,
  date,
  badgeName,
  style,
}: LeaveCardItemProp): React.JSX.Element {
  return (
    <div
      className={`rounded-xl p-4 ${style} flex items-center justify-between hover:shadow-sm transition`}
    >
      <div className="flex flex-col">
        <h3 className=" text-gray-800">{title}</h3>
        <p className="text-gray-500 text-sm">
          {date ? `${date} / ` : null}
          {duration}
        </p>
      </div>

      <Badge name={badgeName} style="bg-blue-100/50 text-blue-700" />
    </div>
  );
}
