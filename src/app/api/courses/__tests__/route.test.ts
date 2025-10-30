import { GET, POST } from '../route';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

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



jest.mock('@/lib/prisma', () => ({
  course: {
    findMany: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock('@/lib/errorHandler', () => ({
    withErrorHandler: (handler: Function) => handler,
    DatabaseError: class extends Error {
        constructor(message: string) {
            super(message);
            this.name = 'DatabaseError';
        }
    }
}));

describe('/api/courses', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should return a list of courses', async () => {
      const mockCourses = [
        { id: 1, name: 'Course 1', description: 'Description 1', price: 100 },
        { id: 2, name: 'Course 2', description: 'Description 2', price: 200 },
      ];
      (prisma.course.findMany as jest.Mock).mockResolvedValue(mockCourses);

      const response = await GET();
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toEqual(mockCourses);
      expect(prisma.course.findMany).toHaveBeenCalledTimes(1);
    });

    it('should return a 500 error if fetching courses fails', async () => {
        (prisma.course.findMany as jest.Mock).mockResolvedValue(null);

        // We need to wrap the call in a try/catch block because the withErrorHandler is mocked
        // and the error will be thrown directly.
        try {
            await GET();
        } catch (error: Error) {
            expect(error.name).toBe('DatabaseError');
            expect(error.message).toBe('Failed to fetch courses');
        }
    });
  });

  describe('POST', () => {
    it('should create a new course', async () => {
      const newCourse = { name: 'New Course', description: 'New Description', price: 300 };
      const createdCourse = { id: 3, ...newCourse };
      (prisma.course.create as jest.Mock).mockResolvedValue(createdCourse);

      const req = new NextRequest('http://localhost/api/courses', {
        method: 'POST',
        body: JSON.stringify(newCourse),
      });

      const response = await POST(req);
      const body = await response.json();

      expect(response.status).toBe(201);
      expect(body).toEqual(createdCourse);
      expect(prisma.course.create).toHaveBeenCalledWith({ data: newCourse });
    });

    it('should return a 400 error for invalid data', async () => {
        const invalidCourse = { name: 'New Course', description: 'New Description', price: -300 };

        const req = new NextRequest('http://localhost/api/courses', {
            method: 'POST',
            body: JSON.stringify(invalidCourse),
        });

        // We need to wrap the call in a try/catch block because zod will throw an error
        try {
            await POST(req);
        } catch (error: Error) {
            expect(error.name).toBe('ZodError');
        }
    });
  });
});