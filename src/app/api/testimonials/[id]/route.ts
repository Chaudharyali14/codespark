import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest, { params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = await paramsPromise;
  const testimonial = await prisma.testimonial.findUnique({
    where: { id: parseInt(params.id) },
  });
  return NextResponse.json(testimonial);
}

export async function PUT(req: NextRequest, { params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = await paramsPromise;
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

export async function DELETE(req: NextRequest, { params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = await paramsPromise;
  await prisma.testimonial.delete({
    where: { id: parseInt(params.id) },
  });
  return new Response(null, { status: 204 });
}
