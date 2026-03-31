import { useEffect, useState } from "react";
import { EllipsisVertical } from "lucide-react";
import PageHeader from "../components/PageHeader"
import Table from "../components/Table";
import { fetchLeaves } from "../api/leave.api";
import type { LeaveResponse } from "../types/leaves";

function Dashboard() : React.JSX.Element {
  const [leaves, setLeaves] = useState<LeaveResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadLeaves() {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchLeaves({ status: 'upcoming', scope: 'self' });
      setLeaves(data);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLeaves();
  }, []);

  const columns = [
    { header: 'Type', render: (leave: LeaveResponse) => leave.type },
    { header: 'Date', render: (leave: LeaveResponse) => new Date(leave.date).toLocaleDateString() },
    { header: 'Duration', render: (leave: LeaveResponse) => leave.duration.replace('_', ' ') },
    { header: 'Applied On', render: (leave: LeaveResponse) => new Date(leave.applyOn).toLocaleDateString() },
    { header: 'Reason', render: (leave: LeaveResponse) => leave.reason },
    { header: 'Actions', render: () => <EllipsisVertical size={20} strokeWidth={3} /> },
  ]

  return (
    <div className="w-full h-screen p-3">
      <PageHeader
        pageTitle="Dashboard"
        pageSubtitle="Welcome to your dashboard! Here you can find an overview of your Leaves" />

      <div className='flex w-full rounded-2xl shadow-xs border border-neutral-200'>
        <div className='w-full'>
          <h1 className='text-2xl font-bold mb-4 p-3'>Upcoming Leaves</h1>
          {loading && <p className="p-3 text-neutral-400">Loading...</p>}
          {error && <p className="p-3 text-red-700">{error}</p>}
          {!loading && !error && <Table data={leaves} columns={columns} />}
        </div>
      </div>
    </div>
  )
}

export default Dashboard