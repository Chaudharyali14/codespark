
import { render, screen, waitFor } from '@testing-library/react';
import AdminPage from '../page';

// Mock the chart component
jest.mock('../components/Charts/StudentTrendChart', () => () => <div>StudentTrendChart</div>);

global.fetch = jest.fn((url) => {
  if (url === '/api/admin/summary') {
    return Promise.resolve({
      json: () => Promise.resolve({ services: 1, projects: 2, courses: 3, students: 4 }),
    } as Response);
  }
  if (url === '/api/admin/activity') {
    return Promise.resolve({
      json: () => Promise.resolve([]),
    } as Response);
  }
  if (url === '/api/admin/student-trend') {
    return Promise.resolve({
      json: () => Promise.resolve([]),
    } as Response);
  }
  return Promise.resolve({ json: () => Promise.resolve({}) } as Response);
});

describe('AdminPage', () => {
  it('renders the dashboard with summary data', async () => {
    render(<AdminPage />);

    await waitFor(() => {
        expect(screen.getByText('Services')).toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('Projects')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText('Courses')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();
        expect(screen.getByText('Students')).toBeInTheDocument();
        expect(screen.getByText('4')).toBeInTheDocument();
    });
  });
});
