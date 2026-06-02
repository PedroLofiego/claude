import { Clock, Ticket } from "lucide-react";
import { formatBRL } from "../lib/calc.js";

export default function AttractionsList({ destination, people = 1 }) {
  const attractions = destination.attractions ?? [];
  if (attractions.length === 0) return null;

  const totalPerPerson = attractions.reduce((s, a) => s + (a.costBRL || 0), 0);
  const totalGroup = totalPerPerson * people;
  const free = attractions.filter((a) => (a.costBRL || 0) === 0).length;
  const paid = attractions.length - free;

  return (
    <div className="card p-5">
      <header className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-white">
            <Ticket size={16} className="mr-1.5 inline -mt-1 text-amber-300" />
            Atrações principais e custos
          </h3>
          <p className="text-xs text-slate-400">
            Preços em BRL convertidos da moeda local (Mai/2026). {paid} pagas · {free} grátis.
          </p>
        </div>
        <div className="text-right">
          <div className="text-[11px] uppercase tracking-wider text-slate-400">
            Fazer todas (por pessoa)
          </div>
          <div className="text-base font-bold text-white">{formatBRL(totalPerPerson)}</div>
          {people > 1 && (
            <div className="text-[11px] text-slate-400">
              {formatBRL(totalGroup)} grupo de {people}
            </div>
          )}
        </div>
      </header>

      <ul className="divide-y divide-white/5">
        {attractions.map((a, i) => (
          <li key={i} className="flex flex-wrap items-start gap-3 py-2.5">
            <div className="grid h-7 w-7 flex-none place-items-center rounded-lg bg-amber-500/15 text-xs font-bold text-amber-200">
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white">{a.name}</div>
              <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-slate-400">
                {a.duration && (
                  <span className="inline-flex items-center gap-1">
                    <Clock size={11} /> {a.duration}
                  </span>
                )}
                {a.note && <span className="italic">{a.note}</span>}
              </div>
            </div>
            <div className="text-right">
              {a.costBRL > 0 ? (
                <>
                  <div className="text-sm font-semibold text-white">{formatBRL(a.costBRL)}</div>
                  <div className="text-[10px] text-slate-500">/pessoa</div>
                </>
              ) : (
                <span className="badge-ok">Grátis</span>
              )}
            </div>
          </li>
        ))}
      </ul>

      <footer className="mt-3 grid grid-cols-3 gap-2 border-t border-white/10 pt-3 text-xs">
        <Stat label="Pagas" value={paid} />
        <Stat label="Grátis" value={free} />
        <Stat label="Tempo total" value={`~${estimateTotalHours(attractions)}h`} />
      </footer>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="text-center">
      <div className="text-[10px] uppercase tracking-wider text-slate-400">{label}</div>
      <div className="text-sm font-semibold text-white">{value}</div>
    </div>
  );
}

function estimateTotalHours(items) {
  return items.reduce((sum, it) => {
    if (!it.duration) return sum;
    const m = String(it.duration).match(/(\d+)\s*h(?:(\d+))?/);
    if (m) return sum + Number(m[1]) + (m[2] ? Number(m[2]) / 60 : 0);
    const m2 = String(it.duration).match(/(\d+)\s*dia/);
    if (m2) return sum + Number(m2[1]) * 8;
    return sum;
  }, 0).toFixed(1).replace(/\.0$/, "");
}
