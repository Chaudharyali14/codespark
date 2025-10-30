import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TestimonialsPage from '../page';

const mockTestimonials = [
  { id: 1, quote: 'Test Quote 1', author: 'Test Author 1', role: 'Test Role 1' },
  { id: 2, quote: 'Test Quote 2', author: 'Test Author 2', role: 'Test Role 2' },
];

global.fetch = jest.fn((url) => {
    if (url === '/api/testimonials') {
        return Promise.resolve({
            json: () => Promise.resolve(mockTestimonials),
        } as Response);
    }
    if (url.toString().startsWith('/api/testimonials/')) {
        return Promise.resolve({
            ok: true,
        } as Response);
    }
    return Promise.resolve({ json: () => Promise.resolve({}) } as Response);
});

describe('TestimonialsPage', () => {
  it('renders the page with testimonials', async () => {
    render(<TestimonialsPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Quote 1')).toBeInTheDocument();
      expect(screen.getByText('Test Author 2')).toBeInTheDocument();
    });
  });

  it('deletes a testimonial when delete is confirmed', async () => {
    window.confirm = jest.fn(() => true);
    render(<TestimonialsPage />);

    await waitFor(() => {
        const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });
        fireEvent.click(deleteButtons[0]);
    });

    await waitFor(() => {
      expect(screen.queryByText('Test Quote 1')).not.toBeInTheDocument();
    });
  });
});
