
import { GET, POST } from '../route';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

jest.mock('@/lib/prisma', () => ({
  vision: {
    findMany: jest.fn(),
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

jest.mock('@/lib/errorHandler', () => ({
    withErrorHandler: (handler) => handler,
    DatabaseError: class extends Error {
        constructor(message) {
            super(message);
            this.name = 'DatabaseError';
        }
    }
}));

describe('/api/vision', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should return a list of visions', async () => {
      const mockVisions = [
        { id: 1, title: 'Vision 1', description: 'Description 1' },
        { id: 2, title: 'Vision 2', description: 'Description 2' },
      ];
      (prisma.vision.findMany as jest.Mock).mockResolvedValue(mockVisions);

      const response = await GET();
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toEqual(mockVisions);
      expect(prisma.vision.findMany).toHaveBeenCalledWith({ orderBy: { createdAt: 'desc' } });
    });

    it('should return a 500 error if fetching visions fails', async () => {
        (prisma.vision.findMany as jest.Mock).mockResolvedValue(null);

        try {
            await GET();
        } catch (error) {
            expect(error.name).toBe('DatabaseError');
            expect(error.message).toBe('Failed to fetch visions');
        }
    });
  });

  describe('POST', () => {
    it('should create a new vision', async () => {
      const newVision = { title: 'New Vision', description: 'New Description' };
      const mockCreatedVision = { id: 3, ...newVision };
      (prisma.vision.create as jest.Mock).mockResolvedValue(mockCreatedVision);

      const req = {
        json: () => Promise.resolve(newVision),
      } as unknown as NextRequest;

      const response = await POST(req);
      const body = await response.json();

      expect(response.status).toBe(201);
      expect(body).toEqual(mockCreatedVision);
      expect(prisma.vision.create).toHaveBeenCalledWith({ data: newVision });
    });

    it('should return a 500 error if creating a vision fails', async () => {
        const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
        const newVision = { title: 'New Vision', description: 'New Description' };
        (prisma.vision.create as jest.Mock).mockResolvedValue(null);

        const req = {
            json: () => Promise.resolve(newVision),
        } as unknown as NextRequest;

        try {
            await POST(req);
        } catch (error) {
            expect(error.name).toBe('DatabaseError');
            expect(error.message).toBe('Failed to create vision');
        }
        consoleError.mockRestore();
    });
  });
});
