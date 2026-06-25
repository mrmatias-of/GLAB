# INSTRUÇÕES EXATAS: CONFIGURAR VERCEL PARA MYSQL

## PROBLEMA ENCONTRADO

Erro em produção: `the URL must start with the protocol mysql://`

**Causa**: DATABASE_URL não está configurada no Vercel Dashboard

---

## SOLUÇÃO: 5 PASSOS SIMPLES

### PASSO 1: Ir para Vercel Dashboard
1. Abrir: https://vercel.com/gmjuliao-5010s-projects/glab/settings/environment-variables
2. Esperar carregar
3. Se pedir login, fazer login

### PASSO 2: REMOVER variáveis antigas PostgreSQL/Neon
Se existirem, remova CLICANDO NO X:
- ❌ POSTGRES_URL
- ❌ POSTGRES_USER
- ❌ POSTGRES_PASSWORD
- ❌ POSTGRES_DATABASE
- ❌ PGHOST
- ❌ PGUSER
- ❌ PGDATABASE
- ❌ PGPASSWORD
- ❌ NEON_AUTH_BASE_URL
- ❌ NEON_PROJECT_ID
- ❌ DATABASE_URL_UNPOOLED
- ❌ POSTGRES_URL_NON_POOLING

**Não remova outras variáveis!**

### PASSO 3: ADICIONAR DATABASE_URL MYSQL

1. Clique em "+ Add New" ou "Add New Variable"
2. Nome da variável:
   ```
   DATABASE_URL
   ```
3. Valor da variável (COPIE EXATAMENTE):
   ```
   mysql://glabcursos_db:Larissa%40123@glabcursos_db.mysql.dbaas.com.br:3306/glabcursos_db
   ```
   **IMPORTANTE**: `@` na senha está como `%40` (URL encoded)

4. Clique "Save"

### PASSO 4: Verificar que foi salvo
- Deve aparecer na lista como "DATABASE_URL"
- Valor deve começar com `mysql://`
- Vai mostrar "●●●●●●●●●●" (asteriscos) no valor

### PASSO 5: Fazer novo deploy
1. Ir para: https://vercel.com/gmjuliao-5010s-projects/glab/deployments
2. Clicar no deploy mais recente
3. Clicar em "...menu" (canto superior direito)
4. Selecionar "Redeploy"
5. Aguardar ~2-3 minutos

---

## VERIFICAR SE FUNCIONOU

### Após o deploy completar:
1. Abrir: https://www.glabcursos.com.br/api/debug/env
2. Deve mostrar resposta JSON:
   ```json
   {
     "status": "debug-info",
     "environment": {
       "DATABASE_URL_DEFINED": true,
       "DATABASE_URL_FIRST_50_CHARS": "mysql://glabcursos_db:Larissa%40123@glabcursos_db...",
       "DATABASE_URL_PROTOCOL": "mysql",
       "DATABASE_URL_VALID": "YES"
     }
   }
   ```

Se `"DATABASE_URL_VALID"` for "YES", passou! ✅

Se for "NO", repetir os passos acima.

### Testar login
1. Abrir: https://www.glabcursos.com.br/login
2. Email: `admin@glabcursos.com`
3. Senha: `Larissa@123`
4. Clicar "Entrar"

Se aparecer erro "Failed to fetch":
- Ainda está sem conexão ao banco
- Ver logs: Vercel Dashboard → Deployments → Clicar deploy → "Logs"
- Procurar por "mysql" ou "connection"

---

## CHECKLIST

- [ ] 1. Fui para Vercel Environment Variables
- [ ] 2. Removi todas as variáveis POSTGRES/NEON/PG
- [ ] 3. Adicionei DATABASE_URL com `mysql://...%40...`
- [ ] 4. Cliquei "Save"
- [ ] 5. Fiz "Redeploy"
- [ ] 6. Testei /api/debug/env (deve mostrar DATABASE_URL_VALID: YES)
- [ ] 7. Testei login (deve funcionar se admin existe no banco)

---

## PRÓXIMAS AÇÕES SE AINDA NÃO FUNCIONAR

Se o login ainda falhar após DATABASE_URL estar correto:

1. **Verificar whitelist de IP na Locaweb**
   - Locaweb Dashboard → MySQL → Firewall
   - Adicionar IP do Vercel (região São Paulo)

2. **Criar admin user no banco MySQL**
   ```sql
   INSERT INTO user (id, email, password, name, is_admin, is_vendedor, createdAt, updatedAt)
   VALUES ('user-123', 'admin@glabcursos.com', '$2a$10$...bcrypt_hash...', 'Admin', 1, 0, NOW(), NOW());
   ```

3. **Ver logs completos**
   - Vercel Dashboard → Deployments → Clicar deploy → "Logs"
   - Procurar por "[v0]" para ver logs da aplicação

