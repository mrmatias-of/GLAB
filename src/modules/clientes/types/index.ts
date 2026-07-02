export interface Cliente {
  id: string
  tenantId: string
  nome: string
  email: string
  telefone?: string
  cpf?: string
  cnpj?: string
  endereco?: string
  cidade?: string
  estado?: string
  cep?: string
  status: 'ativo' | 'inativo'
  createdAt: Date
  updatedAt: Date
}
