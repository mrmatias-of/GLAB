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

export function isPlatformAdmin(email: string) {
  return (process.env.GLAB_ADMIN_EMAILS ?? '')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)
    .includes(email.toLowerCase())
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
