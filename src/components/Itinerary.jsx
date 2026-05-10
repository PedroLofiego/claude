import { CalendarDays } from "lucide-react";
import { buildItinerary } from "../data/itineraries.js";

export default function Itinerary({ destinationId, days }) {
  const plan = buildItinerary(destinationId, days);
  if (!plan.length) return null;

  return (
    <div className="card p-5">
      <header className="mb-3 flex items-center gap-2">
        <CalendarDays size={16} className="text-indigo-300" />
        <h3 className="text-base font-semibold text-white">Roteiro sugerido • {days} dias</h3>
      </header>
      <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {plan.map((d) => (
          <li
            key={d.day}
            className="rounded-xl border border-white/10 bg-white/[0.04] p-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-slate-400">
                Dia {d.day}
              </span>
              <span className="text-[11px] text-indigo-200/80">{d.theme}</span>
            </div>
            <ul className="mt-2 space-y-1 text-sm text-slate-200">
              {d.items.map((it, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-indigo-400/70" />
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-[11px] text-slate-400">
        Roteiro modelo (mock). Ajuste de acordo com clima, preferências e dias da semana — feriados
        locais podem alterar horários e custos de ingressos.
      </p>
    </div>
  );
}
