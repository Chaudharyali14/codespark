
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withErrorHandler, DatabaseError } from '@/lib/errorHandler';

interface TrendData {
  month: string;
  students: number;
}

export const GET = withErrorHandler(async () => {
  const now = new Date();
  const months: TrendData[] = [];

  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = date.toLocaleString('default', { month: 'short' });
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);

    const count = await prisma.student.count({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    });

    if (count === null || count === undefined) {
        throw new DatabaseError('Failed to fetch student trend data');
    }

    months.push({ month: monthName, students: count });
  }

  return NextResponse.json(months);
});
