import { pool } from './db'

export interface SupportCategory {
  id: number
  nome: string
  descricao?: string
  ordem: number
}

export interface SupportTicket {
  id: number
  titulo: string
  descricao: string
  categoria_id: number
  status: 'aberto' | 'em_andamento' | 'resolvido' | 'fechado'
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente'
  usuario_id: string
  responsavel_id?: string
  criado_em: string
  atualizado_em: string
  fechado_em?: string
}

export interface SupportMessage {
  id: number
  ticket_id: number
  autor_id: string
  mensagem: string
  tipo: 'texto' | 'resposta_automatica'
  criado_em: string
}

export interface SupportAttachment {
  id: number
  ticket_id: number
  message_id?: number
  arquivo_url: string
  tipo_arquivo?: string
  tamanho?: number
  enviado_por_id: string
  criado_em: string
}

// CATEGORIAS
export async function getCategories(): Promise<SupportCategory[]> {
  const result = await pool.query(
    'SELECT * FROM support_categories ORDER BY ordem'
  )
  return result.rows
}

export async function getCategoryById(id: number): Promise<SupportCategory | null> {
  const result = await pool.query(
    'SELECT * FROM support_categories WHERE id = $1',
    [id]
  )
  return result.rows[0] || null
}

// TICKETS
export async function createTicket(
  titulo: string,
  descricao: string,
  categoria_id: number,
  usuario_id: string,
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente' = 'media'
): Promise<SupportTicket> {
  const result = await pool.query(
    `INSERT INTO support_tickets (titulo, descricao, categoria_id, usuario_id, prioridade, status)
     VALUES ($1, $2, $3, $4, $5, 'aberto')
     RETURNING *`,
    [titulo, descricao, categoria_id, usuario_id, prioridade]
  )
  return result.rows[0]
}

export async function getTicketsByUser(usuario_id: string): Promise<SupportTicket[]> {
  const result = await pool.query(
    'SELECT * FROM support_tickets WHERE usuario_id = $1 ORDER BY criado_em DESC',
    [usuario_id]
  )
  return result.rows
}

export async function getTicketsByResponsavel(responsavel_id: string): Promise<SupportTicket[]> {
  const result = await pool.query(
    'SELECT * FROM support_tickets WHERE responsavel_id = $1 ORDER BY criado_em DESC',
    [responsavel_id]
  )
  return result.rows
}

export async function getAllTickets(): Promise<SupportTicket[]> {
  const result = await pool.query(
    'SELECT * FROM support_tickets ORDER BY criado_em DESC'
  )
  return result.rows
}

export async function getTicketById(id: number): Promise<SupportTicket | null> {
  const result = await pool.query(
    'SELECT * FROM support_tickets WHERE id = $1',
    [id]
  )
  return result.rows[0] || null
}

export async function updateTicket(
  id: number,
  updates: Partial<SupportTicket>
): Promise<SupportTicket | null> {
  const allowedFields = ['status', 'prioridade', 'responsavel_id']
  const fields: string[] = []
  const values: any[] = []
  let paramCount = 1

  for (const [key, value] of Object.entries(updates)) {
    if (allowedFields.includes(key) && value !== undefined) {
      fields.push(`${key} = $${paramCount}`)
      values.push(value)
      paramCount++
    }
  }

  if (fields.length === 0) return null

  fields.push(`atualizado_em = CURRENT_TIMESTAMP`)
  values.push(id)

  const result = await pool.query(
    `UPDATE support_tickets SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
    values
  )

  return result.rows[0] || null
}

// MESSAGES
export async function createMessage(
  ticket_id: number,
  autor_id: string,
  mensagem: string
): Promise<SupportMessage> {
  const result = await pool.query(
    `INSERT INTO support_messages (ticket_id, autor_id, mensagem, tipo)
     VALUES ($1, $2, $3, 'texto')
     RETURNING *`,
    [ticket_id, autor_id, mensagem]
  )
  return result.rows[0]
}

export async function getMessagesByTicket(ticket_id: number): Promise<SupportMessage[]> {
  const result = await pool.query(
    'SELECT * FROM support_messages WHERE ticket_id = $1 ORDER BY criado_em ASC',
    [ticket_id]
  )
  return result.rows
}

// ATTACHMENTS
export async function addAttachment(
  ticket_id: number,
  arquivo_url: string,
  tipo_arquivo: string,
  tamanho: number,
  enviado_por_id: string,
  message_id?: number
): Promise<SupportAttachment> {
  const result = await pool.query(
    `INSERT INTO support_attachments (ticket_id, message_id, arquivo_url, tipo_arquivo, tamanho, enviado_por_id)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [ticket_id, message_id || null, arquivo_url, tipo_arquivo, tamanho, enviado_por_id]
  )
  return result.rows[0]
}

export async function getAttachmentsByTicket(ticket_id: number): Promise<SupportAttachment[]> {
  const result = await pool.query(
    'SELECT * FROM support_attachments WHERE ticket_id = $1 ORDER BY criado_em DESC',
    [ticket_id]
  )
  return result.rows
}
