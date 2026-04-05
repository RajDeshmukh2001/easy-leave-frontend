import { type JSX } from 'react';

type TagProps = {
  name: string;
  style: string;
};
export default function Badge({ name, style }: TagProps): JSX.Element {
  return <span className={`px-2 py-1 text-xs font-medium rounded-full ${style}`}>{name}</span>;
}
