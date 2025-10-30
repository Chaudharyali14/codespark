import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreateMissionPage from '../page';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const mockPush = jest.fn();
(useRouter as jest.Mock).mockReturnValue({
  push: mockPush,
});

global.fetch = jest.fn();

describe('CreateMissionPage', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
    mockPush.mockClear();
  });

  it('renders the form', () => {
    render(<CreateMissionPage />);
    expect(screen.getByRole('heading', { name: 'Create Mission' })).toBeInTheDocument();
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
  });

  it('submits the form and redirects on success', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: true });
    render(<CreateMissionPage />);

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Test Mission' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Test Description' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create Mission' }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/mission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Test Mission', description: 'Test Description' }),
      });
      expect(mockPush).toHaveBeenCalledWith('/admin/mission');
    });
  });

  it('shows an alert on submission failure', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: false });
    window.alert = jest.fn();
    render(<CreateMissionPage />);

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Test Mission' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Test Description' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create Mission' }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Failed to create mission');
    });
  });
});
