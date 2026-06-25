import { hash, compare } from 'bcryptjs'
import { sign, verify } from 'jsonwebtoken'
import { prisma } from '@/lib/db'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production'
const JWT_EXPIRATION = '7d'

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return compare(password, hash)
}

export function createJWT(userId: string): string {
  return sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRATION })
}

export function verifyJWT(token: string): { userId: string } | null {
  try {
    const decoded = verify(token, JWT_SECRET) as { userId: string; iat: number; exp: number }
    return { userId: decoded.userId }
  } catch (error) {
    return null
  }
}

export async function createSession(userId: string): Promise<string> {
  const token = createJWT(userId)
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 dias

  await prisma.session.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  })

  return token
}

export async function verifySession(token: string) {
  const session = await prisma.session.findUnique({
    where: { token },
  })

  if (!session || session.expiresAt < new Date()) {
    if (session) {
      await prisma.session.delete({
        where: { id: session.id },
      })
    }
    return null
  }

  const jwtVerified = verifyJWT(token)
  if (!jwtVerified) return null

  return session.userId
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  })

  if (!user) {
    throw new Error('Email ou senha incorretos')
  }

  const passwordValid = await verifyPassword(password, user.password)
  if (!passwordValid) {
    throw new Error('Email ou senha incorretos')
  }

  const token = await createSession(user.id)

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      is_admin: user.is_admin,
      is_vendedor: user.is_vendedor,
    },
  }
}

export async function register(email: string, password: string, name?: string) {
  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  })

  if (existingUser) {
    throw new Error('Email já cadastrado')
  }

  const hashedPassword = await hashPassword(password)

  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
    },
  })

  const token = await createSession(user.id)

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      is_admin: user.is_admin,
      is_vendedor: user.is_vendedor,
    },
  }
}

export async function logout(token: string) {
  await prisma.session.deleteMany({
    where: { token },
  })
}
