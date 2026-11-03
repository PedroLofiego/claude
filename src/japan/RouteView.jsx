import { useState } from "react";
import { BedDouble, ExternalLink, MapPin, Train } from "lucide-react";
import { KLOOK_ITEMS } from "./klookData.js";
import { KYOTO_TRIPS, ROUTE_DAYS, ROUTE_KINDS, ROUTE_UPDATED } from "./routeData.js";

const CITY = {
  toquio: { label: "Tóquio", emoji: "🗼", color: "#fb7185" },
  kyoto: { label: "Kyoto", emoji: "🎎", color: "#fbbf24" },
  osaka: { label: "Osaka", emoji: "🐙", color: "#38bdf8" },
  narita: { label: "Narita", emoji: "✈️", color: "#94a3b8" },
};

const PACE = {
  leve: "bg-emerald-500/15 text-emerald-200",
  médio: "bg-sky-500/15 text-sky-200",
  cheio: "bg-amber-500/15 text-amber-200",
  livre: "bg-violet-500/15 text-violet-200",
};

const WHO = { pedro: "🧑 Pedro", gio: "👩 Gio", ambos: "👥 Os dois" };

const mapUrl = (q) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
const klookById = Object.fromEntries(KLOOK_ITEMS.map((i) => [i.id, i]));

// ==================== ROTA IDEAL ====================
export function RouteView() {
  const [city, setCity] = useState("todas");
  const shown = ROUTE_DAYS.filter((d) => city === "todas" || d.city === city || (city === "osaka" && d.city === "narita"));
  const jump = (n) => document.getElementById(`rota-${n}`)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="space-y-4">
      <section className="card p-4 text-sm leading-relaxed text-slate-300">
        <p>
          Os passeios que vocês escolheram na Klook são os <b className="text-emerald-300">pontos fixos</b> do dia. Em volta deles
          entram bairros para <b className="text-sky-300">bater perna</b>, sempre perto um do outro e com folga entre um e outro:
          2 ou 3 lugares por dia, sem correria.
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {Object.entries(ROUTE_KINDS).map(([k, v]) => (
            <span key={k} className={`rounded-md px-2 py-0.5 text-xs font-semibold ${v.cls}`}>{v.label}</span>
          ))}
        </div>
        <p className="mt-2 text-xs text-slate-400">Montada em {ROUTE_UPDATED}. Horários de pôr do sol e de funcionamento podem mudar — conferir perto da data.</p>
      </section>

      <div className="no-print space-y-3">
        <div className="flex flex-wrap gap-2">
          {[["todas", "Todos os dias"], ["toquio", "🗼 Tóquio"], ["kyoto", "🎎 Kyoto"], ["osaka", "🐙 Osaka"]].map(([id, label]) => (
            <button key={id} type="button" onClick={() => setCity(id)} aria-pressed={city === id}
              className={`filter-pill rounded-full border px-3.5 py-2 text-sm font-semibold ${
                city === id ? "border-white bg-white text-slate-900" : "border-white/15 text-slate-200 hover:bg-white/5"
              }`}>
              {label}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:thin]" aria-label="Ir para o dia">
          {shown.map((d) => (
            <button key={d.n} type="button" onClick={() => jump(d.n)}
              className="filter-pill flex flex-none flex-col items-center rounded-xl border border-white/10 bg-white/[0.04] px-2.5 py-1.5 hover:bg-white/10">
              <span className="text-[11px] text-slate-400">{d.date.split(" ")[1]}</span>
              <span className="text-base font-extrabold text-white">{d.n}</span>
              <span className="mt-0.5 h-1 w-5 rounded-full" style={{ background: CITY[d.city].color }} />
            </button>
          ))}
        </div>
      </div>

      <ol className="space-y-3">
        {shown.map((d) => (
          <li key={d.n} id={`rota-${d.n}`} className="scroll-mt-24">
            <RouteDay d={d} />
          </li>
        ))}
      </ol>
    </div>
  );
}

function RouteDay({ d }) {
  const c = CITY[d.city];
  return (
    <article className="card overflow-hidden">
      <header className="flex items-center gap-3 border-b border-white/10 px-4 py-3" style={{ boxShadow: `inset 4px 0 0 ${c.color}` }}>
        <div className="grid h-11 w-11 flex-none place-items-center rounded-xl bg-white/[0.06] text-center">
          <span className="text-[10px] leading-none text-slate-400">DIA</span>
          <span className="text-lg font-extrabold leading-none text-white">{d.n}</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm text-slate-400">{d.date} · {c.emoji} {c.label}</div>
          <h3 className="text-base font-bold leading-snug text-white">{d.title}</h3>
        </div>
        {d.pace && (
          <span className={`flex-none rounded-md px-2 py-0.5 text-xs font-semibold ${PACE[d.pace] ?? PACE.médio}`}>
            ritmo {d.pace}
          </span>
        )}
      </header>
      <ul className="divide-y divide-white/5 px-4">
        {d.slots.map((sl, j) => {
          const k = ROUTE_KINDS[sl.kind] ?? ROUTE_KINDS.livre;
          const item = sl.klookId && klookById[sl.klookId];
          return (
            <li key={j} className="flex gap-3 py-2.5 text-sm">
              <span className="w-14 flex-none pt-0.5 font-semibold text-slate-400">{sl.time}</span>
              <div className="min-w-0 flex-1">
                <span className={`mr-1.5 inline-block rounded-md px-1.5 py-0.5 align-middle text-[11px] font-semibold ${k.cls}`}>{k.label}</span>
                <span className="text-slate-100">{sl.what}</span>
                {sl.split && <span className="ml-1.5 inline-block rounded-md bg-indigo-500/25 px-1.5 py-0.5 text-[11px] font-semibold text-indigo-100">cada um faz um programa</span>}
                {sl.note && <div className="mt-1 text-xs text-amber-200">⚖️ {sl.note}</div>}
                {(sl.map || item) && (
                  <div className="mt-1 flex flex-wrap gap-3 text-xs no-print">
                    {sl.map && (
                      <a href={mapUrl(sl.map)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-sky-300 hover:text-sky-200">
                        <MapPin size={12} /> Mapa
                      </a>
                    )}
                    {item && (
                      <a href={item.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-emerald-300 hover:text-emerald-200">
                        <ExternalLink size={12} /> Klook{item.priceBRL ? ` · ≈ R$ ${item.priceBRL.toLocaleString("pt-BR")} os dois` : ""}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      {(d.tip || d.sleep) && (
        <footer className="space-y-1 border-t border-white/5 px-4 py-2.5 text-xs text-slate-400">
          {d.tip && <p className="text-slate-300">💡 {d.tip}</p>}
          {d.sleep && <p className="flex items-center gap-1.5"><BedDouble size={13} /> Dorme em: {d.sleep}</p>}
        </footer>
      )}
    </article>
  );
}

// ==================== BATE-VOLTA DE KYOTO ====================
export function KyotoTrips() {
  return (
    <div className="space-y-4">
      <section className="card p-4 text-sm leading-relaxed text-slate-300">
        <p>
          Como os passeios pagos de Kyoto saíram, o <b className="text-white">dia 15/12 (terça) ficou livre</b> para um bate-volta.
          Todos saem do hotel (MYSTAYS Shijo, perto da estação Omiya) e voltam no mesmo dia, sem trocar de hotel.
        </p>
        <p className="mt-2 text-slate-300">
          <b className="text-emerald-300">Mais indicados:</b> Himeji, pelo castelo que a Gio queria, ou Uji + Nara, que junta o chá do Pedro
          com os templos da Gio. Os de meio período cabem também na tarde do dia 14 ou do dia 16.
        </p>
      </section>
      <div className="grid gap-3 sm:grid-cols-2">
        {KYOTO_TRIPS.map((t) => <TripCard key={t.id} t={t} />)}
      </div>
    </div>
  );
}

function TripCard({ t }) {
  return (
    <article className={`card flex flex-col p-4 ${t.top ? "border-emerald-400/40" : ""}`}>
      <div className="flex items-start gap-3">
        <span className="text-3xl" aria-hidden>{t.emoji}</span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <h3 className="text-base font-bold text-white">{t.name}</h3>
            {t.top && <span className="rounded-md bg-emerald-500/20 px-1.5 py-0.5 text-[11px] font-semibold text-emerald-100">mais indicado</span>}
          </div>
          <p className="text-sm text-slate-300">{t.tagline}</p>
          <div className="mt-1 flex flex-wrap gap-1.5 text-[11px] font-semibold">
            <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-slate-200">{t.size === "dia" ? "Dia inteiro" : "Meio período"}</span>
            <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-slate-200">Combina com: {WHO[t.match]}</span>
          </div>
        </div>
      </div>
      <p className="mt-3 text-sm text-slate-200">{t.why}</p>
      <ul className="mt-2 list-disc space-y-0.5 pl-5 text-sm text-slate-300">
        {t.doWhat.map((x) => <li key={x}>{x}</li>)}
      </ul>
      <div className="mt-3 space-y-1.5 rounded-xl bg-white/[0.04] p-3 text-sm">
        <p className="flex gap-2 text-slate-200"><Train size={15} className="mt-0.5 flex-none text-sky-300" /> {t.how}</p>
        <p className="text-slate-300">💴 {t.cost}</p>
      </div>
      {t.tip && <p className="mt-2 text-xs text-amber-200">💡 {t.tip}</p>}
      <div className="mt-auto flex flex-wrap gap-3 pt-3 text-xs no-print">
        <a href={mapUrl(`${t.name.split(" ")[0]} Japan`)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-sky-300 hover:text-sky-200">
          <MapPin size={12} /> Mapa
        </a>
        <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${t.name} day trip from Kyoto`)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-rose-300 hover:text-rose-200">
          <ExternalLink size={12} /> Vídeos
        </a>
      </div>
    </article>
  );
}
