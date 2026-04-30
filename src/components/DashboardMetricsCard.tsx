import React from 'react';
import { twMerge } from 'tailwind-merge';
type DashboardMetricsCardProps = {
  title: string;
  value: string | number;
  icon: React.JSX.Element;
  style?: string;
};

function DashboardMetricsCard({
  title,
  value,
  icon,
  style,
}: DashboardMetricsCardProps): React.JSX.Element {
  return (
    <div
      className={twMerge(
        'p-5 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-lg',
        style,
      )}
    >
      <div className="flex justify-between items-center">
        <p className="text-s font-medium text-gray-500">{title}</p>
        <div className="p-2 rounded-lg bg-gray-100 text-gray-600">{icon}</div>
      </div>
      <div className="mt-1">
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

export default DashboardMetricsCard;
