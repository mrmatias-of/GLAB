export interface Produto {
  id: string
  tenantId: string
  codigo: string
  nome: string
  descricao?: string
  categoria: string
  preco: number
  estoque: number
  minimo: number
  maximo: number
  unidade: string
  status: 'ativo' | 'inativo' | 'descontinuado'
  createdAt: Date
  updatedAt: Date
}

export interface Movimentacao {
  id: string
  tenantId: string
  produtoId: string
  tipo: 'entrada' | 'saida'
  quantidade: number
  motivo: string
  referencia?: string
  createdAt: Date
}
