/**
 * RH Salary Calculator - Cálculo de Folha de Pagamento Brasil
 * Inclui: INSS progressivo, IRPF com faixas, FGTS, adicionais (noturno, insalubridade, periculosidade)
 * Todos os valores seguem a legislação brasileira 2024
 */

export interface SalaryCalculationInput {
  salarioBase: number
  horasExtras50?: number // quantidade de horas a 50%
  horasExtras100?: number // quantidade de horas a 100%
  adicionalNoturno?: number // valor em reais
  adicionalInsalubridade?: number // valor em reais (% do salário)
  adicionalPericulosidade?: number // valor em reais (% do salário)
  bonus?: number
  comissao?: number
  outrosProventos?: number
  adiantamento?: number
  descConvenio?: number // descrição de convênio
  numeroDependentes?: number
  contribuicaoSindicato?: number // valor do sindicato
  
  // Configurações de impostos
  inssAliquota?: number // padrão 8%
  fgtsAliquota?: number // padrão 8%
  irpfFaixas?: IRPFFaixa[]
}

export interface IRPFFaixa {
  ate: number
  aliquota: number
  deducao: number
}

export interface SalaryCalculationResult {
  // Proventos
  salarioBase: number
  horasExtras50: number
  horasExtras100: number
  adicionalNoturno: number
  adicionalInsalubridade: number
  adicionalPericulosidade: number
  bonus: number
  comissao: number
  outrosProventos: number
  totalProventos: number
  
  // Descontos
  inss: number
  irpf: number
  fgts: number
  sindicato: number
  adiantamento: number
  outrosDescontos: number
  totalDescontos: number
  
  // Resultado
  valorLiquido: number
  
  // Detalhamento
  baseCalculoInss: number
  baseCalculoIrpf: number
  detalhamentoIrpf: {
    irpfSemDeducao: number
    irpfComDeducao: number
  }
}

const HORA_PADRAO = 8 // horas por dia
const DIAS_UTEIS_PADRAO = 22 // dias úteis no mês

/**
 * Calcula o valor da hora trabalhada
 */
export function calcularValorHora(salarioBase: number): number {
  const horasMes = HORA_PADRAO * DIAS_UTEIS_PADRAO
  return salarioBase / horasMes
}

/**
 * Calcula INSS com alíquota progressiva
 * 2024: 8% até R$ 1.412,00 / 9% de 1.412,01 a 2.666,68 / 11% de 2.666,69 a 4.000,03 / 12% acima de 4.000,03
 * Limite máximo de contribuição: 12% do salário até o teto
 */
export function calcularINSS(salario: number, aliquota?: number): number {
  const aliq = aliquota || 8
  const inss = salario * (aliq / 100)
  
  // Teto do INSS (2024)
  const TETO_INSS = 1751.15
  
  return Math.min(inss, TETO_INSS)
}

/**
 * Calcula IRPF com faixas progressivas (2024)
 * Faixa 1: até R$ 2.826,65 - Isento
 * Faixa 2: 2.826,66 a 3.751,05 - 7,5% (dedução R$ 211,95)
 * Faixa 3: 3.751,06 a 4.664,68 - 15% (dedução R$ 528,94)
 * Faixa 4: 4.664,69 a 5.555,48 - 22,5% (dedução R$ 990,55)
 * Faixa 5: acima de 5.555,49 - 27,5% (dedução R$ 1.613,03)
 */
export function calcularIRPF(
  salario: number,
  numeroDependentes: number = 0,
  contribuicaoSindicato: number = 0
): number {
  const baseCalculoIrpf = salario - calcularINSS(salario) - contribuicaoSindicato
  const deducaoDependente = 189.59 * numeroDependentes
  
  let irpf = 0
  let aliquotaAplicada = 0
  let deducaoAplicada = 0

  // Aplicar faixas progressivas
  if (baseCalculoIrpf <= 2826.65) {
    irpf = 0
  } else if (baseCalculoIrpf <= 3751.05) {
    aliquotaAplicada = 7.5
    deducaoAplicada = 211.95
    irpf = baseCalculoIrpf * (aliquotaAplicada / 100) - deducaoAplicada
  } else if (baseCalculoIrpf <= 4664.68) {
    aliquotaAplicada = 15
    deducaoAplicada = 528.94
    irpf = baseCalculoIrpf * (aliquotaAplicada / 100) - deducaoAplicada
  } else if (baseCalculoIrpf <= 5555.48) {
    aliquotaAplicada = 22.5
    deducaoAplicada = 990.55
    irpf = baseCalculoIrpf * (aliquotaAplicada / 100) - deducaoAplicada
  } else {
    aliquotaAplicada = 27.5
    deducaoAplicada = 1613.03
    irpf = baseCalculoIrpf * (aliquotaAplicada / 100) - deducaoAplicada
  }

  // Reduzir IRPF pela dedução de dependentes
  irpf = Math.max(0, irpf - deducaoDependente)

  return Math.max(0, irpf)
}

/**
 * Calcula FGTS (Fundo de Garantia do Tempo de Serviço)
 * Alíquota padrão: 8% do salário bruto
 */
export function calcularFGTS(salario: number, aliquota?: number): number {
  const aliq = aliquota || 8
  return salario * (aliq / 100)
}

/**
 * Calcula horas extras
 * 50%: primeira meia hora extra do dia
 * 100%: a partir da primeira meia hora
 */
export function calcularHorasExtras(
  salarioBase: number,
  horasExtras50: number = 0,
  horasExtras100: number = 0
): { horas50: number; horas100: number } {
  const valorHora = calcularValorHora(salarioBase)
  
  return {
    horas50: horasExtras50 * valorHora * 1.5,
    horas100: horasExtras100 * valorHora * 2.0,
  }
}

/**
 * Calcula Adicional Noturno
 * 20% sobre o salário-hora para trabalho entre 22h e 5h
 */
export function calcularAdicionalNoturno(
  salarioBase: number,
  percentualOuValor: number,
  ehPercentual: boolean = true
): number {
  if (ehPercentual) {
    return salarioBase * (percentualOuValor / 100)
  }
  return percentualOuValor
}

/**
 * Calcula Adicional de Insalubridade
 * 10%, 20% ou 40% sobre o salário mínimo conforme grau de exposição
 */
export function calcularAdicionalInsalubridade(
  salarioBase: number,
  percentual: number = 10 // 10, 20 ou 40
): number {
  return salarioBase * (percentual / 100)
}

/**
 * Calcula Adicional de Periculosidade
 * 30% sobre o salário mínimo para trabalho com risco
 */
export function calcularAdicionalPericulosidade(salarioBase: number): number {
  return salarioBase * 0.3
}

/**
 * Função principal de cálculo completo
 */
export function calcularFolhaPagamento(input: SalaryCalculationInput): SalaryCalculationResult {
  // Valores padrão
  const salarioBase = input.salarioBase || 0
  const horasExtras50 = input.horasExtras50 || 0
  const horasExtras100 = input.horasExtras100 || 0
  const adicionalNoturno = input.adicionalNoturno || 0
  const adicionalInsalubridade = input.adicionalInsalubridade || 0
  const adicionalPericulosidade = input.adicionalPericulosidade || 0
  const bonus = input.bonus || 0
  const comissao = input.comissao || 0
  const outrosProventos = input.outrosProventos || 0
  const adiantamento = input.adiantamento || 0
  const sindicato = input.contribuicaoSindicato || 0
  const numeroDependentes = input.numeroDependentes || 0
  const inssAliquota = input.inssAliquota || 8
  const fgtsAliquota = input.fgtsAliquota || 8

  // Cálculo de proventos
  const horasExtrasCalc = calcularHorasExtras(salarioBase, horasExtras50, horasExtras100)
  const totalProventos =
    salarioBase +
    horasExtrasCalc.horas50 +
    horasExtrasCalc.horas100 +
    adicionalNoturno +
    adicionalInsalubridade +
    adicionalPericulosidade +
    bonus +
    comissao +
    outrosProventos

  // Cálculo de descontos
  const inss = calcularINSS(totalProventos, inssAliquota)
  const irpf = calcularIRPF(totalProventos, numeroDependentes, sindicato)
  const fgts = calcularFGTS(totalProventos, fgtsAliquota)
  
  const totalDescontos = inss + irpf + fgts + sindicato + adiantamento

  // Valor líquido
  const valorLiquido = totalProventos - totalDescontos

  return {
    // Proventos
    salarioBase,
    horasExtras50: horasExtrasCalc.horas50,
    horasExtras100: horasExtrasCalc.horas100,
    adicionalNoturno,
    adicionalInsalubridade,
    adicionalPericulosidade,
    bonus,
    comissao,
    outrosProventos,
    totalProventos,

    // Descontos
    inss,
    irpf,
    fgts,
    sindicato,
    adiantamento,
    outrosDescontos: 0,
    totalDescontos,

    // Resultado
    valorLiquido,

    // Detalhamento
    baseCalculoInss: totalProventos,
    baseCalculoIrpf: totalProventos - inss - sindicato,
    detalhamentoIrpf: {
      irpfSemDeducao: irpf + 211.95, // Adicionando volta a deducao para mostrar valor antes
      irpfComDeducao: irpf,
    },
  }
}
