import { describe, it, expect, beforeEach, vi } from 'vitest'
import { EstoqueService } from '@/modules/estoque/services/estoque.service'

describe('EstoqueService', () => {
  let service: EstoqueService
  let mockUserId: string
  let mockTenantId: string

  beforeEach(() => {
    service = new EstoqueService()
    mockUserId = 'user-123'
    mockTenantId = 'tenant-456'
  })

  describe('criar', () => {
    it('should create a new inventory item', async () => {
      const dados = {
        nome: 'Parafuso M6',
        descricao: 'Parafuso de aço inoxidável',
        quantidade_atual: 100,
        quantidade_minima: 10,
        valor_unitario: 0.50,
        categoria: 'hardware',
        ativo: true,
      }

      const result = await service.criar(mockUserId, mockTenantId, dados)

      expect(result).toHaveProperty('id')
      expect(result.nome).toBe('Parafuso M6')
      expect(result.userId).toBe(mockUserId)
    })

    it('should validate inventory data before creating', async () => {
      const invalidDados = {
        nome: '', // Invalid: empty name
        quantidade_atual: -10, // Invalid: negative quantity
      }

      expect(async () => {
        await service.criar(mockUserId, mockTenantId, invalidDados)
      }).rejects.toThrow()
    })
  })

  describe('adicionarQuantidade', () => {
    it('should add quantity to existing item', async () => {
      const itemId = 1
      const quantidadeAdicionada = 50
      const motivo = 'Reposição de estoque'

      const result = await service.adicionarQuantidade(
        mockUserId,
        mockTenantId,
        itemId,
        quantidadeAdicionada,
        motivo
      )

      expect(result).toBeDefined()
    })

    it('should record movement when adding quantity', async () => {
      const itemId = 1
      const quantidadeAdicionada = 50

      await service.adicionarQuantidade(
        mockUserId,
        mockTenantId,
        itemId,
        quantidadeAdicionada,
        'Reposição'
      )

      // Movement should be recorded
      const movimentacoes = await service.obterMovimentacoes(mockUserId, mockTenantId, itemId)
      expect(movimentacoes.length).toBeGreaterThan(0)
    })

    it('should throw error if item does not exist', async () => {
      const invalidItemId = 99999

      expect(async () => {
        await service.adicionarQuantidade(
          mockUserId,
          mockTenantId,
          invalidItemId,
          50,
          'Motivo'
        )
      }).rejects.toThrow('Item não encontrado')
    })
  })

  describe('removerQuantidade', () => {
    it('should remove quantity from item', async () => {
      const itemId = 1
      const quantidadeRemovida = 10
      const motivo = 'Venda'

      const result = await service.removerQuantidade(
        mockUserId,
        mockTenantId,
        itemId,
        quantidadeRemovida,
        motivo
      )

      expect(result).toBeDefined()
    })

    it('should not allow negative quantity', async () => {
      const itemId = 1
      const currentQuantity = 5
      const quantidadeRemovida = 10

      // Should not go below zero
      await service.removerQuantidade(
        mockUserId,
        mockTenantId,
        itemId,
        quantidadeRemovida,
        'Venda'
      )

      // Quantity should be 0, not negative
      const item = await service.obter(mockUserId, mockTenantId, itemId)
      expect(item.quantidade_atual).toBeGreaterThanOrEqual(0)
    })
  })

  describe('obterEstoqueBaixo', () => {
    it('should return items with low stock', async () => {
      const items = await service.obterEstoqueBaixo(mockUserId, mockTenantId)

      expect(Array.isArray(items)).toBe(true)
    })

    it('should only return items below minimum quantity', async () => {
      const items = await service.obterEstoqueBaixo(mockUserId, mockTenantId)

      items.forEach(item => {
        expect(item.quantidade_atual).toBeLessThanOrEqual(item.quantidade_minima)
      })
    })
  })

  describe('obterResumo', () => {
    it('should calculate inventory summary', async () => {
      const resumo = await service.obterResumo(mockUserId, mockTenantId)

      expect(resumo).toHaveProperty('totalItens')
      expect(resumo).toHaveProperty('itensAtivos')
      expect(resumo).toHaveProperty('valorTotal')
      expect(resumo).toHaveProperty('itensComEstoqueBaixo')
      expect(resumo).toHaveProperty('movimentacoesUltimos30Dias')
    })

    it('should return correct summary values', async () => {
      const resumo = await service.obterResumo(mockUserId, mockTenantId)

      expect(resumo.totalItens).toBeGreaterThanOrEqual(0)
      expect(resumo.itensAtivos).toBeGreaterThanOrEqual(0)
      expect(resumo.valorTotal).toBeGreaterThanOrEqual(0)
      expect(resumo.itensComEstoqueBaixo).toBeGreaterThanOrEqual(0)
    })
  })

  describe('listar', () => {
    it('should list all items for user', async () => {
      const items = await service.listar(mockUserId, mockTenantId)

      expect(Array.isArray(items)).toBe(true)
    })

    it('should only return items for current user', async () => {
      const items = await service.listar(mockUserId, mockTenantId)

      items.forEach(item => {
        expect(item.userId).toBe(mockUserId)
      })
    })
  })

  describe('deletar', () => {
    it('should delete inventory item', async () => {
      const itemId = 1

      const result = await service.deletar(mockUserId, mockTenantId, itemId)

      expect(result).toBeDefined()
    })

    it('should throw error when deleting non-existent item', async () => {
      const invalidItemId = 99999

      expect(async () => {
        await service.deletar(mockUserId, mockTenantId, invalidItemId)
      }).rejects.toThrow('Item não encontrado')
    })
  })
})
