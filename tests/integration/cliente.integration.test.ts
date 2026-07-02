import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { ClienteService } from '@/src/modules/clientes/services/cliente.service'
import { ClienteRepository } from '@/src/modules/clientes/repositories/cliente.repository'
import { AppError } from '@/lib/errors'

describe('ClienteService Integration Tests', () => {
  let clienteService: ClienteService
  let clienteRepository: ClienteRepository
  const userId = 'test-user-id'
  const tenantId = 'test-tenant-id'

  beforeEach(() => {
    clienteService = new ClienteService()
    clienteRepository = new ClienteRepository()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Create Cliente Flow', () => {
    it('should create a new cliente successfully', async () => {
      const clienteData = {
        nome: 'Empresa Teste',
        email: 'teste@empresa.com',
        telefone: '11999999999',
        endereco: 'Rua Teste, 123',
        tipo: 'pj',
        cnpj: '12345678000190',
        ativo: true,
      }

      const result = await clienteService.criarCliente(userId, clienteData)

      expect(result).toHaveProperty('id')
      expect(result.nome).toBe(clienteData.nome)
      expect(result.email).toBe(clienteData.email)
      expect(result.ativo).toBe(true)
    })

    it('should fail when creating cliente with invalid email', async () => {
      const invalidData = {
        nome: 'Empresa Teste',
        email: 'invalid-email',
        telefone: '11999999999',
        endereco: 'Rua Teste, 123',
        tipo: 'pj',
        cnpj: '12345678000190',
      }

      await expect(
        clienteService.criarCliente(userId, invalidData)
      ).rejects.toThrow(AppError)
    })

    it('should enforce user isolation when creating cliente', async () => {
      const clienteData = {
        nome: 'Empresa Teste',
        email: 'teste@empresa.com',
        telefone: '11999999999',
        endereco: 'Rua Teste, 123',
        tipo: 'pj',
        cnpj: '12345678000190',
      }

      const result = await clienteService.criarCliente(userId, clienteData)

      // Verify that another user cannot access this cliente
      const otherUserId = 'other-user-id'
      const listaOutroUsuario = await clienteService.listarClientes(otherUserId)

      const encontrado = listaOutroUsuario.find(
        (c: any) => c.id === result.id
      )
      expect(encontrado).toBeUndefined()
    })
  })

  describe('Read Cliente Flow', () => {
    it('should retrieve a cliente by id', async () => {
      const clienteData = {
        nome: 'Empresa Teste',
        email: 'teste@empresa.com',
        telefone: '11999999999',
        endereco: 'Rua Teste, 123',
        tipo: 'pj',
        cnpj: '12345678000190',
      }

      const created = await clienteService.criarCliente(userId, clienteData)
      const retrieved = await clienteService.obterCliente(userId, created.id)

      expect(retrieved.id).toBe(created.id)
      expect(retrieved.nome).toBe(clienteData.nome)
    })

    it('should return undefined for non-existent cliente', async () => {
      const result = await clienteService.obterCliente(userId, 99999)
      expect(result).toBeUndefined()
    })

    it('should list all clientes for user', async () => {
      const clienteData1 = {
        nome: 'Empresa 1',
        email: 'empresa1@test.com',
        telefone: '11999999999',
        endereco: 'Rua 1',
        tipo: 'pj',
        cnpj: '12345678000190',
      }

      const clienteData2 = {
        nome: 'Empresa 2',
        email: 'empresa2@test.com',
        telefone: '11988888888',
        endereco: 'Rua 2',
        tipo: 'pj',
        cnpj: '87654321000191',
      }

      await clienteService.criarCliente(userId, clienteData1)
      await clienteService.criarCliente(userId, clienteData2)

      const lista = await clienteService.listarClientes(userId)

      expect(lista.length).toBeGreaterThanOrEqual(2)
      expect(lista.some((c: any) => c.nome === clienteData1.nome)).toBe(true)
      expect(lista.some((c: any) => c.nome === clienteData2.nome)).toBe(true)
    })
  })

  describe('Update Cliente Flow', () => {
    it('should update cliente data successfully', async () => {
      const clienteData = {
        nome: 'Empresa Teste',
        email: 'teste@empresa.com',
        telefone: '11999999999',
        endereco: 'Rua Teste, 123',
        tipo: 'pj',
        cnpj: '12345678000190',
      }

      const created = await clienteService.criarCliente(userId, clienteData)

      const updateData = {
        nome: 'Empresa Teste Atualizada',
        telefone: '11988888888',
      }

      const updated = await clienteService.atualizarCliente(
        userId,
        created.id,
        updateData
      )

      expect(updated.nome).toBe(updateData.nome)
      expect(updated.telefone).toBe(updateData.telefone)
    })

    it('should fail when user tries to update another user\'s cliente', async () => {
      const clienteData = {
        nome: 'Empresa Teste',
        email: 'teste@empresa.com',
        telefone: '11999999999',
        endereco: 'Rua Teste, 123',
        tipo: 'pj',
        cnpj: '12345678000190',
      }

      const created = await clienteService.criarCliente(userId, clienteData)

      const otherUserId = 'other-user-id'
      await expect(
        clienteService.atualizarCliente(otherUserId, created.id, {
          nome: 'Hacked',
        })
      ).rejects.toThrow(AppError)
    })
  })

  describe('Delete Cliente Flow', () => {
    it('should soft delete cliente successfully', async () => {
      const clienteData = {
        nome: 'Empresa Teste',
        email: 'teste@empresa.com',
        telefone: '11999999999',
        endereco: 'Rua Teste, 123',
        tipo: 'pj',
        cnpj: '12345678000190',
      }

      const created = await clienteService.criarCliente(userId, clienteData)
      const deleted = await clienteService.deletarCliente(userId, created.id)

      expect(deleted).toBe(true)

      // Verify soft delete (should not appear in list)
      const lista = await clienteService.listarClientes(userId)
      const encontrado = lista.find((c: any) => c.id === created.id)
      expect(encontrado).toBeUndefined()
    })
  })

  describe('Satisfaction Tracking', () => {
    it('should update cliente satisfaction score', async () => {
      const clienteData = {
        nome: 'Empresa Teste',
        email: 'teste@empresa.com',
        telefone: '11999999999',
        endereco: 'Rua Teste, 123',
        tipo: 'pj',
        cnpj: '12345678000190',
      }

      const created = await clienteService.criarCliente(userId, clienteData)

      await clienteService.atualizarSatisfacao(userId, created.id, 4.5, 'Bom atendimento')

      const updated = await clienteService.obterCliente(userId, created.id)

      expect(updated.satisfacao).toBe(4.5)
      expect(updated.ultimoComentario).toBe('Bom atendimento')
    })

    it('should calculate average satisfaction', async () => {
      const clienteData = {
        nome: 'Empresa Teste',
        email: 'teste@empresa.com',
        telefone: '11999999999',
        endereco: 'Rua Teste, 123',
        tipo: 'pj',
        cnpj: '12345678000190',
      }

      const created = await clienteService.criarCliente(userId, clienteData)

      await clienteService.atualizarSatisfacao(userId, created.id, 5, 'Excelente')
      await clienteService.atualizarSatisfacao(userId, created.id, 4, 'Muito bom')
      await clienteService.atualizarSatisfacao(userId, created.id, 3, 'Satisfeito')

      const stats = await clienteService.obterEstatisticas(userId)

      expect(stats).toHaveProperty('totalClientes')
      expect(stats).toHaveProperty('satisfacaoMedia')
      expect(stats.satisfacaoMedia).toBeGreaterThan(0)
    })
  })
})
