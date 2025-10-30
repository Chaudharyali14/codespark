import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminUsername || !adminPassword) {
    console.warn('ADMIN_USERNAME and ADMIN_PASSWORD environment variables are not set. Skipping admin user creation.');
    return;
  }

  const existingAdmin = await prisma.admin.findUnique({
    where: { username: adminUsername },
  });

  if (existingAdmin) {
    console.log(`Admin user '${adminUsername}' already exists. Skipping creation.`);
    return;
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10); // Hash with salt rounds = 10

  await prisma.admin.create({
    data: {
      username: adminUsername,
      password: hashedPassword,
    },
  });

  console.log(`Admin user '${adminUsername}' created successfully.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
