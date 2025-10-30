import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import { act } from 'react';
import Navbar from '../Navbar';

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ logoUrl: '/logo.png' }),
  } as Response)
);

describe('Navbar', () => {
  it('renders the navbar with logo and navigation links', async () => {
    render(<Navbar />);

    await waitFor(() => {
      expect(screen.getByAltText('CodeSpark Logo')).toBeInTheDocument();
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('About')).toBeInTheDocument();
      expect(screen.getByText('Services')).toBeInTheDocument();
      expect(screen.getByText('Courses')).toBeInTheDocument();
      expect(screen.getByText('Projects')).toBeInTheDocument();
      expect(screen.getByText('Testimonials')).toBeInTheDocument();
      expect(screen.getByText('Contact')).toBeInTheDocument();
      expect(screen.getByText('Apply')).toBeInTheDocument();
    });
  });

  it('opens and closes the mobile menu', async () => {
    render(<Navbar />);

    await waitFor(() => {
      expect(screen.getByAltText('CodeSpark Logo')).toBeInTheDocument();
    });

    const mobileMenuButton = screen.getByRole('button', { name: 'Open main menu' });
    fireEvent.click(mobileMenuButton);

    const mobileMenu = screen.getByTestId('mobile-menu');
    expect(within(mobileMenu).getByRole('link', { name: 'Home' })).toBeVisible();

    fireEvent.click(mobileMenuButton);

    expect(mobileMenu).not.toBeVisible();
  });
});
