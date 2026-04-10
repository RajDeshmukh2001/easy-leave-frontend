import React, { type ReactNode } from 'react';

type Column<T> = {
  header: string;
  render: (value: T) => ReactNode;
};

type TableProps<T> = {
  data: T[];
  columns: Column<T>[];
  message: string;
  getRowKey: (row: T) => string | number;
  onRowClick?: (row: T) => void;
};

function Table<T>({
  data,
  columns,
  message,
  getRowKey,
  onRowClick,
}: TableProps<T>): React.JSX.Element {
  return (
    <div className="w-full overflow-x-auto rounded-b-2xl">
      <table className="min-w-full table-fixed text-sm text-left">
        <thead className="text-gray-600 bg-sidebar/98 border-b sticky top-0 z-10 border-gray-300 uppercase text-xs tracking-wider">
          <tr>
            {columns.map((col) => (
              <th
                key={col.header}
                className="px-3 md:px-6 py-3 text-left text-sidebar-foreground font-semibold text-nowrap"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((value) => (
              <tr
                key={getRowKey(value)}
                onClick={() => onRowClick?.(value)}
                className={`hover:bg-gray-50 transition border-b border-gray-300 bg-white ${onRowClick ? 'cursor-pointer' : ''}`}
              >
                {columns.map((col) => (
                  <td key={col.header} className="px-3 py-2 md:px-6 md:py-4 wrap-break-words">
                    {col.render(value)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center py-4 bg-white">
                {message}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
