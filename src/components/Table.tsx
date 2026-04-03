import React, { type ReactNode } from 'react';

type Column<T> = {
    header: string;
    render: (value: T) => ReactNode
};

type TableProps<T> = {
    data: T[]
    columns: Column<T>[]
    message: string
};

function Table<T>({ data, columns, message }: TableProps<T>): React.JSX.Element {
  return (
        <div className="w-full bg-white rounded-b-2xl shadow-sm overflow-x-auto">
            <table className="w-full min-w-150 text-sm text-left md:min-w-full">
                <thead className="bg-gray-200 text-gray-600 p-10 uppercase text-xs tracking-wider">
                    <tr>
                        {columns.map((col, index) => (
                            <th
                                key={index}
                                className="px-3 md:px-6 py-3 text-left font-semibold text-nowrap"
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map((value, index) => (
                            <tr key={index}
                                className="border-t border-gray-100 hover:bg-gray-50 transition"
                            >
                                {columns.map((col, colIndex) => (
                                    <td
                                        key={colIndex}
                                        className="px-3 py-2 md:px-6 md:py-4 wrap-break-words"
                                    >
                                        {col.render(value)}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length} className="text-center py-4">
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