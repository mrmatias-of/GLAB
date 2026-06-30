import { db } from '@/lib/db'
import { logger } from '@/lib/utils/logger'

export interface DashboardMetrics {
  totalOrders: number
  openOrders: number
  completedOrders: number
  delayedOrders: number
  totalClients: number
  newClients: number
  totalTechnicians: number
  equipmentInBench: number
  monthlyRevenue: number
  monthlyProfit: number
  monthlyCosts: number
  averageRepairTime: number
  averageTicketValue: number
  sla: number
  nps: number
  technicianCount: number
  technicianProductivity: number
  dailyRevenue: number
  monthlyRevenue_full: number
  annualRevenue: number
}

export interface DashboardWidget {
  id: string
  title: string
  type: 'metric' | 'chart' | 'list' | 'table'
  position: number
  visible: boolean
  config?: Record<string, any>
}

export interface ChartData {
  label: string
  value: number
  percentage?: number
}

class DashboardService {
  async getMetrics(userId: string): Promise<DashboardMetrics> {
    try {
      logger.info('DashboardService', 'Fetching metrics for user', { userId })

      const now = new Date()
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

      // Aqui você implementaria as queries reais contra o banco
      // Por enquanto, retornando dados de exemplo
      const metrics: DashboardMetrics = {
        totalOrders: 247,
        openOrders: 12,
        completedOrders: 189,
        delayedOrders: 3,
        totalClients: 45,
        newClients: 8,
        totalTechnicians: 6,
        equipmentInBench: 15,
        monthlyRevenue: 18500,
        monthlyProfit: 6200,
        monthlyCosts: 12300,
        averageRepairTime: 4.5, // horas
        averageTicketValue: 250,
        sla: 95, // percentual
        nps: 82,
        technicianCount: 6,
        technicianProductivity: 87,
        dailyRevenue: 1250,
        monthlyRevenue_full: 18500,
        annualRevenue: 185000,
      }

      return metrics
    } catch (error) {
      logger.error('DashboardService', 'Error fetching metrics', error)
      throw error
    }
  }

  async getRevenueChart(userId: string): Promise<ChartData[]> {
    try {
      logger.info('DashboardService', 'Fetching revenue chart')

      // Implementar query real
      return [
        { label: 'Jan', value: 15000 },
        { label: 'Fev', value: 18500 },
        { label: 'Mar', value: 16200 },
        { label: 'Abr', value: 19800 },
        { label: 'Mai', value: 21200 },
        { label: 'Jun', value: 18500 },
      ]
    } catch (error) {
      logger.error('DashboardService', 'Error fetching revenue chart', error)
      throw error
    }
  }

  async getTechnicianProductivity(userId: string): Promise<ChartData[]> {
    try {
      logger.info('DashboardService', 'Fetching technician productivity')

      // Implementar query real
      return [
        { label: 'João Silva', value: 95, percentage: 95 },
        { label: 'Maria Santos', value: 88, percentage: 88 },
        { label: 'Pedro Costa', value: 92, percentage: 92 },
        { label: 'Ana Oliveira', value: 85, percentage: 85 },
        { label: 'Carlos Mendes', value: 90, percentage: 90 },
        { label: 'Beatriz Lima', value: 78, percentage: 78 },
      ]
    } catch (error) {
      logger.error('DashboardService', 'Error fetching productivity', error)
      throw error
    }
  }

  async getOrderStatus(userId: string): Promise<ChartData[]> {
    try {
      logger.info('DashboardService', 'Fetching order status')

      // Implementar query real
      return [
        { label: 'Aberta', value: 12, percentage: 5 },
        { label: 'Atribuída', value: 28, percentage: 11 },
        { label: 'Em Progresso', value: 89, percentage: 36 },
        { label: 'Concluída', value: 189, percentage: 76 },
        { label: 'Cancelada', value: 5, percentage: 2 },
      ]
    } catch (error) {
      logger.error('DashboardService', 'Error fetching order status', error)
      throw error
    }
  }

  async getDefaultWidgets(): Promise<DashboardWidget[]> {
    return [
      {
        id: 'revenue',
        title: 'Receita',
        type: 'metric',
        position: 1,
        visible: true,
      },
      {
        id: 'profit',
        title: 'Lucro',
        type: 'metric',
        position: 2,
        visible: true,
      },
      {
        id: 'orders',
        title: 'Ordens Abertas',
        type: 'metric',
        position: 3,
        visible: true,
      },
      {
        id: 'clients',
        title: 'Clientes Novos',
        type: 'metric',
        position: 4,
        visible: true,
      },
      {
        id: 'revenue-chart',
        title: 'Receita Mensal',
        type: 'chart',
        position: 5,
        visible: true,
      },
      {
        id: 'productivity',
        title: 'Produtividade de Técnicos',
        type: 'chart',
        position: 6,
        visible: true,
      },
      {
        id: 'order-status',
        title: 'Status das Ordens',
        type: 'chart',
        position: 7,
        visible: true,
      },
    ]
  }
}

export const dashboardService = new DashboardService()
