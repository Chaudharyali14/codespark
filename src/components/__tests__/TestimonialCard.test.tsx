import { render, screen } from '@testing-library/react';
import TestimonialCard from '../TestimonialCard';

describe('TestimonialCard', () => {
  it('renders the testimonial card with correct data', () => {
    const testimonial = {
      quote: 'This is a test testimonial.',
      author: 'John Doe',
      role: 'Software Engineer',
    };

    render(<TestimonialCard {...testimonial} />);

    expect(screen.getByText('This is a test testimonial.')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
  });
});
