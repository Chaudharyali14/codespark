
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withErrorHandler, DatabaseError } from '@/lib/errorHandler';

export const GET = withErrorHandler(async () => {
  const services = await prisma.service.count();
  const projects = await prisma.project.count();
  const courses = await prisma.course.count();
  const students = await prisma.student.count();

  if (services === null || projects === null || courses === null || students === null) {
    throw new DatabaseError('Failed to fetch summary data');
  }

  return NextResponse.json({
    services,
    projects,
    courses,
    students,
  });
});
