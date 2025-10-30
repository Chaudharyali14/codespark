import { GET } from '../route';
import prisma from '@/lib/prisma';

jest.mock('@/lib/prisma', () => ({
  siteSettings: {
    findFirst: jest.fn(),
  },
}));

jest.mock('next/server', () => ({
  NextResponse: {
    json: (data: any, init?: { status?: number }) => {
      return {
        status: init?.status || 200,
        json: () => Promise.resolve(data),
        headers: new Map(),
      };
    },
  },
}));

jest.mock('@/lib/errorHandler', () => ({
    withErrorHandler: (handler: any) => handler,
    NotFoundError: class extends Error {
        constructor(message: string) {
            super(message);
            this.name = 'NotFoundError';
        }
    }
}));

describe('/api/logo', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should return the logo URL', async () => {
      const mockSiteSettings = {
        logo: '/images/logo.png',
      };
      (prisma.siteSettings.findFirst as jest.Mock).mockResolvedValue(mockSiteSettings);

      const response = await GET();
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toEqual({ logoUrl: '/images/logo.png' });
      expect(prisma.siteSettings.findFirst).toHaveBeenCalledTimes(1);
    });

    it('should return a 404 error if no site settings are found', async () => {
        (prisma.siteSettings.findFirst as jest.Mock).mockResolvedValue(null);

        try {
            await GET();
        } catch (error) {
            expect((error as Error).name).toBe('NotFoundError');
            expect((error as Error).message).toBe('No site settings found.');
        }
    });
  });
});
