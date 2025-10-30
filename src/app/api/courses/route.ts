// src/app/api/courses/route.ts
import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { withErrorHandler, DatabaseError } from '@/lib/errorHandler';

const courseSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().positive('Price must be a positive number'),
});

// Handles GET requests to /api/courses
export const GET = withErrorHandler(async () => {
  const courses = await prisma.course.findMany();
  if (!courses) {
    throw new DatabaseError('Failed to fetch courses');
  }
  return NextResponse.json(courses);
});

// Handles POST requests to /api/courses
export const POST = withErrorHandler(async (req: NextRequest) => {
  const json = await req.json();
  const { name, description, price } = courseSchema.parse(json);

  const newCourse = await prisma.course.create({
    data: {
      name,
      description,
      price,
    },
  });
  if (!newCourse) {
    throw new DatabaseError('Failed to create course');
  }
  return NextResponse.json(newCourse, { status: 201 });
});
