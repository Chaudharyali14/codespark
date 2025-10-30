// src/app/api/hero/update/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { title, subtitle } = await req.json();

    // Find the first record and update it, or create a new one if it doesn't exist
    const siteSettings = await prisma.siteSettings.findFirst();
    if (siteSettings) {
      await prisma.siteSettings.update({
        where: { id: siteSettings.id },
        data: { heroTitle: title, heroSubtitle: subtitle },
      });
    } else {
      await prisma.siteSettings.create({
        data: { 
          logo: '', // default or empty
          heroTitle: title, 
          heroSubtitle: subtitle, 
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update hero data:', error);
    return NextResponse.json({ success: false, error: 'Failed to update hero data' });
  }
}
