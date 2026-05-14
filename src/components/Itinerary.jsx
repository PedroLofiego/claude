import { CalendarDays, Gift, PartyPopper } from "lucide-react";
import { buildItinerary } from "../data/itineraries.js";

const KIND_BADGE = {
  xmasEve: {
    label: "Véspera de Natal",
    cls: "bg-rose-500/15 text-rose-200 ring-rose-400/30",
    Icon: Gift,
  },
  xmasDay: {
    label: "Dia de Natal",
    cls: "bg-rose-500/15 text-rose-200 ring-rose-400/30",
    Icon: Gift,
  },
  nyeEve: {
    label: "Réveillon",
    cls: "bg-amber-400/15 text-amber-200 ring-amber-400/30",
    Icon: PartyPopper,
  },
  nyeDay: {
    label: "Ano Novo",
    cls: "bg-amber-400/15 text-amber-200 ring-amber-400/30",
    Icon: PartyPopper,
  },
};

export default function Itinerary({ destinationId, days, startDate }) {
  const plan = buildItinerary(destinationId, days, startDate);
  if (!plan.length) return null;

  return (
    <div className="card p-5">
      <header className="mb-3 flex items-center gap-2">
        <CalendarDays size={16} className="text-indigo-300" />
        <h3 className="text-base font-semibold text-white">
          Roteiro sugerido • {days} dias
        </h3>
        <span className="ml-2 text-xs text-slate-400">
          (com âncoras nos dias 24, 25, 31 e 01)
        </span>
      </header>
      <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {plan.map((d) => {
          const badge = KIND_BADGE[d.kind];
          const isFestive = !!badge;
          return (
            <li
              key={d.day}
              className={`rounded-xl border p-3 ${
                isFestive
                  ? "border-amber-400/30 bg-amber-500/[0.06]"
                  : "border-white/10 bg-white/[0.04]"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs uppercase tracking-wider text-slate-400">
                  Dia {d.day}
                  {d.dateLabel && <span className="ml-1.5 text-slate-300/70">· {d.dateLabel}</span>}
                </span>
                {badge ? (
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${badge.cls}`}
                  >
                    <badge.Icon size={11} /> {badge.label}
                  </span>
                ) : (
                  <span className="text-[11px] text-indigo-200/80">{d.theme}</span>
                )}
              </div>
              {badge && (
                <div className="mt-1 text-[12px] font-semibold text-amber-100">
                  {d.theme}
                </div>
              )}
              <ul className="mt-2 space-y-1 text-sm text-slate-200">
                {d.items.map((it, i) => (
                  <li key={i} className="flex gap-2">
                    <span
                      className={`mt-1 h-1.5 w-1.5 flex-none rounded-full ${
                        isFestive ? "bg-amber-300" : "bg-indigo-400/70"
                      }`}
                    />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ol>
      <p className="mt-3 text-[11px] text-slate-400">
        Roteiro modelo (mock). Os dias 24, 25, 31 e 01 são montados com tradições/eventos
        específicos do destino quando caem dentro da sua janela de viagem.
      </p>
    </div>
  );
}
