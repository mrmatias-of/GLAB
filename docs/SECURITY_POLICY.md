# Política de Segurança - G-LAB Admin Panel

## 1. Autenticação e Credenciais

### Credencial Admin Padrão
```
Email: admin@glabcursos.com
Senha: Admin@12345 (DEVE SER ALTERADA)
```

**IMPORTANTE:** A senha padrão deve ser alterada imediatamente após o primeiro login.

### Como Alterar Senha Admin

Edite o arquivo `/scripts/create-admin-user.mjs`:

```javascript
const defaultPassword = 'SuaSenhaNovaForte123!' // Altere aqui
```

Depois execute:
```bash
node scripts/create-admin-user.mjs
```

## 2. Sistema de Autenticação

### Arquitetura
- **Framework:** Better Auth + Neon PostgreSQL
- **Hashing:** bcryptjs (10 salt rounds)
- **Sessões:** Cookie httpOnly, 24 horas máximo
- **CSRF:** sameSite=lax

### Fluxo de Login

```
1. Usuário preenche email e senha
2. POST /api/auth/signin
3. Validação de rate limit (5 tentativas, 15 min lockout)
4. Busca usuário no banco de dados
5. Valida password hash com bcrypt
6. Cria sessão cookie (httpOnly, secure, sameSite)
7. Log de segurança com IP e timestamp
8. Redireciona para /admin
```

## 3. Segurança Implementada

### ✅ Implementado
- [x] Passwords com bcrypt (não em plaintext)
- [x] Rate limiting (5 tentativas / 15 min)
- [x] Session timeout (30 min inatividade)
- [x] Cookies httpOnly (contra XSS)
- [x] CSRF protection (sameSite)
- [x] IP logging para login
- [x] Middleware protege /admin/*
- [x] Logout limpa cookies

### Logs de Segurança
Todos os eventos de autenticação são registrados:
```
[SECURITY] 2024-01-15T10:30:45.123Z | Event: login_success | Email: admin@glabcursos.com | IP: 192.168.1.1 | Details: Session: session_xxxxx
[SECURITY] 2024-01-15T10:30:50.456Z | Event: login_failed | Email: user@example.com | IP: 192.168.1.2 | Details: Invalid password
[SECURITY] 2024-01-15T10:35:12.789Z | Event: rate_limit | Email: hacker@example.com | IP: 203.0.113.45 | Details: Too many failed attempts
```

## 4. Proteção de Rotas

### Middleware Autenticação
Localização: `/middleware.ts`

**Rotas Protegidas:**
- `/admin/*` - Requer autenticação
- Qualquer rota sem auth_session cookie é redirecionada para `/login`

**Timeout de Inatividade:**
- 30 minutos sem atividade = auto logout
- Tracks `last_activity` em cada requisição

### Verificação de Sessão
```typescript
// middleware.ts verifica:
1. Existência do cookie auth_session
2. Tempo de última atividade
3. Validade da sessão (24 horas máximo)
4. Redirect para login se inválido
```

## 5. Credenciais do Banco de Dados

### Estrutura de Password
```typescript
// Tabela: account (Better Auth)
{
  userId: string        // Foreign key -> user.id
  providerId: 'credential'
  accountId: string
  password: string      // Hash bcrypt (60 caracteres)
  createdAt: timestamp
  updatedAt: timestamp
}
```

### Como Verificar Hash
```bash
# Conectar no psql
psql postgresql://user:password@host/database

# Query para listar passwords (NUNCA faça isso em produção!)
SELECT "userId", "password" FROM "account" WHERE "providerId" = 'credential' LIMIT 5;
```

## 6. Boas Práticas

### ✅ Faça
- [x] Use senhas fortes (12+ caracteres, números, letras, símbolos)
- [x] Altere senha padrão imediatamente
- [x] Monitore logs de segurança regularmente
- [x] Use HTTPS em produção (force secure cookies)
- [x] Mantenha sessões curtas (24 horas máximo)
- [x] Implemente 2FA para admin (TODO)

### ❌ Não Faça
- [ ] Não compartilhe credenciais
- [ ] Não hardcode senhas no código
- [ ] Não use senhas simples (123456, admin123)
- [ ] Não reutilize senhas entre contas
- [ ] Não deixe cookies com secure=false em produção
- [ ] Não ignore timeouts de sessão

## 7. Implementação de 2FA (Futuro)

### Passos Recomendados
1. Adicionar coluna `two_factor_enabled` na tabela user
2. Implementar TOTP (Time-based One-Time Password)
3. Usar biblioteca como `speakeasy` ou `otpauth`
4. Gerar QR code para app authenticator
5. Validar OTP antes de criar sessão

### Exemplo de Implementação
```typescript
// POST /api/auth/2fa/enable
POST /api/auth/2fa/verify  // Valida código TOTP
```

## 8. Recuperação de Senha (Futuro)

### Fluxo Recomendado
1. Usuário clica "Esqueci minha senha"
2. Sistema envia email com link temporário
3. Link válido por 1 hora apenas
4. Usuário define nova senha
5. Email de confirmação é enviado

### Implementação
```typescript
// POST /api/auth/forgot-password
// POST /api/auth/reset-password

// Tabela: password_reset_token
{
  id: string
  userId: string
  token: string (hash)
  expiresAt: timestamp
  createdAt: timestamp
}
```

## 9. Auditoria de Segurança

### Checklist de Segurança
- [ ] Senhas não estão em plaintext
- [ ] Bcrypt está sendo usado (min 10 rounds)
- [ ] Rate limiting funciona
- [ ] Cookies são httpOnly
- [ ] CSRF protection ativa
- [ ] Logs de segurança funcionando
- [ ] Timeout de inatividade ativo
- [ ] Middleware protege rotas admin
- [ ] Não há senhas em .env arquivo
- [ ] HTTPS ativo em produção

### Teste de Segurança
```bash
# 1. Teste rate limiting
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"wrong"}' \
# Repita 6 vezes - deve falhar na 6ª tentativa

# 2. Teste XSS em cookies (deve estar seguro)
# Abrir DevTools Console
document.cookie  # Não deve mostrar auth_session (httpOnly)

# 3. Teste timeout
# Fazer login, esperar 31 minutos (sem atividade)
# Tentar acessar /admin - deve redirecionar para login
```

## 10. Contato e Reportar Vulnerabilidades

Se encontrou uma vulnerabilidade de segurança:

1. **NÃO** crie issue pública
2. Email para: security@glabcursos.com.br
3. Inclua detalhes:
   - Descrição da vulnerabilidade
   - Passos para reproduzir
   - Impacto potencial
   - Sugestão de fix (opcional)

**Prazo para resposta:** 48 horas

---

**Última atualização:** 2024-01-15  
**Versão:** 1.0  
**Autor:** v0 Security Implementation
