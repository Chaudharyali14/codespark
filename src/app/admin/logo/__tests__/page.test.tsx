import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LogoPage from '../page';

const mockLogoData = {
  logoUrl: '/test-logo.jpg',
};

global.fetch = jest.fn();
window.URL.createObjectURL = jest.fn(() => 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==');

describe('LogoPage', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
    (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockLogoData),
    });
  });

  it('renders the page with the current logo', async () => {
    render(<LogoPage />);

    await waitFor(() => {
      expect(screen.getByAltText('CodeSpark Logo')).toBeInTheDocument();
    });
  });

  it('uploads a new logo', async () => {
    render(<LogoPage />);
    (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, filePath: '/new-logo.jpg' }),
    });

    const file = new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' });
    const uploadSection = screen.getByRole('heading', { name: 'Upload New Logo' }).parentElement;
    const input = uploadSection.querySelector('input[type="file"]');

    if (input) {
        fireEvent.change(input, { target: { files: [file] } });
    }
    
    fireEvent.click(screen.getByRole('button', { name: 'Upload Logo' }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/logo/upload', expect.any(Object));
      expect(screen.getByText('Logo uploaded successfully!')).toBeInTheDocument();
    });
  });
});
