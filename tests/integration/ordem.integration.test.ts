import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { OrdemService } from '@/src/modules/ordens/services/ordem.service'

describe('OrdemService Integration Tests', () => {
  let ordemService: OrdemService
  const userId = 'test-user-id'
  const clienteId = 1
  const tecnicoId = 1

  beforeEach(() => {
    ordemService = new OrdemService()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Ordem Creation and Status Flow', () => {
    it('should create a new ordem', async () => {
      const ordemData = {
        clienteId,
        descricao: 'Manutenção de compressor',
        tipo: 'manutencao',
        prioridade: 'alta',
        dataAgendada: new Date(Date.now() + 24 * 60 * 60 * 1000),
        endereco: 'Rua Teste, 123',
        telefone: '11999999999',
      }

      const result = await ordemService.criarOrdem(userId, ordemData)

      expect(result).toHaveProperty('id')
      expect(result.status).toBe('pendente')
      expect(result.descricao).toBe(ordemData.descricao)
    })

    it('should transition ordem through status workflow', async () => {
      const ordemData = {
        clienteId,
        descricao: 'Manutenção de compressor',
        tipo: 'manutencao',
        prioridade: 'alta',
        dataAgendada: new Date(Date.now() + 24 * 60 * 60 * 1000),
        endereco: 'Rua Teste, 123',
        telefone: '11999999999',
      }

      const ordem = await ordemService.criarOrdem(userId, ordemData)

      // Assign to technician
      const assigned = await ordemService.atribuirTecnico(userId, ordem.id, tecnicoId)
      expect(assigned.status).toBe('atribuida')

      // Start service
      const started = await ordemService.iniciarServico(userId, ordem.id)
      expect(started.status).toBe('em_andamento')

      // Complete service
      const completed = await ordemService.finalizarServico(userId, ordem.id, 'Serviço concluído com sucesso')
      expect(completed.status).toBe('concluida')
    })

    it('should not allow invalid status transitions', async () => {
      const ordemData = {
        clienteId,
        descricao: 'Manutenção',
        tipo: 'manutencao',
        prioridade: 'alta',
        dataAgendada: new Date(Date.now() + 24 * 60 * 60 * 1000),
        endereco: 'Rua Teste, 123',
        telefone: '11999999999',
      }

      const ordem = await ordemService.criarOrdem(userId, ordemData)

      // Cannot complete without starting
      await expect(
        ordemService.finalizarServico(userId, ordem.id, 'Teste')
      ).rejects.toThrow()
    })
  })

  describe('Technician Assignment', () => {
    it('should assign technician to ordem', async () => {
      const ordemData = {
        clienteId,
        descricao: 'Manutenção',
        tipo: 'manutencao',
        prioridade: 'alta',
        dataAgendada: new Date(Date.now() + 24 * 60 * 60 * 1000),
        endereco: 'Rua Teste, 123',
        telefone: '11999999999',
      }

      const ordem = await ordemService.criarOrdem(userId, ordemData)
      const assigned = await ordemService.atribuirTecnico(userId, ordem.id, tecnicoId)

      expect(assigned.tecnicoId).toBe(tecnicoId)
      expect(assigned.status).toBe('atribuida')
    })

    it('should list ordens for specific technician', async () => {
      const ordemData1 = {
        clienteId,
        descricao: 'Manutenção 1',
        tipo: 'manutencao',
        prioridade: 'alta',
        dataAgendada: new Date(Date.now() + 24 * 60 * 60 * 1000),
        endereco: 'Rua 1',
        telefone: '11999999999',
      }

      const ordemData2 = {
        clienteId,
        descricao: 'Manutenção 2',
        tipo: 'manutencao',
        prioridade: 'media',
        dataAgendada: new Date(Date.now() + 48 * 60 * 60 * 1000),
        endereco: 'Rua 2',
        telefone: '11988888888',
      }

      const ordem1 = await ordemService.criarOrdem(userId, ordemData1)
      const ordem2 = await ordemService.criarOrdem(userId, ordemData2)

      await ordemService.atribuirTecnico(userId, ordem1.id, tecnicoId)
      await ordemService.atribuirTecnico(userId, ordem2.id, tecnicoId)

      const ordensDoTecnico = await ordemService.listarOrdensPorTecnico(userId, tecnicoId)

      expect(ordensDoTecnico.length).toBeGreaterThanOrEqual(2)
      expect(ordensDoTecnico.some((o: any) => o.id === ordem1.id)).toBe(true)
      expect(ordensDoTecnico.some((o: any) => o.id === ordem2.id)).toBe(true)
    })
  })

  describe('Ordem Filtering and Searching', () => {
    it('should filter ordens by status', async () => {
      const ordemData1 = {
        clienteId,
        descricao: 'Manutenção 1',
        tipo: 'manutencao',
        prioridade: 'alta',
        dataAgendada: new Date(Date.now() + 24 * 60 * 60 * 1000),
        endereco: 'Rua 1',
        telefone: '11999999999',
      }

      const ordemData2 = {
        clienteId,
        descricao: 'Manutenção 2',
        tipo: 'manutencao',
        prioridade: 'media',
        dataAgendada: new Date(Date.now() + 48 * 60 * 60 * 1000),
        endereco: 'Rua 2',
        telefone: '11988888888',
      }

      const ordem1 = await ordemService.criarOrdem(userId, ordemData1)
      const ordem2 = await ordemService.criarOrdem(userId, ordemData2)

      await ordemService.atribuirTecnico(userId, ordem1.id, tecnicoId)
      await ordemService.finalizarServico(userId, ordem1.id, 'Concluída')

      const ordensConcluidas = await ordemService.listarOrdensPorStatus(userId, 'concluida')
      const ordensPendentes = await ordemService.listarOrdensPorStatus(userId, 'pendente')

      expect(ordensConcluidas.some((o: any) => o.id === ordem1.id)).toBe(true)
      expect(ordensPendentes.some((o: any) => o.id === ordem2.id)).toBe(true)
    })

    it('should filter ordens by priority', async () => {
      const ordemAlta = {
        clienteId,
        descricao: 'Urgente',
        tipo: 'manutencao',
        prioridade: 'alta',
        dataAgendada: new Date(Date.now() + 24 * 60 * 60 * 1000),
        endereco: 'Rua 1',
        telefone: '11999999999',
      }

      const ordemBaixa = {
        clienteId,
        descricao: 'Normal',
        tipo: 'manutencao',
        prioridade: 'baixa',
        dataAgendada: new Date(Date.now() + 48 * 60 * 60 * 1000),
        endereco: 'Rua 2',
        telefone: '11988888888',
      }

      await ordemService.criarOrdem(userId, ordemAlta)
      await ordemService.criarOrdem(userId, ordemBaixa)

      const ordensAltas = await ordemService.listarOrdensPorPrioridade(userId, 'alta')

      expect(ordensAltas.length).toBeGreaterThan(0)
      expect(ordensAltas.every((o: any) => o.prioridade === 'alta')).toBe(true)
    })
  })

  describe('User Isolation', () => {
    it('should enforce user isolation for ordens', async () => {
      const ordemData = {
        clienteId,
        descricao: 'Manutenção',
        tipo: 'manutencao',
        prioridade: 'alta',
        dataAgendada: new Date(Date.now() + 24 * 60 * 60 * 1000),
        endereco: 'Rua Teste',
        telefone: '11999999999',
      }

      const ordem = await ordemService.criarOrdem(userId, ordemData)

      const otherUserId = 'other-user-id'
      const listaOutro = await ordemService.listarOrdens(otherUserId)

      expect(listaOutro.some((o: any) => o.id === ordem.id)).toBe(false)
    })

    it('should prevent cross-user assignment', async () => {
      const ordemData = {
        clienteId,
        descricao: 'Manutenção',
        tipo: 'manutencao',
        prioridade: 'alta',
        dataAgendada: new Date(Date.now() + 24 * 60 * 60 * 1000),
        endereco: 'Rua Teste',
        telefone: '11999999999',
      }

      const ordem = await ordemService.criarOrdem(userId, ordemData)

      const otherUserId = 'other-user-id'
      await expect(
        ordemService.atribuirTecnico(otherUserId, ordem.id, tecnicoId)
      ).rejects.toThrow()
    })
  })

  describe('Performance Optimization', () => {
    it('should handle bulk ordem creation efficiently', async () => {
      const startTime = Date.now()

      const promises = Array.from({ length: 10 }, (_, i) => {
        const ordemData = {
          clienteId,
          descricao: `Ordem ${i + 1}`,
          tipo: 'manutencao',
          prioridade: 'media',
          dataAgendada: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000),
          endereco: `Rua ${i + 1}`,
          telefone: '11999999999',
        }

        return ordemService.criarOrdem(userId, ordemData)
      })

      const ordens = await Promise.all(promises)

      const endTime = Date.now()
      const duration = endTime - startTime

      expect(ordens.length).toBe(10)
      expect(duration).toBeLessThan(5000) // Should complete within 5 seconds
    })
  })
})
