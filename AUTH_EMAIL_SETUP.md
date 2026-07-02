# Configuração de Autenticação com Email (Locaweb SMTP)

## Overview

O sistema agora suporta autenticação completa com:
- ✓ Criação de contas (Sign-up)
- ✓ Recuperação de senha (Forgot Password)
- ✓ Redefinição de senha com email
- ✓ Notificações por email via Locaweb

## Variáveis de Ambiente Necessárias

Adicione as seguintes variáveis ao seu arquivo `.env.local` ou no Vercel/Dashboard:

```
# Locaweb SMTP Configuration
LOCAWEB_SMTP_HOST=smtp.locaweb.com.br
LOCAWEB_SMTP_PORT=587
LOCAWEB_SMTP_SECURE=false
LOCAWEB_EMAIL=seu-email@seudominio.com
LOCAWEB_PASSWORD=sua-senha-aqui

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
# Em produção: https://seudominio.com.br
```

## Páginas Implementadas

### 1. Login (`/login`)
- Página de acesso principal
- **Novo:** Botões "Criar Conta" e "Redefinir Senha"

### 2. Sign-Up (`/auth/signup`)
- Criação de nova conta
- Campos: Nome, Email, Senha, Confirmar Senha
- Validações de cliente e servidor
- Email de boas-vindas enviado automaticamente

### 3. Forgot Password (`/auth/forgot-password`)
- Recuperação de senha
- Usuário fornece email
- Link de reset enviado por email (válido por 24h)

### 4. Reset Password (`/auth/reset-password`)
- Página de redefinição (acessada via link do email)
- Parâmetros: `token` e `email` na URL
- Validação de token e expiração

## APIs Criadas

### 1. POST `/api/auth/signup`
Cria nova conta de usuário

**Request:**
```json
{
  "name": "Nome Completo",
  "email": "usuario@email.com",
  "password": "senha123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Conta criada com sucesso! Faça login para continuar.",
  "user": {
    "id": "uuid",
    "email": "usuario@email.com",
    "name": "Nome Completo"
  }
}
```

### 2. POST `/api/auth/reset-password`
Solicita reset de senha

**Request:**
```json
{
  "email": "usuario@email.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Se o email existe, um link de reset será enviado."
}
```

### 3. POST `/api/auth/confirm-reset-password`
Confirma redefinição de senha

**Request:**
```json
{
  "token": "token-do-email",
  "email": "usuario@email.com",
  "newPassword": "nova-senha123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Senha redefinida com sucesso! Você pode fazer login agora."
}
```

## Templates de Email

### 1. Welcome Email (Boas-vindas)
Enviado automaticamente após sign-up
- Contém link de acesso ao painel
- Branding G•Lab

### 2. Password Reset Email
Enviado quando usuário solicita reset
- Link de reset válido por 24 horas
- Instructions claras

### 3. Password Changed Email
Enviado após mudança bem-sucedida
- Confirmação de ação
- Informação de suporte

## Fluxo de Autenticação

### Sign-Up Flow
```
1. Usuário vai para /auth/signup
2. Preenche formulário (nome, email, senha)
3. Sistema cria conta
4. Email de boas-vindas enviado
5. Redirect para /login
6. Usuário pode fazer login
```

### Password Recovery Flow
```
1. Usuário clica "Redefinir Senha" em /login
2. Vai para /auth/forgot-password
3. Fornece email
4. Sistema envia email com link de reset
5. Usuário clica link no email
6. Vai para /auth/reset-password?token=xxx&email=xxx
7. Define nova senha
8. Sistema atualiza senha no banco
9. Email de confirmação enviado
10. Redirect para /login
11. Usuário faz login com nova senha
```

## Notas Importantes

### Segurança
- ✓ Senhas são hasheadas com bcrypt
- ✓ Tokens de reset são únicos e com expiration
- ✓ Links de reset expiram em 24 horas
- ✓ Validação de email antes de reset
- ✓ Não revela se email existe (por segurança)

### Performance
- ✓ Emails enviados assincronamente
- ✓ Não bloqueia requisição se email falhar
- ✓ Tokens criptografados

### Email via Locaweb
Certifique-se de:
1. Que o email está verificado na Locaweb
2. Que as credenciais estão corretas
3. Que a porta 587 (ou 465) está aberta
4. Que NÃO há firewall bloqueando SMTP

## Testando Localmente

```bash
# 1. Configure o .env.local com credenciais Locaweb

# 2. Inicie o servidor
pnpm dev

# 3. Teste o fluxo:
# - Acesse http://localhost:3000/auth/signup
# - Crie uma conta
# - Verifique email de boas-vindas

# - Acesse http://localhost:3000/login
# - Clique "Redefinir Senha"
# - Digite seu email
# - Verifique email com link de reset
# - Clique no link e redefina a senha
```

## Troubleshooting

### Email não está sendo enviado
1. Verifique LOCAWEB_EMAIL e LOCAWEB_PASSWORD
2. Verifique logs do servidor
3. Teste SMTP manualmente
4. Verifique firewall/antispam

### Link de reset inválido
1. Certifique-se que NEXT_PUBLIC_APP_URL está correto
2. Verificar se token expirou (24h)
3. Copiar link exato do email

### Erro na criação de conta
1. Verifique se email já existe
2. Verifique validações de senha
3. Verifique se banco de dados está acessível

## Próximos Passos Sugeridos

1. **Autenticação Social**: Adicionar Google, GitHub OAuth
2. **2FA**: Autenticação de dois fatores
3. **Email Verification**: Confirmar email antes de usar conta
4. **Session Management**: Logout, esquecer dispositivos
5. **Rate Limiting**: Limitar tentativas de login/reset

---

**Status:** Implementado e testado  
**Data:** 2026-07-02
**Versão:** 1.0
