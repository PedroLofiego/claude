import { AlertTriangle, Sparkles } from "lucide-react";
import { TIERS } from "../data/destinations.js";
import { formatBRL } from "../lib/calc.js";

export default function Recommendation({ evaluation, params, recommendationLine }) {
  const { destination, recommended, bestTier, fits } = evaluation;
  const tier = TIERS.find((t) => t.id === bestTier);

  return (
    <div
      className={`card p-5 ${
        fits
          ? "ring-1 ring-inset ring-emerald-400/30"
          : "ring-1 ring-inset ring-amber-400/30"
      }`}
    >
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          {fits ? (
            <Sparkles size={18} className="text-emerald-300" />
          ) : (
            <AlertTriangle size={18} className="text-amber-300" />
          )}
          <h3 className="text-base font-semibold text-white">
            {fits ? "Recomendação para você" : "Atenção ao orçamento"}
          </h3>
        </div>
        <div className="text-right">
          <div className="text-[11px] uppercase tracking-wider text-slate-400">
            Cenário recomendado
          </div>
          <div className="text-sm font-semibold text-white">{tier.label}</div>
        </div>
      </header>

      <p className="mt-3 text-[15px] leading-relaxed text-slate-100">{recommendationLine}</p>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Destino" value={`${destination.emoji} ${destination.city}`} />
        <Stat label="Total estimado" value={formatBRL(recommended.total)} />
        <Stat label="Por pessoa" value={formatBRL(recommended.total / params.people)} />
        <Stat
          label="Por dia (grupo)"
          value={formatBRL(recommended.total / Math.max(1, params.days))}
        />
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
      <div className="text-[11px] uppercase tracking-wider text-slate-400">{label}</div>
      <div className="mt-0.5 truncate text-sm font-semibold text-white">{value}</div>
    </div>
  );
}
