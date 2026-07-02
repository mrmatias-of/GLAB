import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { ClienteService } from '@/src/modules/clientes/services/cliente.service'
import { EstoqueService } from '@/src/modules/estoque/services/estoque.service'
import { OrdemService } from '@/src/modules/ordens/services/ordem.service'
import { FinanceiroService } from '@/src/modules/financeiro/services/financeiro.service'
import { DashboardService } from '@/src/modules/dashboard/services/dashboard.service'

/**
 * E2E Tests for Complete Business Workflows
 * These tests simulate real user workflows across multiple services
 */

describe('E2E: Complete Business Workflows', () => {
  let clienteService: ClienteService
  let estoqueService: EstoqueService
  let ordemService: OrdemService
  let financeiroService: FinanceiroService
  let dashboardService: DashboardService

  const userId = 'e2e-test-user'
  let clienteId: number
  let tecnicoId: number

  beforeEach(() => {
    clienteService = new ClienteService()
    estoqueService = new EstoqueService()
    ordemService = new OrdemService()
    financeiroService = new FinanceiroService()
    dashboardService = new DashboardService()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('E2E: Customer Service Flow', () => {
    it('should complete full customer lifecycle: create -> order -> service -> payment', async () => {
      // Step 1: Create new customer
      const clienteData = {
        nome: 'Empresa ABC Ltda',
        email: 'contato@empresaabc.com',
        telefone: '11987654321',
        endereco: 'Av. Paulista, 1000 - SP',
        tipo: 'pj',
        cnpj: '12345678000190',
        ativo: true,
      }

      const cliente = await clienteService.criarCliente(userId, clienteData)
      clienteId = cliente.id
      expect(cliente).toHaveProperty('id')
      expect(cliente.nome).toBe(clienteData.nome)

      // Step 2: Create service order for customer
      const ordemData = {
        clienteId,
        descricao: 'Manutenção preventiva de compressor de ar',
        tipo: 'manutencao',
        prioridade: 'media',
        dataAgendada: new Date(Date.now() + 24 * 60 * 60 * 1000),
        endereco: cliente.endereco,
        telefone: cliente.telefone,
      }

      const ordem = await ordemService.criarOrdem(userId, ordemData)
      expect(ordem.status).toBe('pendente')
      expect(ordem.clienteId).toBe(clienteId)

      // Step 3: Assign technician
      tecnicoId = 1
      const atribuida = await ordemService.atribuirTecnico(userId, ordem.id, tecnicoId)
      expect(atribuida.status).toBe('atribuida')
      expect(atribuida.tecnicoId).toBe(tecnicoId)

      // Step 4: Process and complete service
      const iniciada = await ordemService.iniciarServico(userId, ordem.id)
      expect(iniciada.status).toBe('em_andamento')

      const concluida = await ordemService.finalizarServico(
        userId,
        ordem.id,
        'Serviço concluído com sucesso. Compressor testado e funcionando normalmente.'
      )
      expect(concluida.status).toBe('concluida')

      // Step 5: Register payment
      const pagamento = await financeiroService.registrarPagamento(userId, {
        ordemId: ordem.id,
        clienteId,
        valor: 250.00,
        tipo: 'credito',
        descricao: 'Manutenção compressor',
      })

      expect(pagamento).toHaveProperty('id')
      expect(pagamento.status).toBe('pendente')

      // Step 6: Confirm payment
      const confirmado = await financeiroService.confirmarPagamento(userId, pagamento.id)
      expect(confirmado.status).toBe('confirmado')

      // Step 7: Update customer satisfaction
      await clienteService.atualizarSatisfacao(userId, clienteId, 4.5, 'Excelente atendimento, serviço rápido e eficiente')

      // Step 8: Check dashboard metrics
      const dashboard = await dashboardService.obterDashboard(userId)

      expect(dashboard).toHaveProperty('kpis')
      expect(dashboard.kpis).toHaveProperty('totalClientes')
      expect(dashboard.kpis.totalClientes).toBeGreaterThan(0)
    })
  })

  describe('E2E: Inventory Management Workflow', () => {
    it('should manage complete inventory cycle: purchase -> stock in -> use -> alert', async () => {
      // Step 1: Create product
      const produtoData = {
        nome: 'Óleo para compressor',
        descricao: 'Óleo mineral de alta performance',
        categoria: 'Óleos',
        sku: 'OLEO-COMPRESS-001',
        preco: 45.00,
        quantidadeMinima: 20,
        ativo: true,
      }

      const produto = await estoqueService.criarProduto(userId, produtoData)
      expect(produto).toHaveProperty('id')

      // Step 2: Record purchase (entrada)
      const entrada1 = await estoqueService.registrarEntrada(
        userId,
        produto.id,
        100,
        'Compra fornecedor principal'
      )
      expect(entrada1.tipo).toBe('entrada')
      expect(entrada1.quantidade).toBe(100)

      // Step 3: Record second purchase
      const entrada2 = await estoqueService.registrarEntrada(
        userId,
        produto.id,
        50,
        'Compra fornecedor backup'
      )

      // Step 4: Use material (saída)
      const saida1 = await estoqueService.registrarSaida(
        userId,
        produto.id,
        30,
        'Uso em serviço OS #001'
      )
      expect(saida1.tipo).toBe('saida')

      const saida2 = await estoqueService.registrarSaida(
        userId,
        produto.id,
        40,
        'Uso em serviço OS #002'
      )

      const saida3 = await estoqueService.registrarSaida(
        userId,
        produto.id,
        50,
        'Uso em serviço OS #003'
      )

      // Step 5: Check low stock alerts
      const alertas = await estoqueService.obterAlertasEstoque(userId)

      // Should have alert for low stock (remaining: 30, minimo: 20)
      const alerta = alertas.find((a: any) => a.produtoId === produto.id && a.tipo === 'quantidade_minima')
      expect(alerta).toBeDefined()

      // Step 6: Verify movement history
      const movimentos = await estoqueService.obterMovimentacoes(userId, produto.id)

      const totalEntradas = movimentos
        .filter((m: any) => m.tipo === 'entrada')
        .reduce((sum: number, m: any) => sum + m.quantidade, 0)

      const totalSaidas = movimentos
        .filter((m: any) => m.tipo === 'saida')
        .reduce((sum: number, m: any) => sum + m.quantidade, 0)

      expect(totalEntradas).toBe(150)
      expect(totalSaidas).toBe(120)
    })
  })

  describe('E2E: Multi-Service Order Workflow', () => {
    it('should process complex order with multiple services and materials', async () => {
      // Create customer
      const cliente = await clienteService.criarCliente(userId, {
        nome: 'XYZ Indústria',
        email: 'xyz@industria.com',
        telefone: '11999999999',
        endereco: 'Rua Industrial, 500',
        tipo: 'pj',
        cnpj: '98765432000191',
      })

      // Create multiple service orders for same customer
      const ordem1Data = {
        clienteId: cliente.id,
        descricao: 'Diagnóstico de sistema',
        tipo: 'diagnostico',
        prioridade: 'alta',
        dataAgendada: new Date(Date.now() + 12 * 60 * 60 * 1000),
        endereco: cliente.endereco,
        telefone: cliente.telefone,
      }

      const ordem2Data = {
        clienteId: cliente.id,
        descricao: 'Reparação de compressor',
        tipo: 'reparo',
        prioridade: 'alta',
        dataAgendada: new Date(Date.now() + 24 * 60 * 60 * 1000),
        endereco: cliente.endereco,
        telefone: cliente.telefone,
      }

      const ordem1 = await ordemService.criarOrdem(userId, ordem1Data)
      const ordem2 = await ordemService.criarOrdem(userId, ordem2Data)

      // Process first order
      const diagnostico = await ordemService.atribuirTecnico(userId, ordem1.id, 1)
      await ordemService.iniciarServico(userId, ordem1.id)
      const diagnosticoFim = await ordemService.finalizarServico(
        userId,
        ordem1.id,
        'Diagnóstico completo: compressor com falha de vedação'
      )

      // Register payment for diagnosis
      const pagDiag = await financeiroService.registrarPagamento(userId, {
        ordemId: ordem1.id,
        clienteId: cliente.id,
        valor: 100.00,
        tipo: 'credito',
        descricao: 'Diagnóstico',
      })

      // Process second order
      const reparo = await ordemService.atribuirTecnico(userId, ordem2.id, 2)
      await ordemService.iniciarServico(userId, ordem2.id)
      const repairoFim = await ordemService.finalizarServico(
        userId,
        ordem2.id,
        'Compressor reparado e testado'
      )

      // Register payment for repair
      const pagRep = await financeiroService.registrarPagamento(userId, {
        ordemId: ordem2.id,
        clienteId: cliente.id,
        valor: 450.00,
        tipo: 'credito',
        descricao: 'Reparo compressor',
      })

      // Get financial summary for customer
      const transacoes = await financeiroService.listarTransacoes(userId, {
        clienteId: cliente.id,
      })

      expect(transacoes.length).toBeGreaterThanOrEqual(2)

      const totalOrcado = transacoes.reduce((sum: number, t: any) => sum + t.valor, 0)
      expect(totalOrcado).toBe(550.00)
    })
  })

  describe('E2E: Dashboard Analytics', () => {
    it('should aggregate data from all services into dashboard', async () => {
      // Create test data across multiple services
      const cliente1 = await clienteService.criarCliente(userId, {
        nome: 'Cliente 1',
        email: 'cliente1@test.com',
        telefone: '11999999999',
        endereco: 'Rua 1',
        tipo: 'pj',
        cnpj: '12345678000190',
      })

      const cliente2 = await clienteService.criarCliente(userId, {
        nome: 'Cliente 2',
        email: 'cliente2@test.com',
        telefone: '11988888888',
        endereco: 'Rua 2',
        tipo: 'pj',
        cnpj: '87654321000191',
      })

      // Create product
      const produto = await estoqueService.criarProduto(userId, {
        nome: 'Peça X',
        descricao: 'Peça importante',
        categoria: 'Peças',
        sku: 'PECA-X-001',
        preco: 100.00,
        quantidadeMinima: 5,
      })

      // Create orders
      const ordem1 = await ordemService.criarOrdem(userId, {
        clienteId: cliente1.id,
        descricao: 'Serviço 1',
        tipo: 'manutencao',
        prioridade: 'alta',
        dataAgendada: new Date(Date.now() + 24 * 60 * 60 * 1000),
        endereco: cliente1.endereco,
        telefone: cliente1.telefone,
      })

      const ordem2 = await ordemService.criarOrdem(userId, {
        clienteId: cliente2.id,
        descricao: 'Serviço 2',
        tipo: 'reparo',
        prioridade: 'media',
        dataAgendada: new Date(Date.now() + 48 * 60 * 60 * 1000),
        endereco: cliente2.endereco,
        telefone: cliente2.telefone,
      })

      // Get dashboard
      const dashboard = await dashboardService.obterDashboard(userId)

      // Verify aggregated data
      expect(dashboard).toHaveProperty('kpis')
      expect(dashboard.kpis).toHaveProperty('totalClientes')
      expect(dashboard.kpis).toHaveProperty('totalOrdens')
      expect(dashboard.kpis).toHaveProperty('totalItens')
      expect(dashboard.kpis).toHaveProperty('arrecadacao')

      expect(dashboard.kpis.totalClientes).toBeGreaterThanOrEqual(2)
      expect(dashboard.kpis.totalOrdens).toBeGreaterThanOrEqual(2)
    })
  })
})
