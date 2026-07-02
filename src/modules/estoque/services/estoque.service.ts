import { estoqueRepository } from '../repositories/estoque.repository'
import { validateEstoqueData } from '@/lib/utils/validators'
import { AppError } from '@/lib/utils/api-response'
import { logger } from '@/lib/utils/logger'

export class EstoqueService {
  async criar(userId: string, tenantId: string, dados: any) {
    validateEstoqueData(dados)
    logger.info('EstoqueService', 'Criando novo item', { userId, nome: dados.nome })
    
    return await estoqueRepository.criar({
      userId,
      ...dados,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  async obter(userId: string, tenantId: string, id: number) {
    const item = await estoqueRepository.obter(id, userId)
    if (!item) {
      throw new AppError('Item não encontrado', 404)
    }
    return item
  }

  async listar(userId: string, tenantId: string, filtros: any = {}) {
    return await estoqueRepository.listar(userId, filtros)
  }

  async atualizar(userId: string, tenantId: string, id: number, dados: any) {
    await this.obter(userId, tenantId, id) // Verifica se existe
    validateEstoqueData(dados, true)
    
    logger.info('EstoqueService', 'Atualizando item', { userId, id })
    return await estoqueRepository.atualizar(id, userId, dados)
  }

  async deletar(userId: string, tenantId: string, id: number) {
    await this.obter(userId, tenantId, id) // Verifica se existe
    
    logger.info('EstoqueService', 'Deletando item', { userId, id })
    await estoqueRepository.deletar(id, userId)
  }

  async adicionarQuantidade(userId: string, tenantId: string, id: number, quantidade: number, motivo: string) {
    const item = await this.obter(userId, tenantId, id)
    const novaQuantidade = (item.quantidade_atual || 0) + quantidade

    await estoqueRepository.atualizar(id, userId, {
      quantidade_atual: novaQuantidade,
    })

    await estoqueRepository.registrarMovimentacao({
      userId,
      estoque_id: id,
      tipo: 'entrada',
      quantidade,
      motivo,
      createdAt: new Date(),
    })

    logger.info('EstoqueService', 'Quantidade adicionada', { id, quantidade, motivo })
  }

  async removerQuantidade(userId: string, tenantId: string, id: number, quantidade: number, motivo: string) {
    const item = await this.obter(userId, tenantId, id)
    const novaQuantidade = Math.max(0, (item.quantidade_atual || 0) - quantidade)

    await estoqueRepository.atualizar(id, userId, {
      quantidade_atual: novaQuantidade,
    })

    await estoqueRepository.registrarMovimentacao({
      userId,
      estoque_id: id,
      tipo: 'saida',
      quantidade,
      motivo,
      createdAt: new Date(),
    })

    logger.info('EstoqueService', 'Quantidade removida', { id, quantidade, motivo })
  }

  async obterEstoqueBaixo(userId: string, tenantId: string) {
    return await estoqueRepository.verificarEstoqueBaixo(userId)
  }

  async obterMovimentacoes(userId: string, tenantId: string, estoqueId?: number) {
    return await estoqueRepository.obterMovimentacoes(userId, estoqueId)
  }

  async obterResumo(userId: string, tenantId: string) {
    const items = await this.listar(userId, tenantId)
    const movimentacoes = await this.obterMovimentacoes(userId, tenantId)
    const itensLagos = await this.obterEstoqueBaixo(userId, tenantId)

    return {
      totalItens: items.length,
      itensAtivos: items.filter((i: any) => i.ativo).length,
      valorTotal: items.reduce((acc: number, i: any) => acc + ((i.quantidade_atual || 0) * (i.valor_unitario || 0)), 0),
      itensComEstoqueBaixo: itensLagos.length,
      movimentacoesUltimos30Dias: movimentacoes.filter((m: any) => 
        new Date(m.createdAt).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000
      ).length,
    }
  }
}

export const estoqueService = new EstoqueService()
