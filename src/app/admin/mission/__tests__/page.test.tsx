import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MissionPage from '../page';

const mockMissions = [
  { id: 1, title: 'Test Mission 1', description: 'Test Description 1' },
  { id: 2, title: 'Test Mission 2', description: 'Test Description 2' },
];

global.fetch = jest.fn((url) => {
    if (url === '/api/mission') {
        return Promise.resolve({
            json: () => Promise.resolve(mockMissions),
        } as Response);
    }
    if (url.toString().startsWith('/api/mission/')) {
        return Promise.resolve({
            ok: true,
        } as Response);
    }
    return Promise.resolve({ json: () => Promise.resolve({}) } as Response);
});

describe('MissionPage', () => {
  it('renders the page with missions', async () => {
    render(<MissionPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Mission 1')).toBeInTheDocument();
      expect(screen.getByText('Test Mission 2')).toBeInTheDocument();
    });
  });

  it('deletes a mission when delete is confirmed', async () => {
    window.confirm = jest.fn(() => true);
    render(<MissionPage />);

    await waitFor(() => {
        const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });
        fireEvent.click(deleteButtons[0]);
    });

    await waitFor(() => {
      expect(screen.queryByText('Test Mission 1')).not.toBeInTheDocument();
    });
  });
});
