# 🔐 Guia de Segurança - G-LAB Admin Panel

## 🚨 Recomendações Críticas

### 1. URGENTE: Alterar Senha Admin (Primeira Vez)

```bash
# 1. Edite o arquivo de script
nano scripts/create-admin-user.mjs

# 2. Mude a senha padrão na linha:
const defaultPassword = 'SuaSenhaNovaSegura123!'

# 3. Execute o script
node scripts/create-admin-user.mjs

# 4. Teste o login com a nova senha
# Acesse: http://localhost:3000/login
```

**Requisitos para Senha Segura:**
- ✅ Mínimo 12 caracteres
- ✅ Números (0-9)
- ✅ Letras maiúsculas (A-Z)
- ✅ Letras minúsculas (a-z)
- ✅ Símbolos (!@#$%^&*)
- ❌ Não reutilize em outras contas

### 2. Configurar Variáveis de Ambiente

```bash
# Copie o arquivo exemplo
cp .env.example .env.local

# Edite com suas configurações
nano .env.local

# Gere um BETTER_AUTH_SECRET seguro
openssl rand -base64 32
```

### 3. Em Produção (Vercel)

```bash
# Certifique-se de que ALL variáveis estão definidas:
vercel env ls

# As variáveis críticas são:
# - DATABASE_URL (com SSL)
# - BETTER_AUTH_SECRET (min 32 chars)
# - NODE_ENV=production
# - AUTH_MAX_LOGIN_ATTEMPTS=5
# - AUTH_LOCKOUT_DURATION=15
```

---

## 📋 Arquitetura de Segurança

### Login Flow

```
┌─────────────────┐
│  User Login     │
│  (email/pass)   │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│ Check Rate Limit                │
│ (5 attempts, 15 min lockout)    │
└────────┬────────────────────────┘
         │
    ┌────┴─────────┐
    │              │
    ▼              ▼
[Blocked]   [Allowed]
             │
             ▼
    ┌──────────────────┐
    │ Query Database   │
    │ user + account   │
    └────────┬─────────┘
             │
         ┌───┴────────┐
         │            │
         ▼            ▼
    [Found]      [Not Found]
         │            │
         ▼            ▼
    bcrypt.compare  [Reject]
         │
    ┌────┴────────┐
    │             │
    ▼             ▼
[Match]      [No Match]
    │             │
    ▼             ▼
[Accept]    [Reject]
    │
    ▼
┌──────────────────────┐
│ Create Session       │
│ - httpOnly cookie    │
│ - secure flag        │
│ - sameSite=lax       │
│ - 24h expiry         │
└──────────────────────┘
    │
    ▼
[Log Success]
    │
    ▼
[Redirect /admin]
```

### Rate Limiting

| Tentativa | Status | Ação |
|-----------|--------|------|
| 1-4 | ✅ Permitida | Continua validando |
| 5 | ❌ Bloqueada | Erro 429 |
| 6-∞ | ❌ Bloqueada | Erro 429 (15 min) |
| Reset | ✅ Desbloqueada | Após 15 minutos |

### Session Timeout

```
┌──────────────────┐
│  User Login      │  Session criada
│  (24h max age)   │  ▼
└──────────────────┘
    │
    ├─── 30 min sem atividade
    │     ▼
    │  [Session Expires]
    │     ▼
    │  [Auto Logout]
    │     ▼
    │  [Redirect /login]
    │
    └─── Com atividade
         ▼
      [Activity Updated]
         ▼
      [Session Extends]
```

---

## 🔒 Segurança Implementada

### ✅ Já Implementado

| Recurso | Status | Detalhes |
|---------|--------|----------|
| Bcrypt Password Hashing | ✅ | 10 salt rounds |
| Rate Limiting | ✅ | 5 tentativas / 15 min |
| Session Cookies | ✅ | httpOnly, secure, sameSite |
| CSRF Protection | ✅ | sameSite=lax |
| IP Logging | ✅ | Todo login é registrado |
| Timeout de Inatividade | ✅ | 30 minutos |
| Middleware Auth | ✅ | Protege /admin/* |
| Security Logger | ✅ | Logs detalhados de eventos |

### 🚧 TODO (Futuro)

- [ ] 2FA (Two-Factor Authentication)
- [ ] Email verification para novos usuários
- [ ] Password reset por email
- [ ] Recuperação de conta
- [ ] Audit trail no banco de dados
- [ ] Dashboard de eventos de segurança
- [ ] Integração com Sentry/DataDog

---

## 📊 Monitorando Segurança

### Logs de Segurança

Todos os eventos estão em `/lib/security-logger.ts`:

```typescript
// Sucesso
[LOW] 2024-01-15T10:30:45Z | login_success | Email: admin@glabcursos.com | IP: 192.168.1.1

// Falha
[MEDIUM] 2024-01-15T10:30:50Z | login_failed | Email: hacker@example.com | IP: 203.0.113.45

// Rate limit
[HIGH] 2024-01-15T10:35:12Z | login_rate_limit | Email: attacker@example.com | IP: 203.0.113.46
```

### Verificar Logs no Vercel

```bash
# Deploy logs
vercel logs

# Ou view real-time
vercel logs --follow

# Filter por evento
vercel logs | grep "login_failed"
```

---

## 🧪 Testando Segurança

### 1. Testar Rate Limiting

```bash
# Comando: enviar 6 logins com credenciais erradas
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/auth/signin \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"wrong"}' \
    -w "\nAttempt $i: %{http_code}\n"
  sleep 2
done

# Esperado:
# Attempts 1-5: 401 (Unauthorized)
# Attempt 6: 429 (Too Many Requests)
```

### 2. Testar Bcrypt

```bash
# Abrir console do Node
node

# Hash uma senha
const bcrypt = require('bcryptjs');
const hash = await bcrypt.hash('Admin@12345', 10);
console.log(hash);

# Validar hash
const valid = await bcrypt.compare('Admin@12345', hash);
console.log(valid); // true
```

### 3. Testar Session Timeout

```bash
# 1. Fazer login
# 2. Abrir DevTools: F12
# 3. Application > Cookies > auth_session
# 4. Verificar maxAge: 86400 (24 horas)
# 5. Aguardar 31 minutos sem atividade
# 6. Tentar acessar /admin
# 7. Esperado: Redireciona para /login
```

---

## 🚨 Responder a Incidentes de Segurança

### Se Suspeitar de Compromisso

1. **Acesso não autorizado ao painel?**
   ```bash
   # Mudar BETTER_AUTH_SECRET imediatamente
   # Regenerar todas as sessões
   # Verificar logs de login em /logs
   ```

2. **Senha admin descoberta?**
   ```bash
   # Usar create-admin-user.mjs com nova senha
   # Verificar todos os logins recentes
   # Mudar em produção via Vercel env vars
   ```

3. **Detectar ataque de força bruta?**
   ```bash
   # Verificar logs para IPs suspeitos
   # Aumentar MAX_ATTEMPTS de 5 para 3
   # Aumentar LOCKOUT_DURATION de 15 para 30 min
   # Considerar adicionar captcha
   ```

---

## 📞 Reportar Vulnerabilidades

Se encontrou uma falha de segurança:

1. **NÃO** crie issue pública
2. Email: `security@glabcursos.com.br`
3. Inclua:
   - Descrição da vulnerabilidade
   - Passos para reproduzir
   - Impacto potencial
4. Resposta: 48 horas

---

## 📖 Documentação Completa

Para documentação detalhada sobre segurança, veja:

- **[SECURITY_POLICY.md](./docs/SECURITY_POLICY.md)** - Política completa
- **[Security Logger](./lib/security-logger.ts)** - Código de logging
- **[Auth Route](./app/api/auth/signin/route.ts)** - Implementação de auth
- **[Middleware](./middleware.ts)** - Proteção de rotas

---

**Última atualização:** 2024-01-15  
**Versão:** 1.0  
**Status:** ✅ Production Ready
