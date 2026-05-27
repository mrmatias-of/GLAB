## 🤖 Integração com Telegram - Guia de Implementação

### ✅ O que foi criado:

#### 1. **Serviço de Telegram** (`lib/telegram.ts`)
- `sendTelegramNotification()` - Função genérica para enviar mensagens
- `notifySale()` - Notifica sobre vendas
- `notifySignup()` - Notifica sobre cadastros
- `notifyError()` - Notifica sobre erros
- `notifyContact()` - Notifica sobre mensagens de contato

#### 2. **API Routes** (para receber eventos)
- `POST /api/vendas` - Notifica quando um curso é vendido
- `POST /api/cadastro` - Notifica quando um usuário se registra
- `POST /api/contato` - Notifica quando uma mensagem é enviada
- `GET /api/contato` - Processa formulário de contato

#### 3. **Error Handler** (`lib/error-handler.ts`)
- Captura erros não tratados do Node.js
- Captura promessas rejeitadas
- Envia automaticamente para o Telegram

### 📝 Como usar:

#### **Para notificar uma venda:**
```typescript
import { notifySale } from '@/lib/telegram'

// No seu componente de checkout ou rota de pagamento
await notifySale('Combo Iniciante Mobile', 'R$ 17,90', 'João Silva')
```

#### **Para notificar um cadastro:**
```typescript
import { notifySignup } from '@/lib/telegram'

// No seu formulário de registro
await notifySignup('usuario@email.com', 'João Silva')
```

#### **Para notificar um erro manualmente:**
```typescript
import { notifyError } from '@/lib/telegram'

try {
  // seu código
} catch (error) {
  await notifyError(
    'Erro ao processar pagamento',
    error.message,
    error.stack
  )
}
```

### 🔗 Próximos passos para integração:

1. **Integrar com seu sistema de pagamento** (Stripe, Kiwify, etc.)
   - Quando um pagamento é confirmado, chame `notifySale()`

2. **Integrar com seu formulário de contato** (página /contato)
   - O formulário já está configurado para enviar para `/api/contato`
   - Só precisa adicionar a chamada FETCH no frontend

3. **Integrar com seu sistema de usuários** (Supabase Auth)
   - Quando um novo usuário se registra, chame `notifySignup()`

4. **Monitorar erros em tempo real**
   - O error handler já está ativo e enviando erros automaticamente

### 🧪 Como testar:

**Teste 1: Venda**
```bash
curl -X POST http://localhost:3000/api/vendas \
  -H "Content-Type: application/json" \
  -d '{"cursoTitulo":"Teste","valor":"R$ 99,90","nomeCliente":"Teste User"}'
```

**Teste 2: Cadastro**
```bash
curl -X POST http://localhost:3000/api/cadastro \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@example.com","nome":"Teste"}'
```

**Teste 3: Contato**
```bash
curl -X POST http://localhost:3000/api/contato \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste","email":"teste@example.com","mensagem":"Olá"}'
```

### 📊 Variáveis de ambiente já configuradas:
- `TELEGRAM_BOT_TOKEN` ✅
- `TELEGRAM_CHAT_ID` ✅

Tudo pronto para usar! 🚀
