import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ClienteService } from '@/modules/clientes/services/cliente.service'
import { ClienteRepository } from '@/modules/clientes/repositories/cliente.repository'
import { mockUserId, mockTenantId, mockCliente } from '../setup'

vi.mock('@/modules/clientes/repositories/cliente.repository')

describe('ClienteService', () => {
  let service: ClienteService
  let repository: any

  beforeEach(() => {
    vi.clearAllMocks()
    service = new ClienteService()
    repository = vi.mocked(ClienteRepository)
  })

  describe('criar', () => {
    it('deve criar um cliente com dados válidos', async () => {
      const dados = {
        nome: 'Novo Cliente',
        email: 'novo@cliente.com',
        telefone: '11999999999',
        cpf_cnpj: '12345678901',
      }

      // Mock do repository
      ;(service as any).repository.criar = vi.fn().mockResolvedValue(mockCliente)

      const resultado = await service.criar(mockUserId, mockTenantId, dados)

      expect(resultado).toEqual(mockCliente)
      expect((service as any).repository.criar).toHaveBeenCalled()
    })

    it('deve lançar erro com dados inválidos', async () => {
      const dadosInvalidos = {
        nome: '', // Nome vazio é inválido
      }

      ;(service as any).repository.criar = vi.fn().mockResolvedValue(mockCliente)

      expect(async () => {
        await service.criar(mockUserId, mockTenantId, dadosInvalidos)
      }).rejects.toThrow()
    })

    it('deve incluir userId ao criar cliente', async () => {
      const dados = { nome: 'Cliente' }

      ;(service as any).repository.criar = vi.fn().mockResolvedValue(mockCliente)

      await service.criar(mockUserId, mockTenantId, dados)

      const chamada = ((service as any).repository.criar as any).mock.calls[0][0]
      expect(chamada.userId).toBe(mockUserId)
    })
  })

  describe('obter', () => {
    it('deve obter um cliente existente', async () => {
      ;(service as any).repository.findById = vi.fn().mockResolvedValue(mockCliente)

      const resultado = await service.obter(mockUserId, mockTenantId, 1)

      expect(resultado).toEqual(mockCliente)
    })

    it('deve lançar erro se cliente não existir', async () => {
      ;(service as any).repository.findById = vi.fn().mockResolvedValue(null)

      expect(async () => {
        await service.obter(mockUserId, mockTenantId, 999)
      }).rejects.toThrow('Cliente')
    })

    it('deve passar userId ao repository', async () => {
      ;(service as any).repository.findById = vi.fn().mockResolvedValue(mockCliente)

      await service.obter(mockUserId, mockTenantId, 1)

      expect((service as any).repository.findById).toHaveBeenCalledWith(1, mockUserId)
    })
  })

  describe('listar', () => {
    it('deve listar clientes do usuário', async () => {
      const clientes = [mockCliente, { ...mockCliente, id: 2 }]
      ;(service as any).repository.findAll = vi.fn().mockResolvedValue(clientes)

      const resultado = await service.listar(mockUserId, mockTenantId)

      expect(resultado).toEqual(clientes)
    })

    it('deve retornar array vazio se não houver clientes', async () => {
      ;(service as any).repository.findAll = vi.fn().mockResolvedValue([])

      const resultado = await service.listar(mockUserId, mockTenantId)

      expect(resultado).toEqual([])
    })
  })

  describe('atualizar', () => {
    it('deve atualizar cliente existente', async () => {
      const dadosAtualizacao = { nome: 'Cliente Atualizado' }
      const clienteAtualizado = { ...mockCliente, ...dadosAtualizacao }

      ;(service as any).repository.findById = vi.fn().mockResolvedValue(mockCliente)
      ;(service as any).repository.update = vi.fn().mockResolvedValue(clienteAtualizado)

      const resultado = await service.atualizar(mockUserId, mockTenantId, 1, dadosAtualizacao)

      expect(resultado).toEqual(clienteAtualizado)
    })

    it('deve lançar erro se cliente não existir', async () => {
      ;(service as any).repository.findById = vi.fn().mockResolvedValue(null)

      expect(async () => {
        await service.atualizar(mockUserId, mockTenantId, 999, { nome: 'Novo' })
      }).rejects.toThrow('Cliente')
    })
  })

  describe('deletar', () => {
    it('deve deletar cliente existente', async () => {
      ;(service as any).repository.findById = vi.fn().mockResolvedValue(mockCliente)
      ;(service as any).repository.delete = vi.fn().mockResolvedValue(undefined)

      const resultado = await service.deletar(mockUserId, mockTenantId, 1)

      expect(resultado).toBe(true)
      expect((service as any).repository.delete).toHaveBeenCalledWith(1, mockUserId)
    })

    it('deve lançar erro se cliente não existir', async () => {
      ;(service as any).repository.findById = vi.fn().mockResolvedValue(null)

      expect(async () => {
        await service.deletar(mockUserId, mockTenantId, 999)
      }).rejects.toThrow('Cliente')
    })
  })

  describe('adicionarValor', () => {
    it('deve adicionar valor ao cliente', async () => {
      const clienteComNovoValor = { ...mockCliente, valor_acumulado: '1500.00' }

      ;(service as any).repository.findById = vi.fn().mockResolvedValue(mockCliente)
      ;(service as any).repository.updateValorAcumulado = vi
        .fn()
        .mockResolvedValue(clienteComNovoValor)

      const resultado = await service.adicionarValor(mockUserId, mockTenantId, 1, 500)

      expect((service as any).repository.updateValorAcumulado).toHaveBeenCalledWith(
        1,
        mockUserId,
        1500
      )
    })

    it('deve lançar erro se cliente não existir', async () => {
      ;(service as any).repository.findById = vi.fn().mockResolvedValue(null)

      expect(async () => {
        await service.adicionarValor(mockUserId, mockTenantId, 999, 500)
      }).rejects.toThrow()
    })
  })
})
