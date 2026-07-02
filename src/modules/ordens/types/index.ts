export interface Ordem {
  id: number
  tenantId: string
  numero: string
  clienteId: number
  descricao: string
  status: 'aberta' | 'em_andamento' | 'concluida' | 'cancelada'
  dataAbertura: Date
  dataFechamento?: Date
  createdAt: Date
  updatedAt: Date
}
