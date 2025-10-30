import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EditServicePage from '../page';
import { useRouter } from 'next/navigation';
import React from 'react';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const mockPush = jest.fn();
(useRouter as jest.Mock).mockReturnValue({
  push: mockPush,
});

const mockService = { id: '1', title: 'Test Service', description: 'Test Description' };

global.fetch = jest.fn();

// Mock React.use
jest.spyOn(React, 'use').mockReturnValue({ id: '1' });


describe('EditServicePage', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
    mockPush.mockClear();
  });

  it('renders the form with service data', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockService),
    });
    render(<EditServicePage params={Promise.resolve({ id: '1' })} />);

    await waitFor(() => {
        expect(screen.getByLabelText('Title')).toHaveValue('Test Service');
        expect(screen.getByLabelText('Description')).toHaveValue('Test Description');
    });
  });

  it('submits the form and shows success message', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockService) });
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: true });
    render(<EditServicePage params={Promise.resolve({ id: '1' })} />);

    await waitFor(() => {
        expect(screen.getByLabelText('Title')).toHaveValue('Test Service');
    });

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Updated Service' } });
    fireEvent.click(screen.getByRole('button', { name: 'Update Service' }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/services/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Updated Service', description: 'Test Description' }),
      });
      expect(screen.getByText('Service updated successfully!')).toBeInTheDocument();
      expect(mockPush).toHaveBeenCalledWith('/admin/services');
    });
  });

  it('shows an error message on submission failure', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockService) });
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: false });
    render(<EditServicePage params={Promise.resolve({ id: '1' })} />);

    await waitFor(() => {
        expect(screen.getByLabelText('Title')).toHaveValue('Test Service');
    });

    fireEvent.click(screen.getByRole('button', { name: 'Update Service' }));

    await waitFor(() => {
      expect(screen.getByText('Failed to update service. Please try again.')).toBeInTheDocument();
    });
  });
});
