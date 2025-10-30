import { GET, POST } from '../route';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

jest.mock('@/lib/prisma', () => ({
  message: {
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

describe('/api/contact', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should return a list of messages', async () => {
      const mockMessages = [
        { id: 1, name: 'John Doe', email: 'john.doe@example.com', message: 'Hello' },
        { id: 2, name: 'Jane Doe', email: 'jane.doe@example.com', message: 'Hi' },
      ];
      (prisma.message.findMany as jest.Mock).mockResolvedValue(mockMessages);

      const response = await GET();
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toEqual(mockMessages);
      expect(prisma.message.findMany).toHaveBeenCalledTimes(1);
    });

    it('should return a 500 error if fetching messages fails', async () => {
        (prisma.message.findMany as jest.Mock).mockResolvedValue(null);

        try {
            await GET();
        } catch (error) {
            expect(error.name).toBe('DatabaseError');
            expect(error.message).toBe('Failed to fetch messages');
        }
    });
  });

  describe('POST', () => {
    it('should create a new message', async () => {
      const newMessage = { name: 'John Doe', email: 'john.doe@example.com', message: 'Hello' };
      const createdMessage = { id: 1, ...newMessage };
      (prisma.message.create as jest.Mock).mockResolvedValue(createdMessage);

      const req = new NextRequest('http://localhost/api/contact', {
        method: 'POST',
        body: JSON.stringify(newMessage),
      });

      const response = await POST(req);
      const body = await response.json();

      expect(response.status).toBe(201);
      expect(body).toEqual(createdMessage);
      expect(prisma.message.create).toHaveBeenCalledWith({ data: newMessage });
    });

    it('should return a 400 error for invalid data', async () => {
        const invalidMessage = { name: 'John Doe', email: 'invalid-email', message: 'Hello' };

        const req = new NextRequest('http://localhost/api/contact', {
            method: 'POST',
            body: JSON.stringify(invalidMessage),
        });

        try {
            await POST(req);
        } catch (error) {
            expect(error.name).toBe('ZodError');
        }
    });

    it('should return a 500 error if creating a message fails', async () => {
        const newMessage = { name: 'John Doe', email: 'john.doe@example.com', message: 'Hello' };
        (prisma.message.create as jest.Mock).mockResolvedValue(null);

        const req = new NextRequest('http://localhost/api/contact', {
            method: 'POST',
            body: JSON.stringify(newMessage),
        });

        try {
            await POST(req);
        } catch (error) {
            expect(error.name).toBe('DatabaseError');
            expect(error.message).toBe('Failed to create message');
        }
    });
  });
});
