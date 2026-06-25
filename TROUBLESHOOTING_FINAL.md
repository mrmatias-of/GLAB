# GUIA FINAL DE TROUBLESHOOTING - LOGIN NÃO FUNCIONA

## ERRO CONFIRMADO
```
"Failed to fetch" ao tentar fazer login
```

Isso significa que a API `/api/auth/login` NÃO consegue conectar ao MySQL Locaweb.

---

## DIAGNÓSTICO: 3 POSSIBILIDADES

### 1. DATABASE_URL INCORRETA OU NÃO DEFINIDA (60% chance)

**Como verificar:**
1. Vercel Dashboard → Settings → Environment Variables
2. Procure por `DATABASE_URL`
3. Verifique o valor:
   - ✅ Deve começar com: `mysql://`
   - ✅ Deve conter: `glabcursos_db` (usuário)
   - ✅ Deve conter: `Larissa%40123` (senha com @ encoded)
   - ✅ Deve conter: `glabcursos_db.mysql.dbaas.com.br` (host)
   - ✅ Deve conter: `3306` (porta)

**Valor correto:**
```
mysql://glabcursos_db:Larissa%40123@glabcursos_db.mysql.dbaas.com.br:3306/glabcursos_db
```

**Se estiver errado:**
- Remova a variável errada
- Adicione a variável correta
- Clique "Save"
- Faça Redeploy

---

### 2. FIREWALL LOCAWEB BLOQUEANDO IP DO VERCEL (35% chance)

**Como verificar:**
1. Painel Locaweb → Banco de Dados → MySQL
2. Procure por "Firewall" ou "IP Whitelist"
3. Verifique se há IPs whitelisted

**O que fazer:**
1. Adicione a faixa de IPs do Vercel: `76.76.0.0/16`
2. OU adicione IP específico do Vercel (São Paulo)
3. Clique "Salvar"
4. Aguarde 5 minutos

**Para encontrar IP do Vercel específico:**
- Criar um arquivo `pages/api/myip.js`:
```javascript
export default (req, res) => {
  res.json({ ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress })
}
```
- Acessar: `https://www.glabcursos.com.br/api/myip`
- Copiar o IP e adicionar ao Firewall Locaweb

---

### 3. BANCO VAZIO - USUÁRIO ADMIN NÃO EXISTE (5% chance)

**Como verificar:**
1. Conectar ao MySQL Locaweb via client
2. Executar: `SELECT * FROM user WHERE email='admin@glabcursos.com';`
3. Se retornar vazio, usuário não existe

**Como criar:**
```sql
INSERT INTO user (id, email, password, name, is_admin, is_vendedor, createdAt, updatedAt)
VALUES (
  'admin-001',
  'admin@glabcursos.com',
  '$2a$10$mTEZemW/cOmZdQN0JQhvZe.Xdkj7vQ6.8Qq8/8Ll3ZQT3VqLKJtCa',
  'Admin',
  1,
  0,
  NOW(),
  NOW()
);
```

Hash bcrypt acima é para senha: `Larissa@123`

---

## PASSO-A-PASSO PARA RESOLVER

### Passo 1: Verificar DATABASE_URL (5 min)
```
Vercel Dashboard → Environment Variables
✓ Confirme que DATABASE_URL existe
✓ Confirme valor = mysql://glabcursos_db:Larissa%40123@...
✓ Se errado: Edite ou recrie
✓ Clique "Save"
✓ Faça "Redeploy"
```

### Passo 2: Verificar Firewall Locaweb (10 min)
```
Locaweb Dashboard → Banco de Dados → MySQL → Firewall
✓ Adicione: 76.76.0.0/16 (range Vercel)
✓ OU encontre IP específico e adicione
✓ Clique "Salvar"
✓ Aguarde 5 minutos
```

### Passo 3: Verificar Usuário Admin (5 min)
```
Se ainda não funcionar:
1. Conecte ao MySQL via client
2. Verifique se admin@glabcursos.com existe
3. Se não existir, crie conforme instruções acima
```

### Passo 4: Testar Login
```
https://www.glabcursos.com.br/login
Email: admin@glabcursos.com
Senha: Larissa@123

✓ Se funcionar → Login bem-sucedido!
✗ Se ainda falhar → Ver logs no Vercel
```

---

## VER LOGS DO VERCEL

Se login ainda falhar após todos os passos:

1. Ir para: https://vercel.com/gmjuliao-5010s-projects/glab/deployments
2. Clicar no deploy mais recente
3. Ir para aba "Logs"
4. Procurar por:
   - `[v0]` - logs da aplicação
   - `error` - mensagens de erro
   - `connection` - erros de conexão
   - `ECONNREFUSED` - conexão recusada (firewall)
   - `ENOTFOUND` - host não encontrado
   - `Access denied` - credenciais erradas

---

## CHECKLIST FINAL

- [ ] DATABASE_URL adicionada corretamente no Vercel
- [ ] DATABASE_URL começa com `mysql://`
- [ ] PASSWORD tem `%40` em vez de `@`
- [ ] Redeploy realizado após salvar DATABASE_URL
- [ ] Firewall Locaweb whitelisted IP Vercel
- [ ] Usuário admin@glabcursos.com existe no banco
- [ ] Testei login e funcionou ✓

---

## SE NADA FUNCIONAR

1. Screenshot do Vercel Environment Variables mostrando DATABASE_URL
2. Screenshot do Firewall Locaweb
3. Screenshot de `SELECT * FROM user;` no MySQL
4. Screenshot dos logs do Vercel (aba "Logs")
5. Compartilhar essas informações para debug remoto

