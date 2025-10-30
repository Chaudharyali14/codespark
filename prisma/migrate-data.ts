// prisma/migrate-data.ts
import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const dataFilePath = path.join(process.cwd(), 'data.json');

async function main() {
  try {
    // Read data from data.json
    const data = await fs.readFile(dataFilePath, 'utf-8');
    const { logoUrl, hero } = JSON.parse(data);

    // Check if there are any existing settings
    const existingSettings = await prisma.siteSettings.findFirst();

    if (existingSettings) {
      // Update existing settings
      await prisma.siteSettings.update({
        where: { id: existingSettings.id },
        data: {
          logo: logoUrl,
          heroTitle: hero.title,
          heroSubtitle: hero.subtitle,
          heroImage1: hero.mainImage,
          heroImage2: hero.secondImage,
        },
      });
      console.log('Successfully updated site settings.');
    } else {
      // Create new settings
      await prisma.siteSettings.create({
        data: {
          logo: logoUrl,
          heroTitle: hero.title,
          heroSubtitle: hero.subtitle,
          heroImage1: hero.mainImage,
          heroImage2: hero.secondImage,
        },
      });
      console.log('Successfully created site settings.');
    }
  } catch (error) {
    console.error('Failed to migrate data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
