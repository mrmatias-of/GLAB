import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { EstoqueService } from '@/src/modules/estoque/services/estoque.service'
import { EstoqueRepository } from '@/src/modules/estoque/repositories/estoque.repository'

describe('EstoqueService Integration Tests', () => {
  let estoqueService: EstoqueService
  const userId = 'test-user-id'

  beforeEach(() => {
    estoqueService = new EstoqueService()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Produto Management', () => {
    it('should create a new produto', async () => {
      const produtoData = {
        nome: 'Óleo para engrenagem',
        descricao: 'Óleo mineral para engrenagens',
        categoria: 'Óleos',
        sku: 'OLEO-001',
        preco: 25.50,
        quantidadeMinima: 10,
        ativo: true,
      }

      const result = await estoqueService.criarProduto(userId, produtoData)

      expect(result).toHaveProperty('id')
      expect(result.nome).toBe(produtoData.nome)
      expect(result.sku).toBe(produtoData.sku)
    })

    it('should list all produtos', async () => {
      const produtoData1 = {
        nome: 'Óleo para engrenagem',
        descricao: 'Óleo mineral',
        categoria: 'Óleos',
        sku: 'OLEO-001',
        preco: 25.50,
        quantidadeMinima: 10,
      }

      const produtoData2 = {
        nome: 'Filtro de ar',
        descricao: 'Filtro de ar para compressor',
        categoria: 'Filtros',
        sku: 'FILT-001',
        preco: 15.00,
        quantidadeMinima: 5,
      }

      await estoqueService.criarProduto(userId, produtoData1)
      await estoqueService.criarProduto(userId, produtoData2)

      const lista = await estoqueService.listarProdutos(userId)

      expect(lista.length).toBeGreaterThanOrEqual(2)
      expect(lista.some((p: any) => p.nome === produtoData1.nome)).toBe(true)
      expect(lista.some((p: any) => p.nome === produtoData2.nome)).toBe(true)
    })
  })

  describe('Inventory Movement', () => {
    it('should record entrada de estoque', async () => {
      const produtoData = {
        nome: 'Óleo para engrenagem',
        descricao: 'Óleo mineral',
        categoria: 'Óleos',
        sku: 'OLEO-001',
        preco: 25.50,
        quantidadeMinima: 10,
      }

      const produto = await estoqueService.criarProduto(userId, produtoData)

      const movimentacao = await estoqueService.registrarEntrada(userId, produto.id, 50, 'Compra fornecedor')

      expect(movimentacao).toHaveProperty('id')
      expect(movimentacao.quantidade).toBe(50)
      expect(movimentacao.tipo).toBe('entrada')
    })

    it('should record saída de estoque', async () => {
      const produtoData = {
        nome: 'Óleo para engrenagem',
        descricao: 'Óleo mineral',
        categoria: 'Óleos',
        sku: 'OLEO-001',
        preco: 25.50,
        quantidadeMinima: 10,
      }

      const produto = await estoqueService.criarProduto(userId, produtoData)

      // First add stock
      await estoqueService.registrarEntrada(userId, produto.id, 50, 'Compra')

      // Then remove stock
      const movimentacao = await estoqueService.registrarSaida(
        userId,
        produto.id,
        10,
        'Uso em serviço',
      )

      expect(movimentacao.quantidade).toBe(10)
      expect(movimentacao.tipo).toBe('saida')
    })

    it('should prevent saída when insufficient quantity', async () => {
      const produtoData = {
        nome: 'Óleo para engrenagem',
        descricao: 'Óleo mineral',
        categoria: 'Óleos',
        sku: 'OLEO-001',
        preco: 25.50,
        quantidadeMinima: 10,
      }

      const produto = await estoqueService.criarProduto(userId, produtoData)

      await expect(
        estoqueService.registrarSaida(userId, produto.id, 100, 'Teste')
      ).rejects.toThrow()
    })

    it('should track quantity accurately', async () => {
      const produtoData = {
        nome: 'Óleo para engrenagem',
        descricao: 'Óleo mineral',
        categoria: 'Óleos',
        sku: 'OLEO-001',
        preco: 25.50,
        quantidadeMinima: 10,
      }

      const produto = await estoqueService.criarProduto(userId, produtoData)

      await estoqueService.registrarEntrada(userId, produto.id, 100, 'Compra 1')
      await estoqueService.registrarEntrada(userId, produto.id, 50, 'Compra 2')
      await estoqueService.registrarSaida(userId, produto.id, 30, 'Uso')

      const movimentos = await estoqueService.obterMovimentacoes(userId, produto.id)

      const totalEntradas = movimentos
        .filter((m: any) => m.tipo === 'entrada')
        .reduce((sum: number, m: any) => sum + m.quantidade, 0)

      const totalSaidas = movimentos
        .filter((m: any) => m.tipo === 'saida')
        .reduce((sum: number, m: any) => sum + m.quantidade, 0)

      expect(totalEntradas).toBe(150)
      expect(totalSaidas).toBe(30)
    })
  })

  describe('Low Stock Alerts', () => {
    it('should alert when quantidade approaches minima', async () => {
      const produtoData = {
        nome: 'Óleo para engrenagem',
        descricao: 'Óleo mineral',
        categoria: 'Óleos',
        sku: 'OLEO-001',
        preco: 25.50,
        quantidadeMinima: 20,
      }

      const produto = await estoqueService.criarProduto(userId, produtoData)

      await estoqueService.registrarEntrada(userId, produto.id, 50, 'Compra')
      await estoqueService.registrarSaida(userId, produto.id, 35, 'Uso')

      const alertas = await estoqueService.obterAlertasEstoque(userId)

      expect(alertas).toContainEqual(
        expect.objectContaining({
          produtoId: produto.id,
          tipo: 'quantidade_minima',
        })
      )
    })
  })

  describe('User Isolation', () => {
    it('should enforce user isolation for produtos', async () => {
      const produtoData = {
        nome: 'Óleo para engrenagem',
        descricao: 'Óleo mineral',
        categoria: 'Óleos',
        sku: 'OLEO-001',
        preco: 25.50,
        quantidadeMinima: 10,
      }

      const produto = await estoqueService.criarProduto(userId, produtoData)

      const otherUserId = 'other-user-id'
      const listaOutro = await estoqueService.listarProdutos(otherUserId)

      expect(listaOutro.some((p: any) => p.id === produto.id)).toBe(false)
    })

    it('should prevent cross-user movimentacoes', async () => {
      const produtoData = {
        nome: 'Óleo para engrenagem',
        descricao: 'Óleo mineral',
        categoria: 'Óleos',
        sku: 'OLEO-001',
        preco: 25.50,
        quantidadeMinima: 10,
      }

      const produto = await estoqueService.criarProduto(userId, produtoData)

      const otherUserId = 'other-user-id'
      await expect(
        estoqueService.registrarEntrada(otherUserId, produto.id, 50, 'Teste')
      ).rejects.toThrow()
    })
  })
})
