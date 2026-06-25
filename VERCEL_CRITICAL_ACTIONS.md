# AÇÕES CRÍTICAS: FAZER O LOGIN FUNCIONAR

## PROBLEMA IDENTIFICADO

Você tem TODAS as variáveis PostgreSQL/Neon ainda configuradas no Vercel Dashboard, conforme a imagem que enviou.

Isso está impedindo o login de funcionar porque Prisma não consegue conectar com a DATABASE_URL MySQL.

---

## AÇÃO 1: REMOVER VARIÁVEIS ANTIGAS (5 MINUTOS)

Ir para: https://vercel.com/gmjuliao-5010s-projects/glab/settings/environment-variables

**REMOVER (clicando no X ao lado de cada uma):**
- ❌ POSTGRES_PASSWORD
- ❌ POSTGRES_URL
- ❌ PGHOST
- ❌ POSTGRES_URL_NON_POOLING
- ❌ NEON_PROJECT_ID
- ❌ PGDATABASE
- ❌ POSTGRES_URL_NO_SSL

**NÃO REMOVA**: AI_GATEWAY_API_KEY ou outras variáveis que não começam com POSTGRES/NEON/PG

---

## AÇÃO 2: VERIFICAR DATABASE_URL (2 MINUTOS)

Ainda em Environment Variables, procure por **DATABASE_URL**.

Se não existir, criar:
- Nome: `DATABASE_URL`
- Valor: `mysql://glabcursos_db:Larissa%40123@glabcursos_db.mysql.dbaas.com.br:3306/glabcursos_db`
- Clicar "Save"

Se existir, verificar se começa com `mysql://`
- Se sim, OK
- Se não, deletar e recriar com valor correto acima

---

## AÇÃO 3: FAZER REDEPLOY (3 MINUTOS)

1. Ir para: https://vercel.com/gmjuliao-5010s-projects/glab/deployments
2. Clicar no deploy mais recente
3. Clicar no menu "..." (canto superior direito)
4. Selecionar "Redeploy"
5. Aguardar ~2-3 minutos

---

## AÇÃO 4: VERIFICAR SE FUNCIONOU (1 MINUTO)

Após deploy completar, abrir: https://www.glabcursos.com.br/api/debug/env

Deve mostrar:
```json
{
  "DATABASE_URL_VALID": "YES"
}
```

Se sim → ✅ Próxima etapa!
Se não → Repetir Ações 1-3

---

## AÇÃO 5: TESTAR LOGIN (1 MINUTO)

1. Abrir: https://www.glabcursos.com.br/login
2. Email: `admin@glabcursos.com`
3. Senha: `Larissa@123`
4. Clicar "Entrar no Painel"

**Se funcionar** → ✅✅✅ SUCESSO!

**Se falhar com "Failed to fetch"** → Firewall Locaweb bloqueando IP Vercel
- Ir para: Locaweb Dashboard → MySQL → Firewall
- Adicionar IP do Vercel (região São Paulo)
- Testar login novamente

---

## RESUMO

| Etapa | Tempo | O Que Fazer |
|-------|-------|-----------|
| 1 | 5 min | Remover variáveis POSTGRES/NEON |
| 2 | 2 min | Verificar DATABASE_URL MySQL |
| 3 | 3 min | Fazer Redeploy |
| 4 | 1 min | Testar /api/debug/env |
| 5 | 1 min | Testar login |
| **TOTAL** | **~12 min** | **Login deve funcionar** |

---

## SE AINDA NÃO FUNCIONAR

1. Ver logs: Vercel Dashboard → Deployments → Clicar deploy → "Logs"
2. Procurar por mensagem de erro
3. Se for "ECONNREFUSED" → Whitelist IP na Locaweb
4. Se for "Access denied" → PASSWORD errada ou USER inválido

---

## ⚠️ IMPORTANTE

Remover as variáveis PostgreSQL/Neon é CRÍTICO. Elas estão sobrescrevendo a configuração MySQL e é por isso que o login não funciona.

Faça agora!

