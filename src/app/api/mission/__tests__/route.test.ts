import { GET, POST } from '../route';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

jest.mock('@/lib/prisma', () => ({
  mission: {
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

describe('/api/mission', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should return a list of missions', async () => {
      const mockMissions = [
        { id: 1, title: 'Mission 1', description: 'Description 1' },
        { id: 2, title: 'Mission 2', description: 'Description 2' },
      ];
      (prisma.mission.findMany as jest.Mock).mockResolvedValue(mockMissions);

      const response = await GET();
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toEqual(mockMissions);
      expect(prisma.mission.findMany).toHaveBeenCalledWith({ orderBy: { createdAt: 'desc' } });
    });

    it('should return a 500 error if fetching missions fails', async () => {
        (prisma.mission.findMany as jest.Mock).mockResolvedValue(null);

        try {
            await GET();
        } catch (error) {
            expect(error.name).toBe('DatabaseError');
            expect(error.message).toBe('Failed to fetch missions');
        }
    });
  });

  describe('POST', () => {
    it('should create a new mission', async () => {
      const newMission = { title: 'New Mission', description: 'New Description' };
      const createdMission = { id: 1, ...newMission };
      (prisma.mission.create as jest.Mock).mockResolvedValue(createdMission);

      const req = new NextRequest('http://localhost/api/mission', {
        method: 'POST',
        body: JSON.stringify(newMission),
      });

      const response = await POST(req);
      const body = await response.json();

      expect(response.status).toBe(201);
      expect(body).toEqual(createdMission);
      expect(prisma.mission.create).toHaveBeenCalledWith({ data: newMission });
    });

    it('should return a 400 error for invalid data', async () => {
        const invalidMission = { title: '', description: 'New Description' };

        const req = new NextRequest('http://localhost/api/mission', {
            method: 'POST',
            body: JSON.stringify(invalidMission),
        });

        try {
            await POST(req);
        } catch (error) {
            expect(error.name).toBe('ZodError');
        }
    });

    it('should return a 500 error if creating a mission fails', async () => {
        const newMission = { title: 'New Mission', description: 'New Description' };
        (prisma.mission.create as jest.Mock).mockResolvedValue(null);

        const req = new NextRequest('http://localhost/api/mission', {
            method: 'POST',
            body: JSON.stringify(newMission),
        });

        try {
            await POST(req);
        } catch (error) {
            expect(error.name).toBe('DatabaseError');
            expect(error.message).toBe('Failed to create mission');
        }
    });
  });
});
