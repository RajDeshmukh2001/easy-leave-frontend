import { REQUEST_STATUS_OPTIONS, type RequestStatus } from '@/constants/request';
import useRequest from '@/hooks/useRequest';
import type { RequestResponse } from '@/types/request';
import React, { useState } from 'react';
import FilterableTableSection from '@/components/FilterableTableSection';
import Badge from '@/components/Badge';

function RequestSection(): React.JSX.Element {
  const [status, setStatus] = useState<RequestStatus>('ALL');
  const [page, setPage] = useState<number>(0);

  const { requests, loading, loadingMore, error, hasMore } = useRequest({
    status: status,
    scope: 'SELF',
    page,
  });

  const formatEnumLabel = (value: string): string => {
    return value
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const columns = [
    {
      header: 'Type',
      render: (request: RequestResponse) => formatEnumLabel(request.type),
    },
    {
      header: 'Date',
      render: (request: RequestResponse) => new Date(request.date).toLocaleDateString(),
    },
    {
      header: 'Duration',
      render: (request: RequestResponse) => formatEnumLabel(request.duration),
    },
    {
      header: 'Status',
      render: (request: RequestResponse) => {
        if (request.status === 'PENDING')
          return <Badge name={'Pending'} style="bg-blue-100 text-blue-700" />;
        else if (request.status === 'REJECTED')
          return <Badge name={'Rejected'} style="bg-gray-100 text-gray-600" />;
        else return <Badge name={'APPROVED'} style="bg-green-100 text-green-700" />;
      },
    },
  ];

  return (
    <div className="w-full md:max-h-150 flex flex-col py-4">
      <div className="flex flex-col flex-1 min-h-0 h-fit md:flex-row gap-6 mt-2">
        <FilterableTableSection
          title="My Requets"
          data={requests}
          columns={columns}
          loading={loading}
          error={error}
          filterOptions={REQUEST_STATUS_OPTIONS}
          filterValue={status}
          onFilterChange={(val) => setStatus(val as RequestStatus)}
          getRowKey={(request: RequestResponse) => request.id}
          emptyMessage="No request records found."
          hasMore={hasMore}
          onLoadMore={() => setPage((prev) => prev + 1)}
          loadingMore={loadingMore}
        />
      </div>
    </div>
  );
}

export default RequestSection;
