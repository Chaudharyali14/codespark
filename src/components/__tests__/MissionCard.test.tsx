import { render, screen } from '@testing-library/react';
import MissionCard from '../MissionCard';

describe('MissionCard', () => {
  it('renders the mission card with correct data', () => {
    const mission = {
      title: 'Test Mission',
      description: 'This is a test mission.',
    };

    render(<MissionCard {...mission} />);

    expect(screen.getByText('Test Mission')).toBeInTheDocument();
    expect(screen.getByText('This is a test mission.')).toBeInTheDocument();
  });
});
