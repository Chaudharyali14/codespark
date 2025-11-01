import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import cloudinary from '@/lib/cloudinary';

async function uploadFile(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const mime = file.type;
  const encoding = 'base64';
  const base64Data = buffer.toString('base64');
  const fileUri = 'data:' + mime + ';' + encoding + ',' + base64Data;

  const result = await cloudinary.uploader.upload(fileUri, {
    folder: 'codespark',
    resource_type: file.type.startsWith('video') ? 'video' : 'image',
  });
  return result.secure_url;
}

export async function GET(req: NextRequest, { params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = await paramsPromise;
  const { id } = params;
  const project = await prisma.project.findUnique({
    where: { id: parseInt(id) },
    include: { media: true },
  });
  return NextResponse.json(project);
}

export async function PUT(req: NextRequest, { params: paramsPromise }: { params: Promise<{ id: string }> }) {
  try {
    const params = await paramsPromise;
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

    // Delete existing media
    await prisma.media.deleteMany({
      where: { projectId: parseInt(id) },
    });

    // Save new images
    const imageUrls: string[] = [];
    for (const imageFile of imageFiles) {
      if (imageFile.size > 0) {
        const imageUrl = await uploadFile(imageFile);
        imageUrls.push(imageUrl);
      }
    }

    // Save video if provided
    let videoUrl = '';
    if (videoFile && videoFile.size > 0) {
      videoUrl = await uploadFile(videoFile);
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

export async function DELETE(req: NextRequest, { params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = await paramsPromise;
  const { id } = params;
  await prisma.media.deleteMany({
    where: { projectId: parseInt(id) },
  });
  await prisma.project.delete({
    where: { id: parseInt(id) },
  });
  return NextResponse.json({ message: 'Project deleted successfully' });
}