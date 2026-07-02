import { ClienteService } from '@/modules/clientes/services/cliente.service'
import { OrdemService } from '@/modules/ordens/services/ordem.service'
import { FinanceiroService } from '@/modules/financeiro/services/financeiro.service'
import { EstoqueService } from '@/modules/estoque/services/estoque.service'
import { TecnicoService } from '@/modules/tecnicos/services/tecnico.service'
import { ComissaoService } from '@/modules/comissoes/services/comissao.service'
import { FuncionarioService } from '@/modules/rh/services/funcionario.service'
import { logger } from '@/lib/logging'

/**
 * Dashboard Service
 * Aggregates data from multiple modules into a unified dashboard
 * No database queries - delegates to other services
 */
export class DashboardService {
  private clienteService: ClienteService
  private ordemService: OrdemService
  private financeiroService: FinanceiroService
  private estoqueService: EstoqueService
  private tecnicoService: TecnicoService
  private comissaoService: ComissaoService
  private funcionarioService: FuncionarioService

  constructor() {
    this.clienteService = new ClienteService()
    this.ordemService = new OrdemService()
    this.financeiroService = new FinanceiroService()
    this.estoqueService = new EstoqueService()
    this.tecnicoService = new TecnicoService()
    this.comissaoService = new ComissaoService()
    this.funcionarioService = new FuncionarioService()
  }

  /**
   * Get complete dashboard overview
   */
  async obterDashboardCompleto(userId: string, tenantId: string) {
    logger.info('DashboardService', 'Gerando dashboard completo', { userId })

    try {
      const [
        ordensStats,
        financeiroStats,
        estoqueStats,
        tecnicoStats,
        clienteStats,
        comissaoStats,
        funcionarioStats,
      ] = await Promise.all([
        this.obterStatsOrdens(userId, tenantId),
        this.obterStatsFinanceiro(userId, tenantId),
        this.obterStatsEstoque(userId, tenantId),
        this.obterStatsTecnicos(userId, tenantId),
        this.obterStatsClientes(userId, tenantId),
        this.obterStatsComissoes(userId, tenantId),
        this.obterStatsFuncionarios(userId, tenantId),
      ])

      return {
        ordens: ordensStats,
        financeiro: financeiroStats,
        estoque: estoqueStats,
        tecnicos: tecnicoStats,
        clientes: clienteStats,
        comissoes: comissaoStats,
        funcionarios: funcionarioStats,
        ultimaAtualizacao: new Date(),
      }
    } catch (error) {
      logger.error('DashboardService', 'Erro ao gerar dashboard', error)
      throw error
    }
  }

  /**
   * Get orders statistics
   */
  async obterStatsOrdens(userId: string, tenantId: string) {
    try {
      const ordensStats = await this.ordemService.obterCounts(userId, tenantId)
      const proximasVencer = await this.ordemService.obterProximasVencer(userId, tenantId)

      return {
        ...ordensStats,
        proximasVencer: proximasVencer.length,
      }
    } catch (error) {
      logger.error('DashboardService', 'Erro ao obter stats de ordens', error)
      return { aberto: 0, em_progresso: 0, pausado: 0, finalizado: 0, cancelado: 0, proximasVencer: 0 }
    }
  }

  /**
   * Get financial statistics
   */
  async obterStatsFinanceiro(userId: string, tenantId: string) {
    try {
      return await this.financeiroService.obterResumo(userId, tenantId)
    } catch (error) {
      logger.error('DashboardService', 'Erro ao obter stats de financeiro', error)
      return { totalReceitas: 0, totalDespesas: 0, lucro: 0, margem: 0 }
    }
  }

  /**
   * Get inventory statistics
   */
  async obterStatsEstoque(userId: string, tenantId: string) {
    try {
      return await this.estoqueService.obterResumo(userId, tenantId)
    } catch (error) {
      logger.error('DashboardService', 'Erro ao obter stats de estoque', error)
      return { totalItens: 0, itensAtivos: 0, valorTotal: 0, itensComEstoqueBaixo: 0 }
    }
  }

  /**
   * Get technicians statistics
   */
  async obterStatsTecnicos(userId: string, tenantId: string) {
    try {
      const tecnicos = await this.tecnicoService.listarAtivos(userId, tenantId)
      const totalOS = tecnicos.reduce((acc: number, t: any) => acc + (t.os_concluidas || 0), 0)
      const ratingMedio = this.calcularMedia(tecnicos, 'rating')

      return {
        totalTecnicos: tecnicos.length,
        totalOSConcluidas: totalOS,
        ratingMedio,
        especialidades: [...new Set(tecnicos.map((t: any) => t.especialidade))],
      }
    } catch (error) {
      logger.error('DashboardService', 'Erro ao obter stats de técnicos', error)
      return { totalTecnicos: 0, totalOSConcluidas: 0, ratingMedio: 0, especialidades: [] }
    }
  }

  /**
   * Get clients statistics
   */
  async obterStatsClientes(userId: string, tenantId: string) {
    try {
      const clientes = await this.clienteService.listar(userId, tenantId)
      const satisfacaoMedia = this.calcularMedia(clientes, 'satisfacao')
      const valorAcumuladoTotal = clientes.reduce((acc: number, c: any) => acc + parseFloat(c.valor_acumulado || 0), 0)

      return {
        totalClientes: clientes.length,
        clientesAtivos: clientes.filter((c: any) => c.ativo).length,
        satisfacaoMedia,
        valorAcumuladoTotal,
      }
    } catch (error) {
      logger.error('DashboardService', 'Erro ao obter stats de clientes', error)
      return { totalClientes: 0, clientesAtivos: 0, satisfacaoMedia: 0, valorAcumuladoTotal: 0 }
    }
  }

  /**
   * Get commissions statistics
   */
  async obterStatsComissoes(userId: string, tenantId: string) {
    try {
      return await this.comissaoService.obterResumo(userId, tenantId)
    } catch (error) {
      logger.error('DashboardService', 'Erro ao obter stats de comissões', error)
      return { totalComissoes: 0, totalPendente: 0, totalPago: 0, comissoesPorTecnico: [] }
    }
  }

  /**
   * Get employees statistics
   */
  async obterStatsFuncionarios(userId: string, tenantId: string) {
    try {
      const funcionarios = await this.funcionarioService.listar(userId, tenantId)
      const salarioTotalMensal = funcionarios.reduce((acc: number, f: any) => acc + parseFloat(f.salario_base || 0), 0)

      return {
        totalFuncionarios: funcionarios.length,
        funcionariosAtivos: funcionarios.filter((f: any) => f.status === 'ativo').length,
        salarioTotalMensal,
        departamentos: [...new Set(funcionarios.map((f: any) => f.departamento))],
      }
    } catch (error) {
      logger.error('DashboardService', 'Erro ao obter stats de funcionários', error)
      return { totalFuncionarios: 0, funcionariosAtivos: 0, salarioTotalMensal: 0, departamentos: [] }
    }
  }

  /**
   * Get KPIs and metrics
   */
  async obterKPIs(userId: string, tenantId: string) {
    try {
      const [stats, financeiro] = await Promise.all([
        this.obterDashboardCompleto(userId, tenantId),
        this.financeiroService.obterDashboard(userId, tenantId),
      ])

      return {
        taxaOSConcluidas: this.calcularTaxaOSConcluidas(stats),
        margem: financeiro.resumoMensal.margem,
        rotatividade: this.calcularRotatividade(stats),
        utilizacaoTecnicos: this.calcularUtilizacaoTecnicos(stats),
      }
    } catch (error) {
      logger.error('DashboardService', 'Erro ao obter KPIs', error)
      return { taxaOSConcluidas: 0, margem: 0, rotatividade: 0, utilizacaoTecnicos: 0 }
    }
  }

  /**
   * Helper methods
   */
  private calcularMedia(items: any[], campo: string): number {
    if (items.length === 0) return 0
    const soma = items.reduce((acc: number, item: any) => acc + (item[campo] || 0), 0)
    return soma / items.length
  }

  private calcularTaxaOSConcluidas(stats: any): number {
    const finalizadas = stats.ordens.finalizado || 0
    const total = (stats.ordens.aberto || 0) + (stats.ordens.em_progresso || 0) + (stats.ordens.finalizado || 0)
    return total > 0 ? (finalizadas / total) * 100 : 0
  }

  private calcularRotatividade(stats: any): number {
    // TODO: Calculate proper employee turnover rate
    return 0
  }

  private calcularUtilizacaoTecnicos(stats: any): number {
    // TODO: Calculate technician utilization rate based on allocation
    return 0
  }
}
