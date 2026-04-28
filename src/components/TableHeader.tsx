import { type JSX } from 'react';

type TableHeaderProps = {
  title: string;
};

function TableHeader({ title }: TableHeaderProps): JSX.Element {
  return (
    <div className="py-2 px-1 bg-white rounded-t-2xl">
      <h1 className="text-xl md:text-xl text-gray-800 font-bold px-4 py-2">{title}</h1>
    </div>
  );
}

export default TableHeader;
