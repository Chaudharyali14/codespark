import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { withErrorHandler, ValidationError } from '@/lib/errorHandler';

export const POST = withErrorHandler(async (req: NextRequest) => {
    const formData = await req.formData();
    const image1 = formData.get('image1') as File;
    const image2 = formData.get('image2') as File;

    if (!image1 || !image2) {
        throw new ValidationError([], 'Missing image files');
    }

    const bytes1 = await image1.arrayBuffer();
    const buffer1 = Buffer.from(bytes1);
    const bytes2 = await image2.arrayBuffer();
    const buffer2 = Buffer.from(bytes2);

    const publicDir = join(process.cwd(), 'public');
    const path1 = join(publicDir, 'hero-default.png');
    const path2 = join(publicDir, 'hero-hover.png');

    await writeFile(path1, buffer1);
    await writeFile(path2, buffer2);

    return NextResponse.json({ message: 'Images uploaded successfully' });
});
