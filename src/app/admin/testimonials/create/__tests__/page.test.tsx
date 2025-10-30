import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreateTestimonialPage from '../page';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const mockPush = jest.fn();
(useRouter as jest.Mock).mockReturnValue({
  push: mockPush,
});

global.fetch = jest.fn();

describe('CreateTestimonialPage', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
    mockPush.mockClear();
  });

  it('renders the form', () => {
    render(<CreateTestimonialPage />);
    expect(screen.getByRole('heading', { name: 'Create Testimonial' })).toBeInTheDocument();
    expect(screen.getByLabelText('Quote')).toBeInTheDocument();
    expect(screen.getByLabelText('Author')).toBeInTheDocument();
    expect(screen.getByLabelText('Role')).toBeInTheDocument();
  });

  it('submits the form and redirects on success', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: true });
    render(<CreateTestimonialPage />);

    fireEvent.change(screen.getByLabelText('Quote'), { target: { value: 'Test Quote' } });
    fireEvent.change(screen.getByLabelText('Author'), { target: { value: 'Test Author' } });
    fireEvent.change(screen.getByLabelText('Role'), { target: { value: 'Test Role' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create' }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quote: 'Test Quote', author: 'Test Author', role: 'Test Role' }),
      });
      expect(mockPush).toHaveBeenCalledWith('/admin/testimonials');
    });
  });
});
