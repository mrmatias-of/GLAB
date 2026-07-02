# DDD Pattern Guide para GLAB

## O que é DDD?

Domain-Driven Design é um padrão arquitetural que organiza código por domínio de negócio (não por tipo de arquivo).

## Estrutura de um Module

Cada module segue este padrão:

```
module-name/
├── config.ts              # Configuração específica do module (opcional)
├── types/index.ts         # Domain models e interfaces
├── schemas/index.ts       # Zod validation schemas
├── repositories/          # Data access layer
│   ├── repo.repository.ts
│   └── index.ts
├── services/              # Business logic
│   ├── service.service.ts
│   └── index.ts
├── controllers/           # HTTP handlers (routes)
│   ├── controller.ts
│   └── index.ts
├── index.ts              # Barrel exports
└── README.md             # Module documentation
```

## Camadas

### 1. Types (Domain Models)
Define as entidades e interfaces do domínio.

```typescript
export interface Usuario {
  id: string
  email: string
  nome: string
  status: 'ativo' | 'inativo'
}
```

### 2. Schemas (Validation)
Define validação com Zod.

```typescript
export const CriarUsuarioSchema = z.object({
  email: z.string().email(),
  nome: z.string().min(3),
})
```

### 3. Repository (Data Access)
Acessa dados do banco (ou outras fontes).

```typescript
export class UsuarioRepository {
  async findById(id: string) { ... }
  async create(data: Usuario) { ... }
  async update(id: string, data: Partial<Usuario>) { ... }
}
```

### 4. Service (Business Logic)
Contém a lógica de negócio.

```typescript
export class UsuarioService {
  constructor(private repo: UsuarioRepository) {}
  
  async criarUsuario(data: CreateUsuarioDTO) {
    // Validação, regras de negócio, etc
    return this.repo.create(data)
  }
}
```

### 5. Controller (HTTP Handlers)
Trata requisições HTTP.

```typescript
export async function POST(req: NextRequest) {
  const data = await req.json()
  const service = new UsuarioService(repo)
  return Response.json(await service.criarUsuario(data))
}
```

## Padrão de Imports

```typescript
// CORRETO - Importar do module
import { UsuarioService } from '@/src/modules/usuarios'
import { UsuarioRepository } from '@/src/modules/usuarios'

// EVITAR - Importar arquivos diretamente
import { UsuarioService } from '@/src/modules/usuarios/services/usuario.service'
```

## Adicionando um Novo Module

1. Criar pasta `src/modules/novo-modulo`
2. Criar subpastas: `types`, `schemas`, `repositories`, `services`, `controllers`
3. Implementar types primeiro
4. Implementar repository
5. Implementar service
6. Implementar controller
7. Criar `index.ts` com barrel exports
8. Atualizar `src/modules/index.ts`

## Exemplo Prático

### 1. types/index.ts
```typescript
export interface Produto {
  id: number
  nome: string
  preco: number
}
```

### 2. repositories/produto.repository.ts
```typescript
export class ProdutoRepository {
  async findAll() {
    return db.query.produtos.findMany()
  }
}
```

### 3. services/produto.service.ts
```typescript
export class ProdutoService {
  constructor(private repo: ProdutoRepository) {}
  
  async listar() {
    return this.repo.findAll()
  }
}
```

### 4. controllers/produto.controller.ts
```typescript
export async function GET() {
  const service = new ProdutoService(new ProdutoRepository())
  return Response.json(await service.listar())
}
```

### 5. index.ts
```typescript
export * from './types'
export { ProdutoRepository } from './repositories/produto.repository'
export { ProdutoService } from './services/produto.service'
export * from './controllers/produto.controller'
```

## Benefícios do DDD

- **Coesão**: Código relacionado fica junto
- **Independência**: Cada domain pode evoluir independentemente
- **Testabilidade**: Fácil fazer testes unitários de cada camada
- **Escalabilidade**: Estrutura suporta crescimento
- **Comunicação**: Alinha com linguagem de negócio

## Perguntas Frequentes

**P: Quando criar um novo module?**
R: Quando tem um novo domínio de negócio (CRM, Vendas, RH, etc).

**P: Como reutilizar código entre modules?**
R: Use `src/shared` para código comum (utilities, tipos globais, etc).

**P: Services precisam de testes?**
R: Sim! Services têm a lógica principal, então devem ter testes unitários.

**P: Como fazer migrations com novos modules?**
R: A estrutura de database fica em `lib/db/schema`, independent dos modules.
