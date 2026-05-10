import { CATEGORIES, TIERS } from "../data/destinations.js";
import { formatBRL } from "./calc.js";
import { buildItinerary } from "../data/itineraries.js";

export function buildReportText(evalResult, params, recommendationLine) {
  const { destination, scenarios, bestTier } = evalResult;
  const itinerary = buildItinerary(destination.id, params.days);
  const lines = [];

  lines.push("RELATÓRIO DE PLANEJAMENTO DE VIAGEM");
  lines.push("======================================");
  lines.push("");
  lines.push(`Destino: ${destination.city} — ${destination.country}`);
  lines.push(`Origem:  ${params.originLabel}`);
  lines.push(`Período: ${params.days} dias`);
  lines.push(`Viajantes: ${params.people}`);
  lines.push(`Orçamento informado: ${formatBRL(params.budget)}`);
  lines.push("");
  lines.push("RECOMENDAÇÃO");
  lines.push("--------------------------------------");
  lines.push(recommendationLine);
  lines.push("");
  lines.push("CENÁRIOS COMPARADOS");
  lines.push("--------------------------------------");
  TIERS.forEach((t) => {
    const s = scenarios[t.id];
    const fits = s.total <= params.budget ? "CABE" : "ACIMA";
    const star = t.id === bestTier ? " ★" : "";
    lines.push(
      `- ${t.label.padEnd(12)} ${formatBRL(s.total).padStart(12)}  [${fits}]${star}`
    );
  });
  lines.push("");
  lines.push(`DETALHE — Cenário selecionado: ${TIERS.find((t) => t.id === bestTier).label}`);
  lines.push("--------------------------------------");
  const rec = scenarios[bestTier];
  lines.push(
    `Voo (${params.people}× ${formatBRL(rec.flight.perPerson)}): ${formatBRL(rec.flight.total)}`
  );
  lines.push(
    `Custos fixos (seguro/visto/chip — ${formatBRL(rec.fixed.perPerson)}/pessoa): ${formatBRL(rec.fixed.total)}`
  );
  lines.push(`Diárias em terra (${params.days} dias × ${params.people} pessoas):`);
  CATEGORIES.forEach((c) => {
    const cat = rec.categories.find((x) => x.id === c.id);
    lines.push(
      `  • ${c.label.padEnd(34)} ${formatBRL(cat.total).padStart(12)}  (${formatBRL(
        cat.perPersonPerDay
      )}/dia/pessoa)`
    );
  });
  lines.push(`Subtotal: ${formatBRL(rec.subtotal)}`);
  lines.push(`Reserva de imprevistos (8%): ${formatBRL(rec.contingency)}`);
  lines.push(`TOTAL: ${formatBRL(rec.total)}`);
  lines.push("");
  lines.push("ROTEIRO SUGERIDO");
  lines.push("--------------------------------------");
  itinerary.forEach((d) => {
    lines.push(`Dia ${d.day} — ${d.theme}`);
    d.items.forEach((it) => lines.push(`  • ${it}`));
  });
  lines.push("");
  lines.push(
    `Gerado em ${new Date().toLocaleString("pt-BR")} • dados estimados (mock) — confirmar tarifas reais antes de comprar.`
  );
  return lines.join("\n");
}

export async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fallback abaixo */
  }
  // Fallback para navegadores sem permissão de Clipboard API.
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  document.body.removeChild(ta);
  return ok;
}

export function downloadTextFile(filename, text) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
