import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const vision = await prisma.vision.findUnique({
      where: { id },
    });

    if (!vision) {
      return NextResponse.json({ error: 'Vision not found' }, { status: 404 });
    }

    return NextResponse.json(vision);
  } catch (error) {
    console.error('Error fetching vision:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const { title, description } = await req.json();

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    const updatedVision = await prisma.vision.update({
      where: { id },
      data: { title, description },
    });

    return NextResponse.json(updatedVision);
  } catch (error) {
    console.error('Error updating vision:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);

    await prisma.vision.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting vision:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
