
import { GET } from '../route';
import prisma from '@/lib/prisma';

jest.mock('@/lib/prisma', () => ({
  service: {
    count: jest.fn(),
  },
  project: {
    count: jest.fn(),
  },
  course: {
    count: jest.fn(),
  },
  student: {
    count: jest.fn(),
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

describe('/api/admin/summary', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should return a summary of the data', async () => {
      (prisma.service.count as jest.Mock).mockResolvedValue(10);
      (prisma.project.count as jest.Mock).mockResolvedValue(20);
      (prisma.course.count as jest.Mock).mockResolvedValue(30);
      (prisma.student.count as jest.Mock).mockResolvedValue(40);

      const response = await GET();
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toEqual({ services: 10, projects: 20, courses: 30, students: 40 });
      expect(prisma.service.count).toHaveBeenCalled();
      expect(prisma.project.count).toHaveBeenCalled();
      expect(prisma.course.count).toHaveBeenCalled();
      expect(prisma.student.count).toHaveBeenCalled();
    });

    it('should return a 500 error if fetching summary data fails', async () => {
        (prisma.service.count as jest.Mock).mockResolvedValue(null);
        (prisma.project.count as jest.Mock).mockResolvedValue(null);
        (prisma.course.count as jest.Mock).mockResolvedValue(null);
        (prisma.student.count as jest.Mock).mockResolvedValue(null);

        try {
            await GET();
        } catch (error) {
            expect(error.name).toBe('DatabaseError');
            expect(error.message).toBe('Failed to fetch summary data');
        }
    });
  });
});
