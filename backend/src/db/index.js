import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log(`\n PostgreSQL connected successfully!`);
  } catch (error) {
    console.error('PostgreSQL connection FAILED', error);
    process.exit(1);
  }
};

export { prisma, connectDB };
