// src/app/api/hero/upload/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import fs from 'fs/promises';
import path from 'path';

const publicFolderPath = path.join(process.cwd(), 'public');

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

    const fileExtension = path.extname(file.name);
    const newFileName = `${imageType}Image${fileExtension}`;
    const imagesDir = path.join(publicFolderPath, 'images');
    const filePath = path.join(imagesDir, newFileName);

    // Ensure the images directory exists
    try {
      await fs.mkdir(imagesDir, { recursive: true });
    } catch (mkdirError) {
      console.error('Failed to create images directory:', mkdirError);
      return NextResponse.json({ success: false, error: 'Failed to create upload directory' }, { status: 500 });
    }

    const fileBuffer = await file.arrayBuffer();
    await fs.writeFile(filePath, Buffer.from(fileBuffer));

    const imageUrl = `/images/${newFileName}`;

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
