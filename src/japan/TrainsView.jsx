import { AlertTriangle, ExternalLink, Clock, Train } from "lucide-react";
import { TRAIN_LEGS, TRAIN_TAGS, TRAINS_UPDATED, TRAIN_PLAN, TRAIN_PAY } from "./trainsData.js";
import { JPY_PER_BRL } from "./tripData.js";

const yen = (v) => `¥${v.toLocaleString("pt-BR")}`;
const brlTwo = (v) => `R$ ${Math.round((v * 2) / JPY_PER_BRL).toLocaleString("pt-BR")}`;


// Lista de trens de um dia (usada no roteiro e na página de Transporte).
export function DayRides({ rides }) {
  return (
    <ul className="space-y-2">
      {rides.map((r, i) => {
        const p = TRAIN_PAY[r.pay];
        return (
          <li key={i} className={`rounded-lg px-3 py-2 text-sm ${r.pay === "comprar" ? "bg-rose-500/10 ring-1 ring-rose-400/40" : "bg-white/[0.04]"}`}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <span className="font-semibold text-white"><span className="text-slate-400">{r.time}</span> · {r.from} → {r.to}</span>
              <span className="text-xs text-slate-300 tabular-nums">{r.duration}{r.yen > 0 && ` · ${yen(r.yen)}/pessoa`}</span>
            </div>
            <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs">
              <span className={`rounded-md border px-1.5 py-0.5 font-semibold ${p.cls}`}>{p.label}</span>
              <span className="text-slate-300">{r.line}</span>
            </div>
            {r.note && <p className={`mt-1 text-xs ${r.pay === "comprar" ? "font-semibold text-rose-200" : "text-slate-400"}`}>{r.note}</p>}
            {r.link && (
              <a href={r.link} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-sky-300 hover:text-sky-200">
                <ExternalLink size={12} /> {r.pay === "comprar" ? "Comprar agora" : "Abrir site"}
              </a>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function AllRides() {
  const toBuy = TRAIN_PLAN.flatMap((d) => d.rides.filter((r) => r.pay === "comprar"));
  return (
    <section className="card p-4">
      <h2 className="flex items-center gap-2 text-base font-bold text-white"><Train size={18} className="text-sky-300" /> Todos os trens da viagem, dia a dia</h2>
      <p className="mt-1 text-sm text-slate-300">
        Quase tudo é só passar o <b className="text-white">Suica</b> na catraca. Os 2 trens-bala já estão <b className="text-emerald-200">pagos ✓</b>
        {toBuy.length > 0 && <> · faltam {toBuy.length} bilhetes</>} e 1 trecho tem assento opcional para reservar (Hankyu PRiVACE, a partir de 03/12).
      </p>
      <div className="mt-3 space-y-4">
        {TRAIN_PLAN.map((d) => (
          <div key={d.day}>
            <div className="mb-1.5 text-xs font-bold uppercase tracking-wide text-slate-400">Dia {d.day} · {d.date}</div>
            <DayRides rides={d.rides} />
          </div>
        ))}
      </div>
    </section>
  );
}

// Os 3 trechos da viagem, com as opções de trem, preço e link de compra.
export default function TrainsView() {
  return (
    <section className="space-y-4">
      <div className="card p-4 text-sm leading-relaxed text-slate-300">
        <h2 className="flex items-center gap-2 text-base font-bold text-white"><Train size={18} className="text-sky-300" /> Trens entre as cidades</h2>
        <p className="mt-1">
          Os 3 deslocamentos da viagem, com a opção recomendada primeiro. Preço <b className="text-white">por pessoa, só ida</b> (e o total para os dois em reais).
          Não vale a pena o JR Pass: estes trechos somam bem menos que o passe.
        </p>
        <p className="mt-1 text-xs text-slate-400">Pesquisa de {TRAINS_UPDATED}. Em dezembro alguns dias têm preço de “pico” (+¥200 a ¥400) — conferir no link.</p>
      </div>

      {TRAIN_LEGS.map((leg) => (
        <article key={leg.id} className="card overflow-hidden">
          <header className="border-b border-white/10 px-4 py-3">
            <div className="text-sm text-slate-400">{leg.date}</div>
            <h3 className="text-lg font-bold text-white">{leg.from} → {leg.to}</h3>
            <p className="mt-0.5 text-sm text-slate-300">{leg.plan}</p>
          </header>
          <ul className="divide-y divide-white/5">
            {leg.options.map((o) => {
              const t = TRAIN_TAGS[o.tag];
              return (
                <li key={o.id} className={`px-4 py-3 ${o.unavailable ? "opacity-80" : ""}`}>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <span className={`rounded-md border px-1.5 py-0.5 text-[11px] font-semibold ${t.cls}`}>{t.label}</span>
                      <div className="mt-1 font-bold text-white">{o.name}</div>
                      <div className="text-xs text-slate-400">{o.train}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-extrabold text-white tabular-nums">{yen(o.yen)}</div>
                      <div className="text-xs text-slate-400">por pessoa · ≈ {brlTwo(o.yen)} os dois</div>
                      <div className="mt-0.5 inline-flex items-center gap-1 text-xs text-slate-300"><Clock size={12} /> {o.duration}</div>
                    </div>
                  </div>
                  {o.unavailable && (
                    <p className="mt-2 flex gap-1.5 rounded-lg bg-rose-500/10 px-2 py-1.5 text-xs font-semibold text-rose-200">
                      <AlertTriangle size={14} className="mt-px flex-none" /> {o.unavailable}
                    </p>
                  )}
                  {o.yenNote && <p className="mt-1 text-xs text-slate-400">{o.yenNote}</p>}
                  <p className="mt-2 text-sm text-slate-200">{o.why}</p>
                  <p className="mt-1 text-xs text-amber-200">🗓️ {o.when}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {o.links.map((l) => (
                      <a key={l.url} href={l.url} target="_blank" rel="noreferrer"
                        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold ${
                          o.tag === "rec" ? "bg-emerald-500 text-white hover:bg-emerald-400" : "bg-white/10 text-white hover:bg-white/15"}`}>
                        <ExternalLink size={13} /> {l.label}
                      </a>
                    ))}
                  </div>
                </li>
              );
            })}
          </ul>
        </article>
      ))}
      <AllRides />
    </section>
  );
}
