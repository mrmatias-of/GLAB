export interface Ordem {
  id: string
  tenantId: string
  numero: string
  clienteId: string
  descricao: string
  status: 'pendente' | 'em-andamento' | 'concluida' | 'cancelada'
  prioridade: 'baixa' | 'media' | 'alta'
  dataCriacao: Date
  dataVencimento?: Date
  dataConclusao?: Date
  valorTotal: number
  createdAt: Date
  updatedAt: Date
}
