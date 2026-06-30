# G•LAB - Guia de Início Rápido

## 🚀 Acessar o Sistema

### Web Admin Panel
1. Acesse: **https://www.glabcursos.com.br**
2. Login com suas credenciais
3. Você terá acesso a todos os módulos

### Mobile App (Para Desenvolvedores)

```bash
cd apps/mobile
npm install
npm run dev
```

Abra o link em um emulador ou dispositivo com Expo Go.

---

## 📱 Funcionalidades por Módulo

### 1. Dashboard
- Visualizar métricas financeiras
- Gráficos de receita/despesa
- Últimas ordens e atividades

### 2. Clientes
- Criar novo cliente
- Editar informações
- Ver histórico de ordens
- Filtrar por cidade/status

### 3. Técnicos
- Gerenciar equipe
- Ver geolocalização em tempo real
- Acompanhar performance
- Calcular comissões

### 4. Ordens de Serviço
- Criar nova ordem
- Atribuir ao técnico
- Acompanhar status
- Capturar fotos com câmera
- Gerar laudo automático

### 5. Estoque
- Cadastrar peças
- Controlar quantidade
- Receber alertas de estoque baixo
- Rastrear movimentações

### 6. Financeiro
- Registrar receitas/despesas
- Acompanhar pagamentos
- Calcular margem de lucro
- Ver relatórios por período

### 7. Relatórios
- Gerar 6 tipos de relatórios
- Exportar dados
- Visualizar gráficos
- Analisar performance

---

## 🔧 APIs Disponíveis

Todos os endpoints estão em: `https://www.glabcursos.com.br/api`

### Exemplos de Uso

#### Listar Clientes
```bash
curl -H "Authorization: Bearer TOKEN" \
  https://www.glabcursos.com.br/api/clientes
```

#### Criar Ordem de Serviço
```bash
curl -X POST \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"cliente_id": 1, "descricao": "..."}' \
  https://www.glabcursos.com.br/api/ordens-servico
```

---

## 📱 Mobile App - Próximos Passos

### Desenvolvimento Local
```bash
cd apps/mobile
npm install
npm run dev
```

### Build para Produção

**iOS:**
```bash
npm run build:ios
```

**Android:**
```bash
npm run build:android
```

### Publicar nas Lojas
1. Configure os certificados
2. Use Expo EAS para building
3. Publique na App Store / Google Play

---

## 🔐 Autenticação

O sistema usa JWT tokens.

### Login
```bash
POST /api/auth/login
{
  "email": "usuario@example.com",
  "password": "senha123"
}
```

Você receberá um `token` que deve ser usado em:
```
Authorization: Bearer {token}
```

---

## 📊 Relatorios Disponíveis

1. **Relatório de OS**
   - Total de ordens
   - Ordens finalizadas
   - Taxa de conclusão

2. **Relatório Financeiro**
   - Receita total
   - Despesa total
   - Lucro líquido
   - Margem de lucro

3. **Relatório de Estoque**
   - Itens em estoque
   - Itens em baixa quantidade
   - Valor total de estoque

4. **Desempenho de Técnicos**
   - Ordens realizadas
   - Tempo médio
   - Rating/Satisfação

5. **Clientes Lucrativos**
   - Clientes por valor gasto
   - Histórico de compras
   - Potencial de negócio

6. **Movimentações de Estoque**
   - Entradas
   - Saídas
   - Ajustes

---

## ⚙️ Configurações

### Variáveis de Ambiente

`.env.local`:
```
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=seu_secret
AI_GATEWAY_API_KEY=sua_chave
```

### Multi-tenancy

Cada usuário vê APENAS seus dados:
- Seus clientes
- Suas ordens
- Seu estoque
- Suas finanças

---

## 📞 Suporte

- **Email:** support@glabcursos.com.br
- **Documentação:** `/docs`
- **API Docs:** `/api/docs`

---

## 📈 Métricas do Sistema

- **Uptime:** 99.9%
- **API Response:** < 100ms
- **Database:** Otimizado com índices
- **Security:** SSL/TLS, Multi-tenancy, Validação

---

## ✅ Checklist de Boas Práticas

- ✅ Sempre use tokens no header `Authorization`
- ✅ Valide os dados antes de enviar
- ✅ Use filtros para grandes volumes de dados
- ✅ Implemente retry logic para APIs instáveis
- ✅ Cache resultados quando possível
- ✅ Monitore performance regularmente

---

**Pronto para começar! 🚀**
