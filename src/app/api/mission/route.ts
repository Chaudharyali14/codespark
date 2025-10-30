import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withErrorHandler, DatabaseError } from '@/lib/errorHandler';
import { z } from 'zod';

const missionSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    });

export const GET = withErrorHandler(async () => {
    const missions = await prisma.mission.findMany({
        orderBy: { createdAt: 'desc' },
    });
    if (!missions) {
        throw new DatabaseError('Failed to fetch missions');
    }
    return NextResponse.json(missions);
});

export const POST = withErrorHandler(async (req: Request) => {
    const json = await req.json();
    const { title, description } = missionSchema.parse(json);
    const mission = await prisma.mission.create({
        data: { title, description },
    });
    if (!mission) {
        throw new DatabaseError('Failed to create mission');
    }
    return NextResponse.json(mission, { status: 201 });
});
