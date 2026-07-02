export interface Item {
  id: number
  tenantId: string
  nome: string
  descricao?: string
  quantidade: number
  categoria?: string
  preco?: number
  status: 'ativo' | 'inativo'
  createdAt: Date
  updatedAt: Date
}
