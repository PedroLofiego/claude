import {
  CATEGORIES,
  flightFromOrigin,
  TIERS,
} from "../data/destinations.js";

export const FIXED_PER_PERSON_BRL = 500;
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

export function computeCost(destination, tier, params) {
  const { origin, days, people } = params;
  const daily = destination.daily[tier];

  const categories = CATEGORIES.map((c) => {
    const perPersonPerDay = daily[c.id] ?? 0;
    const total = perPersonPerDay * days * people;
    return { id: c.id, label: c.label, icon: c.icon, perPersonPerDay, total };
  });

  const dailyPerPerson = CATEGORIES.reduce((sum, c) => sum + (daily[c.id] ?? 0), 0);
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
    daily: { perPerson: dailyPerPerson, perDay: dailyTotal, total: accommodationsAndOnGround },
    categories,
    subtotal,
    contingency,
    total,
  };
}

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
    : "economic";

  const recommended = scenarios[bestTier];
  const fits = tierFits[bestTier];
  const overBy = fits ? 0 : recommended.total - params.budget;
  const headroom = fits ? params.budget - recommended.total : 0;

  return { destination, scenarios, tierFits, bestTier, recommended, fits, overBy, headroom };
}

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
    return a.overBy - b.overBy;
  });
}

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

// === COMBO TRIP (múltiplos destinos) ===

// Custo aproximado de transporte entre destinos (por pessoa, BRL).
// Calibrado para trens/Ryanair na Europa, low-cost na Ásia, voo curto no Golfo.
export function interLegCostBRL(from, to) {
  if (!from || !to) return 0;
  if (from.country === to.country) return 250;
  if (from.region === to.region) {
    if (from.region === "Europa") return 450;
    if (from.region === "Ásia") return 750;
    return 550;
  }
  return 1800;
}

export function interLegLabel(from, to) {
  if (!from || !to) return "";
  if (from.country === to.country) return "Trem/bus regional";
  if (from.region === to.region) {
    if (from.region === "Europa") return "Trem ou low-cost (Ryanair/Vueling)";
    if (from.region === "Ásia") return "Voo curto low-cost";
    return "Voo regional";
  }
  return "Voo intercontinental";
}

// Calcula o custo de uma "perna" (dias num único destino dentro do combo)
// — sem voo internacional nem custos fixos (esses são únicos para o combo todo).
function computeLegCost(destination, tier, people, days) {
  const daily = destination.daily[tier];
  const categories = CATEGORIES.map((c) => {
    const perPersonPerDay = daily[c.id] ?? 0;
    const total = perPersonPerDay * days * people;
    return { id: c.id, label: c.label, icon: c.icon, perPersonPerDay, total };
  });
  const dailyPerPerson = CATEGORIES.reduce((s, c) => s + (daily[c.id] ?? 0), 0);
  const dailyTotal = dailyPerPerson * people;
  const onGround = dailyTotal * days;
  return { categories, dailyPerPerson, dailyTotal, onGround };
}

/**
 * Avalia uma viagem combo (vários destinos em sequência) para um tier.
 *
 * @param {Array<{destination: object, days: number}>} legs - destinos em ordem
 * @param {string} tier - "economic" | "comfortable" | "premium"
 * @param {object} params - { origin, people, budget }
 */
export function computeComboCost(legs, tier, params) {
  const { origin, people } = params;
  if (!legs.length) {
    return { tier, legs: [], flight: { total: 0, perPerson: 0 }, interLegs: [], interLegTotal: 0, fixed: { total: 0, perPerson: FIXED_PER_PERSON_BRL }, onGroundTotal: 0, subtotal: 0, contingency: 0, total: 0, totalDays: 0 };
  }

  const first = legs[0].destination;
  const last = legs[legs.length - 1].destination;

  // Voo multi-trecho aproximado: média do round-trip ao primeiro e ao último
  // destino + 12% de prêmio de open-jaw. Reflete prática real de mercado.
  const flightFirst = flightFromOrigin(origin, first.flightBaseBRL);
  const flightLast = flightFromOrigin(origin, last.flightBaseBRL);
  const flightPerPerson = Math.round(((flightFirst + flightLast) / 2) * 1.12);
  const flightTotal = flightPerPerson * people;

  // Custos por perna (em terra)
  const legCosts = legs.map((leg) => {
    const c = computeLegCost(leg.destination, tier, people, leg.days);
    return {
      destination: leg.destination,
      days: leg.days,
      ...c,
      total: c.onGround,
    };
  });
  const onGroundTotal = legCosts.reduce((s, l) => s + l.onGround, 0);

  // Transporte entre destinos consecutivos
  const interLegs = [];
  for (let i = 0; i < legs.length - 1; i++) {
    const perPerson = interLegCostBRL(legs[i].destination, legs[i + 1].destination);
    interLegs.push({
      from: legs[i].destination,
      to: legs[i + 1].destination,
      perPerson,
      total: perPerson * people,
      label: interLegLabel(legs[i].destination, legs[i + 1].destination),
    });
  }
  const interLegTotal = interLegs.reduce((s, x) => s + x.total, 0);

  const fixedTotal = FIXED_PER_PERSON_BRL * people;
  const subtotal = flightTotal + onGroundTotal + interLegTotal + fixedTotal;
  const contingency = Math.round(subtotal * CONTINGENCY_RATE);
  const total = subtotal + contingency;
  const totalDays = legs.reduce((s, l) => s + l.days, 0);

  return {
    tier,
    legs: legCosts,
    flight: { perPerson: flightPerPerson, total: flightTotal, firstCity: first.city, lastCity: last.city },
    interLegs,
    interLegTotal,
    fixed: { perPerson: FIXED_PER_PERSON_BRL, total: fixedTotal },
    onGroundTotal,
    subtotal,
    contingency,
    total,
    totalDays,
  };
}

export function evaluateCombo(legs, params) {
  const scenarios = TIERS.reduce((acc, t) => {
    acc[t.id] = computeComboCost(legs, t.id, params);
    return acc;
  }, {});
  const tierFits = {
    economic: scenarios.economic.total <= params.budget,
    comfortable: scenarios.comfortable.total <= params.budget,
    premium: scenarios.premium.total <= params.budget,
  };
  const bestTier = tierFits.premium ? "premium" : tierFits.comfortable ? "comfortable" : "economic";
  const recommended = scenarios[bestTier];
  const fits = tierFits[bestTier];
  const overBy = fits ? 0 : recommended.total - params.budget;
  const headroom = fits ? params.budget - recommended.total : 0;
  return { scenarios, tierFits, bestTier, recommended, fits, overBy, headroom };
}

export function buildComboRecommendationLine(comboEval, params) {
  const { recommended, bestTier, fits } = comboEval;
  const totalBRL = formatBRL(recommended.total);
  const budgetBRL = formatBRL(params.budget);
  const cities = recommended.legs.map((l) => l.destination.city).join(" → ");
  const days = recommended.totalDays;
  if (!fits) {
    return `O combo ${cities} (${days} dias) fica em ${totalBRL} no cenário Econômico — acima do orçamento de ${budgetBRL}. Reduza dias ou tire um destino para encaixar.`;
  }
  if (bestTier === "premium") {
    return `Combo ${cities}: cabe no Premium por ${totalBRL}, com folga de ${formatBRL(comboEval.headroom)}. Vai poder se dar todos os luxos pelo caminho.`;
  }
  if (bestTier === "comfortable") {
    return `Combo ${cities}: cabe no Confortável por ${totalBRL}, com folga de ${formatBRL(comboEval.headroom)} para imprevistos.`;
  }
  return `Combo ${cities}: cabe no Econômico por ${totalBRL}. Para um upgrade, aumente o orçamento ou reduza dias.`;
}
