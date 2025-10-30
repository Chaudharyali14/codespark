// src/app/api/logo/upload/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import fs from 'fs/promises';
import path from 'path';

const publicFolderPath = path.join(process.cwd(), 'public');

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('logo') as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' });
    }

    const fileExtension = path.extname(file.name);
    const newFileName = `logo${fileExtension}`;
    const filePath = path.join(publicFolderPath, 'images', newFileName);

    const fileBuffer = await file.arrayBuffer();
    await fs.writeFile(filePath, Buffer.from(fileBuffer));

    const imageUrl = `/images/${newFileName}`;

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