
import { GET } from '../route';
import prisma from '@/lib/prisma';

jest.mock('@/lib/prisma', () => ({
  message: {
    findMany: jest.fn(),
  },
  student: {
    findMany: jest.fn(),
  },
  project: {
    findMany: jest.fn(),
  },
  course: {
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

describe('/api/admin/activity', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should return a list of activities', async () => {
      const mockMessages = [{ id: 1, name: 'John Doe', createdAt: new Date() }];
      const mockStudents = [{ id: 1, name: 'Jane Doe', createdAt: new Date() }];
      const mockProjects = [{ id: 1, title: 'Test Project', createdAt: new Date() }];
      const mockCourses = [{ id: 1, name: 'Test Course', createdAt: new Date() }];

      (prisma.message.findMany as jest.Mock).mockResolvedValue(mockMessages);
      (prisma.student.findMany as jest.Mock).mockResolvedValue(mockStudents);
      (prisma.project.findMany as jest.Mock).mockResolvedValue(mockProjects);
      (prisma.course.findMany as jest.Mock).mockResolvedValue(mockCourses);

      const response = await GET();
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toHaveLength(4);
      expect(prisma.message.findMany).toHaveBeenCalled();
      expect(prisma.student.findMany).toHaveBeenCalled();
      expect(prisma.project.findMany).toHaveBeenCalled();
      expect(prisma.course.findMany).toHaveBeenCalled();
    });

    it('should return a 500 error if fetching activities fails', async () => {
        (prisma.message.findMany as jest.Mock).mockResolvedValue(null);
        (prisma.student.findMany as jest.Mock).mockResolvedValue(null);
        (prisma.project.findMany as jest.Mock).mockResolvedValue(null);
        (prisma.course.findMany as jest.Mock).mockResolvedValue(null);

        try {
            await GET();
        } catch (error) {
            expect(error.name).toBe('DatabaseError');
            expect(error.message).toBe('Failed to fetch activity data');
        }
    });
  });
});
