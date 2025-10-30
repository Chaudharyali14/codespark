
import { GET, POST } from '../route';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

jest.mock('@/lib/prisma', () => ({
  testimonial: {
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

describe('/api/testimonials', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should return a list of testimonials', async () => {
      const mockTestimonials = [
        { id: 1, quote: 'Testimonial 1', author: 'Author 1', role: 'Role 1' },
        { id: 2, quote: 'Testimonial 2', author: 'Author 2', role: 'Role 2' },
      ];
      (prisma.testimonial.findMany as jest.Mock).mockResolvedValue(mockTestimonials);

      const response = await GET();
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toEqual(mockTestimonials);
      expect(prisma.testimonial.findMany).toHaveBeenCalled();
    });

    it('should return a 500 error if fetching testimonials fails', async () => {
        (prisma.testimonial.findMany as jest.Mock).mockResolvedValue(null);

        try {
            await GET();
        } catch (error) {
            expect(error.name).toBe('DatabaseError');
            expect(error.message).toBe('Failed to fetch testimonials');
        }
    });
  });

  describe('POST', () => {
    it('should create a new testimonial', async () => {
      const newTestimonial = { quote: 'New Testimonial', author: 'New Author', role: 'New Role' };
      const mockCreatedTestimonial = { id: 3, ...newTestimonial };
      (prisma.testimonial.create as jest.Mock).mockResolvedValue(mockCreatedTestimonial);

      const req = {
        json: () => Promise.resolve(newTestimonial),
      } as unknown as NextRequest;

      const response = await POST(req);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toEqual(mockCreatedTestimonial);
      expect(prisma.testimonial.create).toHaveBeenCalledWith({ data: newTestimonial });
    });

    it('should return a 500 error if creating a testimonial fails', async () => {
        const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
        const newTestimonial = { quote: 'New Testimonial', author: 'New Author', role: 'New Role' };
        (prisma.testimonial.create as jest.Mock).mockResolvedValue(null);

        const req = {
            json: () => Promise.resolve(newTestimonial),
        } as unknown as NextRequest;

        try {
            await POST(req);
        } catch (error) {
            expect(error.name).toBe('DatabaseError');
            expect(error.message).toBe('Failed to create testimonial');
        }
        consoleError.mockRestore();
    });
  });
});
