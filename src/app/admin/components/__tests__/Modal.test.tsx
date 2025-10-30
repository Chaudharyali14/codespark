import { render, screen, fireEvent } from '@testing-library/react';
import Modal from '../Modal';

describe('Modal', () => {
  it('does not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={() => {}} title="Test Modal">
        <div>Modal Content</div>
      </Modal>
    );

    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
  });

  it('renders the modal with title and children when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal">
        <div>Modal Content</div>
      </Modal>
    );

    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', () => {
    const handleClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Test Modal">
        <div>Modal Content</div>
      </Modal>
    );

    const closeButton = screen.getByRole('button', { name: '×' });
    fireEvent.click(closeButton);

    expect(handleClose).toHaveBeenCalled();
  });
});
