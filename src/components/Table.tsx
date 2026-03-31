import React, { type ReactNode } from 'react';

type Column<T> = {
    header: string;
    render: (value: T) => ReactNode
};

type TableProps<T> = {
    data: T[]
    columns: Column<T>[]
};

function Table<T>({ data, columns }: TableProps<T>): React.JSX.Element {
  return (
        <div className="w-full shadow-xs rounded-b-2xl overflow-x-auto">
            <table className="w-full min-w-150 text-sm text-left md:min-w-full">
                <thead className="text-sm text-body border-b border-neutral-200">
                    <tr>
                        {columns.map((col, index) => (
                            <th key={index} className="px-3 md:px-6 py-2 text-left font-semibold text-nowrap">
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((value, index) => (
                            <tr key={index} className="border-b last:border-b-0 border-neutral-200 cursor-pointer hover:bg-neutral-100">
                                {columns.map((col, colIndex) => (
                                    <td key={colIndex} className="px-3 py-2 md:px-6 md:py-4 wrap-break-words">
                                        {col.render(value)}
                                    </td>
                                ))}
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    );
}

export default Table;