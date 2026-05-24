import { AlertTriangle, ArrowRight, Plane, Route, Sparkles, Train } from "lucide-react";
import { TIERS } from "../data/destinations.js";
import { formatBRL, formatBRLCompact } from "../lib/calc.js";

export default function MultiTripView({
  comboEval,
  params,
  selectedTier,
  onSelectTier,
  recommendationLine,
}) {
  if (!comboEval || comboEval.recommended.legs.length === 0) {
    return (
      <div className="card p-6 text-center text-sm text-slate-300">
        Adicione pelo menos um destino acima para ver o orçamento do combo.
      </div>
    );
  }

  const tier = selectedTier ?? comboEval.bestTier;
  const scenario = comboEval.scenarios[tier];
  const fits = scenario.total <= params.budget;
  const diff = scenario.total - params.budget;

  return (
    <section className="space-y-5">
      <RecommendationHeader
        comboEval={comboEval}
        params={params}
        recommendationLine={recommendationLine}
      />

      <ScenarioPicker
        scenarios={comboEval.scenarios}
        tierFits={comboEval.tierFits}
        selectedTier={tier}
        onSelectTier={onSelectTier}
        budget={params.budget}
      />

      <RouteCard scenario={scenario} params={params} fits={fits} diff={diff} />

      <CostBreakdown scenario={scenario} params={params} />
    </section>
  );
}

function RecommendationHeader({ comboEval, params, recommendationLine }) {
  const { recommended, bestTier, fits } = comboEval;
  const tier = TIERS.find((t) => t.id === bestTier);
  return (
    <div
      className={`card p-5 ${
        fits ? "ring-1 ring-inset ring-emerald-400/30" : "ring-1 ring-inset ring-amber-400/30"
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
            {fits ? "Combo cabe no orçamento" : "Combo acima do orçamento"}
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
        <Stat label="Destinos" value={`${recommended.legs.length} cidades`} />
        <Stat label="Total" value={formatBRL(recommended.total)} />
        <Stat label="Por pessoa" value={formatBRL(recommended.total / params.people)} />
        <Stat label="Por dia (grupo)" value={formatBRL(recommended.total / Math.max(1, recommended.totalDays))} />
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

function ScenarioPicker({ scenarios, tierFits, selectedTier, onSelectTier, budget }) {
  return (
    <div className="card p-4">
      <div className="mb-3 flex items-end justify-between">
        <h3 className="text-base font-semibold text-white">Comparar cenários do combo</h3>
        <span className="text-xs text-slate-400">Clique para detalhar</span>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {TIERS.map((t) => {
          const s = scenarios[t.id];
          const fits = tierFits[t.id];
          const active = selectedTier === t.id;
          const pct = Math.min(150, Math.round((s.total / Math.max(1, budget)) * 100));
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onSelectTier(t.id)}
              className={`rounded-xl border p-3 text-left transition ${
                active
                  ? "border-indigo-400/60 bg-indigo-500/10 ring-1 ring-inset ring-indigo-400/40"
                  : "border-white/10 bg-white/[0.04] hover:border-white/20"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white">{t.label}</span>
                <span
                  className={`text-[11px] font-semibold ${
                    fits ? "text-emerald-300" : "text-rose-300"
                  }`}
                >
                  {fits ? "CABE" : "ACIMA"}
                </span>
              </div>
              <div className="mt-1 text-lg font-bold text-white">{formatBRL(s.total)}</div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded bg-white/10">
                <div
                  className={`h-full ${fits ? "bg-emerald-400" : "bg-rose-400"}`}
                  style={{ width: `${Math.min(100, pct)}%` }}
                />
              </div>
              <div className="mt-1 text-[11px] text-slate-400">{pct}% do orçamento</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function RouteCard({ scenario, params, fits, diff }) {
  const { legs, interLegs, flight } = scenario;
  return (
    <div className="card overflow-hidden">
      <header className="flex flex-wrap items-end justify-between gap-3 border-b border-white/10 p-5">
        <div>
          <h3 className="text-base font-semibold text-white">
            <Route size={16} className="mr-1.5 inline -mt-1 text-fuchsia-300" />
            Roteiro completo
          </h3>
          <p className="text-xs text-slate-400">
            {scenario.totalDays} dias · {legs.length} destinos · {params.people} pessoa(s)
          </p>
        </div>
        <div className="text-right">
          {fits ? (
            <span className="badge-ok">
              Folga {formatBRLCompact(-diff)}
            </span>
          ) : (
            <span className="badge-bad">
              Acima por {formatBRLCompact(diff)}
            </span>
          )}
        </div>
      </header>

      <div className="border-b border-white/10 bg-cyan-500/5 px-5 py-3 text-sm text-cyan-100">
        <Plane size={14} className="mr-1.5 inline -mt-0.5" />
        <span className="font-semibold">Voo multi-trecho {params.origin}:</span>{" "}
        chega em {flight.firstCity}, sai por {flight.lastCity} ·{" "}
        <span className="font-semibold text-white">{formatBRL(flight.perPerson)}</span>
        <span className="text-cyan-100/70"> /pessoa (open-jaw estimado)</span>
      </div>

      <ol className="divide-y divide-white/5">
        {legs.map((leg, i) => {
          const inter = interLegs[i];
          return (
            <li key={`${leg.destination.id}-${i}`}>
              <div className="flex flex-wrap items-center gap-3 px-5 py-4">
                <div className="grid h-9 w-9 flex-none place-items-center rounded-full bg-fuchsia-500/20 text-sm font-bold text-fuchsia-100">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="text-base font-semibold text-white">
                    <span className="mr-1.5">{leg.destination.emoji}</span>
                    {leg.destination.city}, {leg.destination.country}
                  </div>
                  <div className="text-xs text-slate-400">
                    {leg.days} dias · {formatBRL(leg.dailyPerPerson)}/dia/pessoa ·{" "}
                    {leg.destination.tempC && `${leg.destination.tempC.low}°/${leg.destination.tempC.high}°C`}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-white">{formatBRL(leg.total)}</div>
                  <div className="text-[11px] text-slate-400">em terra</div>
                </div>
              </div>
              {inter && (
                <div className="flex items-center gap-2 bg-white/[0.02] px-5 py-2 text-xs text-slate-300">
                  <Train size={12} className="text-slate-400" />
                  <ArrowRight size={12} className="text-slate-500" />
                  <span className="flex-1">
                    {inter.label} para {inter.to.city}
                  </span>
                  <span className="font-semibold text-white">
                    {formatBRL(inter.total)}
                  </span>
                  <span className="text-slate-400">
                    ({formatBRL(inter.perPerson)}/pax)
                  </span>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function CostBreakdown({ scenario, params }) {
  const rows = [
    {
      key: "flight",
      label: `✈️ Voo multi-trecho (${params.people} pax)`,
      value: scenario.flight.total,
      hint: `${formatBRL(scenario.flight.perPerson)}/pessoa · ${scenario.flight.firstCity} ↔ ${scenario.flight.lastCity}`,
    },
    {
      key: "onGround",
      label: "🏨 Em terra (hosp + comida + transp local + passeios)",
      value: scenario.onGroundTotal,
      hint: `Somatório de ${scenario.legs.length} destinos`,
    },
    {
      key: "interLegs",
      label: "🚆 Transporte entre destinos",
      value: scenario.interLegTotal,
      hint: scenario.interLegs.length
        ? `${scenario.interLegs.length} trecho(s)`
        : "Sem trechos extras",
    },
    {
      key: "fixed",
      label: "Seguro / vistos / chip eSIM",
      value: scenario.fixed.total,
      hint: `${formatBRL(scenario.fixed.perPerson)}/pessoa`,
    },
    {
      key: "contingency",
      label: "Reserva de imprevistos (8%)",
      value: scenario.contingency,
      hint: "Buffer recomendado",
    },
  ];

  const max = Math.max(...rows.map((r) => r.value), 1);
  const colors = [
    "from-indigo-500 to-violet-500",
    "from-cyan-500 to-sky-500",
    "from-amber-500 to-orange-500",
    "from-emerald-500 to-teal-500",
    "from-pink-500 to-rose-500",
  ];

  return (
    <div className="card p-5">
      <header className="mb-4 flex items-end justify-between">
        <div>
          <h3 className="text-base font-semibold text-white">Orçamento do combo</h3>
          <p className="text-xs text-slate-400">
            Tudo somado para o grupo, no cenário selecionado.
          </p>
        </div>
        <div className="text-right">
          <div className="text-[11px] uppercase tracking-wider text-slate-400">Total</div>
          <div className="text-lg font-semibold text-white">{formatBRL(scenario.total)}</div>
        </div>
      </header>

      <ul className="space-y-2.5">
        {rows.map((r, i) => {
          const pct = Math.round((r.value / max) * 100);
          const share = Math.round((r.value / Math.max(1, scenario.total)) * 100);
          return (
            <li key={r.key}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-200">{r.label}</span>
                <span className="tabular-nums text-slate-100">
                  {formatBRL(r.value)}{" "}
                  <span className="text-xs text-slate-400">({share}%)</span>
                </span>
              </div>
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-white/5">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${colors[i % colors.length]}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="mt-0.5 text-[11px] text-slate-400">{r.hint}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
