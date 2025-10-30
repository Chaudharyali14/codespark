import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import * as bcrypt from 'bcrypt';
import { withErrorHandler, ApiError } from '@/lib/errorHandler';

export const POST = withErrorHandler(async (req: NextRequest) => {
  const { email, password } = await req.json();

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  const adminUser = await prisma.admin.findUnique({
    where: { username: email },
  });

  if (!adminUser) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const passwordMatch = await bcrypt.compare(password, adminUser.password);

  if (!passwordMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // In a real application, you would generate a JWT token here
  // For now, we'll just return a success message
  return NextResponse.json({ message: 'Login successful', user: { username: adminUser.username } });
});
