// src/app/api/logo/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data.json');

export async function GET() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf-8');
    const { logoUrl } = JSON.parse(data);
    return NextResponse.json({ logoUrl });
  } catch (error) {
    // If data.json doesn't exist or there's an error, return a default logo
    return NextResponse.json({ logoUrl: '/logo.png' });
  }
}
