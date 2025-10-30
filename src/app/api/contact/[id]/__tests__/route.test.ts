import { DELETE } from '../route';
import prisma from '@/lib/prisma';

jest.mock('@/lib/prisma', () => ({
  message: {
    delete: jest.fn(),
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

describe('/api/contact/[id]', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('DELETE', () => {
    it('should delete a message', async () => {
      const mockId = '1';
      (prisma.message.delete as jest.Mock).mockResolvedValue({});

      const response = await DELETE(null, { params: { id: mockId } });

      expect(response.status).toBe(204);
      expect(prisma.message.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should return a 500 error if deleting a message fails', async () => {
        const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
        const mockId = '1';
        (prisma.message.delete as jest.Mock).mockRejectedValue(new Error('Database error'));

        const response = await DELETE(null, { params: { id: mockId } });
        const body = await response.json();

        expect(response.status).toBe(500);
        expect(body.error).toBe('Failed to delete message');
        consoleError.mockRestore();
    });
  });
});
