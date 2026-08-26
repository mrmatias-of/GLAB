import 'server-only'

import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { pool } from '@/lib/db'
import type { RowDataPacket } from 'mysql2'

export type PlatformUser = { id: string; email: string; name: string }

type EnrollmentRow = RowDataPacket & {
  enrollmentId: string
  status: string
  grantedAt: Date
  slug: string
  title: string
  description: string | null
  coverUrl: string | null
  lessonCount: number
  completedCount: number
}

export async function currentPlatformUser(): Promise<PlatformUser | null> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.email) return null
  return { id: session.user.id, email: session.user.email.toLowerCase(), name: session.user.name || 'Aluno G-LAB' }
}

// TODO(temporário): sem a variável de ambiente GLAB_ADMIN_EMAILS configurada,
// caímos neste e-mail fixo para não deixar a área /admin totalmente
// inacessível. Configure GLAB_ADMIN_EMAILS no projeto e remova este
// fallback assim que possível — ele fica exposto no código-fonte.
const FALLBACK_ADMIN_EMAILS = ['admin@glabcursos.com.br']

export function isPlatformAdmin(email: string) {
  const configured = (process.env.GLAB_ADMIN_EMAILS ?? '')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)

  const admins = configured.length > 0 ? configured : FALLBACK_ADMIN_EMAILS
  return admins.includes(email.toLowerCase())
}

export async function studentEnrollments(email: string): Promise<EnrollmentRow[]> {
  const [rows] = await pool.execute<EnrollmentRow[]>(
    `SELECT e.id AS enrollmentId, e.status, e.granted_at AS grantedAt,
      p.slug, p.title, p.description, p.cover_url AS coverUrl,
      COUNT(DISTINCT l.id) AS lessonCount,
      COUNT(DISTINCT CASE WHEN lp.completed_at IS NOT NULL THEN lp.lesson_id END) AS completedCount
     FROM glab_enrollments e
     INNER JOIN glab_products p ON p.id = e.product_id
     LEFT JOIN glab_lessons l ON l.product_id = p.id AND l.is_active = 1
     LEFT JOIN glab_lesson_progress lp ON lp.enrollment_id = e.id AND lp.lesson_id = l.id
     WHERE e.student_email = ? AND e.status = 'ACTIVE'
     GROUP BY e.id, e.status, e.granted_at, p.slug, p.title, p.description, p.cover_url
     ORDER BY e.granted_at DESC`,
    [email],
  )
  return rows
}

export async function platformAdminSummary() {
  const [[summary]] = await pool.query<Array<RowDataPacket & { products: number; activeProducts: number; students: number; paidOrders: number }>>(
    `SELECT
      (SELECT COUNT(*) FROM glab_products) AS products,
      (SELECT COUNT(*) FROM glab_products WHERE is_active = 1) AS activeProducts,
      (SELECT COUNT(DISTINCT student_email) FROM glab_enrollments WHERE status = 'ACTIVE') AS students,
      (SELECT COUNT(*) FROM glab_orders WHERE status = 'PAID') AS paidOrders`,
  )
  return summary ?? { products: 0, activeProducts: 0, students: 0, paidOrders: 0 }
}

export async function platformProducts() {
  const [rows] = await pool.query<Array<RowDataPacket & { id: number; slug: string; title: string; priceCents: number; isActive: number; coverUrl: string | null; updatedAt: Date }>>(
    'SELECT id, slug, title, price_cents AS priceCents, is_active AS isActive, cover_url AS coverUrl, updated_at AS updatedAt FROM glab_products ORDER BY created_at DESC',
  )
  return rows
}

export type PlatformStudentRow = RowDataPacket & {
  email: string
  name: string | null
  createdAt: Date
  activeEnrollments: number
  totalOrders: number
  totalSpentCents: number
}

export async function platformStudents() {
  const [rows] = await pool.query<PlatformStudentRow[]>(
    `SELECT
      u.email AS email,
      u.name AS name,
      u.createdAt AS createdAt,
      (SELECT COUNT(*) FROM glab_enrollments e WHERE e.student_email = u.email AND e.status = 'ACTIVE') AS activeEnrollments,
      (SELECT COUNT(*) FROM glab_orders o WHERE o.buyer_email = u.email AND o.status = 'PAID') AS totalOrders,
      (SELECT COALESCE(SUM(o.amount_cents), 0) FROM glab_orders o WHERE o.buyer_email = u.email AND o.status = 'PAID') AS totalSpentCents
     FROM glab_auth_user u
     ORDER BY u.createdAt DESC`,
  )
  return rows
}

export type PlatformEnrollmentRow = RowDataPacket & {
  id: string
  status: string
  grantedAt: Date
  revokedAt: Date | null
  studentEmail: string
  studentName: string | null
  productTitle: string
  productSlug: string
}

export async function platformEnrollments() {
  const [rows] = await pool.query<PlatformEnrollmentRow[]>(
    `SELECT
      e.id AS id, e.status AS status, e.granted_at AS grantedAt, e.revoked_at AS revokedAt,
      e.student_email AS studentEmail, u.name AS studentName,
      p.title AS productTitle, p.slug AS productSlug
     FROM glab_enrollments e
     INNER JOIN glab_products p ON p.id = e.product_id
     LEFT JOIN glab_auth_user u ON u.email = e.student_email
     ORDER BY e.granted_at DESC
     LIMIT 200`,
  )
  return rows
}

export type PlatformOrderRow = RowDataPacket & {
  id: string
  buyerName: string
  buyerEmail: string
  amountCents: number
  currency: string
  status: string
  productTitle: string
  paidAt: Date | null
  createdAt: Date
}

export async function platformOrders() {
  const [rows] = await pool.query<PlatformOrderRow[]>(
    `SELECT
      o.id AS id, o.buyer_name AS buyerName, o.buyer_email AS buyerEmail,
      o.amount_cents AS amountCents, o.currency AS currency, o.status AS status,
      p.title AS productTitle, o.paid_at AS paidAt, o.created_at AS createdAt
     FROM glab_orders o
     INNER JOIN glab_products p ON p.id = o.product_id
     ORDER BY o.created_at DESC
     LIMIT 200`,
  )
  return rows
}

export async function platformSalesSummary() {
  const [[summary]] = await pool.query<Array<RowDataPacket & { revenueCents: number; paidOrders: number; pendingOrders: number; canceledOrders: number }>>(
    `SELECT
      (SELECT COALESCE(SUM(amount_cents), 0) FROM glab_orders WHERE status = 'PAID') AS revenueCents,
      (SELECT COUNT(*) FROM glab_orders WHERE status = 'PAID') AS paidOrders,
      (SELECT COUNT(*) FROM glab_orders WHERE status = 'PENDING') AS pendingOrders,
      (SELECT COUNT(*) FROM glab_orders WHERE status = 'CANCELED') AS canceledOrders`,
  )
  return summary ?? { revenueCents: 0, paidOrders: 0, pendingOrders: 0, canceledOrders: 0 }
}

export type PlatformCouponRow = RowDataPacket & {
  id: number
  code: string
  description: string | null
  discountType: string
  discountValue: number
  productId: number | null
  productTitle: string | null
  maxRedemptions: number | null
  redeemedCount: number
  isActive: number
  expiresAt: Date | null
  createdAt: Date
}

export async function platformCoupons() {
  const [rows] = await pool.query<PlatformCouponRow[]>(
    `SELECT
      c.id AS id, c.code AS code, c.description AS description,
      c.discount_type AS discountType, c.discount_value AS discountValue,
      c.product_id AS productId, p.title AS productTitle,
      c.max_redemptions AS maxRedemptions, c.redeemed_count AS redeemedCount,
      c.is_active AS isActive, c.expires_at AS expiresAt, c.created_at AS createdAt
     FROM glab_coupons c
     LEFT JOIN glab_products p ON p.id = c.product_id
     ORDER BY c.created_at DESC`,
  )
  return rows
}

export type CreateCouponInput = {
  code: string
  description?: string
  discountType: 'PERCENT' | 'FIXED'
  discountValue: number
  productId?: number | null
  maxRedemptions?: number | null
  expiresAt?: string | null
}

export async function createCoupon(input: CreateCouponInput) {
  const code = input.code.trim().toUpperCase()
  if (!code) throw new Error('Informe um código de cupom.')
  if (!Number.isFinite(input.discountValue) || input.discountValue <= 0) {
    throw new Error('Informe um valor de desconto válido.')
  }
  if (input.discountType === 'PERCENT' && input.discountValue > 100) {
    throw new Error('Desconto percentual não pode passar de 100%.')
  }

  try {
    await pool.execute(
      `INSERT INTO glab_coupons (code, description, discount_type, discount_value, product_id, max_redemptions, is_active, expires_at)
       VALUES (?, ?, ?, ?, ?, ?, 1, ?)`,
      [
        code,
        input.description?.trim() || null,
        input.discountType,
        Math.round(input.discountValue),
        input.productId ?? null,
        input.maxRedemptions ?? null,
        input.expiresAt || null,
      ],
    )
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ER_DUP_ENTRY') {
      throw new Error(`Já existe um cupom com o código "${code}".`)
    }
    throw error
  }
}

export async function setCouponActive(id: number, isActive: boolean) {
  await pool.execute('UPDATE glab_coupons SET is_active = ? WHERE id = ?', [isActive ? 1 : 0, id])
}
