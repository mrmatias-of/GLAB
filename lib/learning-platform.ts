import 'server-only'

import { randomUUID } from 'node:crypto'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { pool } from '@/lib/db'
import type { RowDataPacket } from 'mysql2'
import { sendPurchaseApprovedEmail } from '@/lib/email'

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

export type StudentCourse = RowDataPacket & {
  id: number
  slug: string
  title: string
  description: string | null
  coverUrl: string | null
  enrollmentId: string
}

/** Curso + matrícula ativa do aluno, usado tanto na página do curso quanto no player de aula. */
export async function courseForStudent(slug: string, email: string): Promise<StudentCourse | null> {
  const [[row]] = await pool.execute<StudentCourse[]>(
    `SELECT p.id, p.slug, p.title, p.description, p.cover_url AS coverUrl, e.id AS enrollmentId
     FROM glab_enrollments e INNER JOIN glab_products p ON p.id = e.product_id
     WHERE p.slug = ? AND e.student_email = ? AND e.status = 'ACTIVE' LIMIT 1`,
    [slug, email],
  )
  return row ?? null
}

export type StudentLessonRow = RowDataPacket & {
  id: number
  position: number
  title: string
  lessonType: string
  contentUrl: string | null
  isPreview: number
  completedAt: Date | null
}

export async function lessonsWithProgress(productId: number, enrollmentId: string): Promise<StudentLessonRow[]> {
  const [rows] = await pool.execute<StudentLessonRow[]>(
    `SELECT l.id, l.position, l.title, l.lesson_type AS lessonType, l.content_url AS contentUrl, l.is_preview AS isPreview, lp.completed_at AS completedAt
     FROM glab_lessons l LEFT JOIN glab_lesson_progress lp ON lp.lesson_id = l.id AND lp.enrollment_id = ?
     WHERE l.product_id = ? AND l.is_active = 1 ORDER BY l.position`,
    [enrollmentId, productId],
  )
  return rows
}

export async function markLessonComplete(enrollmentId: string, lessonId: number) {
  await pool.execute(
    `INSERT INTO glab_lesson_progress (enrollment_id, lesson_id, completed_at, last_opened_at)
     VALUES (?, ?, NOW(), NOW())
     ON DUPLICATE KEY UPDATE completed_at = NOW(), last_opened_at = NOW()`,
    [enrollmentId, lessonId],
  )
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

export type CheckoutProduct = RowDataPacket & {
  id: number
  slug: string
  title: string
  description: string | null
  priceCents: number
  compareAtCents: number | null
  currency: string
  isActive: number
}

export async function productBySlug(slug: string): Promise<CheckoutProduct | null> {
  const [[row]] = await pool.execute<CheckoutProduct[]>(
    `SELECT id, slug, title, description, price_cents AS priceCents, compare_at_cents AS compareAtCents, currency, is_active AS isActive
     FROM glab_products WHERE slug = ? AND is_active = 1 LIMIT 1`,
    [slug],
  )
  return row ?? null
}

export type PendingOrder = {
  id: string
  productId: number
  productTitle: string
  buyerName: string
  buyerEmail: string
  amountCents: number
  referenceId: string
}

export async function createPendingOrder(input: {
  productSlug: string
  buyerName: string
  buyerEmail: string
  couponCode?: string
}) {
  const product = await productBySlug(input.productSlug)
  if (!product) throw new Error('Curso não encontrado ou indisponível.')
  const buyerName = input.buyerName.trim().replace(/\\s+/g, ' ')
  const buyerEmail = input.buyerEmail.trim().toLowerCase()
  if (buyerName.length < 3 || buyerName.length > 160) throw new Error('Informe seu nome completo.')
  if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(buyerEmail)) throw new Error('Informe um e-mail válido.')

  let amountCents = product.priceCents
  let couponId: number | null = null
  if (input.couponCode?.trim()) {
    const [[coupon]] = await pool.execute<Array<RowDataPacket & { id: number; discountType: string; discountValue: number; productId: number | null; maxRedemptions: number | null; redeemedCount: number; expiresAt: Date | null }>>(
      `SELECT id, discount_type AS discountType, discount_value AS discountValue, product_id AS productId,
       max_redemptions AS maxRedemptions, redeemed_count AS redeemedCount, expires_at AS expiresAt
       FROM glab_coupons WHERE code = ? AND is_active = 1 LIMIT 1`,
      [input.couponCode.trim().toUpperCase()],
    )
    if (!coupon || (coupon.productId !== null && coupon.productId !== product.id) || (coupon.expiresAt && new Date(coupon.expiresAt).getTime() <= Date.now()) || (coupon.maxRedemptions !== null && coupon.redeemedCount >= coupon.maxRedemptions)) {
      throw new Error('Cupom inválido, expirado ou indisponível para este curso.')
    }
    amountCents = coupon.discountType === 'PERCENT'
      ? Math.max(0, Math.round(product.priceCents * (1 - Math.min(100, coupon.discountValue) / 100)))
      : Math.max(0, product.priceCents - Math.round(coupon.discountValue * 100))
    couponId = coupon.id
  }
  if (amountCents < 100) throw new Error('O valor final precisa ser de pelo menos R$ 1,00.')
  const id = randomUUID()
  const referenceId = `GLAB-${id.replaceAll('-', '').slice(0, 24).toUpperCase()}`
  await pool.execute(
    `INSERT INTO glab_orders (id, product_id, reference_id, buyer_name, buyer_email, amount_cents, currency, status)
     VALUES (?, ?, ?, ?, ?, ?, 'BRL', 'PENDING')`,
    [id, product.id, referenceId, buyerName, buyerEmail, amountCents],
  )
  return { id, productId: product.id, productTitle: product.title, buyerName, buyerEmail, amountCents, referenceId, couponId }
}

export async function orderById(id: string) {
  const [[row]] = await pool.execute<Array<RowDataPacket & { id: string; productId: number; productTitle: string; buyerName: string; buyerEmail: string; amountCents: number; status: string; pagbankOrderId: string | null }>>(
    `SELECT o.id, o.product_id AS productId, p.title AS productTitle, o.buyer_name AS buyerName, o.buyer_email AS buyerEmail,
     o.amount_cents AS amountCents, o.status, o.pagbank_order_id AS pagbankOrderId
     FROM glab_orders o JOIN glab_products p ON p.id = o.product_id WHERE o.id = ? LIMIT 1`, [id],
  )
  return row ?? null
}

export async function fulfillPaidOrder(orderId: string) {
  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()
    const [[order]] = await connection.execute<Array<RowDataPacket & { productId: number; productTitle: string; buyerName: string; buyerEmail: string; status: string }>>(
      `SELECT o.product_id AS productId, p.title AS productTitle, o.buyer_name AS buyerName, o.buyer_email AS buyerEmail, o.status
       FROM glab_orders o JOIN glab_products p ON p.id = o.product_id WHERE o.id = ? FOR UPDATE`, [orderId],
    )
    if (!order) throw new Error('Pedido não encontrado.')
    if (order.status !== 'PAID') await connection.execute(`UPDATE glab_orders SET status = 'PAID', paid_at = COALESCE(paid_at, NOW()) WHERE id = ?`, [orderId])
    await connection.execute(
      `INSERT INTO glab_enrollments (id, product_id, order_id, student_email, status)
       VALUES (?, ?, ?, ?, 'ACTIVE') ON DUPLICATE KEY UPDATE status = 'ACTIVE', revoked_at = NULL`,
      [randomUUID(), order.productId, orderId, order.buyerEmail],
    )
    await connection.commit()
    await sendPurchaseApprovedEmail({ email: order.buyerEmail, name: order.buyerName, courseName: order.productTitle })
    return { email: order.buyerEmail, name: order.buyerName, productId: order.productId }
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
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

// --- Gestão de cursos (produtos) ---

export type PlatformProductDetail = RowDataPacket & {
  id: number
  slug: string
  title: string
  description: string | null
  priceCents: number
  isActive: number
  coverUrl: string | null
  createdAt: Date
  updatedAt: Date
}

export async function platformProductById(id: number) {
  const [[row]] = await pool.execute<PlatformProductDetail[]>(
    `SELECT id, slug, title, description, price_cents AS priceCents, is_active AS isActive,
      cover_url AS coverUrl, created_at AS createdAt, updated_at AS updatedAt
     FROM glab_products WHERE id = ?`,
    [id],
  )
  return row ?? null
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export type SaveProductInput = {
  title: string
  slug?: string
  description?: string
  priceCents: number
  coverUrl?: string | null
  isActive: boolean
}

export async function createProduct(input: SaveProductInput) {
  const title = input.title.trim()
  if (!title) throw new Error('Informe o título do curso.')
  if (!Number.isFinite(input.priceCents) || input.priceCents < 0) {
    throw new Error('Informe um preço válido.')
  }

  const slug = slugify(input.slug?.trim() || title)
  if (!slug) throw new Error('Não foi possível gerar um slug válido para este título.')

  try {
    const [result] = await pool.execute<import('mysql2').ResultSetHeader>(
      `INSERT INTO glab_products (slug, title, description, price_cents, is_active, cover_url)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [slug, title, input.description?.trim() || null, Math.round(input.priceCents), input.isActive ? 1 : 0, input.coverUrl || null],
    )
    return result.insertId
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ER_DUP_ENTRY') {
      throw new Error(`Já existe um curso com o slug "${slug}".`)
    }
    throw error
  }
}

export async function updateProduct(id: number, input: SaveProductInput) {
  const title = input.title.trim()
  if (!title) throw new Error('Informe o título do curso.')
  if (!Number.isFinite(input.priceCents) || input.priceCents < 0) {
    throw new Error('Informe um preço válido.')
  }

  const slug = slugify(input.slug?.trim() || title)
  if (!slug) throw new Error('Não foi possível gerar um slug válido para este título.')

  try {
    await pool.execute(
      `UPDATE glab_products
       SET slug = ?, title = ?, description = ?, price_cents = ?, is_active = ?, cover_url = ?
       WHERE id = ?`,
      [slug, title, input.description?.trim() || null, Math.round(input.priceCents), input.isActive ? 1 : 0, input.coverUrl || null, id],
    )
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ER_DUP_ENTRY') {
      throw new Error(`Já existe um curso com o slug "${slug}".`)
    }
    throw error
  }
}

// --- Gestão de aulas ---

export type PlatformLessonRow = RowDataPacket & {
  id: number
  productId: number
  title: string
  lessonType: string
  contentUrl: string | null
  position: number
  isPreview: number
  isActive: number
  createdAt: Date
}

export async function lessonsByProductId(productId: number) {
  const [rows] = await pool.execute<PlatformLessonRow[]>(
    `SELECT id, product_id AS productId, title, lesson_type AS lessonType,
      content_url AS contentUrl, position, is_preview AS isPreview,
      is_active AS isActive, created_at AS createdAt
     FROM glab_lessons
     WHERE product_id = ?
     ORDER BY position ASC, id ASC`,
    [productId],
  )
  return rows
}

export async function lessonById(id: number) {
  const [[row]] = await pool.execute<PlatformLessonRow[]>(
    `SELECT id, product_id AS productId, title, lesson_type AS lessonType,
      content_url AS contentUrl, position, is_preview AS isPreview,
      is_active AS isActive, created_at AS createdAt
     FROM glab_lessons WHERE id = ?`,
    [id],
  )
  return row ?? null
}

export type SaveLessonInput = {
  productId: number
  title: string
  lessonType: 'VIDEO' | 'PDF' | 'TEXT'
  contentUrl?: string | null
  isPreview: boolean
  isActive: boolean
}

export async function createLesson(input: SaveLessonInput) {
  const title = input.title.trim()
  if (!title) throw new Error('Informe o título da aula.')

  const [[{ nextPosition }]] = await pool.execute<Array<RowDataPacket & { nextPosition: number }>>(
    'SELECT COALESCE(MAX(position), 0) + 1 AS nextPosition FROM glab_lessons WHERE product_id = ?',
    [input.productId],
  )

  const [result] = await pool.execute<import('mysql2').ResultSetHeader>(
    `INSERT INTO glab_lessons (product_id, title, lesson_type, content_url, position, is_preview, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      input.productId,
      title,
      input.lessonType,
      input.contentUrl || null,
      nextPosition,
      input.isPreview ? 1 : 0,
      input.isActive ? 1 : 0,
    ],
  )
  return result.insertId
}

export async function updateLesson(id: number, input: SaveLessonInput) {
  const title = input.title.trim()
  if (!title) throw new Error('Informe o título da aula.')

  await pool.execute(
    `UPDATE glab_lessons
     SET title = ?, lesson_type = ?, content_url = ?, is_preview = ?, is_active = ?
     WHERE id = ?`,
    [title, input.lessonType, input.contentUrl || null, input.isPreview ? 1 : 0, input.isActive ? 1 : 0, id],
  )
}

export async function deleteLesson(id: number) {
  await pool.execute('DELETE FROM glab_lessons WHERE id = ?', [id])
}

export async function reorderLesson(productId: number, lessonId: number, direction: 'up' | 'down') {
  const lessons = await lessonsByProductId(productId)
  const index = lessons.findIndex((l) => l.id === lessonId)
  if (index === -1) return

  const swapIndex = direction === 'up' ? index - 1 : index + 1
  if (swapIndex < 0 || swapIndex >= lessons.length) return

  const current = lessons[index]
  const swap = lessons[swapIndex]

  await pool.execute('UPDATE glab_lessons SET position = ? WHERE id = ?', [swap.position, current.id])
  await pool.execute('UPDATE glab_lessons SET position = ? WHERE id = ?', [current.position, swap.id])
}

// --- Matrícula manual (ponte até o checkout real existir) ---

/**
 * Libera o acesso de um aluno a um curso sem passar por um pagamento real.
 * Cria um pedido PAID "sintético" (valor = preço atual do produto) e a
 * matrícula ACTIVE correspondente, em uma única transação, para satisfazer
 * a FK glab_enrollments.order_id -> glab_orders.id.
 */
export async function grantManualEnrollment(studentEmail: string, productId: number) {
  const email = studentEmail.trim().toLowerCase()
  if (!email) throw new Error('Informe o e-mail do aluno.')

  const [[product]] = await pool.execute<Array<RowDataPacket & { id: number; title: string; priceCents: number }>>(
    'SELECT id, title, price_cents AS priceCents FROM glab_products WHERE id = ?',
    [productId],
  )
  if (!product) throw new Error('Curso não encontrado.')

  const [[existing]] = await pool.execute<RowDataPacket[]>(
    "SELECT id FROM glab_enrollments WHERE student_email = ? AND product_id = ? AND status = 'ACTIVE'",
    [email, productId],
  )
  if (existing) throw new Error(`Este aluno já está matriculado em "${product.title}".`)

  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()

    const orderId = randomUUID()
    const enrollmentId = randomUUID()
    const referenceId = `manual-${orderId}`

    await connection.execute(
      `INSERT INTO glab_orders (id, product_id, reference_id, buyer_email, amount_cents, status, paid_at)
       VALUES (?, ?, ?, ?, ?, 'PAID', NOW())`,
      [orderId, productId, referenceId, email, product.priceCents],
    )

    await connection.execute(
      `INSERT INTO glab_enrollments (id, product_id, order_id, student_email, status, granted_at)
       VALUES (?, ?, ?, ?, 'ACTIVE', NOW())`,
      [enrollmentId, productId, orderId, email],
    )

    await connection.commit()
  } catch (error) {
    await connection.rollback()
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ER_DUP_ENTRY') {
      throw new Error(`Este aluno já está matriculado em "${product.title}".`)
    }
    throw error
  } finally {
    connection.release()
  }
}

// --- Certificado de conclusão ---

export type CertificateData = {
  code: string
  issuedAt: Date
  studentName: string
  studentEmail: string
  courseTitle: string
}

function generateCertificateCode() {
  return randomUUID().replace(/-/g, '').slice(0, 12).toUpperCase()
}

/**
 * Confirma que o aluno concluiu 100% das aulas ativas do curso e retorna
 * (ou emite, se ainda não existir) o registro do certificado.
 * Lança erro se a matrícula não existir ou o curso não estiver 100% concluído.
 */
export async function ensureCertificate(slug: string, email: string): Promise<CertificateData> {
  const course = await courseForStudent(slug, email)
  if (!course) throw new Error('Matrícula não encontrada para este curso.')

  const [[progress]] = await pool.execute<Array<RowDataPacket & { lessonCount: number; completedCount: number }>>(
    `SELECT COUNT(DISTINCT l.id) AS lessonCount,
       COUNT(DISTINCT CASE WHEN lp.completed_at IS NOT NULL THEN lp.lesson_id END) AS completedCount
     FROM glab_lessons l LEFT JOIN glab_lesson_progress lp ON lp.lesson_id = l.id AND lp.enrollment_id = ?
     WHERE l.product_id = ? AND l.is_active = 1`,
    [course.enrollmentId, course.id],
  )
  if (!progress || progress.lessonCount === 0 || progress.completedCount < progress.lessonCount) {
    throw new Error('Conclua todas as aulas do curso para emitir o certificado.')
  }

  const [[existing]] = await pool.execute<Array<RowDataPacket & { code: string; issuedAt: Date }>>(
    'SELECT code, issued_at AS issuedAt FROM glab_certificates WHERE enrollment_id = ?',
    [course.enrollmentId],
  )

  const student = await currentPlatformUser()
  const studentName = student?.name || email

  if (existing) {
    return { code: existing.code, issuedAt: existing.issuedAt, studentName, studentEmail: email, courseTitle: course.title }
  }

  const code = generateCertificateCode()
  try {
    await pool.execute(
      'INSERT INTO glab_certificates (enrollment_id, code, issued_at) VALUES (?, ?, NOW())',
      [course.enrollmentId, code],
    )
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ER_DUP_ENTRY') {
      const [[row]] = await pool.execute<Array<RowDataPacket & { code: string; issuedAt: Date }>>(
        'SELECT code, issued_at AS issuedAt FROM glab_certificates WHERE enrollment_id = ?',
        [course.enrollmentId],
      )
      if (row) return { code: row.code, issuedAt: row.issuedAt, studentName, studentEmail: email, courseTitle: course.title }
    }
    throw error
  }

  return { code, issuedAt: new Date(), studentName, studentEmail: email, courseTitle: course.title }
}
