import { render, screen } from '@testing-library/react';
import Table from './Table';
import { describe, expect, test } from 'vitest';
import userEvent from '@testing-library/user-event';

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
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  test('renders all column headers correctly', () => {
    renderTable();
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Employee Name')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
  });

  test('renders all data values correctly', () => {
    renderTable();
    expect(screen.getByText('Annual Leave')).toBeInTheDocument();
  });

  test('render single row correctly', () => {
    const singleData = [mockData[0]];
    renderTable(singleData);
    expect(screen.getByText('Annual Leave')).toBeInTheDocument();
    expect(screen.getByText('Priyansh Saxena')).toBeInTheDocument();
    expect(screen.getByText('10/1/2026')).toBeInTheDocument();
  });

  test('calls onRowClick with correct row data when a row is clicked', async () => {
    const onRowClick = vi.fn();
    render(
      <Table
        data={mockData}
        columns={mockColumns}
        message="No data to show"
        getRowKey={(leave) => leave.id}
        onRowClick={onRowClick}
      />,
    );

    await userEvent.click(screen.getByText('Annual Leave'));

    expect(onRowClick).toHaveBeenCalledOnce();
    expect(onRowClick).toHaveBeenCalledWith(mockData[0]);
  });
});
