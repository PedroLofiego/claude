# VoaJá · Worker Amadeus

Proxy mínimo em **Cloudflare Workers** que conversa com a **Amadeus
Flight Offers Search API** e devolve preços em BRL para o frontend
do VoaJá (que roda no GitHub Pages).

## Por que precisa de um worker

A Amadeus exige OAuth com `client_secret` (não pode ficar no browser)
e a API não libera CORS. O worker:

1. Guarda as credenciais (Secrets do Cloudflare, nunca no código).
2. Faz o OAuth e cacheia o token em memória até expirar.
3. Chama `/v2/shopping/flight-offers`.
4. Devolve só o necessário (preço total e por pessoa) com CORS aberto.

## Setup em 5 minutos

### 1. Pegue credenciais Amadeus (gratuito)

- Crie conta em [developers.amadeus.com](https://developers.amadeus.com/register).
- Em **My Self-Service Workspace → Create new app**.
- Anote `API Key` e `API Secret` — vai usar como
  `AMADEUS_CLIENT_ID` e `AMADEUS_CLIENT_SECRET`.

> O ambiente "Self-Service Test" é gratuito e suficiente para preços
> indicativos. Para tarifas em tempo real de produção, troque o host
> em `index.js` para `https://api.amadeus.com` (plano pago).

### 2. Deploy do worker — opção A (dashboard, sem CLI)

1. Acesse [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages**
   → **Create** → **Worker** → escolha um nome (ex.: `voaja-amadeus`).
2. Clique em **Quick edit** e cole o conteúdo de [`index.js`](./index.js).
3. **Save and Deploy**.
4. Em **Settings → Variables → Secrets**, adicione:
   - `AMADEUS_CLIENT_ID`
   - `AMADEUS_CLIENT_SECRET`
5. Copie a URL pública (ex.: `https://voaja-amadeus.SEUUSER.workers.dev`).

### 2. Deploy do worker — opção B (Wrangler CLI)

```bash
cd worker
npx wrangler@latest secret put AMADEUS_CLIENT_ID
npx wrangler@latest secret put AMADEUS_CLIENT_SECRET
npx wrangler@latest deploy
```

### 3. Conecte o frontend

Abra o site VoaJá → ícone de engrenagem no header → cole a URL do worker
no campo **Worker URL** → **Salvar**.

Pronto. A partir daí, na página de qualquer destino aparece o botão
**"Atualizar com voo real"**. Existe também um botão global
**"Buscar voos reais para todos"** no formulário.

## Endpoints

```
GET /flights
    ?origin=SSA
    &destination=LIS
    &departureDate=2026-12-23
    &returnDate=2027-01-07
    &adults=2
```

Resposta:

```json
{
  "source": "amadeus-test",
  "fetchedAt": "2026-05-18T19:42:00.000Z",
  "origin": "SSA",
  "destination": "LIS",
  "departureDate": "2026-12-23",
  "returnDate": "2027-01-07",
  "adults": 2,
  "currency": "BRL",
  "totalBRL": 9120,
  "perPersonBRL": 4560,
  "count": 7,
  "carrier": "TP",
  "stops": 1
}
```

## Limitações do ambiente Self-Service Test

- Algumas rotas devolvem **tarifas estáticas/históricas** em vez de
  preços ao vivo. Use como **referência**, não como cotação final.
- Sem acesso a tarifas de companhias low-cost.
- Limite de requisições generoso para desenvolvimento (~10/segundo).

Para produção real, migre para `api.amadeus.com` (Production) — ativação
manual em developers.amadeus.com.
