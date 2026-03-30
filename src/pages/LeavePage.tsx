import React from 'react'
import Table from '../components/Table';
import PageHeader from '../components/PageHeader';
import { EllipsisVertical } from 'lucide-react';
type Leave = {
  id: number;
  type: string;
  duration: string;
  date: Date;
}

function LeavePage(): React.JSX.Element {
  const data: Leave[] = [
    { id: 1, type: 'Annual Leave', duration: "Full Day", date: new Date('2026-10-01')},
    { id: 2, type: 'Annual Leave', duration: "Half Day", date: new Date('2026-3-24')},
    { id: 3, type: 'Annual Leave', duration: "Half Day", date: new Date('2026-3-30')},

  ]

  const columns = [
    { header: 'Type', render: (leave: Leave) => leave.type },
    { header: 'Date', render: (leave: Leave) => leave.date.toLocaleDateString() },
    { header: 'Duration', render: (leave: Leave) => leave.duration },
    {
      header: 'Status', render: (leave: Leave) => {
        if (leave.date > new Date()) {
          return <span className="text-green-500">Upcoming</span>
        }else if(leave.date.toDateString() === new Date().toDateString()) {
          return <span className="text-blue-500">Ongoing</span>
        } else {
          return <span className="text-red-500">Completed</span>
        }
      }
    },
    { header: 'Actions', render: () => <EllipsisVertical size={20} strokeWidth={3} /> },
  ]

  
  return (
    <div className='w-full h-screen p-3'>
      <PageHeader pageTitle="My Leaves" pageSubtitle="View and manage your leave requests" />
      <div className='flex w-full rounded-2xl shadow-xs border border-neutral-200'>
        <div className='w-full'>
          <h1 className='text-2xl font-bold mb-4 p-3'>My Leaves</h1>
          <Table data={data} columns={columns} />
        </div>
      </div>
    </div>
  )
}

export default LeavePage
