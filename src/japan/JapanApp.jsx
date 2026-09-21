import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle, BedDouble, CalendarDays, Check, CheckCircle2,
  ClipboardCopy, Compass, FileDown, FileJson, Info, LayoutDashboard,
  Map as MapIcon, PackageCheck, Plane, Sparkles, Train, Users, Wallet,
} from "lucide-react";
import JapanMap from "./JapanMap.jsx";
import { JAPAN_POIS, POI_CATEGORIES } from "./japanData.js";
import { ACT_CATEGORIES, ACTIVITIES, DAY_TRIPS, EFFORT } from "./activities.js";
import {
  BUDGET_LINES, CHECKLIST, CITY_BLOCKS, CONFLICTS, KYOTO_DAYS,
  LOGISTICS, LOGISTICS_NOTES, OPEN_DECISIONS, OSAKA_DAYS, PACE,
  PERSON_PROFILES, PRACTICAL, PREFERENCES, SETTLED, STAYS, TOKYO_VARIANTS,
  TRIP,
} from "./tripData.js";
import { copyToClipboard, downloadTextFile, formatBRL } from "../lib/format.js";

const STORAGE_KEY = "voaja:japan:v4";

const TABS = [
  { id: "geral", label: "Visão geral", icon: LayoutDashboard },
  { id: "roteiro", label: "Roteiro", icon: CalendarDays },
  { id: "passeios", label: "Explorar e montar", icon: Compass },
  { id: "mapa", label: "Mapa", icon: MapIcon },
  { id: "hospedagem", label: "Hospedagem", icon: BedDouble },
  { id: "transporte", label: "Transporte", icon: Train },
  { id: "perfis", label: "Perfis", icon: Users },
  { id: "pratico", label: "Prático", icon: Info },
  { id: "plano", label: "Meu Plano", icon: PackageCheck },
];

const MATCH_STYLE = {
  pedro: { label: "Pedro", cls: "bg-indigo-500/20 text-indigo-200 ring-indigo-400/40", emoji: "🧑" },
  gio: { label: "Gio", cls: "bg-rose-500/20 text-rose-200 ring-rose-400/40", emoji: "👩" },
  ambos: { label: "Os dois", cls: "bg-emerald-500/20 text-emerald-200 ring-emerald-400/40", emoji: "👥" },
};
const LEVEL_LABEL = { alto: "Match alto", medio: "Match médio", baixo: "Match baixo" };

const HERO_IMAGES = [
  { url: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1600&q=75", alt: "Tóquio" },
  { url: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=1600&q=75", alt: "Fushimi Inari" },
  { url: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1600&q=75", alt: "Neon de Tóquio" },
  { url: "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?auto=format&fit=crop&w=1600&q=75", alt: "Monte Fuji" },
];

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function daysUntil(iso) {
  const ms = new Date(iso + "T00:00:00").getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / 86400000));
}

export default function JapanApp() {
  const saved = useMemo(loadState, []);
  const [tab, setTab] = useState("geral");
  const [extras, setExtras] = useState(() => new Set(saved?.extras ?? []));
  const [tokyoVariant, setTokyoVariant] = useState(saved?.tokyoVariant ?? "sem");
  const [done, setDone] = useState(() => new Set(saved?.done ?? []));
  const [poiIds, setPoiIds] = useState(() => new Set(saved?.poiIds ?? []));

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          extras: [...extras], tokyoVariant, done: [...done], poiIds: [...poiIds],
        })
      );
    } catch { /* ignore */ }
  }, [extras, tokyoVariant, done, poiIds]);

  const toggleIn = (setter) => (id) =>
    setter((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  const toggleExtra = toggleIn(setExtras);
  const toggleDone = toggleIn(setDone);
  const togglePoi = toggleIn(setPoiIds);

  const chosenActs = ACTIVITIES.filter((a) => extras.has(a.id));
  const chosenPois = JAPAN_POIS.filter((p) => poiIds.has(p.id));
  const daysLeft = daysUntil(TRIP.arriveISO);
  const pendingCount = OPEN_DECISIONS.length;
  const checklistLeft = CHECKLIST.length - done.size;

  // Bases confirmadas + pendentes no mapa
  const mapBases = STAYS.filter((s) => s.lat).map((s) => ({
    id: s.id, name: s.name, lat: s.lat, lng: s.lng,
    verdict: s.status === "confirmada" ? "✅ Reservado" : "⏳ Ainda não reservado",
  }));

  const onPdf = () => {
    const t = document.title;
    document.title = "roteiro-japao-pedro-gio";
    window.print();
    setTimeout(() => (document.title = t), 1000);
  };

  const buildJSON = () => ({
    app: "VoaJá · Roteiro Japão",
    schema: "voaja.japan-trip/v4",
    generatedAt: new Date().toISOString(),
    trip: {
      arrive: TRIP.arriveISO, arriveLabel: TRIP.arriveLabel,
      depart: TRIP.departISO, departLabel: TRIP.departLabel,
      days: TRIP.days, nights: TRIP.nights, travelers: TRIP.travelers,
      cityBlocks: CITY_BLOCKS.map((c) => ({ city: c.label, nights: c.nights, range: c.range })),
    },
    stays: STAYS.map((s) => ({
      city: s.city, name: s.name, status: s.status, nights: s.nights,
      checkIn: s.checkIn, checkOut: s.checkOut, totalBRL: s.totalBRL,
      coordinates: s.lat ? { lat: s.lat, lng: s.lng } : null,
    })),
    tokyoVariant: {
      chosen: tokyoVariant,
      label: TOKYO_VARIANTS[tokyoVariant].label,
      days: TOKYO_VARIANTS[tokyoVariant].days,
    },
    baseItinerary: { kyoto: KYOTO_DAYS, osaka: OSAKA_DAYS },
    selectedActivities: chosenActs.map((a) => ({
      id: a.id, city: a.city, area: a.area, name: a.name,
      category: ACT_CATEGORIES.find((c) => c.id === a.cat)?.label,
      hours: a.hours, costBRL: a.costBRL, match: a.match, level: a.level,
      what: a.what, tickets: a.tickets, bestTime: a.bestTime,
      december: a.december, swapFor: a.swapFor,
      coordinates: { lat: a.lat, lng: a.lng },
    })),
    selectedPlaces: chosenPois.map((p) => ({
      id: p.id, name: p.name, category: POI_CATEGORIES.find((c) => c.id === p.cat)?.label,
      coordinates: { lat: p.lat, lng: p.lng }, entryCostBRL: p.costBRL,
      duration: p.duration, transport: p.transport, howToBuy: p.howToBuy || null,
    })),
    openDecisions: OPEN_DECISIONS,
    checklist: CHECKLIST.map((c) => ({ ...c, done: done.has(c.id) })),
    budget: BUDGET_LINES,
  });

  const buildText = () => {
    const L = [];
    L.push("🇯🇵 ROTEIRO JAPÃO — PEDRO & GIO");
    L.push(`${TRIP.arriveLabel} → ${TRIP.departLabel}`);
    L.push(`${TRIP.days} dias / ${TRIP.nights} noites · faltam ${daysLeft} dias`);
    L.push("");
    L.push("🏙️ CIDADES");
    CITY_BLOCKS.forEach((c) => L.push(`  ${c.emoji} ${c.label}: ${c.nights}n (${c.range})`));
    L.push("");
    L.push("🏨 HOSPEDAGEM");
    STAYS.forEach((s) => {
      const tag = s.status === "confirmada" ? "✅" : "⏳";
      L.push(`  ${tag} ${s.name} — ${s.nights}n${s.totalBRL ? ` · ${formatBRL(s.totalBRL)}` : " · A RESERVAR"}`);
    });
    L.push("");
    L.push(`🗼 TÓQUIO — versão ${TOKYO_VARIANTS[tokyoVariant].label}`);
    TOKYO_VARIANTS[tokyoVariant].days.forEach((d) =>
      L.push(`  ${d.date}: ${[d.morning, d.afternoon, d.night].filter(Boolean).join(" · ")}`)
    );
    L.push("");
    L.push("🎎 KYOTO");
    KYOTO_DAYS.forEach((d) => {
      L.push(`  ${d.date} — ${d.title}`);
      d.slots.forEach((sl) => L.push(`     ${sl.time} ${sl.what}`));
    });
    L.push("");
    L.push("🐙 OSAKA");
    OSAKA_DAYS.forEach((d) => {
      L.push(`  ${d.date} — ${d.title}`);
      d.slots.forEach((sl) => L.push(`     ${sl.time} ${sl.what}`));
    });
    if (chosenActs.length) {
      L.push("");
      L.push(`✨ ATIVIDADES ESCOLHIDAS (${chosenActs.length})`);
      chosenActs.forEach((a) => {
        L.push(`  • [${a.city}] ${a.name} — ${a.hours}h · ${a.costBRL > 0 ? formatBRL(a.costBRL) : "grátis"} · match: ${MATCH_STYLE[a.match].label}`);
        if (a.tickets?.where) L.push(`     🎫 ${a.tickets.where}`);
      });
    }
    L.push("");
    L.push(`⏳ PENDÊNCIAS (${pendingCount})`);
    OPEN_DECISIONS.forEach((d) => L.push(`  • ${d.label}`));
    L.push("");
    L.push(`☑️ CHECKLIST: ${done.size}/${CHECKLIST.length} feitos`);
    CHECKLIST.filter((c) => !done.has(c.id)).forEach((c) => L.push(`  ☐ ${c.label}`));
    L.push("");
    L.push(`Gerado em ${new Date().toLocaleString("pt-BR")} · VoaJá`);
    return L.join("\n");
  };

  return (
    <div className="mx-auto min-h-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
      <Hero daysLeft={daysLeft} onPdf={onPdf} />

      <div className="anim-stagger mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Faltam" value={`${daysLeft} dias`} sub={TRIP.arriveLabel.split(",")[0]} highlight />
        <Stat label="Duração" value={`${TRIP.days} dias`} sub={`${TRIP.nights} noites · ${TRIP.people} pessoas`} />
        <Stat label="Atividades escolhidas" value={extras.size} sub={`de ${ACTIVITIES.length} no catálogo`} />
        <Stat label="Pendências" value={pendingCount} sub={`+ ${checklistLeft} do checklist`} bad={pendingCount > 0} />
      </div>

      <AirportWarning />

      <nav className="sticky-tabs no-print mt-5">
        <div className="card tab-strip flex gap-1.5 p-2">
          {TABS.map((t) => {
            const Icon = t.icon;
            const on = tab === t.id;
            const badge =
              t.id === "passeios" ? extras.size : t.id === "pratico" ? checklistLeft : 0;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`filter-pill inline-flex flex-none items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold ${
                  on
                    ? "bg-rose-500/25 text-rose-50 ring-1 ring-inset ring-rose-400/50"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={14} /> {t.label}
                {badge > 0 && (
                  <span className="rounded-full bg-rose-500/40 px-1.5 text-[10px] font-bold">{badge}</span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      <main className="anim-in mt-4 space-y-5">
        {tab === "geral" && (
          <Overview
            daysLeft={daysLeft}
            tokyoVariant={tokyoVariant}
            chosenActs={chosenActs}
            done={done}
            onGo={setTab}
          />
        )}
        {tab === "roteiro" && (
          <Itinerary
            tokyoVariant={tokyoVariant}
            setTokyoVariant={setTokyoVariant}
            chosenActs={chosenActs}
          />
        )}
        {tab === "passeios" && (
          <ActivityCatalog chosen={extras} onToggle={toggleExtra} />
        )}
        {tab === "mapa" && (
          <JapanMap selectedIds={poiIds} onToggle={togglePoi} bases={mapBases} />
        )}
        {tab === "hospedagem" && <Lodging />}
        {tab === "transporte" && <Transport />}
        {tab === "perfis" && <Profiles />}
        {tab === "pratico" && <Practical done={done} onToggle={toggleDone} />}
        {tab === "plano" && (
          <PlanTab
            chosenActs={chosenActs}
            chosenPois={chosenPois}
            tokyoVariant={tokyoVariant}
            done={done}
            buildJSON={buildJSON}
            buildText={buildText}
            onPdf={onPdf}
          />
        )}
      </main>

      <footer className="mt-10 border-t border-white/10 pt-5 text-xs text-slate-400">
        Source of truth da viagem. Voos e hotéis de Tóquio e Narita estão confirmados; Kyoto e
        Osaka seguem em aberto. Valores em iene são estimativas ao câmbio de referência
        (1 BRL ≈ ¥30,7) e mudam com a data — conferir antes de reservar.
      </footer>
    </div>
  );
}

function Hero({ daysLeft, onPdf }) {
  return (
    <header className="anim-in card relative min-h-[17rem] overflow-hidden sm:min-h-[18rem]">
      {HERO_IMAGES.map((img, i) => (
        <img
          key={img.url}
          src={img.url}
          alt={img.alt}
          loading={i === 0 ? "eager" : "lazy"}
          className="hero-img"
          style={{ animationDelay: `${i * 6}s` }}
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-[#070a1a] via-[#070a1a]/60 to-[#070a1a]/15" />

      <div className="relative flex h-full flex-col justify-between gap-4 p-5 sm:p-6">
        <div className="flex items-center justify-end gap-2 no-print">
          <button type="button" className="btn-ghost backdrop-blur-md" onClick={onPdf}>
            <FileDown size={14} /> Exportar PDF
          </button>

        </div>

        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-rose-300/90">
              Pedro &amp; Gio · faltam {daysLeft} dias
            </div>
            <h1 className="mt-1 text-4xl font-extrabold sm:text-5xl" style={{ letterSpacing: "-0.035em" }}>
              <span className="gradient-text">Japão</span>{" "}
              <span className="text-white">2026</span>
            </h1>
            <p className="mt-1.5 text-xs text-slate-300/90 sm:text-sm">
              09/dez → 22/dez
              <span className="mx-1.5 text-slate-500">·</span>
              14 dias
              <span className="mx-1.5 text-slate-500">·</span>
              Tóquio 5n + Kyoto 3n + Osaka 4n + Narita 1n
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <span className="chip backdrop-blur-md">✈️ voos confirmados</span>
            <span className="chip backdrop-blur-md">🏨 2 de 4 hotéis</span>
            <span className="chip backdrop-blur-md">🗺️ {JAPAN_POIS.length} lugares</span>
          </div>
        </div>
      </div>
    </header>
  );
}

function AirportWarning() {
  return (
    <div className="anim-in mt-3 flex items-start gap-3 rounded-2xl border border-amber-400/35 bg-amber-500/10 p-4">
      <AlertTriangle size={18} className="mt-0.5 flex-none text-amber-300" />
      <div className="text-sm text-amber-50">
        <span className="font-bold">Ponto crítico de logística:</span> {TRIP.airportWarning}
      </div>
    </div>
  );
}

function Stat({ label, value, sub, highlight, bad }) {
  return (
    <div
      className={`card p-4 ${
        highlight ? "ring-1 ring-inset ring-rose-400/40" : bad ? "ring-1 ring-inset ring-amber-400/40" : ""
      }`}
    >
      <div className="text-[11px] uppercase tracking-wider text-slate-400">{label}</div>
      <div className={`mt-1 truncate text-lg font-bold ${bad ? "text-amber-200" : "text-white"}`}>{value}</div>
      {sub && <div className="truncate text-[11px] text-slate-400">{sub}</div>}
    </div>
  );
}

function SectionTitle({ icon: Icon, children, sub }) {
  return (
    <div className="mb-3">
      <h3 className="text-base font-bold text-white">
        {Icon && <Icon size={16} className="mr-1.5 inline -mt-1 text-rose-300" />}
        {children}
      </h3>
      {sub && <p className="mt-0.5 text-xs text-slate-400">{sub}</p>}
    </div>
  );
}

function MatchBadge({ match, level }) {
  const m = MATCH_STYLE[match];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ring-inset ${m.cls}`}>
      {m.emoji} {m.label}
      {level && <span className="font-normal opacity-70">· {LEVEL_LABEL[level]}</span>}
    </span>
  );
}

// ==================== VISÃO GERAL ====================
function Overview({ daysLeft, tokyoVariant, chosenActs, done, onGo }) {
  const confirmed = STAYS.filter((s) => s.status === "confirmada");
  const pendingStays = STAYS.filter((s) => s.status === "pendente");
  const paid = BUDGET_LINES.filter((b) => b.status === "pago").reduce((s, b) => s + (b.brl || 0), 0);
  const estimated = BUDGET_LINES.filter((b) => b.status === "estimado")
    .reduce((s, b) => s + (b.perPerson ? (b.brl || 0) * TRIP.people : b.brl || 0), 0);

  return (
    <section className="space-y-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <SectionTitle icon={Plane} sub="Dados fixos, já confirmados">Voos</SectionTitle>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="badge-ok">IDA</span>
              <span className="text-slate-100">{TRIP.arriveLabel}</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="badge-ok">VOLTA</span>
              <span className="text-slate-100">{TRIP.departLabel}</span>
            </li>
          </ul>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {CITY_BLOCKS.map((c) => (
              <div key={c.id} className="rounded-xl border border-white/10 bg-white/[0.04] p-3 text-center">
                <div className="text-xl">{c.emoji}</div>
                <div className="mt-0.5 text-xs font-bold text-white">{c.label}</div>
                <div className="text-lg font-extrabold text-white">{c.nights}n</div>
                <div className="text-[10px] text-slate-400">{c.range}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <SectionTitle icon={Wallet} sub="Estimativa consolidada">Orçamento</SectionTitle>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-300">Já pago (hotéis)</span>
              <span className="font-bold text-emerald-300">{formatBRL(paid)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Estimado (2 pessoas)</span>
              <span className="font-bold text-white">{formatBRL(estimated)}</span>
            </div>
            <div className="flex justify-between border-t border-white/10 pt-2">
              <span className="text-slate-300">Hotéis Kyoto + Osaka</span>
              <span className="font-bold text-amber-300">em aberto</span>
            </div>
          </div>
          <button type="button" className="btn-ghost mt-3 w-full no-print" onClick={() => onGo("plano")}>
            Ver detalhamento
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <SectionTitle icon={AlertTriangle} sub={`${OPEN_DECISIONS.length} decisões ainda em aberto`}>
            Pendências
          </SectionTitle>
          <ul className="space-y-2">
            {OPEN_DECISIONS.map((d) => (
              <li key={d.id} className="flex items-start gap-2 text-xs">
                <span
                  className={`mt-0.5 h-2 w-2 flex-none rounded-full ${
                    d.severity === "alta" ? "bg-rose-400" : d.severity === "media" ? "bg-amber-400" : "bg-slate-500"
                  }`}
                />
                <div>
                  <div className="font-semibold text-slate-100">{d.label}</div>
                  <div className="text-slate-400">{d.detail}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <SectionTitle icon={CheckCircle2} sub="Não precisa mais discutir">Decisões fechadas</SectionTitle>
            <ul className="space-y-1.5 text-xs text-slate-200">
              {SETTLED.map((s, i) => (
                <li key={i} className="flex gap-2">
                  <Check size={13} className="mt-0.5 flex-none text-emerald-400" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-5">
            <SectionTitle icon={Sparkles}>Estado atual do plano</SectionTitle>
            <ul className="space-y-1.5 text-xs text-slate-200">
              <li>🗼 Tóquio na versão <strong>{TOKYO_VARIANTS[tokyoVariant].label}</strong></li>
              <li>✨ {chosenActs.length} passeio(s) extra(s) escolhido(s)</li>
              <li>🏨 {confirmed.length} hotéis confirmados, {pendingStays.length} a reservar</li>
              <li>☑️ {done.size}/{CHECKLIST.length} itens do checklist feitos</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// ==================== ROTEIRO ====================
function Itinerary({ tokyoVariant, setTokyoVariant, chosenActs }) {
  const variant = TOKYO_VARIANTS[tokyoVariant];
  const extrasByCity = (city) => chosenActs.filter((e) => e.city === city);

  return (
    <section className="space-y-5">
      {/* TÓQUIO */}
      <div className="card p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <SectionTitle sub="Chegada dia 9 ao meio-dia (recuperação), 4 dias cheios, saída dia 14 de manhã">
            🗼 Tóquio · 09–14/12
          </SectionTitle>
          <div className="inline-flex rounded-xl border border-white/10 bg-white/5 p-1 text-xs no-print">
            {Object.values(TOKYO_VARIANTS).map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setTokyoVariant(v.id)}
                className={`filter-pill rounded-lg px-3 py-1.5 font-semibold ${
                  tokyoVariant === v.id
                    ? "bg-rose-500/30 text-rose-50 ring-1 ring-inset ring-rose-400/40"
                    : "text-slate-300"
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        <ol className="mt-3 space-y-2">
          {variant.days.map((d, i) => (
            <li key={i} className={`rounded-xl border p-3 ${d.fullDay ? "border-rose-400/40 bg-rose-500/10" : "border-white/10 bg-white/[0.03]"}`}>
              <div className="text-xs font-bold text-white">{d.date}</div>
              <div className="mt-1 grid gap-1 text-xs text-slate-200 sm:grid-cols-3">
                {d.morning && <div><span className="text-slate-500">Manhã ·</span> {d.morning}</div>}
                {d.afternoon && <div><span className="text-slate-500">Tarde ·</span> {d.afternoon}</div>}
                {d.night && <div><span className="text-slate-500">Noite ·</span> {d.night}</div>}
              </div>
            </li>
          ))}
        </ol>

        {variant.cost && (
          <div className="mt-3 rounded-lg bg-amber-500/10 p-3 text-xs text-amber-100 ring-1 ring-inset ring-amber-400/20">
            ⚠️ <span className="font-semibold">Custo real dessa opção:</span> {variant.cost}
          </div>
        )}
        <ExtrasInline list={extrasByCity("toquio")} />
      </div>

      {/* KYOTO */}
      <DayBlock title="🎎 Kyoto · 14–17/12" days={KYOTO_DAYS} extras={extrasByCity("kyoto")} />

      {/* OSAKA */}
      <DayBlock title="🐙 Osaka · 17–21/12" days={OSAKA_DAYS} extras={extrasByCity("osaka")} />
    </section>
  );
}

function DayBlock({ title, days, extras }) {
  return (
    <div className="card p-5">
      <SectionTitle>{title}</SectionTitle>
      <ol className="space-y-3">
        {days.map((d, i) => (
          <li key={i} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-xs font-bold text-white">{d.date}</span>
              <span className="text-xs text-rose-200">{d.title}</span>
            </div>
            <ul className="mt-2 space-y-1.5">
              {d.slots.map((sl, j) => (
                <li key={j} className="flex gap-2 text-xs">
                  <span className="w-14 flex-none font-mono text-slate-400">{sl.time}</span>
                  <span className={sl.split ? "text-indigo-100" : "text-slate-200"}>
                    {sl.what}
                    {sl.split && (
                      <span className="ml-1.5 rounded bg-indigo-500/25 px-1.5 py-0.5 text-[9px] font-bold text-indigo-200">
                        SPLIT
                      </span>
                    )}
                    {sl.booking && (
                      <span className="ml-1.5 rounded bg-amber-500/25 px-1.5 py-0.5 text-[9px] font-bold text-amber-200">
                        RESERVAR
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
      <ExtrasInline list={extras} />
    </div>
  );
}

function ExtrasInline({ list }) {
  if (!list.length) return null;
  return (
    <div className="mt-3 rounded-xl border border-emerald-400/25 bg-emerald-500/[0.07] p-3">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-300">
        + {list.length} extra(s) que vocês escolheram
      </div>
      <ul className="mt-1.5 space-y-1 text-xs text-emerald-50">
        {list.map((a) => (
          <li key={a.id} className="flex flex-wrap items-center gap-2">
            <span className="font-semibold">{a.name}</span>
            <span className="text-emerald-200/70">{a.hours}h</span>
            <span className="text-emerald-200/70">
              {a.costBRL > 0 ? formatBRL(a.costBRL) : "grátis"}
            </span>
            <MatchBadge match={a.match} />
            {a.swapFor && (
              <span className="w-full text-[10px] text-emerald-200/60">↔ {a.swapFor}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ==================== HOSPEDAGEM ====================
function Lodging() {
  return (
    <section className="anim-stagger space-y-4">
      {STAYS.map((s) => {
        const ok = s.status === "confirmada";
        return (
          <div key={s.id} className={`card p-5 ${ok ? "" : "border-amber-400/30"}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-bold text-white">{s.name}</h3>
                  {ok ? (
                    <span className="badge-ok">✅ Confirmada</span>
                  ) : (
                    <span className="badge-warn">⏳ A reservar</span>
                  )}
                </div>
                <div className="mt-1 text-xs text-slate-400">
                  {s.checkIn} → {s.checkOut} · {s.nights} noite{s.nights > 1 ? "s" : ""}
                  {s.room && <> · {s.room}</>}
                </div>
              </div>
              <div className="text-right">
                {s.totalBRL ? (
                  <>
                    <div className="text-lg font-bold text-white">{formatBRL(s.totalBRL)}</div>
                    {s.perNightBRL && <div className="text-[11px] text-slate-400">~{formatBRL(s.perNightBRL)}/noite</div>}
                    {s.totalYen && <div className="text-[11px] text-slate-400">¥{s.totalYen.toLocaleString("ja-JP")}</div>}
                  </>
                ) : (
                  <div className="text-sm font-bold text-amber-300">em aberto</div>
                )}
              </div>
            </div>

            {s.plan && (
              <div className="mt-2 rounded-lg bg-white/[0.04] p-2.5 text-xs text-slate-200">
                <strong>Plano:</strong> {s.plan}
              </div>
            )}
            <div className="mt-2 text-xs text-slate-300">📍 {s.area}</div>
            {s.cancel && <div className="mt-1 text-xs text-slate-400">🔄 {s.cancel}</div>}
            {s.notes?.length > 0 && (
              <ul className="mt-2 space-y-1 text-xs text-amber-100/90">
                {s.notes.map((n, i) => (
                  <li key={i}>⚠️ {n}</li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </section>
  );
}

// ==================== TRANSPORTE ====================
function Transport() {
  return (
    <section className="space-y-4">
      <div className="card p-5">
        <SectionTitle icon={Train} sub="Custos aproximados por pessoa, só ida">Trechos entre cidades</SectionTitle>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/10 text-left text-slate-400">
                <th className="pb-2 pr-3 font-semibold">Trecho</th>
                <th className="pb-2 pr-3 font-semibold">Meio</th>
                <th className="pb-2 pr-3 font-semibold">Duração</th>
                <th className="pb-2 text-right font-semibold">Custo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {LOGISTICS.map((l, i) => (
                <tr key={i}>
                  <td className="py-2 pr-3 font-semibold text-slate-100">
                    {l.from} → {l.to}
                  </td>
                  <td className="py-2 pr-3 text-slate-300">{l.mode}</td>
                  <td className="py-2 pr-3 text-slate-400">{l.time}</td>
                  <td className="py-2 text-right font-semibold text-white">{l.yen}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {LOGISTICS_NOTES.map((n) => (
        <div key={n.title} className="card p-5">
          <h4 className="text-sm font-bold text-white">{n.title}</h4>
          <p className="mt-1.5 text-xs text-slate-300">{n.body}</p>
        </div>
      ))}
    </section>
  );
}

// ==================== PERFIS ====================
function Profiles() {
  const convColor = {
    alta: "text-emerald-300",
    media: "text-slate-300",
    baixa: "text-slate-400",
    divergente: "text-amber-300",
    conflito: "text-rose-300",
  };

  return (
    <section className="space-y-4">
      <div className="card p-5">
        <SectionTitle icon={Users} sub="Questionário respondido separadamente pelos dois, sem consulta prévia. 1 = mais quer, 8 = menos quer.">
          Ranking de prioridades
        </SectionTitle>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/10 text-left text-slate-400">
                <th className="pb-2 pr-3 font-semibold">Categoria</th>
                <th className="pb-2 px-2 text-center font-semibold">🧑 Pedro</th>
                <th className="pb-2 px-2 text-center font-semibold">👩 Gio</th>
                <th className="pb-2 pl-3 font-semibold">Convergência</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {PREFERENCES.map((p) => (
                <tr key={p.cat}>
                  <td className="py-2 pr-3 font-semibold text-slate-100">{p.cat}</td>
                  <td className="py-2 px-2 text-center">
                    <RankPill n={p.pedro} color="#6366f1" />
                  </td>
                  <td className="py-2 px-2 text-center">
                    <RankPill n={p.gio} color="#f43f5e" />
                  </td>
                  <td className={`py-2 pl-3 ${convColor[p.convergence]}`}>
                    {p.note || p.convergence}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 rounded-lg bg-white/[0.04] p-3">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Ritmo</div>
          <ul className="mt-1 space-y-0.5 text-xs text-slate-200">
            {PACE.map((p, i) => <li key={i}>• {p}</li>)}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {PERSON_PROFILES.map((p) => (
          <div key={p.id} className="card p-5" style={{ borderColor: p.color + "44" }}>
            <h4 className="text-base font-bold text-white">{p.emoji} {p.name}</h4>
            <div className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Quer fazer</div>
            <ul className="mt-1 space-y-0.5 text-xs text-slate-200">
              {p.wants.map((w, i) => <li key={i}>✓ {w}</li>)}
            </ul>
            <div className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Cortaria sem dó</div>
            <div className="text-xs text-slate-300">{p.cuts.join(", ")}</div>
            <div className="mt-3 rounded-lg bg-rose-500/10 p-2.5 text-xs text-rose-100 ring-1 ring-inset ring-rose-400/20">
              <strong>Não quer:</strong> {p.veto}
            </div>
          </div>
        ))}
      </div>

      <div className="card p-5">
        <SectionTitle icon={Sparkles}>Conflitos e como foram resolvidos</SectionTitle>
        <ul className="space-y-2.5">
          {CONFLICTS.map((c, i) => (
            <li key={i} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <div className="flex items-start gap-2">
                <span className={c.status === "aberto" ? "text-amber-300" : "text-emerald-300"}>
                  {c.status === "aberto" ? "⏳" : "✅"}
                </span>
                <div>
                  <div className="text-xs font-semibold text-slate-100">{c.conflict}</div>
                  <div className="mt-1 text-xs text-slate-300">→ {c.resolution}</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function RankPill({ n, color }) {
  const strong = n <= 3;
  return (
    <span
      className="inline-grid h-6 w-6 place-items-center rounded-lg text-[11px] font-bold"
      style={{
        background: strong ? color + "33" : "rgba(255,255,255,0.05)",
        color: strong ? "#fff" : "#94a3b8",
        border: `1px solid ${strong ? color + "66" : "rgba(255,255,255,0.08)"}`,
      }}
    >
      {n}
    </span>
  );
}

// ==================== PRÁTICO ====================
function Practical({ done, onToggle }) {
  return (
    <section className="space-y-4">
      <div className="card p-5">
        <SectionTitle icon={PackageCheck} sub={`${done.size} de ${CHECKLIST.length} feitos`}>
          Checklist pré-viagem
        </SectionTitle>
        <ul className="space-y-1.5">
          {CHECKLIST.map((c) => {
            const ok = done.has(c.id);
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => onToggle(c.id)}
                  className={`filter-pill flex w-full items-center gap-2.5 rounded-xl border p-3 text-left text-xs ${
                    ok
                      ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-100"
                      : "border-white/10 bg-white/[0.03] text-slate-200"
                  }`}
                >
                  <span
                    className={`grid h-5 w-5 flex-none place-items-center rounded-md border ${
                      ok ? "border-emerald-400/60 bg-emerald-500/30" : "border-white/20"
                    }`}
                  >
                    {ok && <Check size={12} className="text-emerald-200" />}
                  </span>
                  <span className={ok ? "line-through opacity-70" : ""}>{c.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="anim-stagger grid grid-cols-1 gap-3 lg:grid-cols-2">
        {PRACTICAL.map((p) => (
          <div key={p.id} className="card card-hover p-4">
            <h4 className="text-sm font-bold text-white">{p.emoji} {p.title}</h4>
            <p className="mt-1 text-xs text-slate-300">{p.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ==================== MEU PLANO ====================
function PlanTab({ chosenActs, chosenPois, tokyoVariant, done, buildJSON, buildText, onPdf }) {
  const [copied, setCopied] = useState(null);

  const onDownloadJSON = () =>
    downloadTextFile("roteiro-japao-pedro-gio.json", JSON.stringify(buildJSON(), null, 2));
  const onCopy = async (kind) => {
    const ok = await copyToClipboard(kind === "json" ? JSON.stringify(buildJSON(), null, 2) : buildText());
    if (ok) {
      setCopied(kind);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  const paid = BUDGET_LINES.filter((b) => b.status === "pago").reduce((s, b) => s + (b.brl || 0), 0);

  return (
    <section className="space-y-4">
      <div className="card flex flex-wrap items-center justify-between gap-3 p-5">
        <SectionTitle icon={PackageCheck} sub="Roteiro completo + suas escolhas, prontos para enviar ou virar app">
          Exportar o roteiro
        </SectionTitle>
        <div className="flex flex-wrap gap-2 no-print">
          <button type="button" className="btn-primary" onClick={onDownloadJSON}>
            <FileJson size={14} /> Baixar .json
          </button>
          <button type="button" className="btn-ghost" onClick={() => onCopy("json")}>
            <ClipboardCopy size={14} /> {copied === "json" ? "Copiado!" : "Copiar JSON"}
          </button>
          <button type="button" className="btn-ghost" onClick={() => onCopy("texto")}>
            <ClipboardCopy size={14} /> {copied === "texto" ? "Copiado!" : "Resumo p/ WhatsApp"}
          </button>
          <button type="button" className="btn-ghost" onClick={onPdf}>
            <FileDown size={14} /> PDF
          </button>
        </div>
      </div>

      <div className="card p-5">
        <SectionTitle icon={Wallet} sub="Valores em iene são estimativas — conferir antes de reservar">
          Orçamento consolidado
        </SectionTitle>
        <ul className="divide-y divide-white/5 text-xs">
          {BUDGET_LINES.map((b) => (
            <li key={b.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
              <div className="min-w-0">
                <div className="font-semibold text-slate-100">{b.label}</div>
                {b.sub && <div className="text-[10px] text-slate-400">{b.sub}</div>}
              </div>
              <div className="flex items-center gap-2">
                {b.status === "pago" && <span className="badge-ok">pago</span>}
                {b.status === "aberto" && <span className="badge-warn">em aberto</span>}
                {b.status === "opcional" && (
                  <span className="rounded-full bg-slate-500/20 px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                    opcional
                  </span>
                )}
                <span className="w-24 text-right font-bold text-white">
                  {b.brl ? formatBRL(b.brl) : "—"}
                </span>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between border-t border-white/10 pt-3 text-sm">
          <span className="font-semibold text-slate-200">Já pago em hospedagem</span>
          <span className="text-lg font-bold text-emerald-300">{formatBRL(paid)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <SectionTitle sub={`Versão de Tóquio: ${TOKYO_VARIANTS[tokyoVariant].label}`}>
            ✨ Passeios extras escolhidos ({chosenActs.length})
          </SectionTitle>
          {chosenActs.length === 0 ? (
            <p className="text-xs text-slate-400">
              Nenhum ainda — vá em "Escolher passeios" e marque o que entra.
            </p>
          ) : (
            <ul className="space-y-1.5 text-xs">
              {chosenActs.map((e) => (
                <li key={e.id} className="flex flex-wrap items-center gap-2">
                  <Check size={12} className="flex-none text-emerald-300" />
                  <span className="font-semibold text-slate-100">{e.name}</span>
                  <span className="text-slate-400">{e.duration}</span>
                  <MatchBadge match={e.match} />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card p-5">
          <SectionTitle sub="Marcados por vocês no mapa">
            📍 Lugares salvos ({chosenPois.length})
          </SectionTitle>
          {chosenPois.length === 0 ? (
            <p className="text-xs text-slate-400">Nenhum ainda — abra o Mapa e toque em "+ Adicionar ao plano".</p>
          ) : (
            <ul className="space-y-1 text-xs">
              {chosenPois.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-2">
                  <span className="truncate text-slate-100">{p.name}</span>
                  <span className="flex-none font-semibold text-white">
                    {p.costBRL > 0 ? formatBRL(p.costBRL) : "Grátis"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="card p-5">
        <SectionTitle sub={`${done.size}/${CHECKLIST.length} concluídos`}>☑️ Status do checklist</SectionTitle>
        <ul className="grid grid-cols-1 gap-1 text-xs sm:grid-cols-2">
          {CHECKLIST.map((c) => (
            <li key={c.id} className={done.has(c.id) ? "text-emerald-300 line-through opacity-70" : "text-slate-300"}>
              {done.has(c.id) ? "✅" : "☐"} {c.label}
            </li>
          ))}
        </ul>
      </div>

      <details className="card p-5">
        <summary className="cursor-pointer text-sm font-bold text-white">
          <FileJson size={14} className="mr-1.5 inline -mt-0.5 text-cyan-300" />
          Prévia do JSON (schema voaja.japan-trip/v4)
        </summary>
        <pre className="mt-3 max-h-80 overflow-auto rounded-xl border border-white/10 bg-black/40 p-4 text-[11px] leading-relaxed text-cyan-100">
          {JSON.stringify(buildJSON(), null, 2)}
        </pre>
      </details>
    </section>
  );
}

// ==================== CATÁLOGO DE ATIVIDADES ====================
const CITY_TABS = [
  { id: "todas", label: "Todas", emoji: "🌏" },
  { id: "toquio", label: "Tóquio", emoji: "🗼" },
  { id: "kyoto", label: "Kyoto", emoji: "🎎" },
  { id: "osaka", label: "Osaka", emoji: "🐙" },
];
const MATCH_TABS = [
  { id: "todos", label: "Todos" },
  { id: "pedro", label: "🧑 Pedro" },
  { id: "gio", label: "👩 Gio" },
  { id: "ambos", label: "👥 Os dois" },
];

function ActivityCatalog({ chosen, onToggle }) {
  const [city, setCity] = useState("todas");
  const [cat, setCat] = useState("todas");
  const [match, setMatch] = useState("todos");
  const [hideInBase, setHideInBase] = useState(true);
  const [openId, setOpenId] = useState(null);
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    return ACTIVITIES.filter((a) => {
      if (city !== "todas" && a.city !== city) return false;
      if (cat !== "todas" && a.cat !== cat) return false;
      if (match !== "todos" && a.match !== match) return false;
      if (hideInBase && a.inBase && !chosen.has(a.id)) return false;
      if (term && !`${a.name} ${a.what} ${a.area}`.toLowerCase().includes(term)) return false;
      return true;
    }).sort((a, b) => {
      const w = (x) => (x.priority ? 0 : x.level === "alto" ? 1 : x.level === "medio" ? 2 : 3);
      return w(a) - w(b);
    });
  }, [city, cat, match, hideInBase, q, chosen]);

  const chosenList = ACTIVITIES.filter((a) => chosen.has(a.id));
  const totalHours = chosenList.reduce((s, a) => s + a.hours, 0);
  const totalCost = chosenList.reduce((s, a) => s + (a.costBRL || 0), 0) * 2;
  const priority = ACTIVITIES.filter((a) => a.priority);

  return (
    <section className="space-y-4">
      {/* Filtros */}
      <div className="card panel-accent p-5">
        <SectionTitle icon={Compass} sub={`${ACTIVITIES.length} atividades com ingresso, melhor horário, o que dizem e o que muda em dezembro. Clique para abrir os detalhes; marque para entrar no roteiro.`}>
          Explorar e montar o roteiro
        </SectionTitle>

        <div className="mt-3 space-y-2">
          <div className="flex flex-wrap gap-1.5">
            {CITY_TABS.map((c) => (
              <button key={c.id} type="button" onClick={() => setCity(c.id)}
                className={`filter-pill rounded-xl border px-3 py-1.5 text-xs font-semibold ${
                  city === c.id ? "border-sky-400/60 bg-sky-500/25 text-sky-50" : "border-white/10 bg-white/5 text-slate-300"
                }`}>
                {c.emoji} {c.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button type="button" onClick={() => setCat("todas")}
              className={`filter-pill rounded-xl border px-3 py-1.5 text-xs font-semibold ${
                cat === "todas" ? "border-white/25 bg-white/15 text-white" : "border-white/10 bg-white/5 text-slate-300"
              }`}>Tudo</button>
            {ACT_CATEGORIES.map((c) => (
              <button key={c.id} type="button" onClick={() => setCat(c.id)}
                className={`filter-pill rounded-xl border px-3 py-1.5 text-xs font-semibold ${
                  cat === c.id ? "border-white/25 bg-white/15 text-white" : "border-white/10 bg-white/5 text-slate-300"
                }`}
                style={cat === c.id ? { borderColor: c.color + "88", background: c.color + "26" } : undefined}>
                {c.emoji} {c.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex flex-wrap gap-1.5">
              {MATCH_TABS.map((m) => (
                <button key={m.id} type="button" onClick={() => setMatch(m.id)}
                  className={`filter-pill rounded-xl border px-3 py-1.5 text-xs font-semibold ${
                    match === m.id ? "border-white/25 bg-white/15 text-white" : "border-white/10 bg-white/5 text-slate-300"
                  }`}>{m.label}</button>
              ))}
            </div>
            <input type="text" value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="buscar: matcha, onsen, vista…"
              className="input min-w-[160px] flex-1" />
            <button type="button" onClick={() => setHideInBase((v) => !v)}
              className={`filter-pill rounded-xl border px-3 py-1.5 text-xs font-semibold ${
                hideInBase ? "border-white/10 bg-white/5 text-slate-300" : "border-emerald-400/50 bg-emerald-500/20 text-emerald-100"
              }`}>
              {hideInBase ? "mostrar o que já está no roteiro" : "ocultar o que já está no roteiro"}
            </button>
          </div>
        </div>
      </div>

      {/* Contador do que foi escolhido */}
      {chosenList.length > 0 && (
        <div className="card flex flex-wrap items-center justify-between gap-3 border-emerald-400/30 bg-emerald-500/[0.07] p-4">
          <div className="text-sm text-emerald-50">
            <span className="font-bold">{chosenList.length} atividade(s)</span> no plano ·{" "}
            <span className="font-bold">{totalHours.toFixed(1)}h</span> somadas ·{" "}
            <span className="font-bold">{formatBRL(totalCost)}</span> em ingressos (2 pessoas)
          </div>
          <div className="flex flex-wrap gap-1.5">
            {chosenList.map((a) => (
              <button key={a.id} type="button" onClick={() => onToggle(a.id)}
                className="filter-pill rounded-lg bg-emerald-500/20 px-2 py-1 text-[10px] font-bold text-emerald-100 no-print">
                {a.name} ✕
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Pedidos esquecidos */}
      <div className="card border-amber-400/30 bg-amber-500/[0.07] p-5">
        <SectionTitle icon={AlertTriangle} sub="Apareceram só ao montar o documento com calma">
          Pedidos que ficaram sem lugar no roteiro
        </SectionTitle>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {priority.map((a) => (
            <ActivityCard key={a.id} a={a} chosen={chosen.has(a.id)} onToggle={onToggle}
              open={openId === a.id} onOpen={() => setOpenId(openId === a.id ? null : a.id)} />
          ))}
        </div>
      </div>

      <div className="text-sm text-slate-300">
        <span className="font-bold text-white">{list.length}</span> atividades
        {hideInBase && <span className="text-slate-500"> · itens do roteiro-base ocultos</span>}
      </div>

      <div className="anim-stagger grid grid-cols-1 gap-3 lg:grid-cols-2">
        {list.map((a) => (
          <ActivityCard key={a.id} a={a} chosen={chosen.has(a.id)} onToggle={onToggle}
            open={openId === a.id} onOpen={() => setOpenId(openId === a.id ? null : a.id)} />
        ))}
      </div>

      {/* Bate-voltas */}
      <div className="card p-5">
        <SectionTitle icon={Train} sub="A partir de Kyoto e Osaka — tempo de trem, custo e quanto do dia consome">
          🚄 Bate-voltas possíveis
        </SectionTitle>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/10 text-left text-slate-400">
                <th className="pb-2 pr-3 font-semibold">Destino</th>
                <th className="pb-2 pr-3 font-semibold">Saindo de</th>
                <th className="pb-2 pr-3 font-semibold">Trem</th>
                <th className="pb-2 pr-3 font-semibold">Custo</th>
                <th className="pb-2 pr-3 font-semibold">Consome</th>
                <th className="pb-2 font-semibold">Por quê</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {DAY_TRIPS.map((d) => (
                <tr key={d.id} className={d.heavy ? "opacity-60" : ""}>
                  <td className="py-2 pr-3 font-bold text-white">
                    {d.name}
                    {d.inBase && <span className="ml-1.5 rounded bg-emerald-500/25 px-1 text-[9px] text-emerald-200">no roteiro</span>}
                    {d.priority && <span className="ml-1.5 rounded bg-amber-500/25 px-1 text-[9px] text-amber-200">pedido</span>}
                    {d.cutByBoth && <span className="ml-1.5 rounded bg-slate-500/25 px-1 text-[9px] text-slate-300">cortado</span>}
                  </td>
                  <td className="py-2 pr-3 text-slate-300">{d.from}</td>
                  <td className="py-2 pr-3 text-slate-400">{d.mode} · {d.time}</td>
                  <td className="py-2 pr-3 text-slate-300">{d.cost}</td>
                  <td className="py-2 pr-3 font-semibold text-white">{d.hours >= 24 ? "pernoite" : `${d.hours}h`}</td>
                  <td className="py-2 text-slate-300">{d.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function ActivityCard({ a, chosen, onToggle, open, onOpen }) {
  const cat = ACT_CATEGORIES.find((c) => c.id === a.cat);
  const eff = EFFORT[a.effort];
  return (
    <div className={`card p-4 ${chosen ? "ring-2 ring-emerald-400/50" : ""}`}>
      <div className="flex items-start justify-between gap-2">
        <button type="button" onClick={onOpen} className="min-w-0 flex-1 text-left">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-sm font-bold text-white">{a.name}</span>
            {chosen && <Check size={14} className="flex-none text-emerald-300" />}
            {a.inBase && <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-bold text-emerald-200">JÁ NO ROTEIRO</span>}
            {a.priority && <span className="rounded bg-amber-500/25 px-1.5 py-0.5 text-[9px] font-bold text-amber-200">PEDIDO ESQUECIDO</span>}
            {a.cutByBoth && <span className="rounded bg-slate-500/25 px-1.5 py-0.5 text-[9px] font-bold text-slate-300">CORTADO POR AMBOS</span>}
            {a.solo && <span className="rounded bg-indigo-500/25 px-1.5 py-0.5 text-[9px] font-bold text-indigo-200">SOLO · {a.solo === "pedro" ? "PEDRO" : "GIO"}</span>}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10px] text-slate-400">
            <span className="rounded bg-white/10 px-1.5 py-0.5">{cat?.emoji} {cat?.label}</span>
            <span>📍 {a.area}</span>
            <span>⏱ {a.hours}h</span>
            <span className="font-semibold text-slate-200">
              {a.costBRL > 0 ? `${formatBRL(a.costBRL)}/pessoa` : "grátis"}
            </span>
            {a.rating && <span>⭐ {a.rating.toFixed(1)}</span>}
            {eff && <span style={{ color: eff.color }}>● {eff.label}</span>}
          </div>
          <p className="mt-2 text-xs text-slate-300">{a.what}</p>
        </button>
        <div className="flex flex-none flex-col items-end gap-1.5">
          <MatchBadge match={a.match} level={a.level} />
          <button type="button" onClick={() => onToggle(a.id)}
            className={`filter-pill rounded-lg px-2.5 py-1 text-[10px] font-bold no-print ${
              chosen ? "bg-rose-500/25 text-rose-200" : "bg-indigo-500/30 text-indigo-100"
            }`}>
            {chosen ? "✕ tirar" : "+ ao plano"}
          </button>
        </div>
      </div>

      <button type="button" onClick={onOpen}
        className="mt-2 text-[11px] font-semibold text-sky-300 no-print hover:text-sky-200">
        {open ? "▲ menos detalhes" : "▼ ingressos, horário, avaliações e dezembro"}
      </button>

      {open && (
        <div className="mt-3 space-y-2.5 border-t border-white/10 pt-3 text-xs">
          <Detail icon="🎫" title="Ingresso">
            <div><span className="text-slate-400">Onde:</span> {a.tickets.where}</div>
            <div><span className="text-slate-400">Quando compra:</span> {a.tickets.when}</div>
            <div><span className="text-slate-400">Esgota?</span> {a.tickets.sellsOut}</div>
            <div className="mt-1 rounded bg-amber-500/10 p-2 text-amber-100">💡 {a.tickets.tip}</div>
          </Detail>
          <Detail icon="🕐" title="Melhor horário">{a.bestTime}</Detail>
          <Detail icon="🎄" title="Em dezembro">{a.december}</Detail>
          <Detail icon="💬" title="O que as pessoas dizem">
            <ul className="space-y-0.5">
              {a.says.good.map((g, i) => <li key={`g${i}`} className="text-emerald-200">+ {g}</li>)}
              {a.says.bad.map((b, i) => <li key={`b${i}`} className="text-rose-200">− {b}</li>)}
            </ul>
          </Detail>
          {a.swapFor && <Detail icon="↔️" title="Impacto no roteiro">{a.swapFor}</Detail>}
          {a.spendBRL > 0 && (
            <Detail icon="💸" title="Gasto típico no local">
              ~{formatBRL(a.spendBRL)}/pessoa além da entrada (comida, compras)
            </Detail>
          )}
        </div>
      )}
    </div>
  );
}

function Detail({ icon, title, children }) {
  return (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {icon} {title}
      </div>
      <div className="mt-0.5 text-slate-200">{children}</div>
    </div>
  );
}
