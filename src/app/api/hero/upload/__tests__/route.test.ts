import { POST } from '../route';
import prisma from '@/lib/prisma';
import cloudinary from '@/lib/cloudinary';
import { NextRequest } from 'next/server';

jest.mock('@/lib/prisma', () => ({
  siteSettings: {
    findFirst: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock('@/lib/cloudinary', () => ({
  uploader: {
    upload: jest.fn(),
  },
}));

jest.mock('next/server', () => ({
  NextResponse: {
    json: (data, init) => {
      return {
        status: init?.status || 200,
        json: () => Promise.resolve(data),
        headers: new Map(),
      };
    },
  },
}));

describe('/api/hero/upload', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST', () => {
    it('should upload an image and update the site settings', async () => {
      const mockFile = {
        name: 'test.jpg',
        type: 'image/jpeg',
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
      };
      const formData = new FormData();
      formData.append('image', mockFile as unknown as Blob, 'test.jpg');
      formData.append('imageType', 'main');

      const req = {
        formData: () => Promise.resolve(formData),
      } as unknown as NextRequest;

      (prisma.siteSettings.findFirst as jest.Mock).mockResolvedValue({ id: 1 });
      (cloudinary.uploader.upload as jest.Mock).mockResolvedValue({ secure_url: 'http://cloudinary.com/image.jpg' });

      const response = await POST(req);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.filePath).toBe('http://cloudinary.com/image.jpg');
      expect(cloudinary.uploader.upload).toHaveBeenCalled();
      expect(prisma.siteSettings.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { heroImage1: 'http://cloudinary.com/image.jpg' },
      });
    });

    it('should return a 400 error if no file is uploaded', async () => {
        const formData = new FormData();
        formData.append('imageType', 'main');

        const req = {
            formData: () => Promise.resolve(formData),
        } as unknown as NextRequest;

        const response = await POST(req);
        const body = await response.json();

        expect(response.status).toBe(400);
        expect(body.error).toBe('No file uploaded');
    });

    it('should return a 400 error for an invalid image type', async () => {
        const mockFile = {
            name: 'test.jpg',
            type: 'image/jpeg',
            arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
        };
        const formData = new FormData();
        formData.append('image', mockFile as unknown as Blob, 'test.jpg');

        const req = {
            formData: () => Promise.resolve(formData),
        } as unknown as NextRequest;

        const response = await POST(req);
        const body = await response.json();

        expect(response.status).toBe(400);
        expect(body.error).toBe('Invalid image type');
    });

    it('should return a 500 error if the database update fails', async () => {
        const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
        const mockFile = {
            name: 'test.jpg',
            type: 'image/jpeg',
            arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
        };
        const formData = new FormData();
        formData.append('image', mockFile as unknown as Blob, 'test.jpg');
        formData.append('imageType', 'main');

        const req = {
            formData: () => Promise.resolve(formData),
        } as unknown as NextRequest;

        (prisma.siteSettings.findFirst as jest.Mock).mockRejectedValue(new Error('Database error'));

        const response = await POST(req);
        const body = await response.json();

        expect(response.status).toBe(500);
        expect(body.error).toBe('Failed to upload image');
        consoleError.mockRestore();
    });
  });
});
