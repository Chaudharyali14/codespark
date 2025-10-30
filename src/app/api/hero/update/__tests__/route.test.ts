import { POST } from '../route';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

jest.mock('@/lib/prisma', () => ({
  siteSettings: {
    findFirst: jest.fn(),
    update: jest.fn(),
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

describe('/api/hero/update', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST', () => {
    it('should update the hero data if a record exists', async () => {
      const mockSiteSettings = { id: 1, heroTitle: 'Old Title', heroSubtitle: 'Old Subtitle' };
      (prisma.siteSettings.findFirst as jest.Mock).mockResolvedValue(mockSiteSettings);

      const req = new NextRequest('http://localhost/api/hero/update', {
        method: 'POST',
        body: JSON.stringify({ title: 'New Title', subtitle: 'New Subtitle' }),
      });

      const response = await POST(req);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.success).toBe(true);
      expect(prisma.siteSettings.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { heroTitle: 'New Title', heroSubtitle: 'New Subtitle' },
      });
    });

    it('should create the hero data if no record exists', async () => {
        (prisma.siteSettings.findFirst as jest.Mock).mockResolvedValue(null);

        const req = new NextRequest('http://localhost/api/hero/update', {
            method: 'POST',
            body: JSON.stringify({ title: 'New Title', subtitle: 'New Subtitle' }),
        });

        const response = await POST(req);
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body.success).toBe(true);
        expect(prisma.siteSettings.create).toHaveBeenCalledWith({
            data: {
                logo: '',
                heroTitle: 'New Title',
                heroSubtitle: 'New Subtitle',
            },
        });
    });

    it('should return a 500 error if updating the hero data fails', async () => {
        const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
        (prisma.siteSettings.findFirst as jest.Mock).mockRejectedValue(new Error('Database error'));

        const req = new NextRequest('http://localhost/api/hero/update', {
            method: 'POST',
            body: JSON.stringify({ title: 'New Title', subtitle: 'New Subtitle' }),
        });

        const response = await POST(req);
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body.success).toBe(false);
        expect(body.error).toBe('Failed to update hero data');
        consoleError.mockRestore();
    });
  });
});
