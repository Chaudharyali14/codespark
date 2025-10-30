import { render, screen } from '@testing-library/react';
import ProjectCard from '../ProjectCard';

describe('ProjectCard', () => {
  it('renders the project card with correct data', () => {
    const project = {
      id: 1,
      title: 'Test Project',
      description: 'This is a test project.',
      media: {
        type: 'IMAGE',
        url: '/test-image.jpg',
      },
      projectUrl: 'https://example.com',
    };

    render(<ProjectCard {...project} />);

    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText('This is a test project.')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', '/_next/image?url=%2Ftest-image.jpg&w=3840&q=75');
  });
});
