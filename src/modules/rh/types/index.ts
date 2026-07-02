export interface Funcionario {
  id: string
  tenantId: string
  nome: string
  email: string
  cpf: string
  cargo: string
  departamento: string
  salarioBase: number
  dataAdmissao: Date
  dataDemissao?: Date
  status: 'ativo' | 'inativo' | 'demitido'
  createdAt: Date
  updatedAt: Date
}

export interface Contracheque {
  id: string
  tenantId: string
  funcionarioId: string
  mes: number
  ano: number
  salarioBase: number
  inss: number
  irpf: number
  fgts: number
  liquido: number
  status: 'pendente' | 'pago'
  dataPagamento?: Date
  createdAt: Date
}

export interface Impostos {
  inss: number
  irpf: number
  fgts: number
}
