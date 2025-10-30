import { render, screen, fireEvent } from '@testing-library/react';
import DeleteButton from '../DeleteButton';

describe('DeleteButton', () => {
  it('calls onDelete when the button is clicked and confirmed', () => {
    const handleDelete = jest.fn();
    window.confirm = jest.fn(() => true); // Mock confirm to return true

    render(<DeleteButton onDelete={handleDelete} />);

    const deleteButton = screen.getByRole('button', { name: 'Delete' });
    fireEvent.click(deleteButton);

    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this item?');
    expect(handleDelete).toHaveBeenCalled();
  });

  it('does not call onDelete when the button is clicked and not confirmed', () => {
    const handleDelete = jest.fn();
    window.confirm = jest.fn(() => false); // Mock confirm to return false

    render(<DeleteButton onDelete={handleDelete} />);

    const deleteButton = screen.getByRole('button', { name: 'Delete' });
    fireEvent.click(deleteButton);

    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this item?');
    expect(handleDelete).not.toHaveBeenCalled();
  });
});
