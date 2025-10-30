import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import ContactPage from '../page';

const mockMessages = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com', message: 'Hello, this is a test message.' },
  { id: 2, name: 'Jane Doe', email: 'jane.doe@example.com', message: 'Another test message.' },
];

global.fetch = jest.fn((url) => {
    if (url === '/api/contact') {
        return Promise.resolve({
            json: () => Promise.resolve(mockMessages),
        } as Response);
    }
    if (url.toString().startsWith('/api/contact/')) {
        return Promise.resolve({
            ok: true,
        } as Response);
    }
    return Promise.resolve({ json: () => Promise.resolve({}) } as Response);
});


describe('ContactPage', () => {
  it('renders the page with messages', async () => {
    render(<ContactPage />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('jane.doe@example.com')).toBeInTheDocument();
    });
  });

  it('opens the modal to view a message', async () => {
    render(<ContactPage />);

    await waitFor(() => {
        const viewButtons = screen.getAllByRole('button', { name: 'View Message' });
        fireEvent.click(viewButtons[0]);
    });
    
    await waitFor(() => {
        const modal = screen.getByRole('dialog');
        expect(within(modal).getByText('Message from John Doe')).toBeInTheDocument();
        expect(within(modal).getByText('Hello, this is a test message.')).toBeInTheDocument();
    });
  });

  it('deletes a message when delete is confirmed', async () => {
    window.confirm = jest.fn(() => true);
    render(<ContactPage />);

    await waitFor(() => {
        const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });
        fireEvent.click(deleteButtons[0]);
    });

    await waitFor(() => {
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });
  });
});
