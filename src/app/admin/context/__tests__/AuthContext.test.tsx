import { render, screen, fireEvent } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const mockPush = jest.fn();
(useRouter as jest.Mock).mockReturnValue({
  push: mockPush,
});

const TestComponent = () => {
  const { isLoggedIn, login, logout } = useAuth();
  return (
    <div>
      <p>Logged In: {isLoggedIn.toString()}</p>
      <button onClick={login}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthProvider', () => {
  beforeEach(() => {
    sessionStorage.clear();
    mockPush.mockClear();
  });

  it('redirects to /login if not logged in', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('does not redirect if logged in', () => {
    sessionStorage.setItem('isLoggedIn', 'true');
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    expect(mockPush).not.toHaveBeenCalled();
    expect(screen.getByText('Logged In: true')).toBeInTheDocument();
  });

  it('logs in and redirects to /admin', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    const loginButton = screen.getByRole('button', { name: 'Login' });
    fireEvent.click(loginButton);
    expect(sessionStorage.getItem('isLoggedIn')).toBe('true');
    expect(screen.getByText('Logged In: true')).toBeInTheDocument();
    expect(mockPush).toHaveBeenCalledWith('/admin');
  });

  it('logs out and redirects to /login', () => {
    sessionStorage.setItem('isLoggedIn', 'true');
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    const logoutButton = screen.getByRole('button', { name: 'Logout' });
    fireEvent.click(logoutButton);
    expect(sessionStorage.getItem('isLoggedIn')).toBe(null);
    expect(screen.getByText('Logged In: false')).toBeInTheDocument();
    expect(mockPush).toHaveBeenCalledWith('/login');
  });
});
