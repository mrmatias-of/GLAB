import { User } from '@prisma/client'

export type UserRole = 'admin' | 'vendedor' | 'usuario'

/**
 * Extrai o role do usuário baseado nos atributos
 */
export function getUserRole(user: User | null): UserRole {
  if (!user) return 'usuario'
  
  if (user.is_admin === true) return 'admin'
  if (user.is_vendedor === true) return 'vendedor'
  
  return 'usuario'
}

/**
 * Verifica se o usuário é admin
 */
export function isAdmin(user: User | null): boolean {
  return user?.is_admin === true
}

/**
 * Verifica se o usuário é vendedor
 */
export function isVendedor(user: User | null): boolean {
  return user?.is_vendedor === true
}

/**
 * Verifica se o usuário é admin OU vendedor
 */
export function isAdminOrVendedor(user: User | null): boolean {
  return isAdmin(user) || isVendedor(user)
}

/**
 * Verifica se um usuário pode gerenciar um ticket
 * Admins gerenciam todos os tickets, vendedores gerenciam apenas os que são responsáveis
 */
export function canManageTicket(user: User | null, ticketResponsavelId: string | null): boolean {
  if (!user) return false
  
  // Admin pode gerenciar qualquer ticket
  if (isAdmin(user)) return true
  
  // Vendedor pode gerenciar apenas tickets que é responsável
  if (isVendedor(user) && ticketResponsavelId === user.id) return true
  
  return false
}

/**
 * Verifica se um usuário pode criar um novo ticket
 * Todos os usuários logados podem criar
 */
export function canCreateTicket(user: User | null): boolean {
  return user !== null
}

/**
 * Verifica se um usuário pode responder a um ticket
 * Todos os usuários logados podem responder (ao seu próprio ticket ou se for admin/vendedor)
 */
export function canReplyToTicket(user: User | null, ticketUsuarioId: string): boolean {
  if (!user) return false
  
  // Admin e vendedor podem responder a qualquer ticket
  if (isAdminOrVendedor(user)) return true
  
  // Usuário comum pode responder apenas ao seu próprio ticket
  return user.id === ticketUsuarioId
}

/**
 * Verifica se um usuário pode deletar um ticket
 * Apenas admins podem deletar
 */
export function canDeleteTicket(user: User | null): boolean {
  return isAdmin(user)
}

/**
 * Verifica se um usuário pode atribuir um ticket
 * Apenas admins e vendedores podem atribuir
 */
export function canAssignTicket(user: User | null): boolean {
  return isAdminOrVendedor(user)
}

/**
 * Verifica se um usuário pode mudar o status de um ticket
 * Admins podem mudar qualquer ticket
 * Vendedores podem mudar apenas tickets que gerenciam
 */
export function canChangeTicketStatus(user: User | null, ticketResponsavelId: string | null): boolean {
  if (!user) return false
  
  if (isAdmin(user)) return true
  
  if (isVendedor(user) && ticketResponsavelId === user.id) return true
  
  return false
}
