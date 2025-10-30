import { POST } from '../route';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

jest.mock('@/lib/prisma', () => ({
  student: {
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

describe('/api/apply', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST', () => {
    it('should create a new student', async () => {
      const newStudent = { name: 'John Doe', email: 'john.doe@example.com', phone: '1234567890', courseId: 1 };
      const createdStudent = { id: 1, ...newStudent };
      (prisma.student.create as jest.Mock).mockResolvedValue(createdStudent);

      const req = new NextRequest('http://localhost/api/apply', {
        method: 'POST',
        body: JSON.stringify(newStudent),
      });

      const response = await POST(req);
      const body = await response.json();

      expect(response.status).toBe(201);
      expect(body).toEqual(createdStudent);
      expect(prisma.student.create).toHaveBeenCalledWith({ data: newStudent });
    });

    it('should return a 400 error for invalid data', async () => {
        const invalidStudent = { name: 'John Doe', email: 'john.doe@example.com', phone: '123', courseId: 1 };

        const req = new NextRequest('http://localhost/api/apply', {
            method: 'POST',
            body: JSON.stringify(invalidStudent),
        });

        try {
            await POST(req);
        } catch (error) {
            expect(error.name).toBe('ZodError');
        }
    });

    it('should return a 500 error if creating a student fails', async () => {
        const newStudent = { name: 'John Doe', email: 'john.doe@example.com', phone: '1234567890', courseId: 1 };
        (prisma.student.create as jest.Mock).mockResolvedValue(null);

        const req = new NextRequest('http://localhost/api/apply', {
            method: 'POST',
            body: JSON.stringify(newStudent),
        });

        try {
            await POST(req);
        } catch (error) {
            expect(error.name).toBe('DatabaseError');
            expect(error.message).toBe('Failed to create student');
        }
    });
  });
});
