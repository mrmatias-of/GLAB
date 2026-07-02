import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { ClienteService } from '@/src/modules/clientes/services/cliente.service'
import { EstoqueService } from '@/src/modules/estoque/services/estoque.service'
import { OrdemService } from '@/src/modules/ordens/services/ordem.service'

/**
 * Performance and Load Tests
 * Tests service performance under various load conditions
 */

describe('Performance Tests', () => {
  let clienteService: ClienteService
  let estoqueService: EstoqueService
  let ordemService: OrdemService

  const userId = 'perf-test-user'

  beforeEach(() => {
    clienteService = new ClienteService()
    estoqueService = new EstoqueService()
    ordemService = new OrdemService()
  })

  afterEach(() => {
    // Cleanup
  })

  describe('ClienteService Performance', () => {
    it('should create cliente in <100ms', async () => {
      const clienteData = {
        nome: 'Performance Test Cliente',
        email: 'perf@test.com',
        telefone: '11999999999',
        endereco: 'Rua Teste',
        tipo: 'pj',
        cnpj: '12345678000190',
      }

      const startTime = performance.now()
      await clienteService.criarCliente(userId, clienteData)
      const endTime = performance.now()

      const duration = endTime - startTime
      console.log(`ClienteService.criarCliente duration: ${duration.toFixed(2)}ms`)

      expect(duration).toBeLessThan(100)
    })

    it('should retrieve cliente in <50ms', async () => {
      const clienteData = {
        nome: 'Performance Test Cliente',
        email: 'perf@test.com',
        telefone: '11999999999',
        endereco: 'Rua Teste',
        tipo: 'pj',
        cnpj: '12345678000190',
      }

      const cliente = await clienteService.criarCliente(userId, clienteData)

      const startTime = performance.now()
      await clienteService.obterCliente(userId, cliente.id)
      const endTime = performance.now()

      const duration = endTime - startTime
      console.log(`ClienteService.obterCliente duration: ${duration.toFixed(2)}ms`)

      expect(duration).toBeLessThan(50)
    })

    it('should list 100 clientes in <500ms', async () => {
      // Create 100 clientes
      const promises = Array.from({ length: 100 }, (_, i) => {
        const data = {
          nome: `Cliente ${i + 1}`,
          email: `cliente${i + 1}@test.com`,
          telefone: '11999999999',
          endereco: `Rua ${i + 1}`,
          tipo: 'pj',
          cnpj: `${String(10000000000000 + i).padStart(14, '0')}`,
        }

        return clienteService.criarCliente(userId, data)
      })

      await Promise.all(promises)

      const startTime = performance.now()
      const lista = await clienteService.listarClientes(userId)
      const endTime = performance.now()

      const duration = endTime - startTime
      console.log(`ClienteService.listarClientes (100) duration: ${duration.toFixed(2)}ms`)

      expect(lista.length).toBeGreaterThanOrEqual(100)
      expect(duration).toBeLessThan(500)
    })

    it('should update cliente in <100ms', async () => {
      const clienteData = {
        nome: 'Performance Test Cliente',
        email: 'perf@test.com',
        telefone: '11999999999',
        endereco: 'Rua Teste',
        tipo: 'pj',
        cnpj: '12345678000190',
      }

      const cliente = await clienteService.criarCliente(userId, clienteData)

      const startTime = performance.now()
      await clienteService.atualizarCliente(userId, cliente.id, { nome: 'Updated' })
      const endTime = performance.now()

      const duration = endTime - startTime
      console.log(`ClienteService.atualizarCliente duration: ${duration.toFixed(2)}ms`)

      expect(duration).toBeLessThan(100)
    })
  })

  describe('EstoqueService Performance', () => {
    it('should create produto in <100ms', async () => {
      const produtoData = {
        nome: 'Perf Test Produto',
        descricao: 'Test product',
        categoria: 'Test',
        sku: 'PERF-TEST-001',
        preco: 50.00,
        quantidadeMinima: 10,
      }

      const startTime = performance.now()
      await estoqueService.criarProduto(userId, produtoData)
      const endTime = performance.now()

      const duration = endTime - startTime
      console.log(`EstoqueService.criarProduto duration: ${duration.toFixed(2)}ms`)

      expect(duration).toBeLessThan(100)
    })

    it('should register inventory movement in <100ms', async () => {
      const produtoData = {
        nome: 'Perf Test Produto',
        descricao: 'Test product',
        categoria: 'Test',
        sku: 'PERF-TEST-001',
        preco: 50.00,
        quantidadeMinima: 10,
      }

      const produto = await estoqueService.criarProduto(userId, produtoData)

      const startTime = performance.now()
      await estoqueService.registrarEntrada(userId, produto.id, 100, 'Test')
      const endTime = performance.now()

      const duration = endTime - startTime
      console.log(`EstoqueService.registrarEntrada duration: ${duration.toFixed(2)}ms`)

      expect(duration).toBeLessThan(100)
    })

    it('should handle 50 sequential movements efficiently', async () => {
      const produtoData = {
        nome: 'Perf Test Produto',
        descricao: 'Test product',
        categoria: 'Test',
        sku: 'PERF-TEST-SEQ',
        preco: 50.00,
        quantidadeMinima: 10,
      }

      const produto = await estoqueService.criarProduto(userId, produtoData)
      await estoqueService.registrarEntrada(userId, produto.id, 5000, 'Initial')

      const startTime = performance.now()

      for (let i = 0; i < 50; i++) {
        await estoqueService.registrarSaida(userId, produto.id, 10, `Movement ${i + 1}`)
      }

      const endTime = performance.now()

      const duration = endTime - startTime
      const avgDuration = duration / 50
      console.log(`EstoqueService sequential movements (50): total ${duration.toFixed(2)}ms, avg ${avgDuration.toFixed(2)}ms`)

      expect(duration).toBeLessThan(5000) // Should complete within 5 seconds
      expect(avgDuration).toBeLessThan(150) // Average <150ms per operation
    })
  })

  describe('OrdemService Performance', () => {
    it('should create ordem in <100ms', async () => {
      const ordemData = {
        clienteId: 1,
        descricao: 'Performance test ordem',
        tipo: 'manutencao',
        prioridade: 'media',
        dataAgendada: new Date(Date.now() + 24 * 60 * 60 * 1000),
        endereco: 'Rua Teste',
        telefone: '11999999999',
      }

      const startTime = performance.now()
      await ordemService.criarOrdem(userId, ordemData)
      const endTime = performance.now()

      const duration = endTime - startTime
      console.log(`OrdemService.criarOrdem duration: ${duration.toFixed(2)}ms`)

      expect(duration).toBeLessThan(100)
    })

    it('should handle 10 concurrent orden creations', async () => {
      const promises = Array.from({ length: 10 }, (_, i) => {
        const data = {
          clienteId: 1,
          descricao: `Ordem ${i + 1}`,
          tipo: 'manutencao',
          prioridade: 'media',
          dataAgendada: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000),
          endereco: 'Rua Teste',
          telefone: '11999999999',
        }

        return ordemService.criarOrdem(userId, data)
      })

      const startTime = performance.now()
      const ordens = await Promise.all(promises)
      const endTime = performance.now()

      const duration = endTime - startTime
      const avgDuration = duration / 10
      console.log(`OrdemService concurrent creation (10): total ${duration.toFixed(2)}ms, avg ${avgDuration.toFixed(2)}ms`)

      expect(ordens.length).toBe(10)
      expect(duration).toBeLessThan(1000) // Should complete within 1 second
    })
  })

  describe('Load Test: Bulk Operations', () => {
    it('should handle creating 50 clientes efficiently', async () => {
      const startTime = performance.now()

      const promises = Array.from({ length: 50 }, (_, i) => {
        const data = {
          nome: `Bulk Cliente ${i + 1}`,
          email: `bulk${i + 1}@test.com`,
          telefone: '11999999999',
          endereco: `Rua ${i + 1}`,
          tipo: 'pj',
          cnpj: `${String(50000000000000 + i).padStart(14, '0')}`,
        }

        return clienteService.criarCliente(userId, data)
      })

      await Promise.all(promises)

      const endTime = performance.now()
      const duration = endTime - startTime
      const avgDuration = duration / 50

      console.log(`Bulk create 50 clientes: total ${duration.toFixed(2)}ms, avg ${avgDuration.toFixed(2)}ms`)

      expect(duration).toBeLessThan(5000) // Should complete within 5 seconds
      expect(avgDuration).toBeLessThan(150) // Average <150ms per operation
    })

    it('should handle creating 30 produtos efficiently', async () => {
      const startTime = performance.now()

      const promises = Array.from({ length: 30 }, (_, i) => {
        const data = {
          nome: `Bulk Produto ${i + 1}`,
          descricao: 'Bulk test product',
          categoria: 'Test',
          sku: `BULK-${i + 1}`,
          preco: 50.00 + i,
          quantidadeMinima: 10,
        }

        return estoqueService.criarProduto(userId, data)
      })

      await Promise.all(promises)

      const endTime = performance.now()
      const duration = endTime - startTime
      const avgDuration = duration / 30

      console.log(`Bulk create 30 produtos: total ${duration.toFixed(2)}ms, avg ${avgDuration.toFixed(2)}ms`)

      expect(duration).toBeLessThan(3000) // Should complete within 3 seconds
      expect(avgDuration).toBeLessThan(150) // Average <150ms per operation
    })
  })

  describe('Response Time SLAs', () => {
    it('should meet SLA for read operations (<100ms p95)', async () => {
      const clienteData = {
        nome: 'SLA Test Cliente',
        email: 'sla@test.com',
        telefone: '11999999999',
        endereco: 'Rua Teste',
        tipo: 'pj',
        cnpj: '12345678000190',
      }

      const cliente = await clienteService.criarCliente(userId, clienteData)

      const times: number[] = []

      for (let i = 0; i < 100; i++) {
        const start = performance.now()
        await clienteService.obterCliente(userId, cliente.id)
        const end = performance.now()
        times.push(end - start)
      }

      times.sort((a, b) => a - b)

      const p50 = times[49]
      const p95 = times[94]
      const p99 = times[98]
      const max = times[99]

      console.log(`Read operation percentiles: p50=${p50.toFixed(2)}ms, p95=${p95.toFixed(2)}ms, p99=${p99.toFixed(2)}ms, max=${max.toFixed(2)}ms`)

      expect(p95).toBeLessThan(100)
      expect(max).toBeLessThan(200)
    })

    it('should meet SLA for create operations (<150ms p95)', async () => {
      const times: number[] = []

      for (let i = 0; i < 50; i++) {
        const data = {
          nome: `SLA Test ${i}`,
          email: `sla${i}@test.com`,
          telefone: '11999999999',
          endereco: 'Rua Teste',
          tipo: 'pj',
          cnpj: `${String(12345600000000 + i).padStart(14, '0')}`,
        }

        const start = performance.now()
        await clienteService.criarCliente(userId, data)
        const end = performance.now()
        times.push(end - start)
      }

      times.sort((a, b) => a - b)

      const p50 = times[24]
      const p95 = times[47]
      const p99 = times[49]

      console.log(`Create operation percentiles: p50=${p50.toFixed(2)}ms, p95=${p95.toFixed(2)}ms, p99=${p99.toFixed(2)}ms`)

      expect(p95).toBeLessThan(150)
    })
  })
})
