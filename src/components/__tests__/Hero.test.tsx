import { render, screen, waitFor } from '@testing-library/react';
import Hero from '../Hero';

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({
      title: 'Test Title',
      subtitle: 'Test Subtitle',
      mainImage: '/test-image.jpg',
      secondImage: '/test-image-2.jpg',
    }),
  })
) as jest.Mock;

describe('Hero', () => {
  it('renders the hero section with correct data', async () => {
    render(<Hero />);

    await waitFor(() => {
      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
    });
  });
});
