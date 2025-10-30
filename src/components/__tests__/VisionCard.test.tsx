import { render, screen } from '@testing-library/react';
import VisionCard from '../VisionCard';

describe('VisionCard', () => {
  it('renders the vision card with correct data', () => {
    const vision = {
      title: 'Test Vision',
      description: 'This is a test vision.',
    };

    render(<VisionCard {...vision} />);

    expect(screen.getByText('Test Vision')).toBeInTheDocument();
    expect(screen.getByText('This is a test vision.')).toBeInTheDocument();
  });
});
