
import { GET, POST } from '../route';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

jest.mock('@/lib/prisma', () => ({
  vision: {
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  mission: {
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
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

describe('/api/admin/vision-mission', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should return the vision and mission', async () => {
      const mockVision = { id: 1, title: 'Vision', description: 'Vision Description' };
      const mockMission = { id: 1, title: 'Mission', description: 'Mission Description' };

      (prisma.vision.findFirst as jest.Mock).mockResolvedValue(mockVision);
      (prisma.mission.findFirst as jest.Mock).mockResolvedValue(mockMission);

      const response = await GET();
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toEqual({ vision: mockVision, mission: mockMission });
      expect(prisma.vision.findFirst).toHaveBeenCalled();
      expect(prisma.mission.findFirst).toHaveBeenCalled();
    });

    it('should return a 500 error if fetching vision and mission fails', async () => {
        (prisma.vision.findFirst as jest.Mock).mockResolvedValue(null);
        (prisma.mission.findFirst as jest.Mock).mockResolvedValue(null);

        try {
            await GET();
        } catch (error) {
            expect(error.name).toBe('DatabaseError');
            expect(error.message).toBe('Failed to fetch vision and mission');
        }
    });
  });

  describe('POST', () => {
    it('should create a new vision and mission if they do not exist', async () => {
        const newVision = { title: 'New Vision', description: 'New Vision Description' };
        const newMission = { title: 'New Mission', description: 'New Mission Description' };

        (prisma.vision.findFirst as jest.Mock).mockResolvedValue(null);
        (prisma.mission.findFirst as jest.Mock).mockResolvedValue(null);

        const req = {
            json: () => Promise.resolve({ vision: newVision, mission: newMission }),
        } as unknown as NextRequest;

        const response = await POST(req);

        expect(response.status).toBe(200);
        expect(prisma.vision.create).toHaveBeenCalledWith({ data: newVision });
        expect(prisma.mission.create).toHaveBeenCalledWith({ data: newMission });
    });

    it('should update the vision and mission if they exist', async () => {
        const existingVision = { id: 1, title: 'Existing Vision', description: 'Existing Vision Description' };
        const existingMission = { id: 1, title: 'Existing Mission', description: 'Existing Mission Description' };
        const updatedVision = { title: 'Updated Vision', description: 'Updated Vision Description' };
        const updatedMission = { title: 'Updated Mission', description: 'Updated Mission Description' };

        (prisma.vision.findFirst as jest.Mock).mockResolvedValue(existingVision);
        (prisma.mission.findFirst as jest.Mock).mockResolvedValue(existingMission);

        const req = {
            json: () => Promise.resolve({ vision: updatedVision, mission: updatedMission }),
        } as unknown as NextRequest;

        const response = await POST(req);

        expect(response.status).toBe(200);
        expect(prisma.vision.update).toHaveBeenCalledWith({ where: { id: 1 }, data: updatedVision });
        expect(prisma.mission.update).toHaveBeenCalledWith({ where: { id: 1 }, data: updatedMission });
    });
  });
});
