import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

const uploadDir = path.join(process.cwd(), 'public', 'uploads');

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const project = await prisma.project.findUnique({
    where: { id: parseInt(id) },
    include: { media: true },
  });
  return NextResponse.json(project);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const formData = await req.formData();

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const mainImageIndex = parseInt(formData.get('mainImage') as string) || 0;

    // Get all image files
    const imageFiles: File[] = [];
    for (const [key, value] of formData.entries()) {
      if (key === 'images' && value instanceof File) {
        imageFiles.push(value);
      }
    }

    const videoFile = formData.get('video') as File;

    // Ensure upload directory exists
    try {
      await fs.mkdir(uploadDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create upload directory:', error);
    }

    // Delete existing media
    await prisma.media.deleteMany({
      where: { projectId: parseInt(id) },
    });

    // Save new images
    const imageUrls: string[] = [];
    for (const imageFile of imageFiles) {
      if (imageFile.size > 0) {
        const fileName = `${Date.now()}-${imageFile.name}`;
        const filePath = path.join(uploadDir, fileName);
        const buffer = await imageFile.arrayBuffer();
        await fs.writeFile(filePath, Buffer.from(buffer));
        imageUrls.push(`/uploads/${fileName}`);
      }
    }

    // Save video if provided
    let videoUrl = '';
    if (videoFile && videoFile.size > 0) {
      const fileName = `${Date.now()}-${videoFile.name}`;
      const filePath = path.join(uploadDir, fileName);
      const buffer = await videoFile.arrayBuffer();
      await fs.writeFile(filePath, Buffer.from(buffer));
      videoUrl = `/uploads/${fileName}`;
    }

    // Create media records
    for (const imageUrl of imageUrls) {
      await prisma.media.create({
        data: {
          type: 'IMAGE',
          url: imageUrl,
          projectId: parseInt(id),
        },
      });
    }

    if (videoUrl) {
      await prisma.media.create({
        data: {
          type: 'VIDEO',
          url: videoUrl,
          projectId: parseInt(id),
        },
      });
    }

    // Update project
    const mainImageUrl = imageUrls[mainImageIndex] || imageUrls[0] || '';

    const updatedProject = await prisma.project.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        mainImage: mainImageUrl,
        video: videoUrl,
      },
    });

    return NextResponse.json({ success: true, project: updatedProject });
  } catch (error) {
    console.error('Failed to update project:', error);
    return NextResponse.json({ success: false, error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  await prisma.media.deleteMany({
    where: { projectId: parseInt(id) },
  });
  await prisma.project.delete({
    where: { id: parseInt(id) },
  });
  return NextResponse.json({ message: 'Project deleted successfully' });
}
