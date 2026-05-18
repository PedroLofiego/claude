import { CATEGORIES } from "../data/destinations.js";
import { formatBRL } from "../lib/calc.js";

const PALETTE = [
  "from-indigo-500 to-violet-500",
  "from-cyan-500 to-sky-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500",
  "from-pink-500 to-rose-500",
  "from-fuchsia-500 to-purple-500",
  "from-lime-500 to-green-500",
];

export default function BudgetBreakdown({ scenario, params }) {
  const rows = [
    {
      key: "flight",
      label: `✈️ Voo (${params.people} pax) · estimativa`,
      value: scenario.flight.total,
      hint: `${formatBRL(scenario.flight.perPerson)}/pessoa`,
    },
    ...scenario.categories.map((c) => ({
      key: c.id,
      label: `${c.icon} ${c.label}`,
      value: c.total,
      hint: `${formatBRL(c.perPersonPerDay)}/dia/pessoa`,
    })),
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

  return (
    <div className="card p-5">
      <header className="mb-4 flex items-end justify-between">
        <div>
          <h3 className="text-base font-semibold text-white">Orçamento por categoria</h3>
          <p className="text-xs text-slate-400">
            Detalhamento do cenário selecionado, multiplicado por pessoas e dias.
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
                  className={`h-full rounded-full bg-gradient-to-r ${PALETTE[i % PALETTE.length]}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="mt-0.5 text-[11px] text-slate-400">{r.hint}</div>
            </li>
          );
        })}
      </ul>

      <footer className="mt-4 grid grid-cols-2 gap-3 border-t border-white/10 pt-3 text-xs sm:grid-cols-4">
        <div>
          <div className="text-slate-400">Diária/pessoa</div>
          <div className="font-semibold text-white">{formatBRL(scenario.daily.perPerson)}</div>
        </div>
        <div>
          <div className="text-slate-400">Diária total</div>
          <div className="font-semibold text-white">{formatBRL(scenario.daily.perDay)}</div>
        </div>
        <div>
          <div className="text-slate-400">Em terra ({params.days} dias)</div>
          <div className="font-semibold text-white">{formatBRL(scenario.daily.total)}</div>
        </div>
        <div>
          <div className="text-slate-400">Subtotal s/ buffer</div>
          <div className="font-semibold text-white">{formatBRL(scenario.subtotal)}</div>
        </div>
      </footer>
    </div>
  );
}
