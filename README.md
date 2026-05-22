# Painel Comercial Connectabil 2026

Dashboard comercial em tempo real conectado ao Supabase.

## Stack
- React 18 + Vite
- Supabase (dados em tempo real)
- Recharts (gráficos)
- Plus Jakarta Sans (tipografia)

## Como rodar localmente

```bash
npm install
npm run dev
```

## Como publicar no GitHub Pages

1. Crie um repositório no GitHub (ex: `connectabil-dashboard`)
2. Faça o push deste código para o branch `main`
3. Vá em **Settings → Pages → Source → GitHub Actions**
4. O deploy acontece automaticamente a cada push

## Atualizar os dados

Quando adicionar novos dados na planilha:
1. Execute os 4 SQLs no Supabase SQL Editor (INSERT_1 a INSERT_4)
2. O dashboard atualiza em tempo real via Supabase Realtime

## Estrutura

```
src/
├── lib/
│   ├── supabase.js       # conexão Supabase
│   └── formatters.js     # helpers BRL, datas etc
├── context/
│   └── FiltroContext.jsx # filtros globais de período e IS
├── hooks/
│   └── useDashboard.js   # busca todos os dados
├── components/
│   ├── Header.jsx
│   ├── Filters.jsx
│   ├── KPICard.jsx
│   ├── GraficoReceita.jsx
│   ├── MetaISCard.jsx
│   ├── ProjecaoDiaria.jsx
│   ├── RoletaPipeline.jsx
│   └── Historico.jsx
└── App.jsx               # layout e abas
```
