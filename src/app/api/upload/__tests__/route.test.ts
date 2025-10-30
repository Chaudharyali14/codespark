import { POST } from '../route';
import { NextRequest } from 'next/server';
import { writeFile } from 'fs/promises';

jest.mock('fs/promises', () => ({
  writeFile: jest.fn(),
}));

jest.mock('next/server', () => ({
  NextResponse: {
    json: (data: unknown, init?: { status?: number }) => {
      return {
        status: init?.status || 200,
        json: () => Promise.resolve(data),
        headers: new Map(),
      };
    },
  },
}));

jest.mock('@/lib/errorHandler', () => ({
    withErrorHandler: (handler: Function) => handler,
    ValidationError: class extends Error {
        public errors: unknown;
        constructor(errors: unknown, message: string) {
            super(message);
            this.name = 'ValidationError';
            this.errors = errors;
        }
    }
}));

type MockFile = Blob & { arrayBuffer: () => Promise<ArrayBuffer> };

describe('/api/upload', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST', () => {
    it('should upload two images successfully', async () => {
      const image1 = new Blob(['image1'], { type: 'image/png' }) as MockFile;
      const image2 = new Blob(['image2'], { type: 'image/png' }) as MockFile;
      image1.arrayBuffer = () => Promise.resolve(new ArrayBuffer(0));
      image2.arrayBuffer = () => Promise.resolve(new ArrayBuffer(0));

      const formData = new FormData();
      formData.append('image1', image1);
      formData.append('image2', image2);

      const req = {
        formData: () => Promise.resolve(formData),
      } as unknown as NextRequest;

      const response = await POST(req);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.message).toBe('Images uploaded successfully');
      expect(writeFile).toHaveBeenCalledTimes(2);
    });

    it('should return a validation error if images are missing', async () => {
        const formData = new FormData();
        const req = {
            formData: () => Promise.resolve(formData),
        } as unknown as NextRequest;

        try {
            await POST(req);
        } catch (error: unknown) {
            const err = error as Error;
            expect(err.name).toBe('ValidationError');
            expect(err.message).toBe('Missing image files');
        }
    });
  });
});