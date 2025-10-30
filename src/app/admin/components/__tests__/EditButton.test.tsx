import { render, screen } from '@testing-library/react';
import EditButton from '../EditButton';

describe('EditButton', () => {
  it('renders a link with the correct href', () => {
    render(<EditButton href="/admin/edit/1" />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/admin/edit/1');
  });
});
