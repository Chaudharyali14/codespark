
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withErrorHandler, DatabaseError } from '@/lib/errorHandler';

export const GET = withErrorHandler(async () => {
  const students = await prisma.student.findMany({
    include: {
      course: true,
    },
  });
  if (!students) {
    throw new DatabaseError('Failed to fetch students');
  }
  return NextResponse.json(students);
});
