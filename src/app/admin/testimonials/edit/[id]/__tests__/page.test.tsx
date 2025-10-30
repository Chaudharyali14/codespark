import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EditTestimonialPage from '../page';
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

const mockTestimonial = { id: '1', quote: 'Test Quote', author: 'Test Author', role: 'Test Role' };

global.fetch = jest.fn();

describe('EditTestimonialPage', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
    mockPush.mockClear();
  });

  it('renders the form with testimonial data', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTestimonial),
    });
    render(<EditTestimonialPage />);

    await waitFor(() => {
        expect(screen.getByLabelText('Quote')).toHaveValue('Test Quote');
        expect(screen.getByLabelText('Author')).toHaveValue('Test Author');
        expect(screen.getByLabelText('Role')).toHaveValue('Test Role');
    });
  });

  it('submits the form and redirects on success', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockTestimonial) });
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: true });
    render(<EditTestimonialPage />);

    await waitFor(() => {
        expect(screen.getByLabelText('Quote')).toHaveValue('Test Quote');
    });

    fireEvent.change(screen.getByLabelText('Quote'), { target: { value: 'Updated Quote' } });
    fireEvent.click(screen.getByRole('button', { name: 'Update' }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/testimonials/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quote: 'Updated Quote', author: 'Test Author', role: 'Test Role' }),
      });
      expect(mockPush).toHaveBeenCalledWith('/admin/testimonials');
    });
  });
});
