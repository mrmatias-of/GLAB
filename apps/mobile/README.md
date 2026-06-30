# G•LAB Mobile App

Aplicativo mobile para gerenciamento de assistência técnica em tempo real.

## Features

✓ Dashboard com métricas financeiras
✓ Gerenciamento de ordens de serviço
✓ Rastreamento de estoque
✓ Geolocalização de técnicos
✓ Sincronização offline
✓ Notificações push

## Tecnologias

- React Native / Expo
- TypeScript
- Zustand (State Management)
- Axios (HTTP Client)
- React Navigation
- Expo Location + Camera

## Setup

```bash
npm install
npm run dev
```

## Build

```bash
npm run build:android
npm run build:ios
```

## Estrutura

```
src/
├── screens/         - Telas principais
├── components/      - Componentes reutilizáveis
├── services/        - Chamadas de API
├── store/          - Zustand stores
└── utils/          - Utilidades
```

## API Integration

Conecta-se à API do G•LAB:
- `https://www.glabcursos.com.br/api`

Endpoints utilizados:
- `/api/ordens-servico` - Ordens de serviço
- `/api/estoque` - Gestão de estoque
- `/api/clientes` - Clientes
- `/api/tecnicos` - Técnicos
- `/api/financeiro` - Finanças
