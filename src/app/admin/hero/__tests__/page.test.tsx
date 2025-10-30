import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HeroPage from '../page';

const mockHeroData = {
  title: 'Test Title',
  subtitle: 'Test Subtitle',
  mainImage: '/test-main.jpg',
  secondImage: '/test-second.jpg',
};

global.fetch = jest.fn();
// Mock URL.createObjectURL
window.URL.createObjectURL = jest.fn(() => 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==');


describe('HeroPage', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
    (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockHeroData),
    });
  });

  it('renders the page with hero data', async () => {
    render(<HeroPage />);

    await waitFor(() => {
      expect(screen.getByLabelText('Title')).toHaveValue('Test Title');
      expect(screen.getByLabelText('Subtitle')).toHaveValue('Test Subtitle');
      expect(screen.getByAltText('Main image')).toBeInTheDocument();
      expect(screen.getByAltText('Second image')).toBeInTheDocument();
    });
  });

  it('updates the title and subtitle', async () => {
    render(<HeroPage />);
    
    await waitFor(() => {
        expect(screen.getByLabelText('Subtitle')).toHaveValue('Test Subtitle');
    });

    (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
    });

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Updated Title' } });
    fireEvent.click(screen.getByRole('button', { name: 'Update Hero' }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/hero/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Updated Title', subtitle: 'Test Subtitle' }),
      });
      expect(screen.getByText('Hero section updated successfully!')).toBeInTheDocument();
    });
  });

  it('uploads a new main image', async () => {
    render(<HeroPage />);
    (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, filePath: '/new-main.jpg' }),
    });

    const file = new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' });
    const mainImageSection = screen.getByRole('heading', { name: 'Main Image' }).parentElement;
    const mainImageInput = mainImageSection.querySelector('input[type="file"]');

    if (mainImageInput) {
        fireEvent.change(mainImageInput, { target: { files: [file] } });
    }
    
    fireEvent.click(screen.getByRole('button', { name: 'Upload Main Image' }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/hero/upload', expect.any(Object));
      expect(screen.getByText('Main image uploaded successfully!')).toBeInTheDocument();
    });
  });

  it('uploads a new second image', async () => {
    render(<HeroPage />);
    (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, filePath: '/new-second.jpg' }),
    });

    const file = new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' });
    const secondImageSection = screen.getByRole('heading', { name: 'Second Image' }).parentElement;
    const secondImageInput = secondImageSection.querySelector('input[type="file"]');

    if (secondImageInput) {
        fireEvent.change(secondImageInput, { target: { files: [file] } });
    }

    fireEvent.click(screen.getByRole('button', { name: 'Upload Second Image' }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/hero/upload', expect.any(Object));
      expect(screen.getByText('Second image uploaded successfully!')).toBeInTheDocument();
    });
  });
});
