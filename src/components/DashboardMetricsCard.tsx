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
      className={twMerge('px-4 py-4 border border-gray-200 rounded-2xl bg-white shadow-sm', style)}
    >
      <div className="flex justify-between items-center">
        <p className="font-medium text-gray-700">{title}</p>
        <div className="text-gray-500 flex items-center justify-center">{icon}</div>
      </div>

      <div className="mt-3">
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

export default DashboardMetricsCard;
