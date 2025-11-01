import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import cloudinary from '@/lib/cloudinary';
import { withErrorHandler, DatabaseError, ValidationError } from '@/lib/errorHandler';
import { z } from 'zod';

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

const projectSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().min(1, { message: "Description is required" }),
  });

export const POST = withErrorHandler(async (req: NextRequest) => {
  const formData = await req.formData();

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const mainImageIndex = parseInt(formData.get('mainImage') as string);
  const images = formData.getAll('images') as File[];
  const video = formData.get('video') as File | null;

  projectSchema.parse({ title, description });

  const project = await prisma.project.create({
    data: {
      title,
      description,
    },
  });

  if (!project) {
    throw new DatabaseError('Failed to create project');
  }

  const imagePaths = await Promise.all(images.map(uploadFile));
  const videoPath = video ? await uploadFile(video) : '';

  for (const imagePath of imagePaths) {
    await prisma.media.create({
      data: {
        type: 'IMAGE',
        url: imagePath,
        projectId: project.id,
      },
    });
  }

  if (videoPath) {
    await prisma.media.create({
      data: {
        type: 'VIDEO',
        url: videoPath,
        projectId: project.id,
      },
    });
  }

  const mainImagePath = imagePaths[mainImageIndex];

  const updatedProject = await prisma.project.update({
    where: { id: project.id },
    data: {
      mainImage: mainImagePath,
    },
  });

  return NextResponse.json(updatedProject);
});

export const GET = withErrorHandler(async () => {
  const projects = await prisma.project.findMany({ include: { media: true } });
  if (!projects) {
    throw new DatabaseError('Failed to fetch projects');
  }
  return NextResponse.json(projects);
});
