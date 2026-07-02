export interface Cliente {
  id: number
  tenantId: string
  nome: string
  email: string
  telefone?: string
  endereco?: string
  cidade?: string
  estado?: string
  cep?: string
  status: 'ativo' | 'inativo'
  createdAt: Date
  updatedAt: Date
}
