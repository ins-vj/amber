import { Prisma, PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate'
import { withOptimize } from "@prisma/extension-optimize";

// const prisma = new PrismaClient();

const createPrismaClient = () => {
  const client = new PrismaClient();
  client.$extends(withOptimize({ apiKey: process.env.OPTIMIZE_API_KEY })).$extends(withAccelerate());
  return client;
};

// Ensure only one Prisma client instance is used in development mode
const globalForPrisma = global;
/**
 * @type {import('@prisma/client').PrismaClient}
 */
const amber = globalForPrisma.prisma ?? createPrismaClient();
  
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = amber;
  

const connectDB = async () => {
  try {
    await amber.$connect();
    console.log(`\n PostgreSQL connected successfully!`);
  } catch (error) {
    console.error('PostgreSQL connection FAILED', error);
    process.exit(1);
  }
};

export { amber, connectDB };
