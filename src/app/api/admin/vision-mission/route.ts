
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withErrorHandler, DatabaseError } from '@/lib/errorHandler';
import { z } from 'zod';

const visionSchema = z.object({
    title: z.string(),
    description: z.string(),
  });

  const missionSchema = z.object({
    title: z.string(),
    description: z.string(),
  });

const visionMissionSchema = z.object({
  vision: visionSchema,
  mission: missionSchema,
});

export const GET = withErrorHandler(async () => {
  const vision = await prisma.vision.findFirst();
  const mission = await prisma.mission.findFirst();

  if (!vision || !mission) {
    throw new DatabaseError('Failed to fetch vision and mission');
  }

  return NextResponse.json({ vision, mission });
});

export const POST = withErrorHandler(async (req: Request) => {
  const json = await req.json();
  const { vision, mission } = visionMissionSchema.parse(json);

  const existingVision = await prisma.vision.findFirst();
  if (existingVision) {
    await prisma.vision.update({
      where: { id: existingVision.id },
      data: vision,
    });
  } else {
    await prisma.vision.create({ data: vision });
  }

  const existingMission = await prisma.mission.findFirst();
  if (existingMission) {
    await prisma.mission.update({
      where: { id: existingMission.id },
      data: mission,
    });
  } else {
    await prisma.mission.create({ data: mission });
  }

  return new NextResponse('OK', { status: 200 });
});
