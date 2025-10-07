// src/app/api/logo/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { writeFile } from 'fs/promises';

const dataFilePath = path.join(process.cwd(), 'data.json');
const SECRET_TOKEN = 'my-secret-token'; // This should be in an environment variable

export async function POST(request: NextRequest) {
  const authToken = request.headers.get('Authorization')?.split(' ')[1];

  if (authToken !== SECRET_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('logo') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save the file to the public/images directory
    const logoPath = `/images/${file.name}`;
    const filePath = path.join(process.cwd(), 'public', logoPath);
    await writeFile(filePath, buffer);

    // Update the data.json file
    const data = await fs.readFile(dataFilePath, 'utf-8');
    const jsonData = JSON.parse(data);
    jsonData.logoUrl = logoPath;
    await fs.writeFile(dataFilePath, JSON.stringify(jsonData, null, 2));

    return NextResponse.json({ success: true, logoUrl: logoPath });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
