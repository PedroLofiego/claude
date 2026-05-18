/*
 * VoaJá — Cloudflare Worker proxy para Amadeus Flight Offers Search.
 *
 * Por que existe:
 *   A API da Amadeus exige OAuth2 client_credentials e NÃO libera CORS para
 *   browsers, então o frontend estático (GitHub Pages) não pode chamar direto.
 *   Este worker resolve isso: segura o secret, faz o OAuth, chama a Amadeus
 *   e devolve apenas o necessário com CORS aberto.
 *
 * Como deployar (sem CLI — pelo dashboard):
 *   1. cloudflare.com → Workers & Pages → Create → Worker → "Quick edit"
 *   2. Cole o conteúdo deste arquivo e clique em Deploy.
 *   3. Em Settings → Variables, adicione DOIS Secrets:
 *        AMADEUS_CLIENT_ID
 *        AMADEUS_CLIENT_SECRET
 *      (pegar em developers.amadeus.com → My Self-Service Workspace)
 *   4. Copie a URL pública do worker (algo tipo
 *      https://voaja-amadeus.SEUUSER.workers.dev) e cole no app VoaJá
 *      (engrenagem → Worker URL).
 *
 * Como deployar (com Wrangler CLI):
 *   wrangler secret put AMADEUS_CLIENT_ID
 *   wrangler secret put AMADEUS_CLIENT_SECRET
 *   wrangler deploy
 *
 * Endpoints:
 *   GET /flights?origin=SSA&destination=LIS&departureDate=2026-12-23
 *               &returnDate=2027-01-07&adults=2
 *
 * Resposta:
 *   { source:"amadeus", fetchedAt:"...", totalBRL, perPersonBRL, count }
 */

const AMADEUS_HOST = "https://test.api.amadeus.com"; // troque por api.amadeus.com em produção paga
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
};

// Cache simples em memória (Worker reusa o isolate entre invocações na mesma região).
const tokenCache = { value: null, expiresAt: 0 };

async function getAccessToken(env) {
  const now = Date.now();
  if (tokenCache.value && tokenCache.expiresAt > now + 60_000) return tokenCache.value;

  if (!env.AMADEUS_CLIENT_ID || !env.AMADEUS_CLIENT_SECRET) {
    throw new Error(
      "Credenciais ausentes. Configure AMADEUS_CLIENT_ID e AMADEUS_CLIENT_SECRET como Secrets do Worker."
    );
  }

  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: env.AMADEUS_CLIENT_ID,
    client_secret: env.AMADEUS_CLIENT_SECRET,
  });
  const resp = await fetch(`${AMADEUS_HOST}/v1/security/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const data = await resp.json();
  if (!resp.ok) {
    throw new Error(`OAuth Amadeus falhou (${resp.status}): ${JSON.stringify(data)}`);
  }
  tokenCache.value = data.access_token;
  tokenCache.expiresAt = now + (data.expires_in ?? 1700) * 1000;
  return tokenCache.value;
}

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

async function searchFlights(env, url) {
  const q = url.searchParams;
  const origin = q.get("origin");
  const destination = q.get("destination");
  const departureDate = q.get("departureDate");
  const returnDate = q.get("returnDate") || undefined;
  const adults = Number(q.get("adults") || "1");
  const currencyCode = q.get("currencyCode") || "BRL";
  const max = Number(q.get("max") || "10");

  if (!origin || !destination || !departureDate) {
    return json({ error: "Parâmetros obrigatórios: origin, destination, departureDate" }, 400);
  }
  if (returnDate && returnDate <= departureDate) {
    return json({ error: "returnDate deve ser maior que departureDate" }, 400);
  }

  const token = await getAccessToken(env);

  const api = new URL(`${AMADEUS_HOST}/v2/shopping/flight-offers`);
  api.searchParams.set("originLocationCode", origin);
  api.searchParams.set("destinationLocationCode", destination);
  api.searchParams.set("departureDate", departureDate);
  if (returnDate) api.searchParams.set("returnDate", returnDate);
  api.searchParams.set("adults", String(adults));
  api.searchParams.set("currencyCode", currencyCode);
  api.searchParams.set("max", String(max));

  const resp = await fetch(api, { headers: { Authorization: `Bearer ${token}` } });
  const data = await resp.json();
  if (!resp.ok) {
    return json(
      {
        error: "Amadeus respondeu com erro",
        status: resp.status,
        detail: data,
      },
      resp.status
    );
  }

  const offers = data.data ?? [];
  let cheapestTotal = null;
  let cheapestOffer = null;
  for (const o of offers) {
    const total = Number(o.price?.grandTotal ?? o.price?.total ?? NaN);
    if (Number.isFinite(total) && (cheapestTotal === null || total < cheapestTotal)) {
      cheapestTotal = total;
      cheapestOffer = o;
    }
  }

  return json({
    source: "amadeus-test",
    fetchedAt: new Date().toISOString(),
    origin,
    destination,
    departureDate,
    returnDate,
    adults,
    currency: currencyCode,
    totalBRL: cheapestTotal,
    perPersonBRL: cheapestTotal !== null ? Math.round(cheapestTotal / Math.max(1, adults)) : null,
    count: offers.length,
    carrier: cheapestOffer?.validatingAirlineCodes?.[0] ?? null,
    stops:
      cheapestOffer?.itineraries?.[0]?.segments?.length != null
        ? cheapestOffer.itineraries[0].segments.length - 1
        : null,
  });
}

export default {
  async fetch(req, env) {
    if (req.method === "OPTIONS") return new Response(null, { headers: CORS_HEADERS });

    const url = new URL(req.url);
    try {
      if (url.pathname === "/" || url.pathname === "") {
        return json({
          name: "voaja-amadeus",
          ok: true,
          endpoints: ["/flights?origin=SSA&destination=LIS&departureDate=YYYY-MM-DD&returnDate=YYYY-MM-DD&adults=2"],
          docs: "https://developers.amadeus.com/self-service/category/flights/api-doc/flight-offers-search",
        });
      }
      if (url.pathname === "/flights" && req.method === "GET") {
        return await searchFlights(env, url);
      }
      return json({ error: "Not found", path: url.pathname }, 404);
    } catch (err) {
      return json({ error: err.message ?? String(err) }, 500);
    }
  },
};
