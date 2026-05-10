import {
  CATEGORIES,
  flightFromOrigin,
  TIERS,
} from "../data/destinations.js";

// Custos fixos por pessoa (BRL): seguro viagem, chip eSIM, vacinas, bagagem extra etc.
// TODO: substituir por API real (Coris, Heymondo, Allianz Travel).
export const FIXED_PER_PERSON_BRL = 500;

// Buffer recomendado de imprevistos (8% do total).
export const CONTINGENCY_RATE = 0.08;

export const formatBRL = (value) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(value || 0)));

export const formatBRLCompact = (value) => {
  const v = Math.round(value || 0);
  if (v >= 1000) return `R$ ${(v / 1000).toFixed(v >= 10000 ? 0 : 1)}k`;
  return formatBRL(v);
};

/**
 * Calcula o custo total do destino para um cenário e parâmetros do usuário.
 *
 * @param {object} destination
 * @param {"economic"|"comfortable"|"premium"} tier
 * @param {{ origin: string, days: number, people: number }} params
 */
export function computeCost(destination, tier, params) {
  const { origin, days, people } = params;
  const daily = destination.daily[tier];

  // Diárias por categoria (todos os dias × todas as pessoas).
  const categories = CATEGORIES.map((c) => {
    const perPersonPerDay = daily[c.id] ?? 0;
    const total = perPersonPerDay * days * people;
    return {
      id: c.id,
      label: c.label,
      icon: c.icon,
      perPersonPerDay,
      total,
    };
  });

  const dailyPerPerson = CATEGORIES.reduce(
    (sum, c) => sum + (daily[c.id] ?? 0),
    0
  );
  const dailyTotal = dailyPerPerson * people;
  const accommodationsAndOnGround = dailyTotal * days;

  const flightPerPerson = flightFromOrigin(origin, destination.flightBaseBRL);
  const flightTotal = flightPerPerson * people;

  const fixedTotal = FIXED_PER_PERSON_BRL * people;

  const subtotal = flightTotal + accommodationsAndOnGround + fixedTotal;
  const contingency = Math.round(subtotal * CONTINGENCY_RATE);
  const total = subtotal + contingency;

  return {
    tier,
    flight: { perPerson: flightPerPerson, total: flightTotal },
    fixed: { perPerson: FIXED_PER_PERSON_BRL, total: fixedTotal },
    daily: {
      perPerson: dailyPerPerson,
      perDay: dailyTotal,
      total: accommodationsAndOnGround,
    },
    categories,
    subtotal,
    contingency,
    total,
  };
}

/**
 * Avalia um destino nos três cenários de uma vez e ranqueia por aderência ao orçamento.
 */
export function evaluateDestination(destination, params) {
  const scenarios = TIERS.reduce((acc, t) => {
    acc[t.id] = computeCost(destination, t.id, params);
    return acc;
  }, {});

  const tierFits = {
    economic: scenarios.economic.total <= params.budget,
    comfortable: scenarios.comfortable.total <= params.budget,
    premium: scenarios.premium.total <= params.budget,
  };

  const bestTier = tierFits.premium
    ? "premium"
    : tierFits.comfortable
    ? "comfortable"
    : tierFits.economic
    ? "economic"
    : "economic"; // se nada cabe, mostramos econômico como referência.

  const recommended = scenarios[bestTier];
  const fits = tierFits[bestTier];
  const overBy = fits ? 0 : recommended.total - params.budget;
  const headroom = fits ? params.budget - recommended.total : 0;

  return {
    destination,
    scenarios,
    tierFits,
    bestTier,
    recommended,
    fits,
    overBy,
    headroom,
  };
}

/**
 * Avalia todos os destinos e devolve a lista ordenada para a comparação.
 * Critério: 1) cabe no orçamento, 2) maior tier que cabe, 3) menor custo total.
 */
export function evaluateAll(destinations, params) {
  const evals = destinations.map((d) => evaluateDestination(d, params));
  const tierRank = { premium: 3, comfortable: 2, economic: 1 };
  return evals.sort((a, b) => {
    if (a.fits !== b.fits) return a.fits ? -1 : 1;
    if (a.fits && b.fits) {
      const tr = tierRank[b.bestTier] - tierRank[a.bestTier];
      if (tr !== 0) return tr;
      return a.recommended.total - b.recommended.total;
    }
    // Ambos não cabem: quem ultrapassa menos vem primeiro.
    return a.overBy - b.overBy;
  });
}

/**
 * Sugere uma recomendação de uma frase para o destino e o tier dado.
 */
export function buildRecommendationLine(evalResult, params) {
  const { destination, recommended, bestTier, fits } = evalResult;
  const tierLabel = TIERS.find((t) => t.id === bestTier)?.label ?? bestTier;
  const totalBRL = formatBRL(recommended.total);
  const budgetBRL = formatBRL(params.budget);

  if (!fits) {
    return `Com ${budgetBRL} para ${params.people} pessoa(s) durante ${params.days} dias, ${destination.city} fica acima do orçamento mesmo no cenário mais econômico (${totalBRL}). Considere reduzir dias, ir em baixa temporada ou trocar de destino.`;
  }
  if (bestTier === "premium") {
    return `${destination.city} cabe confortavelmente no cenário Premium (${totalBRL}). Você ainda terá ${formatBRL(
      evalResult.headroom
    )} de folga — perfeito para upgrades, restaurantes estrelados e tours privativos.`;
  }
  if (bestTier === "comfortable") {
    return `${destination.city} é uma escolha equilibrada no cenário Confortável (${totalBRL}), com ${formatBRL(
      evalResult.headroom
    )} de folga para imprevistos e um ou outro luxo pontual.`;
  }
  return `${destination.city} entra no orçamento no cenário Econômico (${totalBRL}). Funciona bem se você prioriza vivência local e está disposto(a) a economizar em hospedagem e transporte.`;
}
