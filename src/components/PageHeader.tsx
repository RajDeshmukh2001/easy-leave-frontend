import type { JSX } from 'react';

type Props = {
  pageTitle: string;
  pageSubtitle: string;
};
const PageHeader = ({ pageTitle, pageSubtitle }: Props): JSX.Element => {
  return (
    <div className="mb-6">
      <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">{pageTitle}</h1>
      <p className="text-sm text-muted-foreground mt-1">{pageSubtitle}</p>
    </div>
  );
};

export default PageHeader;
