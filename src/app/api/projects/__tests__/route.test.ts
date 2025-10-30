import { GET, POST } from '../route';
import prisma from '@/lib/prisma';
import fs from 'fs';
import { NextRequest } from 'next/server';

jest.mock('fs', () => ({
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
  promises: {
    writeFile: jest.fn(),
  },
}));

jest.mock('@/lib/prisma', () => ({
  project: {
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  media: {
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
}));

describe('/api/projects', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should return a list of projects', async () => {
      const mockProjects = [
        { id: 1, title: 'Project 1', description: 'Description 1', media: [] },
        { id: 2, title: 'Project 2', description: 'Description 2', media: [] },
      ];
      (prisma.project.findMany as jest.Mock).mockResolvedValue(mockProjects);

      const response = await GET();
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toEqual(mockProjects);
      expect(prisma.project.findMany).toHaveBeenCalledWith({ include: { media: true } });
    });

    it('should return a 500 error if fetching projects fails', async () => {
        (prisma.project.findMany as jest.Mock).mockResolvedValue(null);

        try {
            await GET();
        } catch (error) {
            expect(error.name).toBe('DatabaseError');
            expect(error.message).toBe('Failed to fetch projects');
        }
    });
  });

  describe('POST', () => {
    it('should create a new project with images and video', async () => {
      const mockProject = { id: 1, title: 'New Project', description: 'New Description' };
      const mockImageFile = {
          name: 'image.jpg',
          type: 'image/jpeg',
          arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
      };
      const mockVideoFile = {
          name: 'video.mp4',
          type: 'video/mp4',
          arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
      };
      const formData = new FormData();
      formData.append('title', 'New Project');
      formData.append('description', 'New Description');
      formData.append('mainImage', '0');
      formData.append('images', mockImageFile as any, 'image.jpg');
      formData.append('video', mockVideoFile as any, 'video.mp4');

      const req = {
        formData: () => Promise.resolve(formData),
      } as unknown as NextRequest;

      (prisma.project.create as jest.Mock).mockResolvedValue(mockProject);
      (prisma.project.update as jest.Mock).mockResolvedValue({ ...mockProject, mainImage: '/uploads/image.jpg' });

      const response = await POST(req);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.mainImage).toBe('/uploads/image.jpg');
      expect(prisma.project.create).toHaveBeenCalledWith({ data: { title: 'New Project', description: 'New Description' } });
      expect(fs.promises.writeFile).toHaveBeenCalledTimes(2);
      expect(prisma.media.create).toHaveBeenCalledTimes(2);
      expect(prisma.project.update).toHaveBeenCalledTimes(1);
    });
  });
});
