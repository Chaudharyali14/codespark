import { render, screen } from '@testing-library/react';
import CourseCard from '../CourseCard';

describe('CourseCard', () => {
  it('renders the course card with correct data', () => {
    const course = {
      id: 1,
      name: 'Test Course',
      description: 'This is a test course.',
      price: 100,
    };

    render(<CourseCard {...course} />);

    expect(screen.getByText('Test Course')).toBeInTheDocument();
    expect(screen.getByText('This is a test course.')).toBeInTheDocument();
    expect(screen.getByText('Pkr 100')).toBeInTheDocument();
  });
});
