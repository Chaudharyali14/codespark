import { POST } from '../route';
import prisma from '@/lib/prisma';
import fs from 'fs/promises';
import { NextRequest } from 'next/server';

jest.mock('fs/promises', () => ({
  mkdir: jest.fn(),
  writeFile: jest.fn(),
}));

jest.mock('@/lib/prisma', () => ({
  siteSettings: {
    findFirst: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
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

describe('/api/logo/upload', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST', () => {
    it('should upload a logo and update the site settings', async () => {
      const mockFile = {
        name: 'test.png',
        type: 'image/png',
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
      };
      const formData = new FormData();
      formData.append('logo', mockFile as unknown as Blob, 'test.png');

      const req = {
        formData: () => Promise.resolve(formData),
      } as unknown as NextRequest;

      (prisma.siteSettings.findFirst as jest.Mock).mockResolvedValue({ id: 1 });

      const response = await POST(req);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.filePath).toBe('/images/logo.png');
      expect(fs.writeFile).toHaveBeenCalled();
      expect(prisma.siteSettings.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { logo: '/images/logo.png' },
      });
    });

    it('should return a 400 error if no file is uploaded', async () => {
        const formData = new FormData();

        const req = {
            formData: () => Promise.resolve(formData),
        } as unknown as NextRequest;

        const response = await POST(req);
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body.success).toBe(false);
        expect(body.error).toBe('No file uploaded');
    });

    it('should return a 500 error if the database update fails', async () => {
        const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
        const mockFile = {
            name: 'test.png',
            type: 'image/png',
            arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
        };
        const formData = new FormData();
        formData.append('logo', mockFile as unknown as Blob, 'test.png');

        const req = {
            formData: () => Promise.resolve(formData),
        } as unknown as NextRequest;

        (prisma.siteSettings.findFirst as jest.Mock).mockRejectedValue(new Error('Database error'));

        const response = await POST(req);
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body.success).toBe(false);
        expect(body.error).toBe('Failed to upload logo');
        consoleError.mockRestore();
    });
  });
});
