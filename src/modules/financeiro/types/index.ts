export interface Transacao {
  id: number
  tenantId: string
  tipo: 'receita' | 'despesa'
  descricao: string
  valor: number
  data: Date
  status: 'pendente' | 'concluida' | 'cancelada'
  createdAt: Date
}
