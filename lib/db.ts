import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

console.log('[v0] Initializing Prisma Client')
console.log('[v0] NODE_ENV:', process.env.NODE_ENV)
console.log('[v0] DATABASE_URL defined:', !!process.env.DATABASE_URL)

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Test connection on startup (only in production)
if (process.env.NODE_ENV === 'production') {
  prisma.$queryRaw`SELECT 1`.catch((error) => {
    console.error('[v0] CRITICAL: Prisma connection test failed on startup:', error)
  })
}

// Query functions for courses
export async function getCursos() {
  return prisma.curso.findMany({
    orderBy: [{ trilha_id: 'asc' }, { posicao: 'asc' }],
  })
}

export async function getTrilhas() {
  return prisma.trilha.findMany({
    orderBy: { nome: 'asc' },
  })
}

export async function getCursosByTrilha(trilhaId: number) {
  return prisma.curso.findMany({
    where: { trilha_id: trilhaId },
    orderBy: { posicao: 'asc' },
  })
}
