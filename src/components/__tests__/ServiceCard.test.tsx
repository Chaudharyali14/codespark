import { render, screen } from '@testing-library/react';
import ServiceCard from '../ServiceCard';

describe('ServiceCard', () => {
  it('renders the service card with correct data', () => {
    const service = {
      title: 'Test Service',
      description: 'This is a test service.',
    };

    render(<ServiceCard {...service} />);

    expect(screen.getByText('Test Service')).toBeInTheDocument();
    expect(screen.getByText('This is a test service.')).toBeInTheDocument();
  });
});
