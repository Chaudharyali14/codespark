import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EditCoursePage from '../page';
import { useRouter } from 'next/navigation';
import React from 'react';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const mockPush = jest.fn();
(useRouter as jest.Mock).mockReturnValue({
  push: mockPush,
});

const mockCourse = { id: '1', name: 'Test Course', description: 'Test Description', price: 100 };

global.fetch = jest.fn();

// Mock React.use
jest.spyOn(React, 'use').mockReturnValue({ id: '1' });


describe('EditCoursePage', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
    mockPush.mockClear();
  });

  it('renders the form with course data', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockCourse),
    });
    render(<EditCoursePage params={Promise.resolve({ id: '1' })} />);

    await waitFor(() => {
        expect(screen.getByLabelText('Name')).toHaveValue('Test Course');
        expect(screen.getByLabelText('Description')).toHaveValue('Test Description');
        expect(screen.getByLabelText('Price')).toHaveValue(100);
    });
  });

  it('submits the form and shows success message', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockCourse) });
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: true });
    render(<EditCoursePage params={Promise.resolve({ id: '1' })} />);

    await waitFor(() => {
        expect(screen.getByLabelText('Name')).toHaveValue('Test Course');
    });

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Updated Course' } });
    fireEvent.click(screen.getByRole('button', { name: 'Update Course' }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/courses/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Updated Course', description: 'Test Description', price: '100' }),
      });
      expect(screen.getByText('Course updated successfully!')).toBeInTheDocument();
      expect(mockPush).toHaveBeenCalledWith('/admin/courses');
    });
  });

  it('shows an error message on submission failure', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockCourse) });
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: false });
    render(<EditCoursePage params={Promise.resolve({ id: '1' })} />);

    await waitFor(() => {
        expect(screen.getByLabelText('Name')).toHaveValue('Test Course');
    });

    fireEvent.click(screen.getByRole('button', { name: 'Update Course' }));

    await waitFor(() => {
      expect(screen.getByText('Failed to update course. Please try again.')).toBeInTheDocument();
    });
  });
});
