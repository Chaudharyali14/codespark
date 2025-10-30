
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withErrorHandler, DatabaseError } from '@/lib/errorHandler';
import { z } from 'zod';

const studentSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    phone: z.string().min(10, { message: "Phone number is required" }),
    courseId: z.number().int().positive({ message: "Course ID is required" }),
  });

export const POST = withErrorHandler(async (req: Request) => {
  const json = await req.json();
  const { name, email, phone, courseId } = studentSchema.parse(json);
  const newStudent = await prisma.student.create({
    data: {
      name,
      email,
      phone,
      courseId,
    },
  });
  if (!newStudent) {
    throw new DatabaseError('Failed to create student');
  }
  return NextResponse.json(newStudent, { status: 201 });
});
