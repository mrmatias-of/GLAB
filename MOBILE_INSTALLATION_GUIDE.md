# Guia Completo - Acessar e Instalar o App Mobile no iPhone

## 1. ACESSO RÁPIDO - Desenvolvimento Local (Easiest)

### Opção 1A: Via Expo Go (Mais Fácil)

#### No seu computador:
```bash
cd apps/mobile
npm install
npm run dev
```

Você verá um QR code no terminal. No seu iPhone:

1. Abra a câmera
2. Aponte para o QR code
3. Clique no link "Expo Go"
4. Abre o app automaticamente

#### Alternativa sem câmera:
1. Instale o app "Expo Go" na App Store
2. Abra o app
3. Aponte a câmera para o QR code
4. Aguarde carregar

**Status:** App rodando em development

---

## 2. DESENVOLVIMENTO CONTÍNUO - Atualizar o App em Tempo Real

Qualquer mudança de código que você fizer:
- Salve o arquivo
- O app atualiza automaticamente (Hot Reload)

Não precisa rebuild!

---

## 3. BUILD PARA TESTE - TestFlight (Recomendado para Testes)

### Pré-requisitos:
- Apple Developer Account ($99/ano)
- Xcode (Mac)
- Certificates e Provisioning Profiles configurados

### Passo 1: Configurar EAS

```bash
npm install -g eas-cli
cd apps/mobile
eas login
```

### Passo 2: Inicializar EAS

```bash
eas build:configure
```

Escolha "Apple" quando perguntado.

### Passo 3: Build para TestFlight

```bash
eas build --platform ios --distribution internal
```

Isso vai:
1. Buildar para iOS
2. Gerar um arquivo .ipa
3. Enviar para EAS

### Passo 4: Baixar no iPhone

O build vai estar pronto em ~15 minutos. Você receberá um link. No iPhone:

1. Abra Safari
2. Cole o link
3. Clique "Install"
4. Aguarde a instalação

---

## 4. PUBLICAÇÃO NA APP STORE (Para Produção)

### Passo 1: Preparar no App Store Connect

```bash
eas build --platform ios --distribution store
```

### Passo 2: Enviar para App Store

```bash
eas submit --platform ios --latest
```

### Passo 3: Aprovar na App Store

1. Vá para App Store Connect
2. Revise o build
3. Envie para revisão
4. Aguarde aprovação (1-3 dias)

### Passo 4: Publicar

Depois de aprovado, clique "Publicar" no App Store Connect.

---

## 5. ACESSO DIRETO - Links Úteis

### Expo Project
- Link: https://expo.dev/@seu_usuario/glab-mobile
- Você vê todos os builds publicados

### App Store Connect
- Link: https://appstoreconnect.apple.com
- Gerenciar builds e submissões

### EAS Dashboard
- Link: https://expo.dev
- Histórico de builds

---

## 6. PRIMEIRO ACESSO - Passo a Passo Completo

### Para testar AGORA (30 segundos):

1. No seu computador, abra terminal:
```bash
cd /vercel/share/v0-project/apps/mobile
npm install
npm run dev
```

2. Você verá:
```
› Press 'i' to open iOS Simulator, or 'w' to open web
› Scan QR code with Expo Go app (Android) or Camera app (iOS)
```

3. No seu iPhone, abra a câmera
4. Aponte para o QR code que apareceu no terminal
5. Clique no link que aparecer
6. Automático! O app abre

### Pronto! O app está rodando no seu iPhone

---

## 7. CONFIGURAÇÃO DE AMBIENTE

### URL da API

O app conecta automaticamente com:
```
https://www.glabcursos.com.br/api
```

Ou configure em `apps/mobile/src/services/api.ts`:
```typescript
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://www.glabcursos.com.br/api'
```

### Variáveis de Ambiente

Crie `apps/mobile/.env`:
```
EXPO_PUBLIC_API_URL=https://www.glabcursos.com.br/api
```

---

## 8. TROUBLESHOOTING

### "Não consigo conectar ao app"

Solução:
```bash
npm install
npm run dev
```

Verifique se o computador e iPhone estão na MESMA rede WiFi.

### "QR code não funciona"

Solução:
1. Instale Expo Go manualmente na App Store
2. Abra o app
3. Clique "Scan QR Code"
4. Aponte para o QR code no terminal

### "App travou"

Solução:
```bash
# Feche e abra novamente
npm run dev
```

### "API não conecta"

Solução:
1. Verifique URL em `src/services/api.ts`
2. Certifique-se que o backend está online
3. Verifique se iPhone tem internet

---

## 9. RECURSOS DO APP

Depois de acessar, você tem:

### Home - Dashboard
- Receita/Despesa/Lucro
- Últimas ordens

### Ordens
- Lista de ordens de serviço
- Status de cada ordem
- Detalhes do cliente

### Técnico
- Dados do técnico logado
- Performance

### Estoque
- Itens em estoque
- Quantidade mínima
- Alertas

### Perfil
- Dados do usuário
- Configurações

---

## 10. DESENVOLVIMENTO FUTURO

Adicionar mais recursos:

```bash
# Câmera para capturar fotos
npm install expo-camera

# Localização GPS
npm install expo-location

# Notificações push
npm install expo-notifications
```

---

## Resumo Rápido

Para acessar agora:
```bash
cd apps/mobile
npm install
npm run dev
# Abra câmera no iPhone, aponte para o QR code
```

Para publicar no iPhone permanentemente:
1. Build via EAS
2. Instalar via TestFlight
3. Submeter para App Store

---

**Pronto! Seu app está acessível!**
