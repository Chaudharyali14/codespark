import { GET, PUT, DELETE } from '../route';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

jest.mock('@/lib/prisma', () => ({
  service: {
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock('next/server', () => ({
  NextResponse: class NextResponse {
    constructor(body, init) {
      this.body = body;
      this.status = init?.status || 200;
    }
    static json(data, init) {
      return {
        status: init?.status || 200,
        json: () => Promise.resolve(data),
        headers: new Map(),
      };
    }
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

describe('/api/services/[id]', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should return a service', async () => {
      const mockService = { id: 1, title: 'Service 1', description: 'Description 1' };
      (prisma.service.findUnique as jest.Mock).mockResolvedValue(mockService);

      const response = await GET(null, { params: { id: '1' } });
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toEqual(mockService);
      expect(prisma.service.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should return a 404 error if the service is not found', async () => {
        (prisma.service.findUnique as jest.Mock).mockResolvedValue(null);

        const response = await GET(null, { params: { id: '1' } });
        const body = await response.json();

        expect(response.status).toBe(404);
        expect(body.error).toBe('Service not found');
    });
  });

  describe('PUT', () => {
    it('should update a service', async () => {
      const updatedService = { id: 1, title: 'Updated Service', description: 'Updated Description' };
      (prisma.service.update as jest.Mock).mockResolvedValue(updatedService);

      const req = new NextRequest('http://localhost/api/services/1', {
        method: 'PUT',
        body: JSON.stringify({ title: 'Updated Service', description: 'Updated Description' }),
      });

      const response = await PUT(req, { params: { id: '1' } });
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toEqual(updatedService);
      expect(prisma.service.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { title: 'Updated Service', description: 'Updated Description' },
      });
    });

    it('should return a 400 error for invalid data', async () => {
        const req = new NextRequest('http://localhost/api/services/1', {
            method: 'PUT',
            body: JSON.stringify({ title: '' }),
        });

        const response = await PUT(req, { params: { id: '1' } });
        const body = await response.json();

        expect(response.status).toBe(400);
        expect(body.error).toBe('Title and description are required');
    });
  });

  describe('DELETE', () => {
    it('should delete a service', async () => {
      (prisma.service.delete as jest.Mock).mockResolvedValue({});

      const response = await DELETE(null, { params: { id: '1' } });

      expect(response.status).toBe(204);
      expect(prisma.service.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should return a 500 error if deleting a service fails', async () => {
        const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
        (prisma.service.delete as jest.Mock).mockRejectedValue(new Error('Database error'));

        const response = await DELETE(null, { params: { id: '1' } });
        const body = await response.json();

        expect(response.status).toBe(500);
        expect(body.error).toBe('Failed to delete service');
        consoleError.mockRestore();
    });
  });
});
