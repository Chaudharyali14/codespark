// src/app/api/logo/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withErrorHandler, NotFoundError } from '@/lib/errorHandler';

export const GET = withErrorHandler(async () => {
  const siteSettings = await prisma.siteSettings.findFirst();
  if (!siteSettings) {
    throw new NotFoundError('No site settings found.');
  }
  return NextResponse.json({ logoUrl: siteSettings.logo });
});
