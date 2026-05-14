import { useId } from "react";
import { Calendar, Coins, MapPin, Users } from "lucide-react";
import { ORIGIN_CITIES } from "../data/destinations.js";
import { formatBRL } from "../lib/calc.js";

export default function InputForm({ params, onChange }) {
  const ids = {
    origin: useId(),
    budget: useId(),
    days: useId(),
    people: useId(),
    startDate: useId(),
  };

  const set = (patch) => onChange({ ...params, ...patch });

  return (
    <section className="card p-5 sm:p-6">
      <header className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">Parâmetros da viagem</h2>
          <p className="text-sm text-slate-300">
            Informe sua origem, orçamento e o perfil do grupo. Recalculamos tudo em tempo real.
          </p>
        </div>
        <span className="chip">
          <Coins size={14} /> {formatBRL(params.budget)}
        </span>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <div>
          <label htmlFor={ids.origin} className="label">
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={14} /> Origem
            </span>
          </label>
          <select
            id={ids.origin}
            className="select"
            value={params.origin}
            onChange={(e) => {
              const city = ORIGIN_CITIES.find((c) => c.code === e.target.value);
              set({ origin: e.target.value, originLabel: city?.label ?? e.target.value });
            }}
          >
            {ORIGIN_CITIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor={ids.budget} className="label">
            <span className="inline-flex items-center gap-1.5">
              <Coins size={14} /> Orçamento total (R$)
            </span>
          </label>
          <input
            id={ids.budget}
            type="number"
            inputMode="numeric"
            min={0}
            step={500}
            className="input"
            value={params.budget}
            onChange={(e) => set({ budget: Number(e.target.value) || 0 })}
          />
          <input
            type="range"
            min={5000}
            max={80000}
            step={500}
            value={Math.min(80000, Math.max(5000, params.budget))}
            onChange={(e) => set({ budget: Number(e.target.value) })}
            className="mt-2 w-full accent-indigo-400"
            aria-label="Orçamento total"
          />
          <div className="mt-1 flex justify-between text-[11px] text-slate-400">
            <span>R$ 5k</span>
            <span>R$ 80k</span>
          </div>
        </div>

        <div>
          <label htmlFor={ids.days} className="label">
            <span className="inline-flex items-center gap-1.5">
              <Calendar size={14} /> Dias de viagem
            </span>
          </label>
          <input
            id={ids.days}
            type="number"
            inputMode="numeric"
            min={1}
            max={60}
            className="input"
            value={params.days}
            onChange={(e) => set({ days: Math.max(1, Number(e.target.value) || 1) })}
          />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {[5, 7, 10, 14, 21].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => set({ days: d })}
                className={`rounded-lg border px-2.5 py-1 text-xs ${
                  params.days === d
                    ? "border-indigo-400/60 bg-indigo-500/20 text-indigo-100"
                    : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                {d}d
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor={ids.startDate} className="label">
            <span className="inline-flex items-center gap-1.5">
              <Calendar size={14} /> Data de partida
            </span>
          </label>
          <input
            id={ids.startDate}
            type="date"
            min="2026-12-20"
            max="2027-01-05"
            className="input"
            value={params.startDate ?? "2026-12-23"}
            onChange={(e) => set({ startDate: e.target.value })}
          />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {["2026-12-22", "2026-12-23", "2026-12-24", "2026-12-25"].map((d) => {
              const label = d.slice(-2) + "/dez";
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => set({ startDate: d })}
                  className={`rounded-lg border px-2.5 py-1 text-xs ${
                    params.startDate === d
                      ? "border-indigo-400/60 bg-indigo-500/20 text-indigo-100"
                      : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label htmlFor={ids.people} className="label">
            <span className="inline-flex items-center gap-1.5">
              <Users size={14} /> Pessoas
            </span>
          </label>
          <input
            id={ids.people}
            type="number"
            inputMode="numeric"
            min={1}
            max={12}
            className="input"
            value={params.people}
            onChange={(e) => set({ people: Math.max(1, Number(e.target.value) || 1) })}
          />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {[1, 2, 3, 4].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => set({ people: p })}
                className={`rounded-lg border px-2.5 py-1 text-xs ${
                  params.people === p
                    ? "border-indigo-400/60 bg-indigo-500/20 text-indigo-100"
                    : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
