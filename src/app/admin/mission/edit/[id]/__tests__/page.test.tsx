import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EditMissionPage from '../page';
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

const mockMission = { id: '1', title: 'Test Mission', description: 'Test Description' };

global.fetch = jest.fn();

describe('EditMissionPage', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
    mockPush.mockClear();
  });

  it('renders the form with mission data', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockMission),
    });
    render(<EditMissionPage />);

    await waitFor(() => {
        expect(screen.getByLabelText('Title')).toHaveValue('Test Mission');
        expect(screen.getByLabelText('Description')).toHaveValue('Test Description');
    });
  });

  it('submits the form and redirects on success', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockMission) });
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: true });
    render(<EditMissionPage />);

    await waitFor(() => {
        expect(screen.getByLabelText('Title')).toHaveValue('Test Mission');
    });

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Updated Mission' } });
    fireEvent.click(screen.getByRole('button', { name: 'Update Mission' }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/mission/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Updated Mission', description: 'Test Description' }),
      });
      expect(mockPush).toHaveBeenCalledWith('/admin/mission');
    });
  });

  it('shows an alert on submission failure', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockMission) });
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: false });
    window.alert = jest.fn();
    render(<EditMissionPage />);

    await waitFor(() => {
        expect(screen.getByLabelText('Title')).toHaveValue('Test Mission');
    });

    fireEvent.click(screen.getByRole('button', { name: 'Update Mission' }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Failed to update mission');
    });
  });
});
