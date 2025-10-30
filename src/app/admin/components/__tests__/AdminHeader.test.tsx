import { render, screen } from '@testing-library/react';
import AdminHeader from '../AdminHeader';

describe('AdminHeader', () => {
  it('renders the title and add new button', () => {
    render(<AdminHeader title="Test Title" addHref="/test/add" />);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add New' })).toBeInTheDocument();
  });

  it('renders the export button when onExport is provided', () => {
    const handleExport = jest.fn();
    render(<AdminHeader title="Test Title" addHref="/test/add" onExport={handleExport} />);

    expect(screen.getByRole('button', { name: 'Export to Excel' })).toBeInTheDocument();
  });
});
