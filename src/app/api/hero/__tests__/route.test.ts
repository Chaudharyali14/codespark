import { GET } from '../route';
import prisma from '@/lib/prisma';

jest.mock('@/lib/prisma', () => ({
  siteSettings: {
    findFirst: jest.fn(),
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
    NotFoundError: class extends Error {
        constructor(message) {
            super(message);
            this.name = 'NotFoundError';
        }
    }
}));

describe('/api/hero', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should return the hero data', async () => {
      const mockSiteSettings = {
        heroTitle: 'Hero Title',
        heroSubtitle: 'Hero Subtitle',
        heroImage1: 'image1.jpg',
        heroImage2: 'image2.jpg',
      };
      (prisma.siteSettings.findFirst as jest.Mock).mockResolvedValue(mockSiteSettings);

      const response = await GET();
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toEqual({
        title: 'Hero Title',
        subtitle: 'Hero Subtitle',
        mainImage: 'image1.jpg',
        secondImage: 'image2.jpg',
      });
      expect(prisma.siteSettings.findFirst).toHaveBeenCalledTimes(1);
    });

    it('should return a 404 error if no site settings are found', async () => {
        (prisma.siteSettings.findFirst as jest.Mock).mockResolvedValue(null);

        try {
            await GET();
        } catch (error) {
            expect(error.name).toBe('NotFoundError');
            expect(error.message).toBe('No site settings found.');
        }
    });
  });
});
