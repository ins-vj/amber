import { Prisma, PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate'
import { withOptimize } from "@prisma/extension-optimize";

// const prisma = new PrismaClient();

const createPrismaClient = () => {
  const client = new PrismaClient();
  const clientWithExtensions=client.$extends(withOptimize({ apiKey: process.env.OPTIMIZE_API_KEY })).$extends(withAccelerate());
  const extensions = clientWithExtensions.$options?.extensions;
  console.log("Prisma client extensions status:", {
    hasExtensions: Boolean(extensions),
    extensionsConfig: extensions,
    optimizeApiKey: process.env.OPTIMIZE_API_KEY ? 'Present' : 'Missing'
  });
  return clientWithExtensions;
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
    console.log('Connected client configuration:', {
      hasExtensions: Boolean(amber.$options?.extensions),
      extensionDetails: amber.$options?.extensions,
      databaseUrl: Boolean(process.env.DATABASE_URL),
    });
    
    // Test query to verify optimize is working
    const testQuery = await amber.$queryRaw`SELECT 1 as test`;
    console.log('Test query successful:', testQuery);
  } catch (error) {
    console.error('PostgreSQL connection FAILED', error);
    process.exit(1);
  }
};

export { amber, connectDB };
