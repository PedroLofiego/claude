/*
 * Cliente do worker Amadeus.
 *
 * Toda chamada vai para um Cloudflare Worker (ver pasta /worker), porque
 * a API Amadeus exige OAuth com secret e bloqueia CORS no browser.
 *
 * Estado:
 *   - workerUrl: salvo em localStorage (configurado pelo usuário no dialog)
 *   - resultados: salvos em localStorage por (origin, destino, dataIda, dataVolta, adults)
 */

const CONFIG_KEY = "voaja:amadeus:config";
const CACHE_KEY = "voaja:amadeus:cache:v1";

export function getConfig() {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (!raw) return { workerUrl: "" };
    return { workerUrl: "", ...JSON.parse(raw) };
  } catch {
    return { workerUrl: "" };
  }
}

export function setConfig(cfg) {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg));
}

export function getCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function setCache(cache) {
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
}

export function clearCache() {
  localStorage.removeItem(CACHE_KEY);
}

export function cacheKey({ origin, destination, departureDate, returnDate, adults }) {
  return [origin, destination, departureDate, returnDate ?? "ow", adults].join("|");
}

/**
 * Calcula a data de retorno a partir da data de ida + número de dias.
 * 16 dias começando em 23/12 → volta em 07/01.
 */
export function computeReturnDate(startISO, days) {
  if (!startISO || !days || days < 1) return null;
  const [y, m, d] = startISO.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + days - 1);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${mm}-${dd}`;
}

export async function fetchFlight({
  workerUrl,
  origin,
  destination,
  departureDate,
  returnDate,
  adults,
}) {
  if (!workerUrl) throw new Error("Worker URL não configurada.");
  const url = new URL("/flights", workerUrl.replace(/\/+$/, "") + "/");
  url.searchParams.set("origin", origin);
  url.searchParams.set("destination", destination);
  url.searchParams.set("departureDate", departureDate);
  if (returnDate) url.searchParams.set("returnDate", returnDate);
  url.searchParams.set("adults", String(adults));
  url.searchParams.set("currencyCode", "BRL");

  const resp = await fetch(url);
  const data = await resp.json().catch(() => ({ error: "Resposta inválida" }));
  if (!resp.ok) {
    throw new Error(
      data?.error
        ? `${data.error}${data.detail ? ` — ${JSON.stringify(data.detail).slice(0, 200)}` : ""}`
        : `Erro ${resp.status}`
    );
  }
  return data;
}
