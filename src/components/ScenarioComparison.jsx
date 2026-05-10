import { Check, X } from "lucide-react";
import { TIERS } from "../data/destinations.js";
import { formatBRL } from "../lib/calc.js";

export default function ScenarioComparison({ evaluation, params, selectedTier, onSelectTier }) {
  const { scenarios, tierFits } = evaluation;

  return (
    <div className="card p-5">
      <header className="mb-4 flex items-end justify-between">
        <div>
          <h3 className="text-base font-semibold text-white">Cenários (Econômico × Confortável × Premium)</h3>
          <p className="text-xs text-slate-400">
            Selecione um cenário para atualizar o detalhamento e o relatório.
          </p>
        </div>
        <span className="text-xs text-slate-400">Orçamento: {formatBRL(params.budget)}</span>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {TIERS.map((t) => {
          const s = scenarios[t.id];
          const fits = tierFits[t.id];
          const isActive = selectedTier === t.id;
          const pct = Math.min(150, Math.round((s.total / Math.max(1, params.budget)) * 100));
          const diff = s.total - params.budget;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onSelectTier(t.id)}
              className={`rounded-xl border p-4 text-left transition ${
                isActive
                  ? "border-indigo-400/70 bg-indigo-500/10"
                  : "border-white/10 bg-white/5 hover:bg-white/10"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-white">{t.label}</div>
                {fits ? (
                  <span className="badge-ok">
                    <Check size={12} /> Cabe
                  </span>
                ) : (
                  <span className="badge-bad">
                    <X size={12} /> Acima
                  </span>
                )}
              </div>
              <p className="mt-1 line-clamp-2 text-[11px] text-slate-300">{t.description}</p>
              <div className="mt-3 text-2xl font-bold text-white">{formatBRL(s.total)}</div>
              <div className="text-[11px] text-slate-400">
                {diff <= 0
                  ? `Sobram ${formatBRL(-diff)} no orçamento`
                  : `Faltam ${formatBRL(diff)} para encaixar`}
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full ${
                    fits ? "bg-emerald-400" : "bg-rose-400"
                  }`}
                  style={{ width: `${Math.min(100, pct)}%` }}
                />
              </div>
              <div className="mt-1 flex justify-between text-[10px] text-slate-400">
                <span>{pct}% do orçamento</span>
                <span>{formatBRL(s.daily.perPerson)}/dia/pax</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
