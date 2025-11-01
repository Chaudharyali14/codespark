// src/app/api/hero/upload/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import cloudinary from '@/lib/cloudinary';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('image') as File;
    const imageType = formData.get('imageType') as string;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    if (!imageType || (imageType !== 'main' && imageType !== 'second')) {
      return NextResponse.json({ success: false, error: 'Invalid image type' }, { status: 400 });
    }

    const fileBuffer = await file.arrayBuffer();
    const mime = file.type;
    const encoding = 'base64';
    const base64Data = Buffer.from(fileBuffer).toString('base64');
    const fileUri = 'data:' + mime + ';' + encoding + ',' + base64Data;

    const result = await cloudinary.uploader.upload(fileUri, {
      folder: 'codespark',
    });

    const imageUrl = result.secure_url;

    const siteSettings = await prisma.siteSettings.findFirst();
    const data = imageType === 'main' ? { heroImage1: imageUrl } : { heroImage2: imageUrl };

    if (siteSettings) {
      await prisma.siteSettings.update({
        where: { id: siteSettings.id },
        data,
      });
    } else {
      await prisma.siteSettings.create({
        data: {
          logo: '',
          heroTitle: '',
          heroSubtitle: '',
          ...data,
        },
      });
    }

    return NextResponse.json({ success: true, filePath: imageUrl });
  } catch (error) {
    console.error('Failed to upload image:', error);
    return NextResponse.json({ success: false, error: 'Failed to upload image' }, { status: 500 });
  }
}
