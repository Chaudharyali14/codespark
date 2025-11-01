// src/app/api/logo/upload/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('logo') as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' });
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

    if (siteSettings) {
      await prisma.siteSettings.update({
        where: { id: siteSettings.id },
        data: { logo: imageUrl },
      });
    } else {
      await prisma.siteSettings.create({
        data: {
          logo: imageUrl,
          heroTitle: '', // default or empty
          heroSubtitle: '',
        },
      });
    }

    return NextResponse.json({ success: true, filePath: imageUrl });
  } catch (error) {
    console.error('Failed to upload logo:', error);
    return NextResponse.json({ success: false, error: 'Failed to upload logo' });
  }
}