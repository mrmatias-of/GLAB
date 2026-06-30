# Solução Final - Acessar App Mobile do iPhone

## O Problema

`localhost:19000` não funciona do iPhone porque é endereço local do servidor.

## 3 Soluções (em ordem de facilidade)

---

## ✅ SOLUÇÃO 1: USAR PC LOCAL (Recomendado - Funciona 100%)

**Pré-requisitos:**
- Node.js instalado no PC (https://nodejs.org)
- WiFi ativo no iPhone
- Expo Go instalado (App Store)

**No seu PC (Windows/Mac/Linux):**

```powershell
git clone https://github.com/mrmatias-of/GLAB.git
cd GLAB\apps\mobile
npm install
npm run dev
```

**Resultado esperado:**
```
› Expo Go app is ready at exp://192.168.X.X:19000
› Scan the QR code with Expo Go (Android) or Camera app (iOS)

[QR CODE]
```

**No iPhone:**
1. Abra a câmera
2. Aponte para o QR code
3. Clique no link "Expo Go"
4. **App abre no iPhone!**

**Vantagens:**
- Funciona 100%
- Hot reload (código atualiza em tempo real)
- Sem limite de tempo

---

## SOLUÇÃO 2: Link Permanente (Melhor para Produção)

Se quer compartilhar um link que qualquer pessoa possa usar:

**Pré-requisitos:**
- Conta Expo.dev (grátis)
- CLI tools instaladas

**Passos:**

1. Faça login no Expo:
```bash
npm install -g eas-cli
eas login
```

2. Crie um build:
```bash
cd apps/mobile
eas build --platform android --profile preview
```

3. Você receberá um **link permanente** como:
```
https://expo.dev/@seu-usuario/glab-mobile
```

4. **No iPhone:** Abra Expo Go e escaneie o QR code da página

**Vantagens:**
- Link permanente
- Qualquer pessoa acessa
- Funciona em qualquer rede

---

## SOLUÇÃO 3: App Store / Play Store

Para distribuição final:

```bash
eas build --platform ios --distribution store
eas submit --platform ios
```

Publicado na App Store - qualquer pessoa pode instalar.

---

## Qual Usar?

| Cenário | Solução |
|---------|---------|
| Testar agora | **Solução 1** (PC local) |
| Compartilhar com time | **Solução 2** (Link permanente) |
| Produção final | **Solução 3** (App Store) |

---

## Troubleshooting

### "Expo Go não abre o link"
- Certifique-se que tem WiFi ativo
- Instale Expo Go manualmente (App Store)
- Tente novamente

### "Não consigo conectar"
- PC e iPhone precisam estar na **MESMA rede WiFi**
- Desative VPN no PC
- Reinicie Expo Go no iPhone

### "Dá erro na API"
- Verifique se www.glabcursos.com.br está online
- Verifique conexão de internet do iPhone

---

## Links Úteis

- Expo Go: https://expo.dev/download
- Expo Docs: https://docs.expo.dev
- GitHub: https://github.com/mrmatias-of/GLAB

---

**Recomendação: Use SOLUÇÃO 1 agora para testar!**
