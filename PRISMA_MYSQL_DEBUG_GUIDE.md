# GUIA COMPLETO: DEBUG PRISMA/MYSQL EM PRODUÇÃO

## 🔍 O Problema
Login falha com "Failed to fetch" - API `/api/auth/login` não consegue conectar ao MySQL

## 🛠️ Ferramentas de Debug Disponíveis

### 1. Endpoint de Health Check
**URL**: `https://www.glabcursos.com.br/api/health`

**O que faz**:
- Testa conexão Prisma → MySQL
- Verifica tabela user
- Verifica se admin@glabcursos.com existe
- Mede tempo de conexão
- Fornece diagnostics detalhados

**Como usar**:
```bash
curl https://www.glabcursos.com.br/api/health
```

**Respostas esperadas**:

✅ **Sucesso (200)**:
```json
{
  "status": "healthy",
  "diagnostics": {
    "prismaConnection": {
      "status": "OK",
      "connectionTimeMs": 142
    },
    "userTable": {
      "status": "OK",
      "totalUsers": 5
    },
    "adminUser": {
      "status": "EXISTS",
      "found": true
    }
  }
}
```

❌ **Falha de Conexão (503)**:
```json
{
  "status": "unhealthy",
  "diagnostics": {
    "error": {
      "message": "connect ECONNREFUSED 127.0.0.1:3306",
      "type": "Error"
    },
    "errorAnalysis": "Connection failed - check firewall/IP whitelist"
  }
}
```

---

## 📊 Interpretando Respostas do Health Check

### ✅ Status "healthy" (200)
**Significa**: Tudo OK com a conexão
**Ação**: Problema está em outro lugar (usuário não existe, senha errada, etc)

### ❌ Prisma Connection Error
**Mensagens típicas**:

| Erro | Causa | Solução |
|------|-------|--------|
| `ECONNREFUSED` | Conexão recusada | Firewall bloqueando - whitelist IP Vercel |
| `ENOTFOUND` | Host não encontrado | DATABASE_URL inválida ou host errado |
| `timeout` | Timeout na conexão | Firewall bloqueando saída de rede |
| `authentication failed` | Credenciais erradas | DATABASE_URL: verificar user/pass |
| `Unknown database` | Database não existe | DATABASE_URL: verificar nome DB |

---

## 🔧 Passos de Debug

### Passo 1: Testar Health Check
```bash
# No terminal ou navegador
curl -i https://www.glabcursos.com.br/api/health

# Esperado: 200 OK ou 503 Service Unavailable
```

### Passo 2: Ver Logs no Vercel Dashboard
1. Ir para: https://vercel.com/gmjuliao-5010s-projects/glab/deployments
2. Clicar no deploy mais recente
3. Clicar na aba "Logs"
4. Procurar por linhas com `[v0]`

**Logs importantes a procurar**:
```
[v0] Initializing Prisma Client
[v0] NODE_ENV: production
[v0] DATABASE_URL defined: true
[v0] Health check - Testing Prisma connection
[v0] Health check - Prisma OK (142 ms)
[v0] Login route - Starting authentication
[v0] Auth.login - User lookup complete: FOUND
```

### Passo 3: Analisar Erros de Login
Quando tentar fazer login, ver logs:
```
[v0] Login route - Starting authentication
[v0] NODE_ENV: production
[v0] DATABASE_URL defined: true
[v0] Request data received: { email: 'admin@glabcursos.com', passwordLength: 11 }
[v0] Calling login function...
[v0] Auth.login - Attempting to find user: admin@glabcursos.com
```

Se parar aqui, o problema é na primeira query Prisma (user.findUnique).

---

## 🚨 Cenários de Erro Comuns

### Cenário 1: "Connection failed - check firewall/IP whitelist"
```
Error: connect ECONNREFUSED or ECONNRESET
```

**Causa**: IP do Vercel não está autorizado na Locaweb

**Solução**:
1. Ir para Locaweb Dashboard → Banco de Dados → MySQL
2. Procurar por "Firewall" ou "IP Whitelist"
3. Adicionar:
   - IP do Vercel (ou range 76.76.0.0/16)
   - Confirmar que regra foi aplicada
4. Esperar 5 minutos
5. Testar `/api/health` novamente

### Cenário 2: "Authentication failed"
```
Error: Access denied for user 'glabcursos_db'@'...'
```

**Causa**: Credenciais MySQL incorretas

**Solução**:
1. Verificar DATABASE_URL no Vercel:
   - Settings → Environment Variables
   - Copiar valor de DATABASE_URL
2. Validar formato:
   ```
   mysql://USER:PASSWORD@HOST:PORT/DATABASE
   ```
3. Verificar:
   - USER: `glabcursos_db` ✓
   - PASSWORD: `Larissa%40123` (com %40 para @) ✓
   - HOST: `glabcursos_db.mysql.dbaas.com.br` ✓
   - PORT: `3306` ✓
   - DATABASE: `glabcursos_db` ✓

### Cenário 3: "User table not found"
```
Error: Table 'glabcursos_db.user' doesn't exist
```

**Causa**: Migrations Prisma não foram rodadas

**Solução**:
1. Rodar migrations em produção:
   ```bash
   DATABASE_URL='mysql://...' npx prisma migrate deploy
   ```
2. Ou rodar via Vercel CLI:
   ```bash
   vercel env pull  # Puxar ENV vars
   npx prisma migrate deploy
   ```

### Cenário 4: "Admin user not found"
```
adminUser: { status: "NOT_FOUND", found: false }
```

**Causa**: Tabela user existe, mas admin@glabcursos.com não foi criado

**Solução**:
1. Conectar ao MySQL via client local:
   ```sql
   mysql -h glabcursos_db.mysql.dbaas.com.br \
         -u glabcursos_db -p \
         glabcursos_db
   ```
2. Criar admin user (com bcrypt hash):
   ```sql
   INSERT INTO user (id, email, password, name, is_admin, is_vendedor, createdAt, updatedAt)
   VALUES (
     'cuid-123',
     'admin@glabcursos.com',
     '$2a$10$...bcrypt-hash-here...',
     'Admin',
     1,
     0,
     NOW(),
     NOW()
   );
   ```
3. Ou usar seed script no projeto:
   ```bash
   pnpm seed
   ```

---

## 🔍 Verificação Passo-a-Passo

### Checklist Completo

- [ ] 1. DATABASE_URL está definida no Vercel Dashboard?
- [ ] 2. DATABASE_URL tem URL encoding correto? (@ → %40)
- [ ] 3. IP do Vercel está whitelisted na Locaweb?
- [ ] 4. Migrations Prisma foram aplicadas? (table user existe)
- [ ] 5. Admin user foi criado no banco?
- [ ] 6. /api/health retorna 200 OK?
- [ ] 7. Logs do Vercel mostram [v0] messages?

### Se todos os acima forem ✓
O login deve funcionar!

---

## 📱 Testando Login

Após confirmar que `/api/health` retorna 200:

1. Abrir: https://www.glabcursos.com.br/login
2. Email: `admin@glabcursos.com`
3. Senha: `Larissa@123`
4. Clicar "Entrar no Painel"
5. Esperar redireção para `/admin` (deve levar 2-3 segundos)

Se ainda falhar:
- Ver logs no Vercel Dashboard
- Procurar por `[v0] Login route error:` nos logs
- Copiar message e errorAnalysis
- Seguir solução específica acima

---

## 🆘 Se Nada Funcionar

1. **Verificar status Locaweb**:
   - https://status.locaweb.com.br
   - Verificar se MySQL está down

2. **Testar conectividade local** (se tiver acesso):
   ```bash
   mysql -h glabcursos_db.mysql.dbaas.com.br \
         -u glabcursos_db -p"Larissa@123" \
         glabcursos_db -e "SELECT 1"
   ```

3. **Verificar logs detalhados do Vercel**:
   - Não apenas /Deployments, mas também /Functions
   - Clicar em /api/auth/login para ver logs dessa função específica

4. **Contactar suporte Locaweb**:
   - Caso de teste: Vercel serverless (IP dinâmico)
   - Pedir: Habilitação de conexões de qualquer IP ou range 76.76.0.0/16

---

## 📋 Resumo

| Quando | O Que | Onde |
|--------|-------|------|
| Sempre | Verificar `/api/health` primeiro | https://www.glabcursos.com.br/api/health |
| Falha login | Ver logs Vercel | Dashboard → Deployments → Logs |
| Erro conexão | Whitelist IP Locaweb | Locaweb → MySQL → Firewall |
| Usuário não existe | Criar via seed ou SQL | Prisma seed ou MySQL client |

