import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreateCoursePage from '../page';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const mockPush = jest.fn();
(useRouter as jest.Mock).mockReturnValue({
  push: mockPush,
});

global.fetch = jest.fn();

describe('CreateCoursePage', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
    mockPush.mockClear();
  });

  it('renders the form', () => {
    render(<CreateCoursePage />);
    expect(screen.getByRole('heading', { name: 'Add New Course' })).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Price')).toBeInTheDocument();
  });

  it('submits the form and shows success message', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: true });
    render(<CreateCoursePage />);

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Test Course' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Test Description' } });
    fireEvent.change(screen.getByLabelText('Price'), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add Course' }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Test Course', description: 'Test Description', price: '123' }),
      });
      expect(screen.getByText('Course added successfully!')).toBeInTheDocument();
      expect(mockPush).toHaveBeenCalledWith('/admin/courses');
    });
  });

  it('shows an error message on submission failure', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: false });
    render(<CreateCoursePage />);

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Test Course' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Test Description' } });
    fireEvent.change(screen.getByLabelText('Price'), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add Course' }));

    await waitFor(() => {
      expect(screen.getByText('Failed to add course. Please try again.')).toBeInTheDocument();
    });
  });
});
