import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import StudentForm from '../StudentForm';
import { useSearchParams } from 'next/navigation';
import { act } from 'react';

jest.mock('next/navigation', () => ({
    useSearchParams: jest.fn(),
}));

const mockFetch = jest.fn();

global.fetch = mockFetch;

describe('StudentForm', () => {
  beforeEach(() => {
    (useSearchParams as jest.Mock).mockReturnValue({
      get: () => null,
    });
    mockFetch.mockReset();
  });

  it('renders the student form with correct data', async () => {
    mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([{ id: 1, name: 'Test Course' }]),
    });
    render(<StudentForm />);

    await waitFor(() => {
        expect(screen.getByText('Apply for a Course')).toBeInTheDocument();
        expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
        expect(screen.getByLabelText('Phone Number (Optional)')).toBeInTheDocument();
        expect(screen.getByLabelText('Select a Course')).toBeInTheDocument();
    });
  });

  it('submits the form with correct data', async () => {
    mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([{ id: 1, name: 'Test Course' }]),
    });
    mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ id: 1, name: 'John Doe' }),
    });
    render(<StudentForm />);

    // Wait for the courses to be loaded
    await screen.findByText('Test Course');

    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(screen.getByLabelText('Phone Number (Optional)'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText('Select a Course'), { target: { value: '1' } });

    await act(async () => {
        fireEvent.submit(screen.getByTestId('student-form'));
    });

    await waitFor(() => {
      expect(mockFetch.mock.calls.length).toBe(2);
      expect(mockFetch.mock.calls[1][0]).toBe('/api/students');
      expect(mockFetch.mock.calls[1][1]).toEqual({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '1234567890',
          courseId: 1,
        }),
      });
      expect(screen.getByText('Application submitted successfully!')).toBeInTheDocument();
    });
  });
});
