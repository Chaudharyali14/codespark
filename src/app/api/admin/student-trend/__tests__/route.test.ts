
import { GET } from '../route';
import prisma from '@/lib/prisma';

jest.mock('@/lib/prisma', () => ({
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

describe('/api/admin/student-trend', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should return the student trend data for the last 6 months', async () => {
      (prisma.student.count as jest.Mock).mockResolvedValue(10);

      const response = await GET();
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toHaveLength(6);
      expect(prisma.student.count).toHaveBeenCalledTimes(6);
    });

    it('should return a 500 error if fetching student trend data fails', async () => {
        (prisma.student.count as jest.Mock).mockResolvedValue(null);

        try {
            await GET();
        } catch (error) {
            expect(error.name).toBe('DatabaseError');
            expect(error.message).toBe('Failed to fetch student trend data');
        }
    });
  });
});
