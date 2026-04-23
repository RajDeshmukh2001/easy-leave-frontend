import LeaveSection from '@/components/leave/LeaveSection';
import PageHeader from '@/components/PageHeader';
import { useState } from 'react';

function LeaveAndRequest(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<'leave' | 'request'>('leave');

  return (
    <div className="w-full md:h-screen flex flex-col p-4">
      <PageHeader pageTitle="Leaves" pageSubtitle="View and manage your leaves" />

      <div className="flex w-fit rounded-lg border border-neutral-200 bg-white mt-2">
        <button
          onClick={() => setActiveTab('leave')}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer
            ${activeTab === 'leave' ? 'bg-(--technogise-blue) text-white' : 'text-gray-600'}`}
        >
          Leave
        </button>
        <button
          onClick={() => setActiveTab('request')}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer
            ${activeTab === 'request' ? 'bg-(--technogise-blue) text-white' : 'text-gray-600'}`}
        >
          Raise Request
        </button>
      </div>
      <div className="flex justify-between gap-5">
        {activeTab === 'leave' ? <LeaveSection /> : <div>Request Tab</div>}
      </div>
    </div>
  );
}

export default LeaveAndRequest;
