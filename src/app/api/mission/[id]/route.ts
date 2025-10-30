import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const { title, description } = await req.json();

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    const updatedMission = await prisma.mission.update({
      where: { id },
      data: { title, description },
    });

    return NextResponse.json(updatedMission);
  } catch (error) {
    console.error('Error updating mission:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);

    await prisma.mission.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting mission:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
