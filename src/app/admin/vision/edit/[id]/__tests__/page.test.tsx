import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EditVisionPage from '../page';
import { useRouter, useParams } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

const mockPush = jest.fn();
(useRouter as jest.Mock).mockReturnValue({
  push: mockPush,
});
(useParams as jest.Mock).mockReturnValue({
  id: '1',
});

const mockVision = { id: '1', title: 'Test Vision', description: 'Test Description' };

global.fetch = jest.fn();

describe('EditVisionPage', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
    mockPush.mockClear();
  });

  it('renders the form with vision data', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockVision),
    });
    render(<EditVisionPage />);

    await waitFor(() => {
        expect(screen.getByLabelText('Title')).toHaveValue('Test Vision');
        expect(screen.getByLabelText('Description')).toHaveValue('Test Description');
    });
  });

  it('submits the form and redirects on success', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockVision) });
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: true });
    render(<EditVisionPage />);

    await waitFor(() => {
        expect(screen.getByLabelText('Title')).toHaveValue('Test Vision');
    });

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Updated Vision' } });
    fireEvent.click(screen.getByRole('button', { name: 'Update Vision' }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/vision/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Updated Vision', description: 'Test Description' }),
      });
      expect(mockPush).toHaveBeenCalledWith('/admin/vision');
    });
  });

  it('shows an alert on submission failure', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockVision) });
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: false });
    window.alert = jest.fn();
    render(<EditVisionPage />);

    await waitFor(() => {
        expect(screen.getByLabelText('Title')).toHaveValue('Test Vision');
    });

    fireEvent.click(screen.getByRole('button', { name: 'Update Vision' }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Failed to update vision');
    });
  });
});
