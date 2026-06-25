import { prisma } from './db'

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
  return prisma.supportCategory.findMany({
    orderBy: { ordem: 'asc' },
  })
}

export async function getCategoryById(id: number): Promise<SupportCategory | null> {
  return prisma.supportCategory.findUnique({
    where: { id },
  })
}

// TICKETS
export async function createTicket(
  titulo: string,
  descricao: string,
  categoria_id: number,
  usuario_id: string,
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente' = 'media'
): Promise<SupportTicket> {
  const ticket = await prisma.supportTicket.create({
    data: {
      titulo,
      descricao,
      categoria_id,
      usuario_id,
      prioridade,
      status: 'aberto',
    },
  })
  return ticket as SupportTicket
}

export async function getTicketsByUser(usuario_id: string): Promise<SupportTicket[]> {
  const tickets = await prisma.supportTicket.findMany({
    where: { usuario_id },
    orderBy: { createdAt: 'desc' },
  })
  return tickets as SupportTicket[]
}

export async function getTicketsByResponsavel(responsavel_id: string): Promise<SupportTicket[]> {
  const tickets = await prisma.supportTicket.findMany({
    where: { responsavel_id },
    orderBy: { createdAt: 'desc' },
  })
  return tickets as SupportTicket[]
}

export async function getAllTickets(): Promise<SupportTicket[]> {
  const tickets = await prisma.supportTicket.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return tickets as SupportTicket[]
}

export async function getTicketById(id: number): Promise<SupportTicket | null> {
  const ticket = await prisma.supportTicket.findUnique({
    where: { id },
  })
  return ticket as SupportTicket | null
}

export async function updateTicket(
  id: number,
  updates: Partial<SupportTicket>
): Promise<SupportTicket | null> {
  const allowedFields = ['status', 'prioridade', 'responsavel_id']
  const updateData: any = {}

  for (const [key, value] of Object.entries(updates)) {
    if (allowedFields.includes(key) && value !== undefined) {
      updateData[key] = value
    }
  }

  if (Object.keys(updateData).length === 0) return null

  const ticket = await prisma.supportTicket.update({
    where: { id },
    data: updateData,
  })

  return ticket as SupportTicket
}

// MESSAGES
export async function createMessage(
  ticket_id: number,
  autor_id: string,
  mensagem: string
): Promise<SupportMessage> {
  const message = await prisma.supportMessage.create({
    data: {
      ticket_id,
      autor_id,
      mensagem,
      tipo: 'texto',
    },
  })
  return message as SupportMessage
}

export async function getMessagesByTicket(ticket_id: number): Promise<SupportMessage[]> {
  const messages = await prisma.supportMessage.findMany({
    where: { ticket_id },
    orderBy: { createdAt: 'asc' },
  })
  return messages as SupportMessage[]
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
  const attachment = await prisma.supportAttachment.create({
    data: {
      ticket_id,
      message_id,
      arquivo_url,
      tipo_arquivo,
      tamanho,
      enviado_por_id,
    },
  })
  return attachment as SupportAttachment
}

export async function getAttachmentsByTicket(ticket_id: number): Promise<SupportAttachment[]> {
  const attachments = await prisma.supportAttachment.findMany({
    where: { ticket_id },
    orderBy: { createdAt: 'desc' },
  })
  return attachments as SupportAttachment[]
}
