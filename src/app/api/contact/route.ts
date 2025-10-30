
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withErrorHandler, DatabaseError } from '@/lib/errorHandler';
import { z } from 'zod';



const messageSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    message: z.string().min(1, { message: "Message is required" }),
  });

export const GET = withErrorHandler(async () => {
  const messages = await prisma.message.findMany();
  if (!messages) {
    throw new DatabaseError('Failed to fetch messages');
  }
  return NextResponse.json(messages);
});

export const POST = withErrorHandler(async (req: Request) => {
  const json = await req.json();
  const { name, email, message } = messageSchema.parse(json);
  const newMessage = await prisma.message.create({
    data: {
      name,
      email,
      message,
    },
  });
  if (!newMessage) {
    throw new DatabaseError('Failed to create message');
  }
  return NextResponse.json(newMessage, { status: 201 });
});
