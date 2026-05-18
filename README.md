# VoaJá · Planejador de Orçamento de Viagem

MVP funcional em **React + Vite + Tailwind** para comparar destinos
internacionais a partir de um orçamento, número de dias e tamanho do grupo.

## O que dá pra fazer

1. Informar **origem, orçamento, dias e número de pessoas** (com presets).
2. Comparar **8 destinos internacionais** (Europa, Ásia e Eurásia) — todos
   fora dos continentes Americano, Africano e da Oceania.
3. Ver o **orçamento detalhado por categoria**: voo, hospedagem, alimentação,
   transporte local, passeios, extras, seguro/visto/chip e reserva de imprevistos (8%).
4. Comparar 3 cenários — **Econômico, Confortável e Premium** — lado a lado.
5. Saber se a viagem **cabe no orçamento** (badge verde / vermelho com diferença em R$).
6. Receber uma **recomendação clara** baseada no melhor cenário que cabe.
7. Ver um **roteiro sugerido dia a dia** com temas e atrações.
8. **Exportar o relatório**: copiar para clipboard, baixar `.txt` ou imprimir.
9. Layout 100% **responsivo** (desktop, tablet, celular).

## Stack

- **React 18** + **Vite 5** (HMR rápido, build otimizado)
- **Tailwind CSS 3** para o design system
- **lucide-react** para ícones
- Estado em `useState`/`useMemo`, persistência leve em `localStorage`

## Como rodar

Pré-requisitos: Node 18+ e npm.

```bash
npm install
npm run dev      # http://localhost:5173
```

Para produção:

```bash
npm run build
npm run preview  # serve a pasta dist/ localmente
```

## Estrutura

```
src/
├── App.jsx                     # Composição e estado global da app
├── main.jsx                    # Bootstrap React
├── index.css                   # Tailwind + tokens visuais
├── data/
│   ├── destinations.js         # MOCK: 8 destinos + diárias + voos base
│   └── itineraries.js          # MOCK: pool de dias temáticos por destino
├── lib/
│   ├── calc.js                 # Lógica de orçamento e ranking
│   └── report.js               # Geração / cópia / download do relatório
└── components/
    ├── InputForm.jsx           # Origem, orçamento, dias e pessoas
    ├── DestinationGrid.jsx     # Comparação rápida de todos os destinos
    ├── DestinationDetail.jsx   # Página detalhada do destino selecionado
    ├── Recommendation.jsx      # Headline + KPIs do cenário recomendado
    ├── ScenarioComparison.jsx  # Cards Econômico × Confortável × Premium
    ├── BudgetBreakdown.jsx     # Barras horizontais por categoria
    ├── Itinerary.jsx           # Roteiro dia a dia
    └── ReportPanel.jsx         # Copiar / baixar / imprimir relatório
```

## Voos reais via Amadeus

O app traz uma integração opcional com a **Amadeus Flight Offers Search**
(plano Self-Service gratuito) através de um Cloudflare Worker — necessário
porque a API exige OAuth com secret e bloqueia CORS no browser.

Passos rápidos:

1. Pegue credenciais grátis em [developers.amadeus.com](https://developers.amadeus.com/register).
2. Deploy o worker em [`/worker`](./worker/) — veja [`worker/README.md`](./worker/README.md).
   Não precisa CLI: dá pra colar o `index.js` direto no painel da Cloudflare.
3. No app, clique na ⚙️ engrenagem do header e cole a URL pública do worker.
4. Clique em **"Buscar voos reais"** (busca em massa) ou no botão de refresh
   em cada destino.

Resultados ficam em cache no `localStorage` por combinação
(origem, destino, datas, pessoas). Os preços mostrados ganham um selo
**Amadeus** ✨; sem worker conectado, ficam com selo **Mock**.

## Onde substituir mocks por APIs reais

Todos os pontos com dados estimados estão **comentados como `MOCKED`** /
`TODO`. Pontos para integração:

| Mock                                    | Onde está                       | API sugerida                          |
| --------------------------------------- | ------------------------------- | ------------------------------------- |
| Preço de voo base e multiplicador origem | `src/data/destinations.js`      | Skyscanner, Kiwi, Amadeus Flight Offers |
| Diárias por categoria/cenário           | `src/data/destinations.js`      | Numbeo, Booking, GetYourGuide         |
| Roteiros temáticos por dia              | `src/data/itineraries.js`       | GetYourGuide, Triposo, LLM (Claude)   |
| Custos fixos (seguro, visto, eSIM)      | `src/lib/calc.js`               | Coris, Heymondo, Allianz Travel       |
| Câmbio                                  | (futuro)                        | Open Exchange Rates, Frankfurter      |

A camada de cálculo (`src/lib/calc.js`) é totalmente pura — basta trocar os
inputs por dados de APIs reais que toda a UI continua funcionando.

## Critérios de aceite (checklist)

- [x] Informar origem, orçamento, dias e nº de pessoas
- [x] Comparar 6+ destinos internacionais (8 entregues, fora de Américas/África/Oceania)
- [x] Budget detalhado por categoria
- [x] Cenários econômico, confortável e premium
- [x] Indicação clara de "cabe / não cabe" no orçamento
- [x] Recomendação textual personalizada
- [x] Roteiro sugerido dia a dia
- [x] Exportar/copiar relatório (clipboard, `.txt`, impressão)
- [x] Responsivo (mobile, tablet e desktop)

## Notas

Os preços partem de médias estimadas para 2026 em BRL. Valores reais variam
muito por **temporada**, **antecedência da compra** e **promoções pontuais**.
Sempre confirme tarifas antes de comprar.
