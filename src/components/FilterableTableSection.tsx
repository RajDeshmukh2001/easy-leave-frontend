import FilterDropdown from '@/components/FilterDropdown';
import Loading from '@/components/Loading';
import type { ReactNode } from 'react';
import Table from '@/components/Table';

type Column<T> = {
  header: string;
  render: (value: T) => ReactNode;
};

type FilterableTableSectionProps<T> = {
  title: string;
  data: T[];
  columns: Column<T>[];
  loading: boolean;
  error: string | null;
  filterOptions: string[];
  filterValue: string;
  onFilterChange: (value: string) => void;
  getRowKey: (row: T) => string | number;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  hasMore?: boolean;
  onLoadMore?: () => void;
  loadingMore?: boolean;
};

function FilterableTableSection<T>({
  title,
  data,
  columns,
  loading,
  error,
  filterOptions,
  filterValue,
  onFilterChange,
  getRowKey,
  onRowClick,
  emptyMessage = 'No records found.',
  hasMore,
  onLoadMore,
  loadingMore,
}: FilterableTableSectionProps<T>): React.JSX.Element {
  return (
    <div className="flex flex-1 flex-col rounded-2xl mb-5 max-h-150 md:max-h-fit shadow-xs border border-neutral-200">
      <div className="flex items-center p-3 justify-between bg-sidebar/98 rounded-t-2xl ">
        <h1 className="text-xl md:text-2xl text-sidebar-foreground font-bold px-3 py-2">{title}</h1>

        <FilterDropdown options={filterOptions} value={filterValue} onChange={onFilterChange} />
      </div>

      {loading && <Loading />}

      {error && <p className="p-3 text-red-700">{error}</p>}

      {!loading && !error && (
        <Table
          data={data}
          columns={columns}
          message={emptyMessage}
          getRowKey={getRowKey}
          onRowClick={onRowClick}
          hasMore={hasMore}
          onLoadMore={onLoadMore}
          loadingMore={loadingMore}
        />
      )}
    </div>
  );
}

export default FilterableTableSection;
