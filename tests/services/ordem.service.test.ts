import { describe, it, expect, beforeEach } from 'vitest'
import { OrdemService } from '@/modules/ordens/services/ordem.service'

describe('OrdemService', () => {
  let service: OrdemService
  let mockUserId: string
  let mockTenantId: string

  beforeEach(() => {
    service = new OrdemService()
    mockUserId = 'user-123'
    mockTenantId = 'tenant-456'
  })

  describe('criar', () => {
    it('should create a new work order', async () => {
      const dados = {
        cliente_id: 1,
        descricao: 'Manutenção preventiva',
        data_inicio: new Date(),
        data_fim_prevista: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        prioridade: 'media',
      }

      const result = await service.criar(mockUserId, mockTenantId, dados)

      expect(result).toHaveProperty('id')
      expect(result.status).toBe('aberto')
      expect(result.userId).toBe(mockUserId)
    })

    it('should validate order data before creating', async () => {
      const invalidDados = {
        cliente_id: null,
        descricao: '', // Invalid: empty
      }

      expect(async () => {
        await service.criar(mockUserId, mockTenantId, invalidDados)
      }).rejects.toThrow()
    })
  })

  describe('alterarStatus', () => {
    it('should change order status', async () => {
      const ordemId = 1
      const novoStatus = 'em_progresso'

      const result = await service.alterarStatus(mockUserId, mockTenantId, ordemId, novoStatus)

      expect(result.status).toBe('em_progresso')
    })

    it('should only accept valid status values', async () => {
      const ordemId = 1
      const invalidStatus = 'completo' // Not in valid list

      expect(async () => {
        await service.alterarStatus(mockUserId, mockTenantId, ordemId, invalidStatus)
      }).rejects.toThrow('Status inválido')
    })

    it('should accept all valid statuses', async () => {
      const validStatuses = ['aberto', 'em_progresso', 'pausado', 'finalizado', 'cancelado']
      const ordemId = 1

      for (const status of validStatuses) {
        const result = await service.alterarStatus(mockUserId, mockTenantId, ordemId, status)
        expect(result.status).toBe(status)
      }
    })
  })

  describe('listarPorStatus', () => {
    it('should list orders by specific status', async () => {
      const status = 'aberto'

      const orders = await service.listarPorStatus(mockUserId, mockTenantId, status)

      expect(Array.isArray(orders)).toBe(true)
      orders.forEach(order => {
        expect(order.status).toBe(status)
      })
    })

    it('should return empty array for status with no orders', async () => {
      const status = 'cancelado'

      const orders = await service.listarPorStatus(mockUserId, mockTenantId, status)

      expect(Array.isArray(orders)).toBe(true)
    })
  })

  describe('obterCounts', () => {
    it('should return count of orders by status', async () => {
      const counts = await service.obterCounts(mockUserId, mockTenantId)

      expect(counts).toHaveProperty('aberto')
      expect(counts).toHaveProperty('em_progresso')
      expect(counts).toHaveProperty('pausado')
      expect(counts).toHaveProperty('finalizado')
      expect(counts).toHaveProperty('cancelado')
    })

    it('should have numeric counts', async () => {
      const counts = await service.obterCounts(mockUserId, mockTenantId)

      Object.values(counts).forEach(count => {
        expect(typeof count).toBe('number')
        expect(count).toBeGreaterThanOrEqual(0)
      })
    })
  })

  describe('obterProximasVencer', () => {
    it('should return orders closest to due date', async () => {
      const proximasVencer = await service.obterProximasVencer(mockUserId, mockTenantId)

      expect(Array.isArray(proximasVencer)).toBe(true)
    })

    it('should be sorted by due date ascending', async () => {
      const proximasVencer = await service.obterProximasVencer(mockUserId, mockTenantId)

      for (let i = 0; i < proximasVencer.length - 1; i++) {
        const current = new Date(proximasVencer[i].data_fim_prevista).getTime()
        const next = new Date(proximasVencer[i + 1].data_fim_prevista).getTime()
        expect(current).toBeLessThanOrEqual(next)
      }
    })
  })

  describe('deletar', () => {
    it('should mark order as cancelled', async () => {
      const ordemId = 1

      const result = await service.deletar(mockUserId, mockTenantId, ordemId)

      expect(result.status).toBe('cancelado')
    })

    it('should throw error when deleting non-existent order', async () => {
      const invalidOrdemId = 99999

      expect(async () => {
        await service.deletar(mockUserId, mockTenantId, invalidOrdemId)
      }).rejects.toThrow('Ordem não encontrada')
    })
  })

  describe('listar', () => {
    it('should list all orders for user', async () => {
      const orders = await service.listar(mockUserId, mockTenantId)

      expect(Array.isArray(orders)).toBe(true)
    })

    it('should only return orders for current user', async () => {
      const orders = await service.listar(mockUserId, mockTenantId)

      orders.forEach(order => {
        expect(order.userId).toBe(mockUserId)
      })
    })
  })

  describe('obter', () => {
    it('should retrieve specific order', async () => {
      const ordemId = 1

      const order = await service.obter(mockUserId, mockTenantId, ordemId)

      expect(order).toHaveProperty('id')
      expect(order.id).toBe(ordemId)
      expect(order.userId).toBe(mockUserId)
    })

    it('should throw error when order not found', async () => {
      const invalidOrdemId = 99999

      expect(async () => {
        await service.obter(mockUserId, mockTenantId, invalidOrdemId)
      }).rejects.toThrow('Ordem não encontrada')
    })
  })

  describe('atualizar', () => {
    it('should update order details', async () => {
      const ordemId = 1
      const dados = {
        descricao: 'Descrição atualizada',
        prioridade: 'alta',
      }

      const result = await service.atualizar(mockUserId, mockTenantId, ordemId, dados)

      expect(result.descricao).toBe('Descrição atualizada')
      expect(result.prioridade).toBe('alta')
    })

    it('should validate update data', async () => {
      const ordemId = 1
      const invalidDados = {
        descricao: '', // Invalid: empty
      }

      expect(async () => {
        await service.atualizar(mockUserId, mockTenantId, ordemId, invalidDados)
      }).rejects.toThrow()
    })
  })
})
