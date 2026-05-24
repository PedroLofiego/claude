import { ArrowDown, ArrowUp, GripVertical, Plus, Route, X } from "lucide-react";
import { DESTINATIONS } from "../data/destinations.js";

export default function MultiTripBuilder({ legs, onChange, totalDays, targetDays }) {
  const usedIds = new Set(legs.map((l) => l.destinationId));

  const addLeg = (id) => {
    if (!id || usedIds.has(id)) return;
    onChange([...legs, { destinationId: id, days: 4 }]);
  };
  const removeLeg = (i) => onChange(legs.filter((_, idx) => idx !== i));
  const setDays = (i, d) =>
    onChange(legs.map((l, idx) => (idx === i ? { ...l, days: Math.max(1, d) } : l)));
  const setDest = (i, id) =>
    onChange(legs.map((l, idx) => (idx === i ? { ...l, destinationId: id } : l)));
  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= legs.length) return;
    const next = [...legs];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  const dayDiff = totalDays - targetDays;
  const dayMatch =
    dayDiff === 0
      ? { color: "text-emerald-300", text: "bate com a janela" }
      : dayDiff > 0
      ? { color: "text-amber-300", text: `${dayDiff}d a mais que a janela` }
      : { color: "text-rose-300", text: `${Math.abs(dayDiff)}d a menos que a janela` };

  return (
    <section className="card p-5 sm:p-6">
      <header className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">
            <Route size={16} className="mr-1.5 inline -mt-1 text-fuchsia-300" />
            Montar combo
          </h2>
          <p className="text-sm text-slate-300">
            Adicione destinos na ordem do roteiro. Dias somam automaticamente; o transporte
            entre eles é estimado pela região.
          </p>
        </div>
        <div className="text-right">
          <div className="text-[11px] uppercase tracking-wider text-slate-400">Total de dias</div>
          <div className="text-xl font-bold text-white">{totalDays}</div>
          <div className={`text-[11px] font-semibold ${dayMatch.color}`}>{dayMatch.text}</div>
        </div>
      </header>

      {legs.length === 0 && (
        <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.02] p-6 text-center text-sm text-slate-300">
          Nenhum destino no combo ainda. Escolha o primeiro abaixo para começar.
        </div>
      )}

      <ul className="mt-2 space-y-2">
        {legs.map((leg, i) => {
          const dest = DESTINATIONS.find((d) => d.id === leg.destinationId);
          if (!dest) return null;
          return (
            <li
              key={`${leg.destinationId}-${i}`}
              className="flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] p-3"
            >
              <div className="flex flex-none items-center gap-1 text-slate-400">
                <GripVertical size={16} />
                <span className="text-xs font-bold text-slate-300">{i + 1}.</span>
              </div>

              <select
                className="select min-w-0 flex-1 sm:flex-none sm:w-72"
                value={leg.destinationId}
                onChange={(e) => setDest(i, e.target.value)}
              >
                {DESTINATIONS.map((d) => (
                  <option
                    key={d.id}
                    value={d.id}
                    disabled={d.id !== leg.destinationId && usedIds.has(d.id)}
                  >
                    {d.emoji} {d.city}, {d.country}
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={1}
                  max={30}
                  className="input w-20 text-center"
                  value={leg.days}
                  onChange={(e) => setDays(i, Number(e.target.value) || 1)}
                  aria-label={`Dias em ${dest.city}`}
                />
                <span className="text-xs text-slate-400">dias</span>
              </div>

              <div className="ml-auto flex items-center gap-1">
                <button
                  type="button"
                  className="btn-ghost !px-2"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  title="Mover para cima"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  type="button"
                  className="btn-ghost !px-2"
                  onClick={() => move(i, 1)}
                  disabled={i === legs.length - 1}
                  title="Mover para baixo"
                >
                  <ArrowDown size={14} />
                </button>
                <button
                  type="button"
                  className="btn-ghost !px-2 text-rose-300 hover:text-rose-200"
                  onClick={() => removeLeg(i)}
                  title="Remover"
                >
                  <X size={14} />
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          + Adicionar destino:
        </label>
        <select
          className="select flex-1 sm:flex-none sm:w-72"
          value=""
          onChange={(e) => {
            addLeg(e.target.value);
            e.target.value = "";
          }}
        >
          <option value="" disabled>
            Escolher…
          </option>
          {DESTINATIONS.filter((d) => !usedIds.has(d.id)).map((d) => (
            <option key={d.id} value={d.id}>
              {d.emoji} {d.city}, {d.country}
            </option>
          ))}
        </select>
        <span className="text-[11px] text-slate-400">
          ({DESTINATIONS.length - legs.length} disponíveis)
        </span>
      </div>

      <ComboPresets onApply={onChange} disabled={legs.length > 0} />
    </section>
  );
}

const PRESETS = [
  {
    label: "Eurotrip clássica",
    legs: [
      { destinationId: "paris", days: 5 },
      { destinationId: "roma", days: 5 },
      { destinationId: "barcelona", days: 6 },
    ],
  },
  {
    label: "Leste europeu festivo",
    legs: [
      { destinationId: "praga", days: 5 },
      { destinationId: "viena", days: 5 },
      { destinationId: "budapeste", days: 6 },
    ],
  },
  {
    label: "Itália completa",
    legs: [
      { destinationId: "roma", days: 5 },
      { destinationId: "veneza", days: 4 },
      { destinationId: "milao", days: 7 },
    ],
  },
  {
    label: "Sudeste asiático",
    legs: [
      { destinationId: "bangkok", days: 4 },
      { destinationId: "chiangmai", days: 4 },
      { destinationId: "phuket", days: 8 },
    ],
  },
  {
    label: "Tailândia + Indonésia",
    legs: [
      { destinationId: "bangkok", days: 5 },
      { destinationId: "bali", days: 11 },
    ],
  },
  {
    label: "Tour Oriente Médio",
    legs: [
      { destinationId: "doha", days: 4 },
      { destinationId: "dubai", days: 5 },
      { destinationId: "abudhabi", days: 4 },
      { destinationId: "muscat", days: 3 },
    ],
  },
  {
    label: "Japão + Coreia",
    legs: [
      { destinationId: "toquio", days: 6 },
      { destinationId: "osaka", days: 4 },
      { destinationId: "seul", days: 6 },
    ],
  },
];

function ComboPresets({ onApply, disabled }) {
  return (
    <div className="mt-4 border-t border-white/10 pt-3">
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        Combos prontos ({disabled ? "limpe o roteiro para aplicar" : "clique para usar"}):
      </div>
      <div className="flex flex-wrap gap-1.5">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            disabled={disabled}
            onClick={() => onApply(p.legs)}
            className="rounded-lg border border-fuchsia-400/30 bg-fuchsia-500/10 px-2.5 py-1 text-xs text-fuchsia-100 hover:bg-fuchsia-500/20 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus size={11} className="mr-1 inline -mt-0.5" />
            {p.label}
            <span className="ml-1 text-fuchsia-300/70">
              ({p.legs.reduce((s, l) => s + l.days, 0)}d)
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
