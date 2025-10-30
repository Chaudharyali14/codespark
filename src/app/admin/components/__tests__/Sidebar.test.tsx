import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from '../Sidebar';
import { usePathname } from 'next/navigation';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('Sidebar', () => {
  beforeEach(() => {
    (usePathname as jest.Mock).mockReturnValue('/admin');
  });

  it('renders the sidebar with navigation links', () => {
    render(<Sidebar isOpen={true} onClose={() => {}} />);

    expect(screen.getByText('Admin Panel')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Logo')).toBeInTheDocument();
    // ... add more assertions for other links
  });

  it('highlights the active link', () => {
    render(<Sidebar isOpen={true} onClose={() => {}} />);

    const dashboardLink = screen.getByText('Dashboard').closest('a');
    expect(dashboardLink).toHaveClass('bg-indigo-500 text-white');
  });

  it('calls onClose when a link is clicked', () => {
    const handleClose = jest.fn();
    render(<Sidebar isOpen={true} onClose={handleClose} />);

    const dashboardLink = screen.getByText('Dashboard').closest('a');
    if (dashboardLink) {
      fireEvent.click(dashboardLink);
    }

    expect(handleClose).toHaveBeenCalled();
  });

  it('calls handleLogout when the logout button is clicked', () => {
    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');
    
    render(<Sidebar isOpen={true} onClose={() => {}} />);

    const logoutButton = screen.getByRole('button', { name: 'Logout' });
    
    const originalError = console.error;
    console.error = jest.fn();

    fireEvent.click(logoutButton);

    expect(removeItemSpy).toHaveBeenCalledWith('isLoggedIn');

    console.error = originalError;
    removeItemSpy.mockRestore();
  });
});
