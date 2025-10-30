import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params; // ✅ await params (Next.js 15+)
    const missionId = parseInt(id, 10);
    const { title, description } = await request.json();

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }

    const updatedMission = await prisma.mission.update({
      where: { id: missionId },
      data: { title, description },
    });

    return NextResponse.json(updatedMission);
  } catch (error) {
    console.error('Error updating mission:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params; // ✅ await params
    const missionId = parseInt(id, 10);

    await prisma.mission.delete({
      where: { id: missionId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting mission:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
