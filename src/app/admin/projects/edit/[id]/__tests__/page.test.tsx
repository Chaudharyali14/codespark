import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EditProjectPage from '../page';
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

const mockProject = { id: '1', title: 'Test Project', description: 'Test Description' };

global.fetch = jest.fn();

describe('EditProjectPage', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
    mockPush.mockClear();
  });

  it('renders the form with project data', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockProject),
    });
    render(<EditProjectPage />);

    await waitFor(() => {
        expect(screen.getByLabelText('Title')).toHaveValue('Test Project');
        expect(screen.getByLabelText('Description')).toHaveValue('Test Description');
    });
  });

  it('submits the form and redirects on success', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockProject) });
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ success: true }) });
    render(<EditProjectPage />);

    await waitFor(() => {
        expect(screen.getByLabelText('Title')).toHaveValue('Test Project');
    });

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Updated Project' } });
    fireEvent.click(screen.getByRole('button', { name: 'Update' }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/projects/1', expect.any(Object));
      expect(mockPush).toHaveBeenCalledWith('/admin/projects');
    });
  });

  it('shows an alert on submission failure', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockProject) });
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: false, json: () => Promise.resolve({ error: 'Failed to update' }) });
    window.alert = jest.fn();
    render(<EditProjectPage />);

    await waitFor(() => {
        expect(screen.getByLabelText('Title')).toHaveValue('Test Project');
    });

    fireEvent.click(screen.getByRole('button', { name: 'Update' }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Failed to update project: Failed to update');
    });
  });
});
