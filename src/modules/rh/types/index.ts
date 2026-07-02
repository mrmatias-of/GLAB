export interface Funcionario {
  id: number
  tenantId: string
  nome: string
  email: string
  cargo: string
  salarioBase: number
  status: 'ativo' | 'inativo'
  dataAdmissao: Date
  createdAt: Date
}

export interface Contracheque {
  id: number
  tenantId: string
  funcionarioId: number
  mes: number
  ano: number
  salarioBase: number
  descontos: number
  valorLiquido: number
  createdAt: Date
}
