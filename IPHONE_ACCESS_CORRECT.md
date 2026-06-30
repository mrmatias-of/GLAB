# Acessar o App Mobile do iPhone - Guia Correto

## Problema
`localhost:19000` não funciona porque é um endereço local do servidor.
Do iPhone, você precisa do IP externo ou domínio.

## Solução 1: USAR PC LOCAL (Mais Fácil e Funciona 100%)

Se você tem Node.js no PC:

```powershell
git clone https://github.com/mrmatias-of/GLAB.git
cd GLAB\apps\mobile
npm install
npm run dev
```

Aguarde aparecer:
```
› Scan the QR code with Expo Go or Camera app (iOS)
```

**No iPhone:**
1. Abra câmera
2. Aponte para o QR code
3. Clique no link
4. Escolha Expo Go

**Isso funciona 100%!**

---

## Solução 2: Via ngrok (Se quiser do servidor Locaweb)

Se quer usar o servidor Locaweb:

No servidor:
```bash
npm install -g ngrok
ngrok http 19000
```

Você receberá um link como:
```
https://abc123.ngrok.io
```

**No iPhone:**
1. Instale Expo Go (App Store)
2. Abra o app
3. Clique "Scan QR code"
4. Manualmente vá para:
   ```
   exp://abc123.ngrok.io
   ```

---

## Solução 3: Publicar no Expo (Melhor para Produção)

Publicar uma versão permanente:

```bash
npm install -g eas-cli
eas build --platform android --profile preview
```

Você receberá um link permanente que funciona em qualquer lugar.

---

## Recomendação

**Para testar AGORA:** Use Solução 1 (PC local)
- Mais rápido
- Funciona 100%
- Hot reload em tempo real

**Para compartilhar:** Use Solução 3 (EAS)
- Link permanente
- Qualquer pessoa acessa
- Não precisa rodar servidor

---

## Se ainda não funcionar

1. Certifique-se que o iPhone está com WiFi ativo
2. Expo Go está instalado (App Store)
3. O app está conectado à internet
4. Não tem VPN ativada

Pronto! 🚀
