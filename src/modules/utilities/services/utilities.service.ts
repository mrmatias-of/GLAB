import { logger } from '@/lib/logging'

/**
 * Utilities Service
 * Provides common utility functions for the application
 * Functions for validation, formatting, calculations, etc
 */
export class UtilitiesService {
  /**
   * Validate and format CPF/CNPJ
   */
  validarCPF(cpf: string): boolean {
    const cpfLimpo = cpf.replace(/\D/g, '')

    if (cpfLimpo.length !== 11) return false
    if (/^(\d)\1{10}$/.test(cpfLimpo)) return false

    let soma = 0
    let resto

    for (let i = 1; i <= 9; i++) {
      soma += parseInt(cpfLimpo.substring(i - 1, i)) * (11 - i)
    }

    resto = (soma * 10) % 11
    if (resto === 10 || resto === 11) resto = 0
    if (resto !== parseInt(cpfLimpo.substring(9, 10))) return false

    soma = 0
    for (let i = 1; i <= 10; i++) {
      soma += parseInt(cpfLimpo.substring(i - 1, i)) * (12 - i)
    }

    resto = (soma * 10) % 11
    if (resto === 10 || resto === 11) resto = 0
    if (resto !== parseInt(cpfLimpo.substring(10, 11))) return false

    return true
  }

  validarCNPJ(cnpj: string): boolean {
    const cnpjLimpo = cnpj.replace(/\D/g, '')

    if (cnpjLimpo.length !== 14) return false
    if (/^(\d)\1{13}$/.test(cnpjLimpo)) return false

    let tamanho = cnpjLimpo.length - 2
    let numeros = cnpjLimpo.substring(0, tamanho)
    let digitos = cnpjLimpo.substring(tamanho)
    let soma = 0
    let pos = 0

    for (let i = tamanho - 1; i >= 0; i--) {
      pos++
      soma += numeros.charAt(tamanho - pos) * (pos % 8) + 2
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11)
    if (resultado !== parseInt(digitos.charAt(0))) return false

    tamanho = tamanho + 1
    numeros = cnpjLimpo.substring(0, tamanho)
    soma = 0
    pos = 0

    for (let i = tamanho - 1; i >= 0; i--) {
      pos++
      soma += numeros.charAt(tamanho - pos) * (pos % 8) + 2
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11)
    if (resultado !== parseInt(digitos.charAt(1))) return false

    return true
  }

  /**
   * Format values for display
   */
  formatarMoeda(valor: number, decimais: number = 2): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: decimais,
      maximumFractionDigits: decimais,
    }).format(valor)
  }

  formatarTelefone(telefone: string): string {
    const telefoneL impo = telefone.replace(/\D/g, '')

    if (telefoneL impo.length === 10) {
      return `(${telefoneL impo.substring(0, 2)}) ${telefoneL impo.substring(2, 6)}-${telefoneL impo.substring(6)}`
    } else if (telefoneL impo.length === 11) {
      return `(${telefoneL impo.substring(0, 2)}) ${telefoneL impo.substring(2, 7)}-${telefoneL impo.substring(7)}`
    }

    return telefone
  }

  formatarCEP(cep: string): string {
    const cepLimpo = cep.replace(/\D/g, '')
    if (cepLimpo.length === 8) {
      return `${cepLimpo.substring(0, 5)}-${cepLimpo.substring(5)}`
    }
    return cep
  }

  formatarCPFCNPJ(documento: string): string {
    const documentoLimpo = documento.replace(/\D/g, '')

    if (documentoLimpo.length === 11) {
      return `${documentoLimpo.substring(0, 3)}.${documentoLimpo.substring(3, 6)}.${documentoLimpo.substring(6, 9)}-${documentoLimpo.substring(9)}`
    } else if (documentoLimpo.length === 14) {
      return `${documentoLimpo.substring(0, 2)}.${documentoLimpo.substring(2, 5)}.${documentoLimpo.substring(5, 8)}/${documentoLimpo.substring(8, 12)}-${documentoLimpo.substring(12)}`
    }

    return documento
  }

  /**
   * Date utilities
   */
  obterInicioMes(data: Date = new Date()): Date {
    const inicio = new Date(data)
    inicio.setDate(1)
    inicio.setHours(0, 0, 0, 0)
    return inicio
  }

  obterFimMes(data: Date = new Date()): Date {
    const fim = new Date(data)
    fim.setMonth(fim.getMonth() + 1)
    fim.setDate(0)
    fim.setHours(23, 59, 59, 999)
    return fim
  }

  obterInicioSemana(data: Date = new Date()): Date {
    const inicio = new Date(data)
    const dia = inicio.getDay()
    const diff = inicio.getDate() - dia + (dia === 0 ? -6 : 1)
    inicio.setDate(diff)
    inicio.setHours(0, 0, 0, 0)
    return inicio
  }

  obterFimSemana(data: Date = new Date()): Date {
    const fim = new Date(data)
    const dia = fim.getDay()
    const diff = fim.getDate() - dia + (dia === 0 ? 0 : 7)
    fim.setDate(diff)
    fim.setHours(23, 59, 59, 999)
    return fim
  }

  formatarData(data: Date, formato: string = 'DD/MM/YYYY'): string {
    const dia = String(data.getDate()).padStart(2, '0')
    const mes = String(data.getMonth() + 1).padStart(2, '0')
    const ano = data.getFullYear()

    if (formato === 'DD/MM/YYYY') return `${dia}/${mes}/${ano}`
    if (formato === 'YYYY-MM-DD') return `${ano}-${mes}-${dia}`
    if (formato === 'MM/DD/YYYY') return `${mes}/${dia}/${ano}`

    return data.toLocaleDateString('pt-BR')
  }

  /**
   * Calculation utilities
   */
  calcularIMC(peso: number, altura: number): number {
    return peso / (altura * altura)
  }

  calcularIdade(dataNascimento: Date): number {
    const hoje = new Date()
    let idade = hoje.getFullYear() - dataNascimento.getFullYear()
    const mes = hoje.getMonth() - dataNascimento.getMonth()

    if (mes < 0 || (mes === 0 && hoje.getDate() < dataNascimento.getDate())) {
      idade--
    }

    return idade
  }

  calcularPorcentagem(parte: number, total: number): number {
    if (total === 0) return 0
    return (parte / total) * 100
  }

  calcularDesconto(valor: number, percentualDesconto: number): number {
    return valor * (1 - percentualDesconto / 100)
  }

  /**
   * String utilities
   */
  slugificar(texto: string): string {
    return texto
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  gerarCodigoAleatorio(comprimento: number = 6, tipo: string = 'alfanumerico'): string {
    const caracteres: any = {
      numerico: '0123456789',
      alfabetico: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
      alfanumerico: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    }

    const lista = caracteres[tipo] || caracteres.alfanumerico
    let codigo = ''

    for (let i = 0; i < comprimento; i++) {
      codigo += lista.charAt(Math.floor(Math.random() * lista.length))
    }

    return codigo
  }

  /**
   * Misc utilities
   */
  agruparPor(array: any[], campo: string): any {
    return array.reduce((acc, item) => {
      const chave = item[campo]
      if (!acc[chave]) {
        acc[chave] = []
      }
      acc[chave].push(item)
      return acc
    }, {})
  }

  ordenarPor(array: any[], campo: string, direcao: 'asc' | 'desc' = 'asc'): any[] {
    const sorted = [...array].sort((a, b) => {
      if (a[campo] < b[campo]) return -1
      if (a[campo] > b[campo]) return 1
      return 0
    })

    return direcao === 'desc' ? sorted.reverse() : sorted
  }

  removerDuplicatas(array: any[], campo?: string): any[] {
    if (!campo) return [...new Set(array)]

    const unique: any = {}
    return array.filter((item) => {
      const chave = item[campo]
      if (unique[chave]) return false
      unique[chave] = true
      return true
    })
  }

  gerarRelatorioErro(erro: any): string {
    const stack = erro.stack || ''
    return `Erro: ${erro.message}\n\nStack:\n${stack}`
  }
}
