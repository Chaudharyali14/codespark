import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import StudentsPage from '../page';

const mockStudents = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com', phone: '123-456-7890', course: { name: 'Test Course 1' } },
  { id: 2, name: 'Jane Doe', email: 'jane.doe@example.com', phone: '098-765-4321', course: { name: 'Test Course 2' } },
];

global.fetch = jest.fn((url) => {
    if (url === '/api/students') {
        return Promise.resolve({
            json: () => Promise.resolve(mockStudents),
        } as Response);
    }
    if (url.toString().startsWith('/api/students/')) {
        return Promise.resolve({
            ok: true,
        } as Response);
    }
    return Promise.resolve({ json: () => Promise.resolve({}) } as Response);
});


describe('StudentsPage', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders the page with students', async () => {
    render(<StudentsPage />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('jane.doe@example.com')).toBeInTheDocument();
      expect(screen.getByText('Test Course 2')).toBeInTheDocument();
    });
  });

  it('deletes a student when delete is confirmed', async () => {
    window.confirm = jest.fn(() => true);
    render(<StudentsPage />);

    await waitFor(() => {
        const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });
        fireEvent.click(deleteButtons[0]);
    });

    await waitFor(() => {
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });
  });

  it('exports data to excel', async () => {
    window.URL.createObjectURL = jest.fn();
    const createObjectURLSpy = jest.spyOn(window.URL, 'createObjectURL');
    const createElementSpy = jest.spyOn(document, 'createElement');
    const appendChildSpy = jest.spyOn(document.body, 'appendChild');
    const removeChildSpy = jest.spyOn(document.body, 'removeChild');

    render(<StudentsPage />);
    
    await waitFor(() => {
        fireEvent.click(screen.getByRole('button', { name: 'Export to Excel' }));
    });

    expect(createObjectURLSpy).toHaveBeenCalled();
    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(appendChildSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalled();
  });
});
