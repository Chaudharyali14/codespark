
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const testimonial = await prisma.testimonial.findUnique({
    where: { id: parseInt(params.id) },
  });
  return NextResponse.json(testimonial);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { quote, author, role } = await req.json();
  const testimonial = await prisma.testimonial.update({
    where: { id: parseInt(params.id) },
    data: {
      quote,
      author,
      role,
    },
  });
  return NextResponse.json(testimonial);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.testimonial.delete({
    where: { id: parseInt(params.id) },
  });
  return new Response(null, { status: 204 });
}
