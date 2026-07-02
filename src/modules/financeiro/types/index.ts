export interface Transacao {
  id: string
  tenantId: string
  tipo: 'receita' | 'despesa'
  descricao: string
  valor: number
  categoria: string
  data: Date
  status: 'pendente' | 'concluida' | 'cancelada'
  referencia?: string
  createdAt: Date
  updatedAt: Date
}

export interface RelatorioFinanceiro {
  periodo: string
  receitas: number
  despesas: number
  lucro: number
  transacoes: Transacao[]
}
