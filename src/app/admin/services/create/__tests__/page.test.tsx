import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreateServicePage from '../page';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const mockPush = jest.fn();
(useRouter as jest.Mock).mockReturnValue({
  push: mockPush,
});

global.fetch = jest.fn();

describe('CreateServicePage', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
    mockPush.mockClear();
  });

  it('renders the form', () => {
    render(<CreateServicePage />);
    expect(screen.getByRole('heading', { name: 'Add New Service' })).toBeInTheDocument();
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
  });

  it('submits the form and shows success message', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: true });
    render(<CreateServicePage />);

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Test Service' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Test Description' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add Service' }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Test Service', description: 'Test Description' }),
      });
      expect(screen.getByText('Service added successfully!')).toBeInTheDocument();
      expect(mockPush).toHaveBeenCalledWith('/admin/services');
    });
  });

  it('shows an error message on submission failure', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: false });
    render(<CreateServicePage />);

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Test Service' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Test Description' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add Service' }));

    await waitFor(() => {
      expect(screen.getByText('Failed to add service. Please try again.')).toBeInTheDocument();
    });
  });
});
