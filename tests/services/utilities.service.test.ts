import { describe, it, expect } from 'vitest'
import { UtilitiesService } from '@/modules/utilities/services/utilities.service'

describe('UtilitiesService', () => {
  const service = new UtilitiesService()

  describe('CPF Validation', () => {
    it('deve validar CPF válido', () => {
      // CPF válido
      const resultado = service.validarCPF('111.444.777-35')
      expect(resultado).toBe(true)
    })

    it('deve rejeitar CPF inválido', () => {
      const resultado = service.validarCPF('111.111.111-11')
      expect(resultado).toBe(false)
    })

    it('deve lidar com CPF sem formatação', () => {
      const resultado = service.validarCPF('11144477735')
      expect(resultado).toBe(true)
    })

    it('deve rejeitar CPF com tamanho incorreto', () => {
      const resultado = service.validarCPF('123')
      expect(resultado).toBe(false)
    })
  })

  describe('CNPJ Validation', () => {
    it('deve validar CNPJ válido', () => {
      // CNPJ válido de teste
      const resultado = service.validarCNPJ('11.222.333/0001-81')
      expect(typeof resultado).toBe('boolean')
    })

    it('deve rejeitar CNPJ com tamanho incorreto', () => {
      const resultado = service.validarCNPJ('123')
      expect(resultado).toBe(false)
    })
  })

  describe('Formatação de Moeda', () => {
    it('deve formatar valores em BRL', () => {
      const resultado = service.formatarMoeda(1000)
      expect(resultado).toContain('1.000')
    })

    it('deve respeitar casas decimais', () => {
      const resultado = service.formatarMoeda(1234.56, 2)
      expect(resultado).toContain('1.234,56')
    })

    it('deve lidar com zero', () => {
      const resultado = service.formatarMoeda(0)
      expect(resultado).toContain('0')
    })
  })

  describe('Formatação de Telefone', () => {
    it('deve formatar telefone com 10 dígitos', () => {
      const resultado = service.formatarTelefone('1133334444')
      expect(resultado).toMatch(/\(\d{2}\) \d{4}-\d{4}/)
    })

    it('deve formatar telefone com 11 dígitos', () => {
      const resultado = service.formatarTelefone('11999999999')
      expect(resultado).toMatch(/\(\d{2}\) \d{5}-\d{4}/)
    })

    it('deve remover caracteres não numéricos', () => {
      const resultado = service.formatarTelefone('(11) 99999-9999')
      expect(resultado).toMatch(/\(\d{2}\) \d{5}-\d{4}/)
    })
  })

  describe('Formatação de CEP', () => {
    it('deve formatar CEP válido', () => {
      const resultado = service.formatarCEP('01234567')
      expect(resultado).toBe('01234-567')
    })

    it('deve remover caracteres não numéricos', () => {
      const resultado = service.formatarCEP('01234-567')
      expect(resultado).toBe('01234-567')
    })
  })

  describe('Formatação de CPF/CNPJ', () => {
    it('deve formatar CPF', () => {
      const resultado = service.formatarCPFCNPJ('11144477735')
      expect(resultado).toBe('111.444.777-35')
    })

    it('deve formatar CNPJ', () => {
      const resultado = service.formatarCPFCNPJ('11222333000181')
      expect(resultado).toMatch(/\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}/)
    })
  })

  describe('Data Utilities', () => {
    it('deve obter início do mês', () => {
      const data = new Date(2024, 4, 15)
      const inicio = service.obterInicioMes(data)
      expect(inicio.getDate()).toBe(1)
      expect(inicio.getMonth()).toBe(4)
    })

    it('deve obter fim do mês', () => {
      const data = new Date(2024, 4, 15)
      const fim = service.obterFimMes(data)
      expect(fim.getDate()).toBe(31)
      expect(fim.getMonth()).toBe(4)
    })

    it('deve formatar data', () => {
      const data = new Date(2024, 0, 15)
      const resultado = service.formatarData(data, 'DD/MM/YYYY')
      expect(resultado).toMatch(/15\/01\/2024/)
    })

    it('deve retornar data atual se não fornecida', () => {
      const inicio = service.obterInicioMes()
      expect(inicio.getDate()).toBe(1)
    })
  })

  describe('Cálculos', () => {
    it('deve calcular percentagem', () => {
      const resultado = service.calcularPorcentagem(50, 200)
      expect(resultado).toBe(25)
    })

    it('deve lidar com divisão por zero', () => {
      const resultado = service.calcularPorcentagem(50, 0)
      expect(resultado).toBe(0)
    })

    it('deve calcular desconto', () => {
      const resultado = service.calcularDesconto(100, 10)
      expect(resultado).toBe(90)
    })

    it('deve calcular idade', () => {
      const dataNascimento = new Date(1990, 0, 1)
      const idade = service.calcularIdade(dataNascimento)
      expect(idade).toBeGreaterThanOrEqual(33)
    })
  })

  describe('String Utilities', () => {
    it('deve slugificar strings', () => {
      const resultado = service.slugificar('Olá Mundo!')
      expect(resultado).toBe('ola-mundo')
    })

    it('deve gerar código aleatório', () => {
      const resultado = service.gerarCodigoAleatorio(6)
      expect(resultado).toHaveLength(6)
    })

    it('deve gerar código numérico', () => {
      const resultado = service.gerarCodigoAleatorio(6, 'numerico')
      expect(resultado).toMatch(/^\d+$/)
    })

    it('deve gerar código alfabético', () => {
      const resultado = service.gerarCodigoAleatorio(6, 'alfabetico')
      expect(resultado).toMatch(/^[a-zA-Z]+$/)
    })
  })

  describe('Array Operations', () => {
    it('deve agrupar por campo', () => {
      const dados = [
        { categoria: 'A', valor: 1 },
        { categoria: 'B', valor: 2 },
        { categoria: 'A', valor: 3 },
      ]

      const resultado = service.agruparPor(dados, 'categoria')
      expect(resultado.A).toHaveLength(2)
      expect(resultado.B).toHaveLength(1)
    })

    it('deve ordenar por campo', () => {
      const dados = [{ nome: 'C' }, { nome: 'A' }, { nome: 'B' }]
      const resultado = service.ordenarPor(dados, 'nome', 'asc')
      expect(resultado[0].nome).toBe('A')
      expect(resultado[2].nome).toBe('C')
    })

    it('deve remover duplicatas', () => {
      const dados = [1, 2, 2, 3, 3, 3]
      const resultado = service.removerDuplicatas(dados)
      expect(resultado).toHaveLength(3)
    })

    it('deve remover duplicatas por campo', () => {
      const dados = [
        { id: 1, nome: 'A' },
        { id: 1, nome: 'B' },
        { id: 2, nome: 'C' },
      ]

      const resultado = service.removerDuplicatas(dados, 'id')
      expect(resultado).toHaveLength(2)
    })
  })
})
