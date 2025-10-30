
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withErrorHandler, DatabaseError } from '@/lib/errorHandler';
import { z } from 'zod';

const testimonialSchema = z.object({
    quote: z.string().min(1, { message: "Quote is required" }),
    author: z.string().min(1, { message: "Author is required" }),
    role: z.string().min(1, { message: "Role is required" }),
    });

export const GET = withErrorHandler(async () => {
    const testimonials = await prisma.testimonial.findMany();
    if (!testimonials) {
        throw new DatabaseError('Failed to fetch testimonials');
    }
    return NextResponse.json(testimonials);
});

export const POST = withErrorHandler(async (req: NextRequest) => {
    const json = await req.json();
    const { quote, author, role } = testimonialSchema.parse(json);
    const testimonial = await prisma.testimonial.create({
        data: {
            quote,
            author,
            role,
        },
    });
    if (!testimonial) {
        throw new DatabaseError('Failed to create testimonial');
    }
    return NextResponse.json(testimonial);
});
