import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

describe('Footer', () => {
  it('renders the footer with correct data', () => {
    render(<Footer />);

    expect(screen.getByText('CodeSpark')).toBeInTheDocument();
    expect(screen.getByText('© 2024 CodeSpark. All rights reserved.')).toBeInTheDocument();
  });
});
