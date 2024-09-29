import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
await prisma.$queryRaw`PRAGMA journal_mode=WAL`;
await prisma.$queryRaw`PRAGMA synchronous=NORMAL`;

export default prisma;