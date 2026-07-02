import { describe, beforeEach, afterEach, vi } from 'vitest'

/**
 * Test setup file
 * Configures test environment, mocks, and utilities
 */

// Mock database connection
vi.mock('@/lib/db', () => ({
  db: {
    query: {
      clientes: { findFirst: vi.fn(), findMany: vi.fn() },
      ordens_servico: { findFirst: vi.fn(), findMany: vi.fn() },
      estoque: { findFirst: vi.fn(), findMany: vi.fn() },
      financeiro: { findFirst: vi.fn(), findMany: vi.fn() },
      funcionarios: { findFirst: vi.fn(), findMany: vi.fn() },
      tecnicos: { findFirst: vi.fn(), findMany: vi.fn() },
      servicos: { findFirst: vi.fn(), findMany: vi.fn() },
    },
    insert: vi.fn(() => ({
      values: vi.fn(() => ({
        returning: vi.fn(),
      })),
    })),
    update: vi.fn(() => ({
      set: vi.fn(() => ({
        where: vi.fn(() => ({
          returning: vi.fn(),
        })),
      })),
    })),
    delete: vi.fn(() => ({
      where: vi.fn(vi.fn()),
    })),
  },
}))

// Mock logger
vi.mock('@/lib/logging', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}))

// Mock error class
vi.mock('@/lib/errors', () => ({
  AppError: class AppError extends Error {
    constructor(message: string, public statusCode: number = 500) {
      super(message)
      this.name = 'AppError'
    }

    static NotFound(resource: string) {
      return new AppError(`${resource} não encontrado`, 404)
    }
  },
}))

// Test utilities
export const mockUserId = 'test-user-123'
export const mockTenantId = 'test-tenant-456'

export const mockCliente = {
  id: 1,
  userId: mockUserId,
  nome: 'Cliente Teste',
  email: 'cliente@teste.com',
  telefone: '11999999999',
  cpf_cnpj: '12345678901',
  endereco: 'Rua Teste, 123',
  cidade: 'São Paulo',
  estado: 'SP',
  cep: '01234-567',
  observacoes: 'Cliente de teste',
  ativo: true,
  valor_acumulado: '1000.00',
  satisfacao: 5,
  createdAt: new Date(),
  updatedAt: new Date(),
}

export const mockOrdem = {
  id: 1,
  userId: mockUserId,
  numero: 'OS-2024-001',
  cliente_id: 1,
  tecnico_id: 1,
  descricao: 'Ordem de serviço teste',
  equipamento: 'Computador',
  numero_serie: 'SN-12345',
  prioridade: 'normal',
  status: 'aberto',
  data_abertura: new Date(),
  data_prevista: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  data_conclusao: null,
  tempo_estimado_horas: '2.00',
  tempo_real_horas: null,
  valor_orcado: '500.00',
  valor_final: null,
  status_orcamento: 'aprovado',
  observacoes: 'Observação de teste',
  garantia_meses: 12,
  createdAt: new Date(),
  updatedAt: new Date(),
}

export const mockTecnico = {
  id: 1,
  userId: mockUserId,
  nome: 'Técnico Teste',
  email: 'tecnico@teste.com',
  telefone: '11999999998',
  cpf: '12345678900',
  especialidade: 'Computadores',
  status: 'ativo',
  latitude: -23.5505,
  longitude: -46.6333,
  comissao_percentual: '10.00',
  os_concluidas: 15,
  rating: '4.50',
  createdAt: new Date(),
  updatedAt: new Date(),
}

export const mockFuncionario = {
  id: 1,
  userId: mockUserId,
  nome: 'Funcionário Teste',
  email: 'funcionario@teste.com',
  cpf: '12345678901',
  data_nascimento: new Date('1990-01-01'),
  pis_pasep: 'PIS-12345678901',
  banco: 'Banco do Brasil',
  agencia: '1234',
  conta: '123456',
  cargo: 'Técnico',
  departamento: 'Técnico',
  salario_base: '3000.00',
  data_admissao: new Date(),
  data_demissao: null,
  tipo_contrato: 'CLT',
  regime_jornada: 'normal',
  status: 'ativo',
  telefone: '11999999997',
  endereco: 'Rua Teste, 456',
  cidade: 'São Paulo',
  estado: 'SP',
  cep: '01234-568',
  foto_url: null,
  createdAt: new Date(),
  updatedAt: new Date(),
}

export const mockEstoque = {
  id: 1,
  userId: mockUserId,
  nome: 'Produto Teste',
  descricao: 'Descrição do produto',
  categoria: 'Componentes',
  quantidade_atual: '50.00',
  quantidade_minima: '10.00',
  valor_unitario: '100.00',
  localizacao: 'Prateleira A1',
  garantia_meses: 12,
  data_garantia: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
  ativo: true,
  createdAt: new Date(),
  updatedAt: new Date(),
}

export const mockFinanceiro = {
  id: 1,
  userId: mockUserId,
  os_id: 1,
  tecnico_id: 1,
  tipo: 'receita',
  descricao: 'Transação de teste',
  valor: '1000.00',
  categoria: 'Serviços',
  status: 'pendente',
  data_vencimento: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  data_pagamento: null,
  forma_pagamento: 'transferencia',
  observacoes: 'Observação de teste',
  createdAt: new Date(),
  updatedAt: new Date(),
}

/**
 * Common test utilities
 */
export function createMockRepository() {
  return {
    criar: vi.fn(),
    obter: vi.fn(),
    listar: vi.fn(),
    atualizar: vi.fn(),
    deletar: vi.fn(),
  }
}

export function expectCallWith(fn: any, params: any) {
  expect(fn).toHaveBeenCalledWith(expect.objectContaining(params))
}

export class TestError extends Error {
  constructor(message: string, public statusCode: number = 500) {
    super(message)
    this.name = 'TestError'
  }
}
