import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ServicesPage from '../page';

const mockServices = [
  { id: 1, title: 'Test Service 1', description: 'Test Description 1' },
  { id: 2, title: 'Test Service 2', description: 'Test Description 2' },
];

global.fetch = jest.fn((url) => {
    if (url === '/api/services') {
        return Promise.resolve({
            json: () => Promise.resolve(mockServices),
        } as Response);
    }
    if (url.toString().startsWith('/api/services/')) {
        return Promise.resolve({
            ok: true,
        } as Response);
    }
    return Promise.resolve({ json: () => Promise.resolve({}) } as Response);
});

describe('ServicesPage', () => {
  it('renders the page with services', async () => {
    render(<ServicesPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Service 1')).toBeInTheDocument();
      expect(screen.getByText('Test Service 2')).toBeInTheDocument();
    });
  });

  it('deletes a service when delete is confirmed', async () => {
    window.confirm = jest.fn(() => true);
    render(<ServicesPage />);

    await waitFor(() => {
        const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });
        fireEvent.click(deleteButtons[0]);
    });

    await waitFor(() => {
      expect(screen.queryByText('Test Service 1')).not.toBeInTheDocument();
    });
  });
});
