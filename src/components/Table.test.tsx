import { render, screen } from '@testing-library/react';
import Table from './Table';
import { describe, expect, test } from 'vitest';

type Leave = {
  id: number;
  type: string;
  employeeName: string;
  date: Date;
};

const mockData: Leave[] = [
  { id: 1, type: 'Annual Leave', employeeName: 'Priyansh Saxena', date: new Date('2026-10-01') },
];

const mockColumns = [
  { header: 'ID', render: (leave: Leave) => leave.id },
  { header: 'Type', render: (leave: Leave) => leave.type },
  { header: 'Employee Name', render: (leave: Leave) => leave.employeeName },
  { header: 'Date', render: (leave: Leave) => leave.date.toLocaleDateString() },
];

const renderTable = (data = mockData, columns = mockColumns) => {
  return render(
    <Table
      data={data}
      columns={columns}
      message="No data to show"
      getRowKey={(leave: Leave) => leave.id}
    />,
  );
};

describe('Table Component', () => {
  test('renders Table component content', () => {
    renderTable();
    expect(screen.getByRole('table')).toBeDefined();
  });

  test('renders all column headers correctly', () => {
    renderTable();
    expect(screen.getByText('ID')).toBeDefined();
    expect(screen.getByText('Type')).toBeDefined();
    expect(screen.getByText('Employee Name')).toBeDefined();
    expect(screen.getByText('Date')).toBeDefined();
  });

  test('renders all data values correctly', () => {
    renderTable();
    expect(screen.getByText('Annual Leave')).toBeDefined();
  });

  test('render single row correctly', () => {
    const singleData = [mockData[0]];
    renderTable(singleData);
    expect(screen.getByText('Annual Leave')).toBeDefined();
    expect(screen.getByText('Priyansh Saxena')).toBeDefined();
    expect(screen.getByText('10/1/2026')).toBeDefined();
  });
});
