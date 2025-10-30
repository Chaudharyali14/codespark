import { render, screen } from '@testing-library/react';
import AdminTable from '../AdminTable';

const mockData = [
  { id: 1, name: 'Test Name 1', email: 'test1@example.com' },
  { id: 2, name: 'Test Name 2', email: 'test2@example.com' },
];

const mockColumns = ['Name', 'Email'];

describe('AdminTable', () => {
  it('renders the table with data', () => {
    const handleDelete = jest.fn();
    render(
      <AdminTable
        columns={mockColumns}
        data={mockData}
        editHrefBase="/admin/edit"
        onDelete={handleDelete}
      />
    );

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Test Name 1')).toBeInTheDocument();
    expect(screen.getByText('test1@example.com')).toBeInTheDocument();
    expect(screen.getByText('Test Name 2')).toBeInTheDocument();
    expect(screen.getByText('test2@example.com')).toBeInTheDocument();
  });
});
