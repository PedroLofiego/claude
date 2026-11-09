import { useEffect, useState } from "react";
import { BedDouble, CalendarCheck, CalendarPlus, Clock, Download, ExternalLink, FileText, MapPin, Navigation, Route as RouteIcon, Smartphone, Ticket, Train } from "lucide-react";
import { KLOOK_ITEMS, KLOOK_PAID_ON, KLOOK_STATUS } from "./klookData.js";
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
const enc = (q) => encodeURIComponent(q);
const voucherUrl = (file) => `${import.meta.env.BASE_URL}vouchers/${file}`;
// Rota com várias paradas (o Google abre todas em ordem; trem com várias paradas ele não monta).
const dayRouteUrl = (stops) => `https://www.google.com/maps/dir/${stops.map((q) => enc(q).replace(/%20/g, "+")).join("/")}/`;
// Trecho único em transporte público, da parada anterior até esta.
const transitUrl = (from, to) =>
  `https://www.google.com/maps/dir/?api=1&origin=${enc(from)}&destination=${enc(to)}&travelmode=transit`;
const dayStops = (d) => [d.from, ...d.slots.filter((s) => s.map).map((s) => s.map), d.end].filter(Boolean)
  .filter((q, i, a) => q !== a[i - 1]);

// ==================== ROTA IDEAL ====================
export function RouteView() {
  const [city, setCity] = useState("todas");
  const shown = ROUTE_DAYS.filter((d) => city === "todas" || d.city === city || (city === "osaka" && d.city === "narita"));
  const jump = (n) => document.getElementById(`rota-${n}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  const todayN = todayDayN();
  // Durante a viagem, a aba já abre no dia de hoje.
  useEffect(() => {
    if (todayN) setTimeout(() => jump(todayN), 300);
  }, [todayN]);

  return (
    <div className="space-y-4">
      <details className="card p-4 text-sm leading-relaxed text-slate-300">
        <summary className="cursor-pointer font-semibold text-white">ℹ️ Como usar esta página</summary>
        <p className="mt-2">
          Os passeios que vocês escolheram na Klook são os <b className="text-emerald-300">pontos fixos</b> do dia. Em volta deles
          entram bairros para <b className="text-sky-300">bater perna</b>, sempre perto um do outro e com folga entre um e outro:
          2 ou 3 lugares por dia, sem correria.
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {Object.entries(ROUTE_KINDS).map(([k, v]) => (
            <span key={k} className={`rounded-md px-2 py-0.5 text-xs font-semibold ${v.cls}`}>{v.label}</span>
          ))}
        </div>
        <p className="mt-2 flex gap-1.5 text-slate-300"><RouteIcon size={15} className="mt-0.5 flex-none text-sky-300" />
          <span>Cada dia tem o botão <b className="text-white">Rota do dia no Google Maps</b>, com todas as paradas na ordem, saindo do hotel. Em cada lugar, <b className="text-white">Como chegar</b> abre o trajeto de trem e metrô desde a parada anterior.</span></p>
        <p className="mt-2 flex gap-1.5 text-slate-300"><Ticket size={15} className="mt-0.5 flex-none text-amber-300" />
          <span>Os <b className="text-white">ingressos</b> estão dentro de cada dia: o botão amarelo abre o voucher, e “Na entrada” diz como usar. Durante a viagem, a página abre direto no dia de hoje.</span></p>
        <p className="mt-2 text-xs text-slate-400">Montada em {ROUTE_UPDATED}. Horários de pôr do sol e de funcionamento podem mudar — conferir perto da data.</p>
      </details>

      <ExportCard />

      <div className="no-print space-y-3">
        {todayN && (
          <button type="button" onClick={() => { setCity("todas"); setTimeout(() => jump(todayN), 50); }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-500 px-3 py-3 text-base font-bold text-white shadow hover:bg-rose-400">
            <CalendarCheck size={18} /> Ir para hoje · Dia {todayN}
          </button>
        )}
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
              className={`filter-pill flex flex-none flex-col items-center rounded-xl border px-2.5 py-1.5 hover:bg-white/10 ${
                d.n === todayN ? "border-rose-400 bg-rose-500/20" : "border-white/10 bg-white/[0.04]"}`}>
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
            <RouteDay d={d} isToday={d.n === todayN} />
          </li>
        ))}
      </ol>
    </div>
  );
}

function RouteDay({ d, isToday }) {
  const c = CITY[d.city];
  const stops = dayStops(d);
  const tickets = d.slots.filter((s) => s.klookId).map((s) => klookById[s.klookId]).filter(Boolean);
  let prev = d.from;
  return (
    <article className={`card overflow-hidden ${isToday ? "ring-2 ring-rose-400" : ""}`}>
      <header className="flex items-center gap-3 border-b border-white/10 px-4 py-3" style={{ boxShadow: `inset 4px 0 0 ${c.color}` }}>
        <div className="grid h-11 w-11 flex-none place-items-center rounded-xl bg-white/[0.06] text-center">
          <span className="text-[10px] leading-none text-slate-400">DIA</span>
          <span className="text-lg font-extrabold leading-none text-white">{d.n}</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm text-slate-400">{isToday && <b className="text-rose-300">HOJE · </b>}{d.date} · {c.emoji} {c.label}</div>
          <h3 className="text-base font-bold leading-snug text-white">{d.title}</h3>
        </div>
        <div className="flex flex-none flex-col items-end gap-1">
          {d.pace && (
            <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${PACE[d.pace] ?? PACE.médio}`}>ritmo {d.pace}</span>
          )}
          {tickets.length > 0 && (
            <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/15 px-2 py-0.5 text-xs font-semibold text-amber-200">
              <Ticket size={12} /> {tickets.length} {tickets.length > 1 ? "ingressos" : "ingresso"}
            </span>
          )}
        </div>
      </header>
      <ul className="divide-y divide-white/5 px-4">
        {d.slots.map((sl, j) => {
          const item = sl.klookId && klookById[sl.klookId];
          const k = item?.status === "pago" ? { label: "Pago ✓", cls: "bg-emerald-500/25 text-emerald-100" }
            : item?.status === "carrinho" ? { label: "Falta pagar", cls: "bg-amber-500/25 text-amber-100" }
            : ROUTE_KINDS[sl.kind] ?? ROUTE_KINDS.livre;
          const from = prev;
          if (sl.map) prev = sl.map;
          return (
            <li key={j} className="py-2.5 text-sm">
             <div className="flex gap-3">
              <span className="w-14 flex-none pt-0.5 font-semibold text-slate-400">{sl.time}</span>
              <div className="min-w-0 flex-1">
                {!item && <span className={`mr-1.5 inline-block rounded-md px-1.5 py-0.5 align-middle text-[11px] font-semibold ${k.cls}`}>{k.label}</span>}
                <span className={item ? "font-semibold text-white" : "text-slate-100"}>{sl.what}</span>
                {sl.split && <span className="ml-1.5 inline-block rounded-md bg-indigo-500/25 px-1.5 py-0.5 text-[11px] font-semibold text-indigo-100">cada um faz um programa</span>}
                {sl.note && <div className="mt-1 text-xs text-amber-200">⚖️ {sl.note}</div>}
                {sl.trains && (
                  <a href={`#/japao/organizar/transporte`} className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-sky-300 hover:text-sky-200 no-print">
                    <Train size={12} /> Ver opções de trem, preços e links
                  </a>
                )}
                {sl.map && !item && (
                  <div className="mt-1 flex flex-wrap gap-3 text-xs no-print">
                    {sl.map && (
                      <a href={mapUrl(sl.map)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-sky-300 hover:text-sky-200">
                        <MapPin size={12} /> Mapa
                      </a>
                    )}
                    {sl.map && from && from !== sl.map && (
                      <a href={transitUrl(from, sl.map)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-violet-300 hover:text-violet-200">
                        <Navigation size={12} /> Como chegar
                      </a>
                    )}
                  </div>
                )}
              </div>
             </div>
             {item && <TicketCard item={item} map={sl.map} from={from} />}
            </li>
          );
        })}
      </ul>
      {stops.length > 2 && (
        <div className="px-4 pb-1 pt-2 no-print">
          <a href={dayRouteUrl(stops)} target="_blank" rel="noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500/15 px-3 py-2.5 text-sm font-semibold text-sky-100 hover:bg-sky-500/25">
            <RouteIcon size={16} /> Rota do dia no Google Maps <span className="font-normal text-sky-200/80">· {stops.length} paradas</span>
          </a>
        </div>
      )}
      {(d.tip || d.sleep) && (
        <footer className="space-y-1 border-t border-white/5 px-4 py-2.5 text-xs text-slate-400">
          {d.tip && <p className="text-slate-300">💡 {d.tip}</p>}
          {d.sleep && <p className="flex items-center gap-1.5"><BedDouble size={13} /> Dorme em: {d.sleep}</p>}
        </footer>
      )}
    </article>
  );
}

// "Levar para o celular": calendário (.ics) e lugares para o Google My Maps (.csv),
// gerados no build por scripts/export-trip.mjs.
function ExportCard() {
  const base = import.meta.env.BASE_URL;
  return (
    <section className="card no-print border-sky-400/30 p-4">
      <h3 className="flex items-center gap-2 text-base font-bold text-white"><Smartphone size={18} className="text-sky-300" /> Levar para o celular</h3>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <a href={`${base}export/japao-pedro-gio.ics`}
          className="flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-3 py-3 text-sm font-bold text-white hover:bg-sky-400">
          <CalendarPlus size={18} /> Adicionar ao calendário
        </a>
        <a href={`${base}export/japao-lugares.csv`} download
          className="flex items-center justify-center gap-2 rounded-xl bg-white/10 px-3 py-3 text-sm font-bold text-white hover:bg-white/15">
          <Download size={18} /> Lugares para o Google Maps
        </a>
      </div>
      <details className="mt-3 text-sm text-slate-300">
        <summary className="cursor-pointer font-semibold text-sky-200">Como colocar no iPhone (passo a passo)</summary>
        <div className="mt-2 space-y-3 leading-relaxed">
          <div>
            <b className="text-white">📅 Calendário — 1 toque, cada um no seu iPhone</b>
            <ol className="mt-1 list-decimal space-y-0.5 pl-5">
              <li>Abram este site no Safari do iPhone e toquem em <b>Adicionar ao calendário</b>.</li>
              <li>Aparece a lista de eventos: toquem em <b>Adicionar todos</b>.</li>
              <li>Cada dia vira um evento com o plano inteiro e a rota do Google Maps; cada ingresso vira um evento no horário, com endereço, reserva, “na entrada” e o link do voucher (e aviso 1h antes).</li>
            </ol>
            <p className="mt-1 text-xs text-slate-400">Se a rota mudar depois, apaguem os eventos antigos antes de importar de novo, para não duplicar.</p>
          </div>
          <div>
            <b className="text-white">🗺️ Google Maps — uma vez no computador, aparece nos dois iPhones</b>
            <ol className="mt-1 list-decimal space-y-0.5 pl-5">
              <li>Baixem o arquivo <b>Lugares para o Google Maps</b>.</li>
              <li>Abram <a className="text-sky-300 underline" href="https://www.google.com/maps/d/" target="_blank" rel="noreferrer">Google My Maps</a> → <b>Criar novo mapa</b> → <b>Importar</b> → escolham o arquivo.</li>
              <li>Local: coluna <b>Endereço</b>. Título: coluna <b>Nome</b>.</li>
              <li>Em “Estilo”, agrupem por <b>Dia</b> — cada dia ganha uma cor.</li>
              <li><b>Compartilhar</b> → coloquem o e-mail da Gio.</li>
              <li>No iPhone: Google Maps → <b>Você</b> → <b>Salvos</b> → <b>Mapas</b> → o mapa da viagem.</li>
            </ol>
            <p className="mt-1 text-xs text-slate-400">O Google não deixa importar uma lista de lugares direto por link no app — esse é o jeito oficial.</p>
          </div>
          <div>
            <b className="text-white">🎟️ Vouchers sem internet</b>
            <p className="mt-1">Abram cada voucher (botão amarelo) → <b>Compartilhar</b> → <b>Salvar em Arquivos</b>. Ficam disponíveis mesmo sem sinal.</p>
          </div>
          <div>
            <b className="text-white">📱 O site como app</b>
            <p className="mt-1">No Safari: <b>Compartilhar</b> → <b>Adicionar à Tela de Início</b>. Abre direto no roteiro, com o dia de hoje.</p>
          </div>
        </div>
      </details>
    </section>
  );
}

// Data de cada dia da rota (2026) para o botão "Hoje".
function todayDayN() {
  const now = new Date();
  const iso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const d = ROUTE_DAYS.find((x) => {
    const [dd, mm] = x.date.split(" ")[1].split("/");
    return `2026-${mm}-${dd}` === iso;
  });
  return d?.n ?? null;
}

// Cartão do ingresso dentro do dia: tudo o que precisa na hora, num lugar só.
function TicketCard({ item: i, map, from }) {
  const st = KLOOK_STATUS[i.status];
  const paid = i.status === "pago";
  return (
    <div className={`mt-2 overflow-hidden rounded-xl border ${paid ? "border-emerald-400/30 bg-emerald-500/[0.06]" : "border-amber-400/30 bg-amber-500/[0.06]"}`}>
      <div className="flex gap-3 p-3">
        {i.img && <img src={i.img} alt="" loading="lazy" className="h-16 w-16 flex-none rounded-lg object-cover sm:h-20 sm:w-24" />}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={`rounded-md border px-1.5 py-0.5 text-[11px] font-semibold ${st.cls}`}>{st.label}</span>
            {i.ref && <span className="text-[11px] font-semibold tracking-wide text-slate-400">Reserva {i.ref}</span>}
          </div>
          <div className="mt-0.5 text-sm font-bold leading-snug text-white">{i.name}</div>
          <div className="mt-0.5 flex flex-wrap gap-x-3 text-xs text-slate-300">
            <span className="inline-flex items-center gap-1"><Clock size={12} /> {i.time}</span>
            {i.duration && i.duration !== "—" && <span>{i.duration}</span>}
            <span>2 pessoas</span>
          </div>
        </div>
      </div>
      {i.vouchers?.length > 0 && (
        <div className="grid gap-1.5 px-3 pb-2 no-print">
          {i.vouchers.map((v) => (
            <a key={v.file} href={voucherUrl(v.file)} target="_blank" rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-lg bg-amber-400 px-3 py-2.5 text-sm font-bold text-slate-900 hover:bg-amber-300">
              <FileText size={16} /> {i.vouchers.length > 1 ? v.label : "Abrir voucher (PDF)"}
            </a>
          ))}
        </div>
      )}
      {(i.howTo || i.voucherNote) && (
        <div className="space-y-1 border-t border-white/5 px-3 py-2 text-xs leading-relaxed">
          {i.howTo && <p className="text-slate-200"><b className="text-white">Na entrada:</b> {i.howTo}</p>}
          {i.voucherNote && <p className="text-sky-200">ℹ️ {i.voucherNote}</p>}
        </div>
      )}
      <div className="flex flex-wrap gap-x-4 gap-y-1 border-t border-white/5 px-3 py-2 text-xs no-print">
        {(map || i.lat) && (
          <a href={mapUrl(map || `${i.lat},${i.lng}`)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-sky-300 hover:text-sky-200">
            <MapPin size={12} /> Mapa
          </a>
        )}
        {map && from && from !== map && (
          <a href={transitUrl(from, map)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-violet-300 hover:text-violet-200">
            <Navigation size={12} /> Como chegar
          </a>
        )}
        <a href={i.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-emerald-300 hover:text-emerald-200">
          <ExternalLink size={12} /> Página na Klook{!paid && i.priceBRL ? ` · ≈ R$ ${i.priceBRL.toLocaleString("pt-BR")} os dois` : ""}
        </a>
      </div>
    </div>
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

// ==================== INGRESSOS ESCOLHIDOS ====================
export function TicketsView() {
  const items = [...KLOOK_ITEMS].sort((a, b) => a.dateISO.localeCompare(b.dateISO) || a.time.localeCompare(b.time));
  const paid = items.filter((i) => i.status === "pago");
  const inCart = items.filter((i) => i.status === "carrinho");
  const toBuy = items.filter((i) => i.status === "sem-venda");
  const paidUSD = paid.reduce((s, i) => s + (i.paidUSD || 0), 0);
  const cartBRL = inCart.reduce((s, i) => s + (i.priceBRL || 0), 0);
  const brl = (v) => `R$ ${v.toLocaleString("pt-BR")}`;
  const usd = (v) => `US$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return (
    <div className="space-y-4">
      <section className="card p-4 text-sm leading-relaxed text-slate-300">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl bg-emerald-500/10 p-2"><div className="text-xl font-extrabold text-emerald-200">{paid.length}</div><div className="text-xs text-emerald-100/80">pagos</div></div>
          <div className="rounded-xl bg-amber-500/10 p-2"><div className="text-xl font-extrabold text-amber-200">{inCart.length}</div><div className="text-xs text-amber-100/80">falta pagar</div></div>
          <div className="rounded-xl bg-white/5 p-2"><div className="text-xl font-extrabold text-slate-200">{toBuy.length}</div><div className="text-xs text-slate-400">venda não abriu</div></div>
        </div>
        <p className="mt-3">
          <b className="text-emerald-200">Pago em {KLOOK_PAID_ON}:</b> {usd(paidUSD)} no total, 2 ingressos em cada.
          {inCart.length > 0 && <> Ainda no carrinho, sem pagar: ≈ <b className="text-white">{brl(cartBRL)}</b>.</>}
        </p>
        <p className="mt-1.5 text-xs text-slate-400">
          Os vouchers em PDF estão no botão de cada ingresso. Baixem no celular antes de viajar para abrir sem internet —
          e não compartilhem o link: o PDF funciona como ingresso. Os originais também ficam no app da Klook, em Reservas.
        </p>
      </section>
      <ul className="space-y-2">
        {items.map((i) => {
          const st = KLOOK_STATUS[i.status];
          return (
            <li key={i.id} className="card flex gap-3 p-3">
              {i.img && <img src={i.img} alt="" loading="lazy" className="h-16 w-20 flex-none rounded-lg object-cover sm:h-20 sm:w-28" />}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="font-semibold text-slate-300">{i.day} · {i.time}</span>
                  <span className={`rounded-md border px-1.5 py-0.5 font-semibold ${st.cls}`}>{st.label}</span>
                </div>
                <h3 className="mt-0.5 text-sm font-bold leading-snug text-white">{i.name}</h3>
                {i.salesNote && <p className="mt-0.5 text-xs text-amber-200">{i.salesNote}</p>}
                {i.voucherNote && <p className="mt-0.5 text-xs text-sky-200">ℹ️ {i.voucherNote}</p>}
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                  <span className="font-semibold text-slate-200">
                    {i.status === "pago" ? (i.paidUSD ? `Pago ${usd(i.paidUSD)}` : "Grátis · emitido") : i.priceBRL ? `≈ ${brl(i.priceBRL)} os dois` : "Grátis"}
                  </span>
                  <a href={i.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-emerald-300 hover:text-emerald-200">
                    <ExternalLink size={12} /> Klook
                  </a>
                  {i.vouchers?.map((v) => (
                    <a key={v.file} href={voucherUrl(v.file)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-md bg-amber-500/15 px-1.5 py-0.5 font-semibold text-amber-200 hover:bg-amber-500/25">
                      <FileText size={12} /> {v.label}
                    </a>
                  ))}
                  {i.lat && (
                    <a href={mapUrl(`${i.lat},${i.lng}`)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-sky-300 hover:text-sky-200">
                      <MapPin size={12} /> Mapa
                    </a>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
