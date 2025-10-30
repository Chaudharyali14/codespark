import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CoursesPage from '../page';

const mockCourses = [
  { id: 1, name: 'Test Course 1', description: 'Test Description 1', price: 100 },
  { id: 2, name: 'Test Course 2', description: 'Test Description 2', price: 200 },
];

global.fetch = jest.fn((url) => {
    if (url === '/api/courses') {
        return Promise.resolve({
            json: () => Promise.resolve(mockCourses),
        } as Response);
    }
    if (url.toString().startsWith('/api/courses/')) {
        return Promise.resolve({
            ok: true,
        } as Response);
    }
    return Promise.resolve({ json: () => Promise.resolve({}) } as Response);
});

describe('CoursesPage', () => {
  it('renders the page with courses', async () => {
    render(<CoursesPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Course 1')).toBeInTheDocument();
      expect(screen.getByText('Test Course 2')).toBeInTheDocument();
    });
  });

  it('deletes a course when delete is confirmed', async () => {
    window.confirm = jest.fn(() => true);
    render(<CoursesPage />);

    await waitFor(() => {
        const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });
        fireEvent.click(deleteButtons[0]);
    });

    await waitFor(() => {
      expect(screen.queryByText('Test Course 1')).not.toBeInTheDocument();
    });
  });
});
