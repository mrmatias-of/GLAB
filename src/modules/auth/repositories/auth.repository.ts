import { db } from '@/lib/db'
import { user, account, session } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { AppError } from '@/src/shared/errors/app.error'
import type { AuthUser } from '../types'

/**
 * Auth Repository - Handles user and session data access
 */
export class AuthRepository {
  async findUserByEmail(email: string, tenantId: string): Promise<AuthUser | null> {
    const result = await db
      .select()
      .from(user)
      .where(and(eq(user.email, email), eq(user.tenantId, tenantId)))
      .limit(1)

    return result[0] || null
  }

  async findUserById(id: string, tenantId: string): Promise<AuthUser | null> {
    const result = await db
      .select()
      .from(user)
      .where(and(eq(user.id, id), eq(user.tenantId, tenantId)))
      .limit(1)

    return result[0] || null
  }

  async createUser(data: {
    id: string
    email: string
    name: string
    tenantId: string
    emailVerified?: boolean
  }): Promise<AuthUser> {
    const result = await db
      .insert(user)
      .values({
        id: data.id,
        email: data.email,
        name: data.name,
        tenantId: data.tenantId,
        emailVerified: data.emailVerified || false,
      })
      .returning()

    if (!result.length) {
      throw new AppError('Failed to create user', 'CREATE_USER_FAILED', 500)
    }

    return result[0]
  }

  async updateUser(
    id: string,
    tenantId: string,
    data: Partial<{
      email: string
      name: string
      image: string
      emailVerified: boolean
    }>
  ): Promise<AuthUser> {
    const result = await db
      .update(user)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(and(eq(user.id, id), eq(user.tenantId, tenantId)))
      .returning()

    if (!result.length) {
      throw new AppError('User not found', 'USER_NOT_FOUND', 404)
    }

    return result[0]
  }

  async createAccount(data: {
    id: string
    userId: string
    tenantId: string
    providerId: string
    accountId: string
    password?: string
    accessToken?: string
    refreshToken?: string
  }): Promise<void> {
    await db.insert(account).values({
      id: data.id,
      userId: data.userId,
      tenantId: data.tenantId,
      providerId: data.providerId,
      accountId: data.accountId,
      password: data.password,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    })
  }

  async findSession(token: string, tenantId: string): Promise<any> {
    const result = await db
      .select()
      .from(session)
      .where(and(eq(session.token, token), eq(session.tenantId, tenantId)))
      .limit(1)

    return result[0] || null
  }

  async createSession(data: {
    id: string
    token: string
    userId: string
    tenantId: string
    expiresAt: Date
    ipAddress?: string
    userAgent?: string
  }): Promise<void> {
    await db.insert(session).values({
      id: data.id,
      token: data.token,
      userId: data.userId,
      tenantId: data.tenantId,
      expiresAt: data.expiresAt,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
    })
  }

  async invalidateSession(token: string, tenantId: string): Promise<void> {
    await db
      .delete(session)
      .where(and(eq(session.token, token), eq(session.tenantId, tenantId)))
  }
}
