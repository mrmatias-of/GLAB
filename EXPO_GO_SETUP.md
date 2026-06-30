# G•LAB Mobile - Acessar via Expo Go (Sem Credenciais)

## Opção Mais Fácil - Rodando no seu PC Local

### Pré-requisitos
- Windows/Mac/Linux
- Node.js instalado (https://nodejs.org)
- iPhone ou Android com WiFi
- App "Expo Go" instalado (App Store / Google Play)

### Passo 1: Preparar o Projeto no PC

```powershell
# Abra PowerShell e execute:

# Clone o repositório
git clone https://github.com/mrmatias-of/GLAB.git
cd GLAB\apps\mobile

# Instale dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

### Passo 2: QR Code Aparecerá

Você verá algo assim no terminal:

```
Expo Go app is ready at exp://192.168.1.100:19000
Scan the QR code above with Expo Go (Android) or Camera (iOS)
```

### Passo 3: No seu iPhone

1. **Abra a câmera**
2. **Aponte para o QR code** que apareceu no terminal
3. **Clique no link** que aparecer
4. **Escolha "Expo Go"**
5. **O app abre automaticamente!**

---

## Se Preferir Sem QR Code

### Via Link Direto

No terminal você verá algo como:
```
exp://192.168.1.100:19000
```

1. Abra o app **Expo Go** no iPhone
2. Clique em **"Scan QR code"**
3. OU manualmente:
   - Clique em "Enter URL manually"
   - Cole: `exp://seu-ip:19000`

---

## Desenvolvimento em Tempo Real

Qualquer arquivo que você modificar:
1. Salve no editor
2. O app atualiza automaticamente no iPhone
3. Sem precisar rebuild!

---

## Troubleshooting

### "Cannot connect to dev server"

**Solução:**
- Certifique-se que PC e iPhone estão na **MESMA rede WiFi**
- Desative VPN no seu PC
- Execute: `npm run dev` novamente

### "QR code não aparece"

**Solução:**
```powershell
npm install -g expo-cli
expo start
```

### "Expo Go não abre o app"

**Solução:**
1. Abra Expo Go manualmente
2. Clique "Scan QR code"
3. Aponte para o QR code no terminal

---

## Compartilhar com Outros

Se você publicar no Expo (com credenciais):

```bash
npm install -g eas-cli
eas build --platform android --profile preview
```

Depois recebe um link que qualquer pessoa pode acessar via Expo Go.

---

## Recursos do App

Após conectar:

- **Home**: Dashboard com métricas
- **Ordens**: Lista de ordens de serviço
- **Técnico**: Dados do técnico
- **Estoque**: Gestão de peças
- **Perfil**: Dados do usuário

---

## URLs e Configuração

API: https://www.glabcursos.com.br/api
Arquivo: `apps/mobile/src/services/api.ts`

---

**Pronto! Seu app está acessível no iPhone! 🚀**
