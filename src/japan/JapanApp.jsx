import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle, BedDouble, CalendarDays, Check, ChevronDown, ChevronRight,
  ClipboardCopy, Compass, ExternalLink, FileDown, FileJson, HelpCircle, Home as HomeIcon,
  ListChecks, Map as MapIcon, PackageCheck, Plane, Plus, Scale, Search,
  SlidersHorizontal, Train, Users, Wallet, X,
} from "lucide-react";
import JapanMap from "./JapanMap.jsx";
import { JAPAN_POIS, POI_CATEGORIES } from "./japanData.js";
import { ACT_CATEGORIES, ACTIVITIES, DAY_TRIPS, EFFORT } from "./activities.js";
import { AGENCY_PACKAGES, COVERAGE, coverageCount } from "./agencyPackages.js";
import {
  BUDGET_LINES, CHECKLIST, CITY_BLOCKS, CONFLICTS, KYOTO_DAYS,
  LOGISTICS, LOGISTICS_NOTES, OPEN_DECISIONS, OSAKA_DAYS, PACE,
  PERSON_PROFILES, PRACTICAL, PREFERENCES, SETTLED, STAYS, TOKYO_VARIANTS,
  TRIP,
} from "./tripData.js";
import { copyToClipboard, downloadTextFile, formatBRL } from "../lib/format.js";

const STORAGE_KEY = "voaja:japan:v4";

/*
 * NAVEGAÇÃO — 5 seções fixas (cabem na tela do celular sem rolar).
 * As seções maiores têm sub-abas; a URL guarda as duas
 * (#/japao/passeios/mapa) para o link e o botão voltar funcionarem.
 */
const SECTIONS = [
  { id: "inicio", label: "Início", icon: HomeIcon },
  { id: "roteiro", label: "Roteiro", icon: CalendarDays,
    title: "Roteiro dia a dia",
    desc: "Os 14 dias da viagem em ordem. Toque num dia na faixa abaixo para ir direto a ele." },
  { id: "passeios", label: "Passeios", icon: Compass,
    title: "Passeios",
    desc: "Procure o que fazer e toque em “Adicionar” para colocar no plano.",
    subs: [
      { id: "catalogo", label: "Lista", icon: Compass },
      { id: "mapa", label: "Mapa", icon: MapIcon },
      { id: "pacotes", label: "Pacotes de agência", icon: Scale },
    ] },
  { id: "organizar", label: "Organizar", icon: ListChecks,
    title: "Organizar a viagem",
    desc: "O que falta resolver antes de embarcar, hotéis e deslocamentos.",
    subs: [
      { id: "checklist", label: "O que falta", icon: ListChecks },
      { id: "hoteis", label: "Hotéis", icon: BedDouble },
      { id: "transporte", label: "Transporte", icon: Train },
      { id: "dicas", label: "Dicas", icon: HelpCircle },
      { id: "perfis", label: "Quem quer o quê", icon: Users },
    ] },
  { id: "plano", label: "Meu plano", icon: PackageCheck,
    title: "Meu plano",
    desc: "Tudo o que vocês escolheram, o orçamento e como compartilhar." },
];

// Endereços antigos continuam funcionando (links já compartilhados).
const LEGACY = {
  geral: ["inicio"], pacotes: ["passeios", "pacotes"], mapa: ["passeios", "mapa"],
  hospedagem: ["organizar", "hoteis"], transporte: ["organizar", "transporte"],
  perfis: ["organizar", "perfis"], pratico: ["organizar", "checklist"],
};

function routeFromHash() {
  const parts = window.location.hash.replace(/^#\/?(japao\/?)?/, "").split("/").filter(Boolean);
  let [section, sub] = LEGACY[parts[0]] ?? parts;
  const s = SECTIONS.find((x) => x.id === section) ?? SECTIONS[0];
  const validSub = s.subs?.find((x) => x.id === sub) ? sub : s.subs?.[0].id;
  return { section: s.id, sub: validSub ?? null };
}

const CITY = {
  toquio: { label: "Tóquio", emoji: "🗼", color: "#fb7185" },
  kyoto: { label: "Kyoto", emoji: "🎎", color: "#fbbf24" },
  osaka: { label: "Osaka", emoji: "🐙", color: "#38bdf8" },
  narita: { label: "Narita", emoji: "✈️", color: "#94a3b8" },
};

const MATCH_STYLE = {
  pedro: { label: "Pedro", emoji: "🧑" },
  gio: { label: "Gio", emoji: "👩" },
  ambos: { label: "Os dois", emoji: "👥" },
};

const HERO_IMAGES = [
  { url: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1600&q=75", alt: "Tóquio" },
  { url: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=1600&q=75", alt: "Fushimi Inari" },
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

// "Asakusa (Senso-ji, Nakamise)" → "Asakusa"
const firstPlace = (s) => (s || "").split(/\s*[(,/]\s*/)[0].trim();

/*
 * Junta Tóquio (manhã/tarde/noite), Kyoto e Osaka (por horário) num
 * formato só, do dia 1 ao 14, com chegada e volta incluídas.
 */
function buildDays(tokyoVariant) {
  const arrival = {
    city: "toquio", date: "Qua 09/12", title: "Chegada",
    slots: [
      { time: "11:45", what: "Pouso em Narita (NRT)" },
      { time: "Tarde", what: "Trem até o hotel em Nihonbashi (Access Express, ~55 min) e descanso" },
    ],
  };
  const tokyo = TOKYO_VARIANTS[tokyoVariant].days.map((d) =>
    d.fullDay
      ? { city: "toquio", date: d.date, title: "DisneySea", slots: [{ time: "Dia todo", what: d.morning }], note: d.afternoon }
      : {
          city: "toquio", date: d.date,
          title: [firstPlace(d.morning), firstPlace(d.afternoon)].filter(Boolean).join(" + "),
          slots: [
            d.morning && { time: "Manhã", what: d.morning },
            d.afternoon && { time: "Tarde", what: d.afternoon },
            d.night && { time: "Noite", what: d.night },
          ].filter(Boolean),
        }
  );
  const kyoto = KYOTO_DAYS.map((d) => ({ ...d, city: "kyoto", title: d.title === "Chegada" ? "Chegada em Kyoto" : d.title }));
  const osaka = OSAKA_DAYS.map((d) => ({ ...d, city: "osaka" }));
  const departure = {
    city: "narita", date: "Ter 22/12", title: "Volta para casa",
    slots: [
      { time: "Manhã", what: "Check-out da cápsula 9h, no Terminal 2 (até 10:00)" },
      { time: "13:35", what: "Voo de volta saindo de Narita" },
    ],
  };
  return [arrival, ...tokyo, ...kyoto, ...osaka, departure].map((d, i) => ({ ...d, n: i + 1 }));
}

export default function JapanApp() {
  const saved = useMemo(loadState, []);
  const [route, setRoute] = useState(routeFromHash);
  const [helpOpen, setHelpOpen] = useState(false);
  const [extras, setExtras] = useState(() => new Set(saved?.extras ?? []));
  const [tokyoVariant, setTokyoVariant] = useState(saved?.tokyoVariant ?? "sem");
  const [done, setDone] = useState(() => new Set(saved?.done ?? []));
  const [poiIds, setPoiIds] = useState(() => new Set(saved?.poiIds ?? []));

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ extras: [...extras], tokyoVariant, done: [...done], poiIds: [...poiIds] })
      );
    } catch { /* ignore */ }
  }, [extras, tokyoVariant, done, poiIds]);

  useEffect(() => {
    const onHash = () => setRoute(routeFromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const go = (section, sub) => {
    const s = SECTIONS.find((x) => x.id === section);
    const nextSub = sub ?? s.subs?.[0].id ?? null;
    window.location.hash = `/japao/${section}${nextSub ? `/${nextSub}` : ""}`;
    setRoute({ section, sub: nextSub });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
  const todo = CHECKLIST.length - done.size;

  const mapBases = STAYS.filter((s) => s.lat).map((s) => ({
    id: s.id, name: s.name, lat: s.lat, lng: s.lng,
    verdict: s.status === "confirmada" ? "✅ Reservado" : "⏳ Ainda não reservado",
  }));

  // O PDF sai sempre do roteiro, que é o que as pessoas querem imprimir.
  const onPdf = () => {
    go("roteiro");
    const t = document.title;
    setTimeout(() => {
      document.title = "roteiro-japao-pedro-gio";
      window.print();
      document.title = t;
    }, 400);
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
    L.push(`🗓️ DIA A DIA (Tóquio: ${TOKYO_VARIANTS[tokyoVariant].label})`);
    buildDays(tokyoVariant).forEach((d) => {
      L.push(`Dia ${d.n} · ${d.date} · ${CITY[d.city].emoji} ${d.title}`);
      d.slots.forEach((sl) => L.push(`   ${sl.time} — ${sl.what}`));
    });
    L.push("");
    L.push("🏨 HOSPEDAGEM");
    STAYS.forEach((s) => {
      const tag = s.status === "confirmada" ? "✅" : "⏳";
      L.push(`  ${tag} ${s.name} — ${s.nights} noite(s)${s.totalBRL ? ` · ${formatBRL(s.totalBRL)}` : " · A RESERVAR"}`);
    });
    if (chosenActs.length) {
      L.push("");
      L.push(`✨ PASSEIOS EXTRAS ESCOLHIDOS (${chosenActs.length})`);
      chosenActs.forEach((a) => {
        L.push(`  • [${CITY[a.city]?.label ?? a.city}] ${a.name} — ${a.hours}h · ${a.costBRL > 0 ? formatBRL(a.costBRL) : "grátis"}`);
        if (a.tickets?.where) L.push(`     🎫 ${a.tickets.where}`);
      });
    }
    L.push("");
    L.push(`⏳ DECISÕES EM ABERTO (${OPEN_DECISIONS.length})`);
    OPEN_DECISIONS.forEach((d) => L.push(`  • ${d.label}`));
    L.push("");
    L.push(`☑️ CHECKLIST: ${done.size}/${CHECKLIST.length} feitos`);
    CHECKLIST.filter((c) => !done.has(c.id)).forEach((c) => L.push(`  ☐ ${c.label}`));
    L.push("");
    L.push(`Gerado em ${new Date().toLocaleString("pt-BR")} · VoaJá`);
    return L.join("\n");
  };

  const section = SECTIONS.find((s) => s.id === route.section);
  const badges = { passeios: extras.size, organizar: todo };

  return (
    <div className="min-h-full pb-28 lg:pb-10">
      <TopBar route={route} go={go} badges={badges} daysLeft={daysLeft} onHelp={() => setHelpOpen(true)} />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <main key={route.section + route.sub} className="anim-in pt-5 sm:pt-7">
          {route.section !== "inicio" && (
            <PageHeader section={section} sub={route.sub} onSub={(id) => go(section.id, id)} />
          )}

          {route.section === "inicio" && (
            <Home daysLeft={daysLeft} extrasCount={extras.size} todo={todo} go={go} />
          )}
          {route.section === "roteiro" && (
            <Itinerary tokyoVariant={tokyoVariant} setTokyoVariant={setTokyoVariant}
              chosenActs={chosenActs} onRemove={toggleExtra} go={go} />
          )}
          {route.section === "passeios" && route.sub === "catalogo" && (
            <ActivityCatalog chosen={extras} onToggle={toggleExtra} />
          )}
          {route.section === "passeios" && route.sub === "mapa" && (
            <JapanMap selectedIds={poiIds} onToggle={togglePoi} bases={mapBases} />
          )}
          {route.section === "passeios" && route.sub === "pacotes" && (
            <AgencyCompare extras={extras} onToggleExtra={toggleExtra} poiIds={poiIds} onTogglePoi={togglePoi} />
          )}
          {route.section === "organizar" && route.sub === "checklist" && (
            <ChecklistView done={done} onToggle={toggleDone} />
          )}
          {route.section === "organizar" && route.sub === "hoteis" && <Lodging />}
          {route.section === "organizar" && route.sub === "transporte" && <Transport />}
          {route.section === "organizar" && route.sub === "dicas" && <Tips />}
          {route.section === "organizar" && route.sub === "perfis" && <Profiles />}
          {route.section === "plano" && (
            <PlanTab chosenActs={chosenActs} chosenPois={chosenPois} tokyoVariant={tokyoVariant}
              done={done} buildJSON={buildJSON} buildText={buildText} onPdf={onPdf}
              onRemoveAct={toggleExtra} onRemovePoi={togglePoi} go={go} />
          )}
        </main>

        <footer className="mt-12 border-t border-white/10 pt-5 text-xs leading-relaxed text-slate-400">
          Voos e hotéis de Tóquio e Narita estão confirmados; Kyoto e Osaka seguem em aberto. Valores em
          iene são estimativas (1 BRL ≈ ¥30,7) — conferir antes de reservar. O que vocês marcam fica salvo
          neste aparelho.
        </footer>
      </div>

      <BottomNav route={route} go={go} badges={badges} />
      {helpOpen && <HelpDialog onClose={() => setHelpOpen(false)} go={go} />}
    </div>
  );
}

// ==================== ESTRUTURA ====================
function TopBar({ route, go, badges, daysLeft, onHelp }) {
  return (
    <header className="no-print sticky top-0 z-[1100] border-b border-white/10 bg-[#070a1a]/85 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5 sm:px-6">
        <button type="button" onClick={() => go("inicio")} className="flex min-w-0 items-center gap-2 text-left">
          <span className="grid h-9 w-9 flex-none place-items-center rounded-xl bg-rose-500/20 text-lg" aria-hidden>⛩️</span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-extrabold text-white">Japão 2026</span>
            <span className="block truncate text-xs text-slate-400">Pedro &amp; Gio · faltam {daysLeft} dias</span>
          </span>
        </button>

        <nav className="ml-auto hidden items-center gap-1 lg:flex" aria-label="Seções">
          {SECTIONS.map((s) => {
            const Icon = s.icon;
            const on = route.section === s.id;
            return (
              <button key={s.id} type="button" onClick={() => go(s.id)}
                aria-current={on ? "page" : undefined}
                className={`filter-pill relative inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold ${
                  on ? "bg-white/10 text-white" : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}>
                <Icon size={16} className={on ? "text-rose-300" : ""} /> {s.label}
                {badges[s.id] > 0 && <Count n={badges[s.id]} />}
              </button>
            );
          })}
        </nav>

        <button type="button" onClick={onHelp}
          className="filter-pill ml-auto inline-flex flex-none items-center gap-1.5 rounded-xl border border-white/10 px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-white/5 lg:ml-2">
          <HelpCircle size={16} /> <span className="hidden sm:inline">Ajuda</span>
        </button>
      </div>
    </header>
  );
}

function BottomNav({ route, go, badges }) {
  return (
    <nav aria-label="Seções"
      className="no-print fixed inset-x-0 bottom-0 z-[1200] border-t border-white/10 bg-[#070a1a]/95 backdrop-blur-lg lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="mx-auto grid max-w-lg grid-cols-5">
        {SECTIONS.map((s) => {
          const Icon = s.icon;
          const on = route.section === s.id;
          return (
            <button key={s.id} type="button" onClick={() => go(s.id)}
              aria-current={on ? "page" : undefined}
              className={`relative flex flex-col items-center gap-1 px-1 pb-2 pt-2.5 text-[11px] font-semibold ${
                on ? "text-white" : "text-slate-400"
              }`}>
              {on && <span className="absolute inset-x-5 top-0 h-0.5 rounded-full bg-rose-400" />}
              <span className="relative">
                <Icon size={22} className={on ? "text-rose-300" : ""} />
                {badges[s.id] > 0 && (
                  <span className="absolute -right-2.5 -top-1.5"><Count n={badges[s.id]} /></span>
                )}
              </span>
              {s.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function Count({ n }) {
  return (
    <span className="inline-grid min-w-[18px] place-items-center rounded-full bg-rose-500 px-1 text-[11px] font-bold leading-[18px] text-white">
      {n}
    </span>
  );
}

function PageHeader({ section, sub, onSub }) {
  return (
    <div className="mb-5">
      <h1 className="text-2xl font-extrabold text-white sm:text-3xl">{section.title}</h1>
      <p className="mt-1 max-w-2xl text-sm text-slate-300 sm:text-base">{section.desc}</p>
      {section.subs && (
        <div className="no-print mt-4 flex gap-1 overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.04] p-1 [scrollbar-width:none]" role="tablist">
          {section.subs.map((s) => {
            const Icon = s.icon;
            const on = s.id === sub;
            return (
              <button key={s.id} type="button" role="tab" aria-selected={on} onClick={() => onSub(s.id)}
                className={`filter-pill inline-flex flex-1 flex-none items-center justify-center gap-1.5 whitespace-nowrap rounded-xl px-3.5 py-2.5 text-sm font-semibold sm:flex-none ${
                  on ? "bg-white text-slate-900 shadow" : "text-slate-300 hover:bg-white/5"
                }`}>
                <Icon size={15} /> {s.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function HelpDialog({ onClose, go }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  const steps = [
    ["roteiro", "Roteiro", "Veja o que vocês fazem em cada um dos 14 dias."],
    ["passeios", "Passeios", "Procure atividades e toque em “Adicionar” no que quiserem fazer."],
    ["organizar", "Organizar", "Marque o que já foi resolvido: hotéis, ingressos, seguro…"],
    ["plano", "Meu plano", "Veja tudo o que escolheram e mande o resumo no WhatsApp ou baixe o PDF."],
  ];
  return (
    <div className="fixed inset-0 z-[1300] grid place-items-end bg-black/60 p-3 sm:place-items-center" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="help-title"
        className="card anim-in w-full max-w-md bg-[#0f1530] p-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-3">
          <h2 id="help-title" className="text-lg font-extrabold text-white">Como usar</h2>
          <button type="button" onClick={onClose} aria-label="Fechar" className="rounded-lg p-1 text-slate-300 hover:bg-white/10">
            <X size={20} />
          </button>
        </div>
        <ol className="mt-3 space-y-2">
          {steps.map(([id, label, body], i) => (
            <li key={id}>
              <button type="button" onClick={() => { onClose(); go(id); }}
                className="row-hover flex w-full items-start gap-3 rounded-xl border border-white/10 p-3 text-left">
                <span className="grid h-7 w-7 flex-none place-items-center rounded-full bg-rose-500/25 text-sm font-bold text-rose-100">{i + 1}</span>
                <span>
                  <span className="block text-sm font-bold text-white">{label}</span>
                  <span className="block text-sm text-slate-300">{body}</span>
                </span>
              </button>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-sm text-slate-400">Tudo o que vocês marcam fica salvo neste aparelho automaticamente.</p>
      </div>
    </div>
  );
}

function Box({ title, icon: Icon, sub, action, children, className = "" }) {
  return (
    <section className={`card p-5 ${className}`}>
      {(title || action) && (
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            {title && (
              <h2 className="flex items-center gap-2 text-base font-bold text-white">
                {Icon && <Icon size={18} className="text-rose-300" />} {title}
              </h2>
            )}
            {sub && <p className="mt-0.5 text-sm text-slate-400">{sub}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

function LinkButton({ onClick, children }) {
  return (
    <button type="button" onClick={onClick}
      className="inline-flex flex-none items-center gap-0.5 text-sm font-semibold text-sky-300 hover:text-sky-200 no-print">
      {children} <ChevronRight size={16} />
    </button>
  );
}

// ==================== INÍCIO ====================
function Home({ daysLeft, extrasCount, todo, go }) {
  const paid = BUDGET_LINES.filter((b) => b.status === "pago").reduce((s, b) => s + (b.brl || 0), 0);
  const estimated = BUDGET_LINES.filter((b) => b.status === "estimado")
    .reduce((s, b) => s + (b.perPerson ? (b.brl || 0) * TRIP.people : b.brl || 0), 0);
  const urgent = OPEN_DECISIONS.filter((d) => d.severity === "alta");

  const actions = [
    { id: "roteiro", icon: CalendarDays, title: "Ver o roteiro", body: "Dia a dia, do pouso à volta" },
    { id: "passeios", icon: Compass, title: "Escolher passeios", body: extrasCount ? `${extrasCount} escolhido(s) até agora` : "Nenhum escolhido ainda" },
    { id: "organizar", icon: ListChecks, title: "O que falta resolver", body: `${todo} ${todo === 1 ? "item" : "itens"} no checklist` },
    { id: "plano", icon: PackageCheck, title: "Compartilhar", body: "Resumo no WhatsApp ou PDF" },
  ];

  return (
    <div className="space-y-5">
      <header className="card relative overflow-hidden">
        {HERO_IMAGES.map((img, i) => (
          <img key={img.url} src={img.url} alt={img.alt} loading={i === 0 ? "eager" : "lazy"}
            className="hero-img" style={{ animationDelay: `${i * 8}s`, animationDuration: "24s" }}
            onError={(e) => (e.currentTarget.style.display = "none")} />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070a1a] via-[#070a1a]/70 to-[#070a1a]/20" />
        <div className="relative flex min-h-[14rem] flex-col justify-end p-5 sm:min-h-[16rem] sm:p-7">
          <div className="text-sm font-semibold text-rose-200">Pedro &amp; Gio</div>
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl" style={{ letterSpacing: "-0.035em" }}>
            <span className="gradient-text">Japão</span> 2026
          </h1>
          <p className="mt-2 text-base text-slate-200">
            09 a 22 de dezembro · 14 dias · <strong className="text-white">faltam {daysLeft} dias</strong>
          </p>
        </div>
      </header>

      <div>
        <h2 className="mb-2.5 text-sm font-semibold uppercase tracking-wider text-slate-400">O que vocês querem fazer?</h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {actions.map((a) => {
            const Icon = a.icon;
            return (
              <button key={a.id} type="button" onClick={() => go(a.id)}
                className="card card-hover flex flex-col items-start gap-2 p-4 text-left">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-rose-500/15 text-rose-300">
                  <Icon size={20} />
                </span>
                <span className="text-base font-bold text-white">{a.title}</span>
                <span className="text-sm text-slate-400">{a.body}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-amber-400/35 bg-amber-500/10 p-4">
        <AlertTriangle size={20} className="mt-0.5 flex-none text-amber-300" />
        <p className="text-sm text-amber-50">
          <strong>Atenção:</strong> {TRIP.airportWarning}
        </p>
      </div>

      <Box title="A viagem em uma linha" icon={Plane}>
        <CityBar />
        <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
          <div className="rounded-xl bg-white/[0.04] p-3"><span className="badge-ok mr-2">IDA</span>{TRIP.arriveLabel}</div>
          <div className="rounded-xl bg-white/[0.04] p-3"><span className="badge-ok mr-2">VOLTA</span>{TRIP.departLabel}</div>
        </div>
      </Box>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        <Box className="lg:col-span-3" title="Resolver primeiro" icon={AlertTriangle}
          sub={`${urgent.length} decisões urgentes de ${OPEN_DECISIONS.length} em aberto`}
          action={<LinkButton onClick={() => go("organizar", "checklist")}>Ver tudo</LinkButton>}>
          <ul className="divide-y divide-white/5">
            {urgent.map((d) => (
              <li key={d.id} className="flex items-start gap-3 py-2.5">
                <span className="mt-1.5 h-2.5 w-2.5 flex-none rounded-full bg-rose-400" />
                <div>
                  <div className="text-sm font-semibold text-white">{d.label}</div>
                  <div className="text-sm text-slate-400">{d.detail}</div>
                </div>
              </li>
            ))}
          </ul>
        </Box>

        <Box className="lg:col-span-2" title="Orçamento" icon={Wallet}
          action={<LinkButton onClick={() => go("plano")}>Detalhes</LinkButton>}>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-slate-300">Já pago (hotéis)</dt>
              <dd className="text-lg font-bold text-emerald-300">{formatBRL(paid)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-300">Estimativa do resto (2 pessoas)</dt>
              <dd className="text-lg font-bold text-white">{formatBRL(estimated)}</dd>
            </div>
            <div className="flex justify-between gap-3 border-t border-white/10 pt-3">
              <dt className="text-slate-300">Hotéis de Kyoto e Osaka</dt>
              <dd className="font-bold text-amber-300">ainda sem preço</dd>
            </div>
          </dl>
        </Box>
      </div>

      <details className="card p-5">
        <summary className="cursor-pointer text-base font-bold text-white">
          ✅ Decisões que já foram tomadas ({SETTLED.length})
        </summary>
        <ul className="mt-3 space-y-2 text-sm text-slate-200">
          {SETTLED.map((s) => (
            <li key={s} className="flex gap-2"><Check size={16} className="mt-0.5 flex-none text-emerald-400" />{s}</li>
          ))}
        </ul>
      </details>
    </div>
  );
}

function CityBar() {
  const total = CITY_BLOCKS.reduce((s, c) => s + c.nights, 0);
  return (
    <div>
      <div className="flex h-3 overflow-hidden rounded-full">
        {CITY_BLOCKS.map((c) => (
          <div key={c.id} style={{ width: `${(c.nights / total) * 100}%`, background: CITY[c.id].color }} />
        ))}
      </div>
      <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {CITY_BLOCKS.map((c) => (
          <li key={c.id} className="flex items-start gap-2">
            <span className="mt-1 h-3 w-3 flex-none rounded-full" style={{ background: CITY[c.id].color }} />
            <div>
              <div className="text-sm font-bold text-white">{c.emoji} {c.label}</div>
              <div className="text-sm text-slate-300">{c.nights} {c.nights > 1 ? "noites" : "noite"} · {c.range}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ==================== ROTEIRO ====================
function Itinerary({ tokyoVariant, setTokyoVariant, chosenActs, onRemove, go }) {
  const [city, setCity] = useState("todas");
  const days = buildDays(tokyoVariant);
  const shown = days.filter((d) => city === "todas" || d.city === city || (city === "osaka" && d.city === "narita"));
  const variant = TOKYO_VARIANTS[tokyoVariant];

  const jump = (n) => document.getElementById(`dia-${n}`)?.scrollIntoView({ behavior: "smooth", block: "start" });

  // Extras escolhidos aparecem depois do último dia da cidade.
  const lastOfCity = {};
  shown.forEach((d) => (lastOfCity[d.city] = d.n));

  return (
    <div className="space-y-4">
      <div className="no-print space-y-3">
        <div className="flex flex-wrap gap-2">
          {[["todas", "Todos os dias"], ["toquio", "🗼 Tóquio"], ["kyoto", "🎎 Kyoto"], ["osaka", "🐙 Osaka"]].map(([id, label]) => (
            <Pill key={id} on={city === id} onClick={() => setCity(id)}>{label}</Pill>
          ))}
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:thin]" aria-label="Ir para o dia">
          {shown.map((d) => (
            <button key={d.n} type="button" onClick={() => jump(d.n)}
              className="filter-pill flex flex-none flex-col items-center rounded-xl border border-white/10 bg-white/[0.04] px-2.5 py-1.5 hover:bg-white/10">
              <span className="text-[11px] text-slate-400">Dia</span>
              <span className="text-base font-extrabold text-white">{d.n}</span>
              <span className="mt-0.5 h-1 w-5 rounded-full" style={{ background: CITY[d.city].color }} />
            </button>
          ))}
        </div>
      </div>

      {(city === "todas" || city === "toquio") && (
        <div className="card border-rose-400/30 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-sm font-bold text-white">Decisão em aberto: DisneySea em Tóquio?</div>
              <div className="text-sm text-slate-400">Troque para ver como fica cada versão.</div>
            </div>
            <div className="flex gap-1 rounded-xl bg-white/5 p-1 no-print" role="group" aria-label="Versão de Tóquio">
              {Object.values(TOKYO_VARIANTS).map((v) => (
                <button key={v.id} type="button" onClick={() => setTokyoVariant(v.id)} aria-pressed={tokyoVariant === v.id}
                  className={`filter-pill rounded-lg px-3.5 py-2 text-sm font-semibold ${
                    tokyoVariant === v.id ? "bg-white text-slate-900" : "text-slate-300"
                  }`}>
                  {v.label}
                </button>
              ))}
            </div>
          </div>
          {variant.cost && <p className="mt-3 rounded-lg bg-amber-500/10 p-3 text-sm text-amber-100">⚠️ {variant.cost}</p>}
        </div>
      )}

      <ol className="space-y-3">
        {shown.map((d) => (
          <li key={d.n} id={`dia-${d.n}`} className="scroll-mt-24">
            <DayCard d={d} />
            {lastOfCity[d.city] === d.n && (
              <ExtrasForCity city={d.city} list={chosenActs.filter((a) => a.city === d.city)} onRemove={onRemove} go={go} />
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

function DayCard({ d }) {
  const c = CITY[d.city];
  return (
    <article className="card overflow-hidden">
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3" style={{ boxShadow: `inset 4px 0 0 ${c.color}` }}>
        <div className="grid h-11 w-11 flex-none place-items-center rounded-xl bg-white/[0.06] text-center">
          <span className="text-[10px] leading-none text-slate-400">DIA</span>
          <span className="text-lg font-extrabold leading-none text-white">{d.n}</span>
        </div>
        <div className="min-w-0">
          <div className="text-sm text-slate-400">{d.date} · {c.emoji} {c.label}</div>
          <h3 className="truncate text-base font-bold text-white">{d.title}</h3>
        </div>
      </div>
      <ul className="divide-y divide-white/5 px-4">
        {d.slots.map((sl, j) => (
          <li key={j} className="flex gap-3 py-2.5 text-sm">
            <span className="w-16 flex-none font-semibold text-slate-400">{sl.time}</span>
            <span className="text-slate-100">
              {sl.what}
              {sl.split && <Tag cls="bg-indigo-500/25 text-indigo-100">cada um faz um programa</Tag>}
              {sl.booking && <Tag cls="bg-amber-500/25 text-amber-100">reservar antes</Tag>}
            </span>
          </li>
        ))}
      </ul>
      {d.note && <p className="px-4 pb-3 text-sm text-slate-400">{d.note}</p>}
    </article>
  );
}

function Tag({ cls, children }) {
  return <span className={`ml-2 inline-block rounded-md px-1.5 py-0.5 text-xs font-semibold ${cls}`}>{children}</span>;
}

function ExtrasForCity({ city, list, onRemove, go }) {
  if (city === "narita") return null;
  const c = CITY[city];
  return (
    <div className="mt-3 rounded-2xl border border-dashed border-emerald-400/30 bg-emerald-500/[0.05] p-4">
      <div className="text-sm font-bold text-emerald-100">
        ✨ Passeios extras em {c.label} {list.length > 0 && `(${list.length})`}
      </div>
      {list.length === 0 ? (
        <p className="mt-1 text-sm text-slate-400">
          Nenhum ainda.{" "}
          <button type="button" className="font-semibold text-sky-300 hover:text-sky-200 no-print" onClick={() => go("passeios")}>
            Procurar passeios →
          </button>
        </p>
      ) : (
        <>
          <p className="mt-0.5 text-sm text-slate-400">Encaixem num dos dias acima.</p>
          <ul className="mt-2 space-y-1.5">
            {list.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-2 rounded-xl bg-white/[0.04] px-3 py-2 text-sm">
                <span className="min-w-0 text-slate-100">
                  <strong>{a.name}</strong>
                  <span className="text-slate-400"> · {a.hours}h · {a.costBRL > 0 ? formatBRL(a.costBRL) : "grátis"}</span>
                </span>
                <button type="button" onClick={() => onRemove(a.id)} aria-label={`Tirar ${a.name}`}
                  className="flex-none rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white no-print">
                  <X size={16} />
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function Pill({ on, onClick, children, color }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={on}
      className={`filter-pill rounded-full border px-3.5 py-2 text-sm font-semibold ${
        on ? "border-white bg-white text-slate-900" : "border-white/15 bg-white/[0.04] text-slate-200 hover:bg-white/10"
      }`}
      style={on && color ? { background: color, borderColor: color } : undefined}>
      {children}
    </button>
  );
}

// ==================== PASSEIOS: LISTA ====================
const CITY_FILTER = [
  ["todas", "Todas"], ["toquio", "🗼 Tóquio"], ["kyoto", "🎎 Kyoto"], ["osaka", "🐙 Osaka"],
];

function ActivityCatalog({ chosen, onToggle }) {
  const [city, setCity] = useState("todas");
  const [cat, setCat] = useState("todas");
  const [match, setMatch] = useState("todos");
  const [showInBase, setShowInBase] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [openId, setOpenId] = useState(null);
  const [q, setQ] = useState("");

  const extraFilters = (cat !== "todas") + (match !== "todos") + showInBase;
  const clear = () => { setCat("todas"); setMatch("todos"); setShowInBase(false); setQ(""); setCity("todas"); };

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    return ACTIVITIES.filter((a) => {
      if (city !== "todas" && a.city !== city) return false;
      if (cat !== "todas" && a.cat !== cat) return false;
      if (match !== "todos" && a.match !== match) return false;
      if (!showInBase && a.inBase && !chosen.has(a.id)) return false;
      if (term && !`${a.name} ${a.what} ${a.area}`.toLowerCase().includes(term)) return false;
      return true;
    }).sort((a, b) => {
      const w = (x) => (x.priority ? 0 : x.level === "alto" ? 1 : x.level === "medio" ? 2 : 3);
      return w(a) - w(b);
    });
  }, [city, cat, match, showInBase, q, chosen]);

  const chosenList = ACTIVITIES.filter((a) => chosen.has(a.id));
  const totalCost = chosenList.reduce((s, a) => s + (a.costBRL || 0), 0) * 2;

  return (
    <div className="space-y-4">
      <div className="card space-y-3 p-4">
        <label className="relative block">
          <span className="sr-only">Buscar passeio</span>
          <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar: ramen, templo, vista, onsen…"
            className="input py-3 pl-11 text-base" />
        </label>

        <div className="flex flex-wrap items-center gap-2">
          {CITY_FILTER.map(([id, label]) => (
            <Pill key={id} on={city === id} onClick={() => setCity(id)}>{label}</Pill>
          ))}
          <button type="button" onClick={() => setMoreOpen((v) => !v)} aria-expanded={moreOpen}
            className="filter-pill ml-auto inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10">
            <SlidersHorizontal size={15} /> Filtros
            {extraFilters > 0 && <Count n={extraFilters} />}
            <ChevronDown size={15} className={moreOpen ? "rotate-180" : ""} />
          </button>
        </div>

        {moreOpen && (
          <div className="space-y-4 border-t border-white/10 pt-3">
            <FilterGroup label="Tipo de passeio">
              <Pill on={cat === "todas"} onClick={() => setCat("todas")}>Todos</Pill>
              {ACT_CATEGORIES.map((c) => (
                <Pill key={c.id} on={cat === c.id} onClick={() => setCat(c.id)}>{c.emoji} {c.label}</Pill>
              ))}
            </FilterGroup>
            <FilterGroup label="Combina mais com">
              {[["todos", "Qualquer um"], ["ambos", "👥 Os dois"], ["pedro", "🧑 Pedro"], ["gio", "👩 Gio"]].map(([id, label]) => (
                <Pill key={id} on={match === id} onClick={() => setMatch(id)}>{label}</Pill>
              ))}
            </FilterGroup>
            <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-200">
              <input type="checkbox" checked={showInBase} onChange={(e) => setShowInBase(e.target.checked)}
                className="h-4 w-4 accent-rose-500" />
              Mostrar também o que já está no roteiro
            </label>
          </div>
        )}
      </div>

      {chosenList.length > 0 && (
        <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/[0.08] px-4 py-3 text-sm text-emerald-50">
          <strong>{chosenList.length} no plano</strong>
          {totalCost > 0 ? ` · ${formatBRL(totalCost)} em ingressos para os dois` : " · todos gratuitos"}
        </div>
      )}

      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="text-slate-300"><strong className="text-white">{list.length}</strong> passeios</span>
        {(extraFilters > 0 || q || city !== "todas") && (
          <button type="button" onClick={clear} className="font-semibold text-sky-300 hover:text-sky-200">Limpar filtros</button>
        )}
      </div>

      {list.length === 0 ? (
        <div className="card p-8 text-center text-sm text-slate-300">
          Nada encontrado com esses filtros.{" "}
          <button type="button" onClick={clear} className="font-semibold text-sky-300">Limpar filtros</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {list.map((a) => (
            <ActivityCard key={a.id} a={a} chosen={chosen.has(a.id)} onToggle={onToggle}
              open={openId === a.id} onOpen={() => setOpenId(openId === a.id ? null : a.id)} />
          ))}
        </div>
      )}

      <details className="card p-5">
        <summary className="cursor-pointer text-base font-bold text-white">🚄 Bate-voltas: quanto tempo e dinheiro cada um consome</summary>
        <ul className="mt-3 divide-y divide-white/5">
          {DAY_TRIPS.map((d) => (
            <li key={d.id} className="py-3 text-sm">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-bold text-white">{d.name}</span>
                <span className="text-slate-300">{d.hours >= 24 ? "exige pernoite" : `consome ~${d.hours}h`} · {d.cost}</span>
              </div>
              <div className="text-slate-400">Saindo de {d.from} · {d.mode} {d.time}</div>
              <div className="mt-0.5 text-slate-300">{d.why}</div>
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}

function FilterGroup({ label, children }) {
  return (
    <div>
      <div className="mb-2 text-sm font-semibold text-slate-400">{label}</div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function ActivityCard({ a, chosen, onToggle, open, onOpen }) {
  const cat = ACT_CATEGORIES.find((c) => c.id === a.cat);
  const eff = EFFORT[a.effort];
  const note = a.priority ? "Pedido que ficou sem lugar no roteiro"
    : a.inBase ? "Já está no roteiro"
    : a.cutByBoth ? "Vocês dois cortaram"
    : a.solo ? `Programa só ${a.solo === "pedro" ? "do Pedro" : "da Gio"}` : null;

  return (
    <article className={`card flex flex-col p-4 ${chosen ? "ring-2 ring-emerald-400/60" : ""}`}>
      {note && <div className={`mb-1.5 text-xs font-semibold ${a.priority ? "text-amber-300" : "text-slate-400"}`}>{note}</div>}
      <h3 className="text-base font-bold text-white">{a.name}</h3>
      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-slate-400">
        <span>{CITY[a.city]?.emoji} {a.area}</span>
        <span>⏱ {a.hours}h</span>
        <span className="font-semibold text-slate-200">{a.costBRL > 0 ? `${formatBRL(a.costBRL)}/pessoa` : "grátis"}</span>
        {a.rating && <span>⭐ {a.rating.toFixed(1)}</span>}
      </div>
      <p className="mt-2 text-sm leading-relaxed text-slate-300">{a.what}</p>
      <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-400">
        {cat && <span className="rounded-md bg-white/[0.06] px-2 py-1">{cat.emoji} {cat.label}</span>}
        <span className="rounded-md bg-white/[0.06] px-2 py-1">{MATCH_STYLE[a.match].emoji} {MATCH_STYLE[a.match].label}</span>
        {eff && <span className="rounded-md bg-white/[0.06] px-2 py-1"><span style={{ color: eff.color }}>●</span> {eff.label}</span>}
      </div>

      {open && (
        <div className="mt-3 space-y-3 border-t border-white/10 pt-3 text-sm">
          <Detail title="🎫 Ingresso">
            <div>{a.tickets.where}</div>
            <div className="text-slate-400">Quando comprar: {a.tickets.when} · Esgota? {a.tickets.sellsOut}</div>
            <div className="mt-1.5 rounded-lg bg-amber-500/10 p-2.5 text-amber-100">💡 {a.tickets.tip}</div>
          </Detail>
          <Detail title="🕐 Melhor horário">{a.bestTime}</Detail>
          <Detail title="🎄 Em dezembro">{a.december}</Detail>
          <Detail title="💬 O que as pessoas dizem">
            <ul className="space-y-0.5">
              {a.says.good.map((g, i) => <li key={`g${i}`} className="text-emerald-200">+ {g}</li>)}
              {a.says.bad.map((b, i) => <li key={`b${i}`} className="text-rose-200">− {b}</li>)}
            </ul>
          </Detail>
          {a.swapFor && <Detail title="↔️ O que muda no roteiro">{a.swapFor}</Detail>}
          {a.spendBRL > 0 && <Detail title="💸 Gasto típico no local">~{formatBRL(a.spendBRL)} por pessoa além da entrada</Detail>}
        </div>
      )}

      <div className="mt-auto flex gap-2 pt-3 no-print">
        <button type="button" onClick={onOpen} aria-expanded={open}
          className="btn-ghost flex-1 py-2">
          {open ? "Menos detalhes" : "Detalhes"} <ChevronDown size={15} className={open ? "rotate-180" : ""} />
        </button>
        <button type="button" onClick={() => onToggle(a.id)}
          className={`btn flex-1 py-2 ${chosen ? "bg-emerald-500/20 text-emerald-100 ring-1 ring-inset ring-emerald-400/50" : "btn-primary"}`}>
          {chosen ? <><Check size={16} /> No plano</> : <><Plus size={16} /> Adicionar</>}
        </button>
      </div>
    </article>
  );
}

function Detail({ title, children }) {
  return (
    <div>
      <div className="text-xs font-bold uppercase tracking-wider text-slate-400">{title}</div>
      <div className="mt-0.5 text-slate-200">{children}</div>
    </div>
  );
}

// ==================== PASSEIOS: PACOTES DE AGÊNCIA ====================
function AgencyCompare({ extras, onToggleExtra, poiIds, onTogglePoi }) {
  const [pkgId, setPkgId] = useState(AGENCY_PACKAGES[0].id);
  const [only, setOnly] = useState("todos");
  const pkg = AGENCY_PACKAGES.find((p) => p.id === pkgId);
  const count = coverageCount(pkg);
  const actName = (id) => ACTIVITIES.find((a) => a.id === id)?.name;
  const poiName = (id) => JAPAN_POIS.find((p) => p.id === id)?.name;

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-300">
        Dois roteiros prontos de agência, comparados com o de vocês. Servem de fonte de ideias — são em outra
        época do ano e em ritmo de excursão.
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {AGENCY_PACKAGES.map((p) => {
          const c = coverageCount(p);
          const n = Object.values(c).reduce((s, x) => s + x, 0);
          const on = p.id === pkgId;
          return (
            <button key={p.id} type="button" onClick={() => { setPkgId(p.id); setOnly("todos"); }} aria-pressed={on}
              className={`card filter-pill p-4 text-left ${on ? "ring-2 ring-rose-400/70" : "hover:bg-white/[0.06]"}`}>
              <div className="text-base font-bold text-white">{p.name}</div>
              <div className="text-sm text-slate-400">{p.agency}</div>
              <div className="mt-1 text-sm text-slate-200">{p.dates} · {p.season.split(" — ")[0]}</div>
              <div className="mt-2 text-sm font-semibold text-emerald-200">{c.roteiro} de {n} atrações já estão no roteiro</div>
            </button>
          );
        })}
      </div>

      <Box>
        <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <div><dt className="text-slate-400">Datas</dt><dd className="text-slate-100">{pkg.dates} · {pkg.japanDays}</dd></div>
          <div><dt className="text-slate-400">Estação</dt><dd className="text-slate-100">{pkg.season}</dd></div>
          <div><dt className="text-slate-400">Preço</dt><dd className="text-slate-100">{pkg.price}</dd></div>
          <div><dt className="text-slate-400">Formato</dt><dd className="text-slate-100">{pkg.style}</dd></div>
        </dl>
        <p className="mt-3 rounded-lg bg-amber-500/10 p-3 text-sm text-amber-100">⚠️ {pkg.extras}</p>
        {pkg.url && (
          <a href={pkg.url} target="_blank" rel="noreferrer"
            className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-sky-300 hover:text-sky-200 no-print">
            Página original da agência <ExternalLink size={14} />
          </a>
        )}
      </Box>

      <div>
        <div className="mb-2 text-sm text-slate-400">Toque para filtrar:</div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {Object.entries(COVERAGE).map(([id, c]) => (
            <button key={id} type="button" onClick={() => setOnly(only === id ? "todos" : id)} aria-pressed={only === id}
              className={`filter-pill rounded-xl p-3 text-left ring-1 ring-inset ${c.cls} ${only === id ? "ring-2" : ""}`}>
              <div className="text-2xl font-extrabold">{count[id]}</div>
              <div className="text-sm font-semibold">{c.emoji} {c.label}</div>
            </button>
          ))}
        </div>
      </div>

      <ol className="space-y-3">
        {pkg.days.map((d) => {
          const items = (d.items || []).filter((it) => only === "todos" || it.status === only);
          if (!d.outOfScope && items.length === 0) return null;
          if (d.outOfScope && only !== "todos") return null;
          return (
            <li key={d.date} className={`card p-4 ${d.outOfScope ? "opacity-60" : ""}`}>
              <div className="text-sm text-slate-400">{d.date}{d.outOfScope && " · fora do Japão"}</div>
              <h3 className="text-base font-bold text-white">{d.title}</h3>
              {d.note && <p className="mt-1 text-sm text-slate-400">{d.note}</p>}
              {items.length > 0 && (
                <ul className="mt-2 space-y-2">
                  {items.map((it) => {
                    const c = COVERAGE[it.status];
                    const added = it.actId ? extras.has(it.actId) : it.poiId ? poiIds.has(it.poiId) : false;
                    const link = it.actId ? actName(it.actId) : it.poiId ? poiName(it.poiId) : null;
                    return (
                      <li key={it.name} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white/[0.04] p-3">
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-semibold text-slate-100">{it.name}</div>
                          <div className="text-sm text-slate-400">
                            {it.where && <>No roteiro: <span className="text-slate-200">{it.where}</span></>}
                            {link && <>No site como: <span className="text-slate-200">{link}</span></>}
                            {it.note && <>{(it.where || link) && " · "}{it.note}</>}
                          </div>
                        </div>
                        <div className="flex flex-none items-center gap-2">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${c.cls}`}>{c.emoji} {c.short}</span>
                          {(it.actId || it.poiId) && (
                            <button type="button"
                              onClick={() => (it.actId ? onToggleExtra(it.actId) : onTogglePoi(it.poiId))}
                              className={`filter-pill rounded-lg px-3 py-1.5 text-sm font-semibold no-print ${
                                added ? "bg-emerald-500/25 text-emerald-100" : "bg-indigo-500/35 text-white"
                              }`}>
                              {added ? "✓ No plano" : "+ Adicionar"}
                            </button>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

// ==================== ORGANIZAR ====================
function ChecklistView({ done, onToggle }) {
  const pct = Math.round((done.size / CHECKLIST.length) * 100);
  const sev = { alta: ["bg-rose-400", "Urgente"], media: ["bg-amber-400", "Logo"], baixa: ["bg-slate-500", "Sem pressa"] };
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <Box title="Checklist antes de embarcar" icon={ListChecks} sub="Toque em um item quando ele estiver resolvido.">
        <div className="mb-3">
          <div className="flex justify-between text-sm text-slate-300">
            <span>{done.size} de {CHECKLIST.length} feitos</span><span>{pct}%</span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/10">
            <div className="bar-animated h-full rounded-full bg-emerald-400" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <ul className="space-y-2">
          {CHECKLIST.map((c) => {
            const ok = done.has(c.id);
            return (
              <li key={c.id}>
                <button type="button" onClick={() => onToggle(c.id)} aria-pressed={ok}
                  className={`filter-pill flex w-full items-center gap-3 rounded-xl border p-3 text-left text-sm ${
                    ok ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-100" : "border-white/10 bg-white/[0.03] text-slate-100 hover:bg-white/[0.06]"
                  }`}>
                  <span className={`grid h-6 w-6 flex-none place-items-center rounded-md border-2 ${
                    ok ? "border-emerald-400 bg-emerald-500/40" : "border-white/30"}`}>
                    {ok && <Check size={14} className="text-white" />}
                  </span>
                  <span className={ok ? "line-through opacity-70" : ""}>{c.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </Box>

      <Box title="Decisões em aberto" icon={AlertTriangle} sub="Conversem sobre estas antes de reservar.">
        <ul className="divide-y divide-white/5">
          {OPEN_DECISIONS.map((d) => (
            <li key={d.id} className="flex items-start gap-3 py-3">
              <span className={`mt-1.5 h-2.5 w-2.5 flex-none rounded-full ${sev[d.severity][0]}`} />
              <div className="min-w-0">
                <div className="text-sm font-semibold text-white">
                  {d.label} <span className="ml-1 text-xs font-normal text-slate-400">· {sev[d.severity][1]}</span>
                </div>
                <div className="text-sm text-slate-400">{d.detail}</div>
              </div>
            </li>
          ))}
        </ul>
      </Box>
    </div>
  );
}

function Lodging() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {STAYS.map((s) => {
        const ok = s.status === "confirmada";
        return (
          <Box key={s.id} className={ok ? "" : "border-amber-400/30"}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm text-slate-400">{CITY[s.city]?.emoji} {CITY[s.city]?.label} · {s.checkIn} → {s.checkOut}</div>
                <h3 className="text-base font-bold text-white">{s.name}</h3>
                <div className="mt-1">{ok ? <span className="badge-ok">✅ Reservado</span> : <span className="badge-warn">⏳ Falta reservar</span>}</div>
              </div>
              <div className="text-right">
                {s.totalBRL ? (
                  <>
                    <div className="text-lg font-bold text-white">{formatBRL(s.totalBRL)}</div>
                    <div className="text-sm text-slate-400">{s.nights} noite{s.nights > 1 ? "s" : ""}</div>
                  </>
                ) : (
                  <div className="text-sm font-bold text-amber-300">{s.nights} noites · sem preço</div>
                )}
              </div>
            </div>
            <dl className="mt-3 space-y-1.5 text-sm">
              <div><dt className="inline text-slate-400">Onde: </dt><dd className="inline text-slate-200">{s.area}</dd></div>
              {s.room && <div><dt className="inline text-slate-400">Quarto: </dt><dd className="inline text-slate-200">{s.room}</dd></div>}
              {s.plan && <div><dt className="inline text-slate-400">Plano: </dt><dd className="inline text-slate-200">{s.plan}</dd></div>}
              {s.cancel && <div><dt className="inline text-slate-400">Cancelamento: </dt><dd className="inline text-slate-200">{s.cancel}</dd></div>}
            </dl>
            {s.notes?.length > 0 && (
              <ul className="mt-3 space-y-1 text-sm text-amber-100/90">
                {s.notes.map((n) => <li key={n}>⚠️ {n}</li>)}
              </ul>
            )}
          </Box>
        );
      })}
    </div>
  );
}

function Transport() {
  return (
    <div className="space-y-4">
      <Box title="Trechos entre cidades" icon={Train} sub="Preço aproximado por pessoa, só ida.">
        <ul className="divide-y divide-white/5">
          {LOGISTICS.map((l) => (
            <li key={`${l.from}-${l.to}`} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
              <div className="min-w-0">
                <div className="font-semibold text-white">{l.from} → {l.to}</div>
                <div className="text-slate-400">{l.mode} · {l.time}</div>
              </div>
              <div className="font-bold text-white">{l.yen}</div>
            </li>
          ))}
        </ul>
      </Box>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {LOGISTICS_NOTES.map((n) => (
          <Box key={n.title} title={n.title}>
            <p className="text-sm leading-relaxed text-slate-300">{n.body}</p>
          </Box>
        ))}
      </div>
    </div>
  );
}

function Tips() {
  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
      {PRACTICAL.map((p) => (
        <Box key={p.id} title={`${p.emoji} ${p.title}`}>
          <p className="text-sm leading-relaxed text-slate-300">{p.body}</p>
        </Box>
      ))}
    </div>
  );
}

function Profiles() {
  const convColor = {
    alta: "text-emerald-300", media: "text-slate-300", baixa: "text-slate-400",
    divergente: "text-amber-300", conflito: "text-rose-300",
  };
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {PERSON_PROFILES.map((p) => (
          <Box key={p.id} title={`${p.emoji} ${p.name}`}>
            <div className="text-sm font-semibold text-slate-400">Quer fazer</div>
            <ul className="mt-1 space-y-1 text-sm text-slate-100">
              {p.wants.map((w) => <li key={w}>✓ {w}</li>)}
            </ul>
            <div className="mt-3 text-sm"><span className="font-semibold text-slate-400">Cortaria: </span><span className="text-slate-200">{p.cuts.join(", ")}</span></div>
            <p className="mt-3 rounded-lg bg-rose-500/10 p-3 text-sm text-rose-100"><strong>Não quer:</strong> {p.veto}</p>
          </Box>
        ))}
      </div>

      <Box title="Onde discordavam e como ficou">
        <ul className="space-y-2">
          {CONFLICTS.map((c) => (
            <li key={c.conflict} className="rounded-xl bg-white/[0.04] p-3 text-sm">
              <div className="font-semibold text-slate-100">{c.status === "aberto" ? "⏳" : "✅"} {c.conflict}</div>
              <div className="mt-1 text-slate-300">→ {c.resolution}</div>
            </li>
          ))}
        </ul>
      </Box>

      <details className="card p-5">
        <summary className="cursor-pointer text-base font-bold text-white">Ranking do questionário (1 = mais quer)</summary>
        <ul className="mt-3 divide-y divide-white/5">
          {PREFERENCES.map((p) => (
            <li key={p.cat} className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-sm">
              <span className="font-semibold text-slate-100">{p.cat}</span>
              <span className="flex items-center gap-3">
                <span className="text-slate-300">🧑 {p.pedro}</span>
                <span className="text-slate-300">👩 {p.gio}</span>
                <span className={`w-40 text-right ${convColor[p.convergence]}`}>{p.note || p.convergence}</span>
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-3 text-sm font-semibold text-slate-400">Ritmo</div>
        <ul className="mt-1 space-y-0.5 text-sm text-slate-200">
          {PACE.map((p) => <li key={p}>• {p}</li>)}
        </ul>
      </details>
    </div>
  );
}

// ==================== MEU PLANO ====================
function PlanTab({ chosenActs, chosenPois, tokyoVariant, done, buildJSON, buildText, onPdf, onRemoveAct, onRemovePoi, go }) {
  const [copied, setCopied] = useState(null);

  const onCopy = async (kind) => {
    const ok = await copyToClipboard(kind === "json" ? JSON.stringify(buildJSON(), null, 2) : buildText());
    if (ok) {
      setCopied(kind);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  const paid = BUDGET_LINES.filter((b) => b.status === "pago").reduce((s, b) => s + (b.brl || 0), 0);
  const statusLabel = { pago: ["badge-ok", "pago"], aberto: ["badge-warn", "falta"], estimado: [null, "estimado"], opcional: [null, "opcional"] };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 no-print">
        <button type="button" className="btn-primary py-3.5 text-base" onClick={() => onCopy("texto")}>
          <ClipboardCopy size={18} /> {copied === "texto" ? "Copiado! Cole no WhatsApp" : "Copiar resumo para o WhatsApp"}
        </button>
        <button type="button" className="btn-ghost py-3.5 text-base" onClick={onPdf}>
          <FileDown size={18} /> Baixar roteiro em PDF
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Box title={`Passeios extras (${chosenActs.length})`} sub={`Tóquio na versão ${TOKYO_VARIANTS[tokyoVariant].label}`}>
          {chosenActs.length === 0 ? (
            <p className="text-sm text-slate-400">
              Nenhum ainda. <button type="button" className="font-semibold text-sky-300" onClick={() => go("passeios")}>Escolher passeios →</button>
            </p>
          ) : (
            <ul className="space-y-1.5">
              {chosenActs.map((e) => (
                <li key={e.id} className="flex items-center justify-between gap-2 rounded-xl bg-white/[0.04] px-3 py-2 text-sm">
                  <span className="min-w-0"><span className="font-semibold text-white">{e.name}</span>
                    <span className="text-slate-400"> · {CITY[e.city]?.label} · {e.hours}h</span></span>
                  <button type="button" onClick={() => onRemoveAct(e.id)} aria-label={`Tirar ${e.name}`}
                    className="flex-none rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white no-print"><X size={16} /></button>
                </li>
              ))}
            </ul>
          )}
        </Box>

        <Box title={`Lugares salvos no mapa (${chosenPois.length})`}>
          {chosenPois.length === 0 ? (
            <p className="text-sm text-slate-400">
              Nenhum ainda. <button type="button" className="font-semibold text-sky-300" onClick={() => go("passeios", "mapa")}>Abrir o mapa →</button>
            </p>
          ) : (
            <ul className="space-y-1.5">
              {chosenPois.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-2 rounded-xl bg-white/[0.04] px-3 py-2 text-sm">
                  <span className="min-w-0 truncate text-white">{p.name}</span>
                  <span className="flex flex-none items-center gap-2">
                    <span className="text-slate-300">{p.costBRL > 0 ? formatBRL(p.costBRL) : "Grátis"}</span>
                    <button type="button" onClick={() => onRemovePoi(p.id)} aria-label={`Tirar ${p.name}`}
                      className="rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white no-print"><X size={16} /></button>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Box>
      </div>

      <Box title="Orçamento" icon={Wallet} sub="Valores em iene são estimativas — conferir antes de reservar.">
        <ul className="divide-y divide-white/5">
          {BUDGET_LINES.map((b) => {
            const [cls, label] = statusLabel[b.status] ?? [null, b.status];
            return (
              <li key={b.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-sm">
                <div className="min-w-0">
                  <div className="font-semibold text-slate-100">{b.label}</div>
                  {b.sub && <div className="text-slate-400">{b.sub}</div>}
                </div>
                <div className="flex items-center gap-3">
                  {cls ? <span className={cls}>{label}</span> : <span className="text-xs text-slate-400">{label}</span>}
                  <span className="w-24 text-right font-bold text-white">{b.brl ? formatBRL(b.brl) : "—"}</span>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="mt-3 flex justify-between border-t border-white/10 pt-3 text-sm">
          <span className="font-semibold text-slate-200">Já pago em hospedagem</span>
          <span className="text-lg font-bold text-emerald-300">{formatBRL(paid)}</span>
        </div>
      </Box>

      <Box title={`Checklist: ${done.size} de ${CHECKLIST.length} feitos`}
        action={<LinkButton onClick={() => go("organizar", "checklist")}>Abrir</LinkButton>}>
        <ul className="grid grid-cols-1 gap-1 text-sm sm:grid-cols-2">
          {CHECKLIST.map((c) => (
            <li key={c.id} className={done.has(c.id) ? "text-emerald-300 line-through opacity-70" : "text-slate-300"}>
              {done.has(c.id) ? "✅" : "☐"} {c.label}
            </li>
          ))}
        </ul>
      </Box>

      <details className="card p-5 no-print">
        <summary className="cursor-pointer text-sm font-semibold text-slate-300">Opções avançadas (dados em JSON)</summary>
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" className="btn-ghost" onClick={() => downloadTextFile("roteiro-japao-pedro-gio.json", JSON.stringify(buildJSON(), null, 2))}>
            <FileJson size={16} /> Baixar .json
          </button>
          <button type="button" className="btn-ghost" onClick={() => onCopy("json")}>
            <ClipboardCopy size={16} /> {copied === "json" ? "Copiado!" : "Copiar JSON"}
          </button>
        </div>
        <pre className="mt-3 max-h-80 overflow-auto rounded-xl border border-white/10 bg-black/40 p-4 text-xs leading-relaxed text-cyan-100">
          {JSON.stringify(buildJSON(), null, 2)}
        </pre>
      </details>
    </div>
  );
}
