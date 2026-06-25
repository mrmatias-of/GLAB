# Configuração MySQL Locaweb - Guia Completo

## Passo 1: Criar Banco de Dados MySQL

1. Acesse seu painel Locaweb: https://painel.locaweb.com.br
2. Vá para **Banco de Dados** → **MySQL**
3. Clique em **Criar novo banco de dados**
4. Configure:
   - Nome do banco: `glabcursos_db`
   - Codificação: `utf8mb4_unicode_ci`
   - Clique em **Criar**

## Passo 2: Criar Usuário MySQL

1. Em **Banco de Dados** → **Usuários MySQL**
2. Clique em **Criar novo usuário**
3. Configure:
   - Usuário: `glabcursos_user`
   - Senha: (crie uma senha forte)
   - Confirmação: (repita a senha)
   - Clique em **Criar**

## Passo 3: Associar Usuário ao Banco

1. Em **Banco de Dados** → **MySQL**
2. Clique no banco `glabcursos_db`
3. Em **Usuários do banco**, adicione o usuário `glabcursos_user`
4. Marque todas as permissões (SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, DROP)

## Passo 4: Obter Credenciais de Conexão

1. Vá para **Banco de Dados** → **MySQL**
2. Clique no banco `glabcursos_db`
3. Na aba **Informações de conexão**, copie:
   - **Host**: (ex: mysql.hosting.locaweb.com.br)
   - **Porta**: (ex: 3306)
   - **Usuário**: glabcursos_user
   - **Senha**: (a que você criou)
   - **Banco**: glabcursos_db

## Informações Necessárias

Após criar o banco, envie-me EXATAMENTE estes dados:

```
Host: [preencher]
Porta: [preencher]
Usuário: [preencher]
Senha: [preencher]
Banco: [preencher]
```

**IMPORTANTE**: Guarde essas credenciais em segurança! Elas serão usadas nas variáveis de ambiente.

## O que vamos fazer depois:

1. ✓ Você cria o banco MySQL
2. ✓ Você fornece as credenciais
3. → Eu instalo Prisma e configuro a conexão
4. → Eu migro os dados do Neon para MySQL
5. → Eu atualizo toda a autenticação
6. → Eu faço deploy em produção
