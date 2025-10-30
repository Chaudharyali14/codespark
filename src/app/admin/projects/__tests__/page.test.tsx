import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProjectsPage from '../page';

const mockProjects = [
  { id: 1, title: 'Test Project 1', description: 'Test Description 1' },
  { id: 2, title: 'Test Project 2', description: 'Test Description 2' },
];

global.fetch = jest.fn((url) => {
    if (url === '/api/projects') {
        return Promise.resolve({
            json: () => Promise.resolve(mockProjects),
        } as Response);
    }
    if (url.toString().startsWith('/api/projects/')) {
        return Promise.resolve({
            ok: true,
        } as Response);
    }
    return Promise.resolve({ json: () => Promise.resolve({}) } as Response);
});

describe('ProjectsPage', () => {
  it('renders the page with projects', async () => {
    render(<ProjectsPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Project 1')).toBeInTheDocument();
      expect(screen.getByText('Test Project 2')).toBeInTheDocument();
    });
  });

  it('deletes a project when delete is confirmed', async () => {
    window.confirm = jest.fn(() => true);
    render(<ProjectsPage />);

    await waitFor(() => {
        const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });
        fireEvent.click(deleteButtons[0]);
    });

    await waitFor(() => {
      expect(screen.queryByText('Test Project 1')).not.toBeInTheDocument();
    });
  });
});
