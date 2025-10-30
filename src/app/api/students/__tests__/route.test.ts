import { GET } from '../route';
import prisma from '@/lib/prisma';

jest.mock('@/lib/prisma', () => ({
  student: {
    findMany: jest.fn(),
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

describe('/api/students', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should return a list of students', async () => {
      const mockStudents = [
        { id: 1, name: 'Student 1', email: 'student1@example.com', course: { id: 1, name: 'Course 1' } },
        { id: 2, name: 'Student 2', email: 'student2@example.com', course: { id: 1, name: 'Course 1' } },
      ];
      (prisma.student.findMany as jest.Mock).mockResolvedValue(mockStudents);

      const response = await GET();
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toEqual(mockStudents);
      expect(prisma.student.findMany).toHaveBeenCalledWith({ include: { course: true } });
    });

    it('should return a 500 error if fetching students fails', async () => {
        (prisma.student.findMany as jest.Mock).mockResolvedValue(null);

        try {
            await GET();
        } catch (error) {
            expect(error.name).toBe('DatabaseError');
            expect(error.message).toBe('Failed to fetch students');
        }
    });
  });
});
