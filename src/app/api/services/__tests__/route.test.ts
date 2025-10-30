import { GET, POST } from '../route';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

jest.mock('@/lib/prisma', () => ({
  service: {
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
  NextRequest: class NextRequest {
    constructor(input, init) {
      this.input = input;
      this.init = init;
    }
    json() {
        return Promise.resolve(JSON.parse(this.init.body));
    }
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

describe('/api/services', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should return a list of services', async () => {
      const mockServices = [
        { id: 1, title: 'Service 1', description: 'Description 1' },
        { id: 2, title: 'Service 2', description: 'Description 2' },
      ];
      (prisma.service.findMany as jest.Mock).mockResolvedValue(mockServices);

      const response = await GET();
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toEqual(mockServices);
      expect(prisma.service.findMany).toHaveBeenCalledTimes(1);
    });

    it('should return a 500 error if fetching services fails', async () => {
        (prisma.service.findMany as jest.Mock).mockResolvedValue(null);

        try {
            await GET();
        } catch (error) {
            expect(error.name).toBe('DatabaseError');
            expect(error.message).toBe('Failed to fetch services');
        }
    });
  });

  describe('POST', () => {
    it('should create a new service', async () => {
      const newService = { title: 'New Service', description: 'New Description' };
      const createdService = { id: 1, ...newService };
      (prisma.service.create as jest.Mock).mockResolvedValue(createdService);

      const req = new NextRequest('http://localhost/api/services', {
        method: 'POST',
        body: JSON.stringify(newService),
      });

      const response = await POST(req);
      const body = await response.json();

      expect(response.status).toBe(201);
      expect(body).toEqual(createdService);
      expect(prisma.service.create).toHaveBeenCalledWith({ data: newService });
    });

    it('should return a 400 error for invalid data', async () => {
        const invalidService = { title: '', description: 'New Description' };

        const req = new NextRequest('http://localhost/api/services', {
            method: 'POST',
            body: JSON.stringify(invalidService),
        });

        try {
            await POST(req);
        } catch (error) {
            expect(error.name).toBe('ZodError');
        }
    });

    it('should return a 500 error if creating a service fails', async () => {
        const newService = { title: 'New Service', description: 'New Description' };
        (prisma.service.create as jest.Mock).mockResolvedValue(null);

        const req = new NextRequest('http://localhost/api/services', {
            method: 'POST',
            body: JSON.stringify(newService),
        });

        try {
            await POST(req);
        } catch (error) {
            expect(error.name).toBe('DatabaseError');
            expect(error.message).toBe('Failed to create service');
        }
    });
  });
});
