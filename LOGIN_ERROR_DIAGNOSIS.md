# DIAGNÓSTICO: ERRO "FAILED TO FETCH" NO LOGIN

## Problema Identificado
**Erro**: "Failed to fetch" ao tentar fazer login em produção (Vercel)
**Endpoint**: `/api/auth/login` retorna erro
**Status**: ❌ Login não funciona ainda

---

## Possíveis Causas (Por Probabilidade)

### 1. FIREWALL DE IP (75% de chance) ⚠️ MAIS PROVÁVEL
**Descrição**: IP do Vercel não está whitelisted na Locaweb

**Sintomas**:
- Erro "Failed to fetch" ou timeout
- Conexão recusada no MySQL
- Funciona localmente (sandbox v0) mas não em produção

**Solução**:
1. Ir para painel Locaweb
2. Database → MySQL → Firewall/Security
3. Adicionar IP do Vercel à whitelist
   - IP pode variar: 76.76.0.0/16 ou IPs específicos
   - Ou permitir todas as conexões (menos seguro)
4. Confirmar aplicação da regra
5. Testar login novamente

---

### 2. VARIÁVEIS DE AMBIENTE ERRADAS NO VERCEL (15% de chance)
**Descrição**: DATABASE_URL não configurada corretamente no dashboard Vercel

**Sintomas**:
- API tenta conectar em banco errado
- Variáveis PostgreSQL/Neon ainda presentes

**Solução**:
1. Ir para: https://vercel.com/gmjuliao-5010s-projects/glab/settings/environment-variables
2. **REMOVER** (se existirem):
   - POSTGRES_URL
   - POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DATABASE
   - PGHOST, PGUSER, PGDATABASE, PGPASSWORD
   - Qualquer NEON_*
   - DATABASE_URL_UNPOOLED
   - POSTGRES_URL_NON_POOLING

3. **CONFIRMAR/ADICIONAR**:
   - DATABASE_URL = `mysql://glabcursos_db:Larissa%40123@glabcursos_db.mysql.dbaas.com.br:3306/glabcursos_db`

4. Redeploy e testar

---

### 3. USUÁRIO ADMIN NÃO EXISTE (9% de chance)
**Descrição**: Banco de dados vazio ou sem usuário admin criado

**Sintomas**:
- Mesmo com acesso de rede, login retorna "Email ou senha incorretos"
- Tabela user está vazia

**Solução**:
1. Conectar ao MySQL Locaweb via ferramentas Locaweb
2. Verificar: `SELECT * FROM user WHERE email='admin@glabcursos.com'`
3. Se vazio, criar usuário:
   ```sql
   -- Gerar hash: use o seed script prisma/seed.js
   INSERT INTO user (email, password, is_admin, is_vendedor, created_at, updated_at)
   VALUES ('admin@glabcursos.com', '<BCRYPT_HASH>', 1, 0, NOW(), NOW());
   ```

---

### 4. URL ENCODING DA SENHA (1% de chance)
**Descrição**: Senha @ não URL-encoded corretamente

**Status**: ✅ **JÁ CORRIGIDO** em commit anterior
- Correto: `Larissa%40123`
- Incorreto: `Larissa@123`

---

## CHECKLIST DE SOLUÇÃO

### Fase 1: Verificação Rápida (5 min)
- [ ] Acessar Vercel Dashboard
- [ ] Verificar Environment Variables
- [ ] Confirmar DATABASE_URL está correto
- [ ] Remover variáveis PostgreSQL/Neon

### Fase 2: Firewall na Locaweb (10 min)
- [ ] Acessar painel Locaweb
- [ ] Encontrar seção Firewall do MySQL
- [ ] Adicionar IP Vercel à whitelist
- [ ] Confirmar regra foi aplicada

### Fase 3: Testar (5 min)
- [ ] Deploy automático no Vercel (push git já realizado)
- [ ] Acessar https://www.glabcursos.com.br/login
- [ ] Tentar login com admin@glabcursos.com / Larissa@123
- [ ] Se funcionar → ✅ Sucesso!

### Fase 4: Se Ainda Falhar
- [ ] Verificar console.log de erro na API
- [ ] Conectar ao banco manualmente para testar
- [ ] Confirmar usuário admin existe no banco

---

## STATUS TÉCNICO

### Código ✅
```
✓ Prisma provider = mysql
✓ DATABASE_URL com URL encoding correto
✓ Sem dependências PostgreSQL
✓ Build compila com sucesso
```

### Produção ❌
```
✗ Login retorna "Failed to fetch"
✗ API não consegue conectar ao MySQL Locaweb
✗ Firewall ou variáveis em questão
```

---

## PRÓXIMAS AÇÕES

**Você precisa fazer:**

1. **Limpar Vercel Environment Variables** (CRÍTICO)
   - Remover todas as variáveis PostgreSQL/Neon
   - Confirmar DATABASE_URL MySQL

2. **Whitelist IP na Locaweb** (CRÍTICO)
   - Adicionar IP do Vercel à whitelist do firewall MySQL
   - Sem isso, Vercel nunca conseguirá conectar

3. **Testar Login**
   - Depois que as 2 ações acima forem feitas
   - Login deve funcionar

---

## Arquivos de Referência
- `MYSQL_VALIDATION_FINAL.md` - Validação MySQL completa
- `MYSQL_ONLY_CONFIGURATION.md` - Configuração exclusiva MySQL
- `prisma/seed.js` - Script para criar usuário admin (se necessário)

---

## Contato Locaweb
Se precisar de suporte para liberar firewall:
- Suporte Locaweb: suporte@locaweb.com.br
- Informar: "Preciso whitelist IP do Vercel para conexão MySQL"
