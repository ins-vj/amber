import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

const prismaClientSingleton = () => {
    return new PrismaClient();
  };
  
  // Ensure only one Prisma client instance is used in development mode
  const globalForPrisma = global;
  
  const prisma = globalForPrisma.prisma ?? prismaClientSingleton();
  
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
  

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
