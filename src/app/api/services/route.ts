// src/app/api/services/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withErrorHandler, DatabaseError } from '@/lib/errorHandler';
import { z } from 'zod';

const serviceSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    });

// Handles GET requests to /api/services
export const GET = withErrorHandler(async () => {
    const services = await prisma.service.findMany();
    if (!services) {
        throw new DatabaseError('Failed to fetch services');
    }
    return NextResponse.json(services);
});

// Handles POST requests to /api/services
export const POST = withErrorHandler(async (req: Request) => {
    const json = await req.json();
    const { title, description } = serviceSchema.parse(json);
    const newService = await prisma.service.create({
        data: {
            title,
            description,
        },
    });
    if (!newService) {
        throw new DatabaseError('Failed to create service');
    }
    return NextResponse.json(newService, { status: 201 });
});
