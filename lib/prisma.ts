import {PrismaClient} from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

/** The application's shared Prisma database client. */
export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        log: ["query"],
    });

if (process.env.NODE_ENV != "production") globalForPrisma.prisma;
