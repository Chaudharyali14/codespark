// src/app/api/hero/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withErrorHandler, NotFoundError, DatabaseError } from '@/lib/errorHandler';

export const GET = withErrorHandler(async () => {
  const siteSettings = await prisma.siteSettings.findFirst();
  if (!siteSettings) {
    throw new NotFoundError('No site settings found.');
  }
  const { heroTitle, heroSubtitle, heroImage1, heroImage2 } = siteSettings;
  return NextResponse.json({ title: heroTitle, subtitle: heroSubtitle, mainImage: heroImage1, secondImage: heroImage2 });
});
