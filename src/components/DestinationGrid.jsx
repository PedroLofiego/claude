import { Check, Plane, Shield, Snowflake, X } from "lucide-react";
import { TIERS } from "../data/destinations.js";
import { formatBRL, formatBRLCompact } from "../lib/calc.js";

function FitBadge({ fits, overBy, headroom }) {
  if (fits && headroom > 0) {
    return (
      <span className="badge-ok">
        <Check size={12} /> Cabe • folga {formatBRLCompact(headroom)}
      </span>
    );
  }
  if (fits) {
    return (
      <span className="badge-ok">
        <Check size={12} /> Cabe no orçamento
      </span>
    );
  }
  return (
    <span className="badge-bad">
      <X size={12} /> Acima por {formatBRLCompact(overBy)}
    </span>
  );
}

function TierMatrix({ scenarios, tierFits, budget }) {
  return (
    <div className="mt-3 grid grid-cols-3 gap-2">
      {TIERS.map((t) => {
        const s = scenarios[t.id];
        const fits = tierFits[t.id];
        const pct = Math.min(150, Math.round((s.total / Math.max(1, budget)) * 100));
        return (
          <div
            key={t.id}
            className={`rounded-lg border px-2.5 py-2 text-[11px] ${
              fits
                ? "border-emerald-400/30 bg-emerald-500/10"
                : "border-rose-400/30 bg-rose-500/10"
            }`}
            title={t.description}
          >
            <div className="flex items-center justify-between font-semibold text-white/90">
              <span>{t.label}</span>
              {fits ? (
                <Check size={12} className="text-emerald-300" />
              ) : (
                <X size={12} className="text-rose-300" />
              )}
            </div>
            <div className="mt-0.5 text-slate-200">{formatBRLCompact(s.total)}</div>
            <div className="mt-1 h-1 w-full overflow-hidden rounded bg-white/10">
              <div
                className={`h-full ${fits ? "bg-emerald-400" : "bg-rose-400"}`}
                style={{ width: `${Math.min(100, pct)}%` }}
              />
            </div>
            <div className="mt-0.5 text-[10px] text-slate-300">{pct}% do orç.</div>
          </div>
        );
      })}
    </div>
  );
}

export default function DestinationGrid({ evaluations, params, selectedId, onSelect }) {
  return (
    <section>
      <div className="mb-3 flex items-end justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Comparação de destinos</h2>
          <p className="text-sm text-slate-300">
            {evaluations.length} destinos analisados. Ordenados pela melhor aderência ao seu orçamento.
          </p>
        </div>
        <span className="hidden text-xs text-slate-400 sm:inline">
          Toque em um card para ver o detalhamento ↓
        </span>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {evaluations.map((ev) => {
          const d = ev.destination;
          const isActive = d.id === selectedId;
          return (
            <button
              key={d.id}
              onClick={() => onSelect(d.id)}
              className={`card card-hover overflow-hidden text-left ${
                isActive ? "ring-2 ring-indigo-400/70" : ""
              }`}
            >
              <div className="relative h-36 w-full overflow-hidden">
                <img
                  src={d.image}
                  alt={`${d.city}, ${d.country}`}
                  loading="lazy"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/30 to-transparent" />
                <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-slate-200/80">
                      {d.region}
                    </div>
                    <div className="text-lg font-semibold text-white">
                      <span className="mr-1.5">{d.emoji}</span>
                      {d.city}, {d.country}
                    </div>
                  </div>
                  <FitBadge fits={ev.fits} overBy={ev.overBy} headroom={ev.headroom} />
                </div>
              </div>
              <div className="p-4">
                <div className="flex flex-wrap gap-1.5 text-xs text-slate-300">
                  <span className="chip" title="Voo estimado para alta temporada Dez/Jan">
                    <Plane size={12} /> {formatBRL(ev.recommended.flight.perPerson)}/pax
                  </span>
                  {d.tempC && (
                    <span className="chip" title="Mín / Máx média no período da viagem">
                      <Snowflake size={12} /> {d.tempC.low}° / {d.tempC.high}°C
                    </span>
                  )}
                  <span className="chip">
                    <Shield size={12} /> {d.safetyScore.toFixed(1)}
                  </span>
                  <span className="chip">{d.flightHours}h voo</span>
                  <span className="chip">{d.visaRequired ? "Visto" : "Sem visto"}</span>
                </div>
                <TierMatrix
                  scenarios={ev.scenarios}
                  tierFits={ev.tierFits}
                  budget={params.budget}
                />
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-slate-300">
                    Recomendado:{" "}
                    <span className="font-semibold text-white">
                      {TIERS.find((t) => t.id === ev.bestTier).label}
                    </span>
                  </span>
                  <span className="font-semibold text-white">
                    {formatBRL(ev.recommended.total)}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
