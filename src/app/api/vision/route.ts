import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withErrorHandler, DatabaseError } from '@/lib/errorHandler';
import { z } from 'zod';

const visionSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    });

export const GET = withErrorHandler(async () => {
    const visions = await prisma.vision.findMany({
        orderBy: { createdAt: 'desc' },
    });
    if (!visions) {
        throw new DatabaseError('Failed to fetch visions');
    }
    return NextResponse.json(visions);
});

export const POST = withErrorHandler(async (req: Request) => {
    const json = await req.json();
    const { title, description } = visionSchema.parse(json);
    const vision = await prisma.vision.create({
        data: { title, description },
    });
    if (!vision) {
        throw new DatabaseError('Failed to create vision');
    }
    return NextResponse.json(vision, { status: 201 });
});
