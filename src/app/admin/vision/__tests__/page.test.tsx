import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import VisionPage from '../page';

const mockVisions = [
  { id: 1, title: 'Test Vision 1', description: 'Test Description 1' },
  { id: 2, title: 'Test Vision 2', description: 'Test Description 2' },
];

global.fetch = jest.fn((url) => {
    if (url === '/api/vision') {
        return Promise.resolve({
            json: () => Promise.resolve(mockVisions),
        } as Response);
    }
    if (url.toString().startsWith('/api/vision/')) {
        return Promise.resolve({
            ok: true,
        } as Response);
    }
    return Promise.resolve({ json: () => Promise.resolve({}) } as Response);
});

describe('VisionPage', () => {
  it('renders the page with visions', async () => {
    render(<VisionPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Vision 1')).toBeInTheDocument();
      expect(screen.getByText('Test Vision 2')).toBeInTheDocument();
    });
  });

  it('deletes a vision when delete is confirmed', async () => {
    window.confirm = jest.fn(() => true);
    render(<VisionPage />);

    await waitFor(() => {
        const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });
        fireEvent.click(deleteButtons[0]);
    });

    await waitFor(() => {
      expect(screen.queryByText('Test Vision 1')).not.toBeInTheDocument();
    });
  });
});
