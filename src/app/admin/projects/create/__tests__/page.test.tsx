import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreateProjectPage from '../page';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const mockPush = jest.fn();
(useRouter as jest.Mock).mockReturnValue({
  push: mockPush,
});

global.fetch = jest.fn();

describe('CreateProjectPage', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
    mockPush.mockClear();
  });

  it('renders the form', () => {
    render(<CreateProjectPage />);
    expect(screen.getByRole('heading', { name: 'Create Project' })).toBeInTheDocument();
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByText('Images')).toBeInTheDocument();
    expect(screen.getByLabelText('Video')).toBeInTheDocument();
  });

  it('submits the form and redirects on success', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: true });
    render(<CreateProjectPage />);

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Test Project' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Test Description' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create' }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/projects', expect.any(Object));
      expect(mockPush).toHaveBeenCalledWith('/admin/projects');
    });
  });
});
