import { REQUEST_STATUS_OPTIONS, type RequestStatus } from '@/constants/Request';
import useRequest from '@/hooks/useRequest';
import type { RequestResponse } from '@/types/request';
import React, { useState } from 'react';
import FilterableTableSection from '../FilterableTableSection';

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
      render: (request: RequestResponse) => formatEnumLabel(request.status),
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
