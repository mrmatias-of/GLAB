import { describe, it, expect, beforeEach, vi } from 'vitest'
import { DashboardService } from '@/modules/dashboard/services/dashboard.service'

describe('DashboardService', () => {
  let service: DashboardService
  const testUserId = 'test-user-123'
  const testTenantId = 'tenant-456'

  beforeEach(() => {
    service = new DashboardService()
  })

  describe('getKpis', () => {
    it('should return KPI metrics', async () => {
      const kpis = await service.getKpis(testUserId, testTenantId)

      expect(kpis).toBeDefined()
      expect(kpis).toHaveProperty('totalClientes')
      expect(kpis).toHaveProperty('totalOrdensAbertas')
      expect(kpis).toHaveProperty('faturamentoMes')
      expect(kpis).toHaveProperty('lucroMes')
    })

    it('should calculate correct financial metrics', async () => {
      const kpis = await service.getKpis(testUserId, testTenantId)

      expect(typeof kpis.faturamentoMes).toBe('number')
      expect(typeof kpis.lucroMes).toBe('number')
      expect(kpis.margemLucro).toBeGreaterThanOrEqual(0)
      expect(kpis.margemLucro).toBeLessThanOrEqual(100)
    })
  })

  describe('getFinancialSummary', () => {
    it('should return financial summary', async () => {
      const summary = await service.getFinancialSummary(testUserId, testTenantId)

      expect(summary).toBeDefined()
      expect(summary).toHaveProperty('totalReceitas')
      expect(summary).toHaveProperty('totalDespesas')
      expect(summary).toHaveProperty('lucroLiquido')
      expect(summary).toHaveProperty('comissoesPendentes')
    })

    it('should calculate lucro as receitas minus despesas', async () => {
      const summary = await service.getFinancialSummary(testUserId, testTenantId)

      const expectedLucro = summary.totalReceitas - summary.totalDespesas
      expect(summary.lucroLiquido).toBe(expectedLucro)
    })
  })

  describe('getClientMetrics', () => {
    it('should return client metrics', async () => {
      const metrics = await service.getClientMetrics(testUserId, testTenantId)

      expect(metrics).toBeDefined()
      expect(metrics).toHaveProperty('totalClientes')
      expect(metrics).toHaveProperty('clientesAtivos')
      expect(metrics).toHaveProperty('satisfacaoMedia')
      expect(metrics).toHaveProperty('clientesFidelidade')
    })

    it('should have satisfaction between 0 and 5', async () => {
      const metrics = await service.getClientMetrics(testUserId, testTenantId)

      expect(metrics.satisfacaoMedia).toBeGreaterThanOrEqual(0)
      expect(metrics.satisfacaoMedia).toBeLessThanOrEqual(5)
    })
  })

  describe('getTechnicianMetrics', () => {
    it('should return technician performance metrics', async () => {
      const metrics = await service.getTechnicianMetrics(testUserId, testTenantId)

      expect(metrics).toBeDefined()
      expect(metrics).toHaveProperty('totalTecnicos')
      expect(metrics).toHaveProperty('osCompletadas')
      expect(metrics).toHaveProperty('avaliacaoMedia')
      expect(metrics).toHaveProperty('produtividadeMedia')
    })

    it('should calculate correct productivity rates', async () => {
      const metrics = await service.getTechnicianMetrics(testUserId, testTenantId)

      expect(metrics.produtividadeMedia).toBeGreaterThanOrEqual(0)
      expect(metrics.produtividadeMedia).toBeLessThanOrEqual(100)
    })
  })

  describe('getAllMetrics', () => {
    it('should return comprehensive dashboard data', async () => {
      const allMetrics = await service.getAllMetrics(testUserId, testTenantId)

      expect(allMetrics).toBeDefined()
      expect(allMetrics).toHaveProperty('kpis')
      expect(allMetrics).toHaveProperty('financial')
      expect(allMetrics).toHaveProperty('clients')
      expect(allMetrics).toHaveProperty('technicians')
      expect(allMetrics).toHaveProperty('timestamp')
    })

    it('should include recent data', async () => {
      const allMetrics = await service.getAllMetrics(testUserId, testTenantId)

      const now = new Date()
      const minutesAgo = new Date(now.getTime() - 5 * 60000)

      expect(new Date(allMetrics.timestamp).getTime()).toBeGreaterThan(minutesAgo.getTime())
    })
  })
})
