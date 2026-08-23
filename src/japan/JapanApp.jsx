import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown, ArrowLeft, ArrowUp, BedDouble, Calendar, Check, ClipboardCopy,
  ExternalLink, FileDown, FileJson, Map as MapIcon, Minus, PackageCheck, Plus,
  ShoppingBag, Ticket, Train, Trash2, Utensils, Wallet,
} from "lucide-react";
import JapanMap from "./JapanMap.jsx";
import {
  CITIES, DAILY_STYLES, intercityRoute, JAPAN_ITINERARY, JAPAN_POIS,
  FOOD_GUIDE, JAPAN_TRIP, LODGING_AREAS, POI_CATEGORIES, SHOPPING_GUIDE,
  TRANSPORT_GUIDE,
} from "./japanData.js";
import { formatBRL } from "../lib/calc.js";
import { copyToClipboard, downloadTextFile } from "../lib/report.js";

const STORAGE_KEY = "voaja:japan:v3";

const DEFAULT_STAYS = [{ areaId: "asakusa", tier: "midrange", nights: 13 }];

const STAY_PRESETS = [
  { label: "Só Tóquio (13n)", stays: [{ areaId: "asakusa", tier: "midrange", nights: 13 }] },
  { label: "Clássico: Tóquio 8 + Kyoto 3 + Osaka 2", stays: [
    { areaId: "asakusa", tier: "midrange", nights: 8 },
    { areaId: "kawaramachi", tier: "midrange", nights: 3 },
    { areaId: "namba", tier: "midrange", nights: 2 },
  ]},
  { label: "Kansai forte: Tóquio 7 + Kyoto 3 + Osaka 3", stays: [
    { areaId: "asakusa", tier: "midrange", nights: 7 },
    { areaId: "kawaramachi", tier: "midrange", nights: 3 },
    { areaId: "namba", tier: "midrange", nights: 3 },
  ]},
  { label: "Com ryokan: Tóquio 8 + Hakone 1 + Kyoto 4", stays: [
    { areaId: "asakusa", tier: "midrange", nights: 8 },
    { areaId: "hakone-onsen", tier: "midrange", nights: 1 },
    { areaId: "kawaramachi", tier: "midrange", nights: 4 },
  ]},
  { label: "Base dupla: Tóquio 8 + Osaka 5 (Airbnb)", stays: [
    { areaId: "asakusa", tier: "airbnb", nights: 8 },
    { areaId: "namba", tier: "airbnb", nights: 5 },
  ]},
];

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

const TABS = [
  { id: "mapa", label: "Mapa", icon: MapIcon },
  { id: "bases", label: "Bases & Hotéis", icon: BedDouble },
  { id: "transporte", label: "Transporte", icon: Train },
  { id: "roteiro", label: "Roteiro", icon: Calendar },
  { id: "comida", label: "Comida", icon: Utensils },
  { id: "orcamento", label: "Orçamento", icon: Wallet },
  { id: "compras", label: "Compras", icon: ShoppingBag },
  { id: "plano", label: "Meu Plano", icon: PackageCheck },
];

const areaOf = (id) => LODGING_AREAS.find((a) => a.id === id);
const cityOf = (id) => CITIES.find((c) => c.id === id);
const tierLabel = (t) =>
  t === "hostel" ? "Hostel/cápsula"
  : t === "airbnb" ? "Airbnb (apto)"
  : t === "midrange" ? "Rede 2-3★"
  : "Hotel 4-5★";

export default function JapanApp() {
  const saved = useMemo(loadState, []);
  const [tab, setTab] = useState("mapa");
  const [selectedIds, setSelectedIds] = useState(
    () => new Set(saved?.selected ?? ["shibuya-sky", "teamlab", "sumo", "sensoji", "hakone"])
  );
  const [stays, setStays] = useState(() => {
    const s = saved?.stays;
    return Array.isArray(s) && s.length > 0 && s.every((x) => areaOf(x.areaId)) ? s : DEFAULT_STAYS;
  });
  const [dailyStyle, setDailyStyle] = useState(saved?.dailyStyle ?? "comfortable");

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ selected: [...selectedIds], stays, dailyStyle })
      );
    } catch { /* ignore */ }
  }, [selectedIds, stays, dailyStyle]);

  const togglePoi = (id) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const selectedPois = JAPAN_POIS.filter((p) => selectedIds.has(p.id));
  const style = DAILY_STYLES.find((s) => s.id === dailyStyle);

  // ==== Orçamento multi-bases ====
  const P = JAPAN_TRIP.people;
  const D = JAPAN_TRIP.days;
  const TARGET_NIGHTS = JAPAN_TRIP.nights;
  const remainingBudget = JAPAN_TRIP.totalBudgetBRL - JAPAN_TRIP.flightsPaidBRL;

  const stayRows = stays.map((s) => {
    const area = areaOf(s.areaId);
    const night = area?.priceNight[s.tier] ?? 0;
    return { ...s, area, city: cityOf(area?.city), night, total: night * s.nights };
  });
  const totalNights = stayRows.reduce((sum, s) => sum + s.nights, 0);
  const lodgingTotal = stayRows.reduce((sum, s) => sum + s.total, 0);

  // Trechos entre cidades: aeroporto (Tóquio) → bases → aeroporto (Tóquio)
  const citySeq = ["toquio", ...stayRows.map((s) => s.area?.city), "toquio"];
  const legs = [];
  for (let i = 0; i < citySeq.length - 1; i++) {
    const route = intercityRoute(citySeq[i], citySeq[i + 1]);
    if (route) {
      legs.push({
        from: cityOf(citySeq[i]),
        to: cityOf(citySeq[i + 1]),
        ...route,
        totalBRL: route.costBRL * P,
      });
    }
  }
  const intercityTotal = legs.reduce((s, l) => s + l.totalBRL, 0);

  const dailyPerPerson = style.foodBRL + style.transportBRL + style.funBRL;
  const dailyTotal = dailyPerPerson * P * D;
  const attractionsEntry = selectedPois.reduce((s, p) => s + p.costBRL, 0) * P;
  const attractionsSpend = selectedPois.reduce((s, p) => s + (p.spendBRL || 0), 0) * P;
  const fixed = 500 * P;
  const plannedSubtotal = lodgingTotal + intercityTotal + dailyTotal + attractionsEntry + fixed;
  const contingency = Math.round(plannedSubtotal * 0.08);
  const plannedTotal = plannedSubtotal + contingency;
  const leftover = remainingBudget - plannedTotal;
  const fits = leftover >= 0;
  const usagePct = Math.min(150, Math.round((plannedTotal / remainingBudget) * 100));

  const budget = {
    remainingBudget, lodgingTotal, intercityTotal, dailyPerPerson, dailyTotal,
    attractionsEntry, attractionsSpend, fixed, plannedSubtotal, contingency,
    plannedTotal, leftover, fits, usagePct, P, D, totalNights, TARGET_NIGHTS,
  };

  const baseAreas = [...new Map(stayRows.filter((s) => s.area).map((s) => [s.area.id, s.area])).values()];

  // ==== Export ====
  const buildPlanJSON = () => ({
    app: "VoaJá · Modo Japão",
    schema: "voaja.japan-plan/v3",
    generatedAt: new Date().toISOString(),
    trip: {
      destination: "Japão",
      arrive: "2026-12-09",
      depart: "2026-12-22",
      days: D,
      nights: TARGET_NIGHTS,
      people: P,
    },
    budgetBRL: {
      total: JAPAN_TRIP.totalBudgetBRL,
      flightsPaid: JAPAN_TRIP.flightsPaidBRL,
      remaining: remainingBudget,
      planned: {
        lodging: lodgingTotal,
        intercityTransport: intercityTotal,
        dailySpend: dailyTotal,
        attractionTickets: attractionsEntry,
        fixedCosts: fixed,
        contingency8pct: contingency,
        total: plannedTotal,
      },
      leftover,
      informalSpendEstimate: attractionsSpend,
    },
    stays: stayRows.map((s) => ({
      city: s.city?.label,
      area: s.area?.name,
      tier: s.tier,
      nights: s.nights,
      pricePerNightBRL: s.night,
      totalBRL: s.total,
      coordinates: { lat: s.area?.lat, lng: s.area?.lng },
      verdict: s.area?.verdict,
    })),
    intercityLegs: legs.map((l) => ({
      from: l.from?.label,
      to: l.to?.label,
      mode: l.label,
      costPerPersonBRL: l.costBRL,
      totalBRL: l.totalBRL,
    })),
    dailyStyle: {
      id: style.id,
      label: style.label,
      perPersonPerDayBRL: dailyPerPerson,
      breakdown: { food: style.foodBRL, transport: style.transportBRL, fun: style.funBRL },
    },
    selectedPlaces: selectedPois.map((p) => ({
      id: p.id,
      name: p.name,
      category: POI_CATEGORIES.find((c) => c.id === p.cat)?.label,
      coordinates: { lat: p.lat, lng: p.lng },
      entryCostBRL: p.costBRL,
      typicalSpendBRL: p.spendBRL || 0,
      duration: p.duration,
      transport: p.transport,
      tip: p.tip,
      howToBuy: p.howToBuy || null,
    })),
    itinerary: JAPAN_ITINERARY.map((d) => ({
      day: d.day, date: d.date, theme: d.theme, activities: d.items,
    })),
  });

  const buildSummaryText = () => {
    const L = [];
    L.push("🇯🇵 PLANO DE VIAGEM — JAPÃO");
    L.push(`📅 09 → 22/dez (${D} dias) · ${P} pessoas · chegada e volta por Narita (NRT)`);
    L.push("");
    L.push(`💰 Orçamento: ${formatBRL(JAPAN_TRIP.totalBudgetBRL)} · voos pagos ${formatBRL(JAPAN_TRIP.flightsPaidBRL)} · restante ${formatBRL(remainingBudget)}`);
    L.push("");
    L.push("🏨 BASES:");
    stayRows.forEach((s, i) => {
      L.push(`  ${i + 1}. ${s.city?.emoji} ${s.city?.label} — ${s.area?.name} (${tierLabel(s.tier)})`);
      L.push(`     ${s.nights} noites × ${formatBRL(s.night)} = ${formatBRL(s.total)}`);
    });
    if (legs.length) {
      L.push("");
      L.push("🚄 DESLOCAMENTOS:");
      legs.forEach((l) => {
        L.push(`  • ${l.from?.label} → ${l.to?.label}: ${l.label} — ${formatBRL(l.totalBRL)} (${P}p)`);
      });
    }
    L.push("");
    L.push(`🍜 Estilo diário: ${style.label} (${formatBRL(dailyPerPerson)}/dia/pessoa)`);
    L.push("");
    L.push(`🎟️ LUGARES ESCOLHIDOS (${selectedPois.length}):`);
    selectedPois.forEach((p) => {
      L.push(`  • ${p.name} — ${p.costBRL > 0 ? formatBRL(p.costBRL) + "/pessoa" : "grátis"}`);
      if (p.howToBuy) L.push(`     🎫 ${p.howToBuy}`);
    });
    L.push("");
    L.push("📊 CONTA FINAL:");
    L.push(`  Hospedagem: ${formatBRL(lodgingTotal)}`);
    L.push(`  Trens entre cidades: ${formatBRL(intercityTotal)}`);
    L.push(`  Diárias: ${formatBRL(dailyTotal)}`);
    L.push(`  Ingressos: ${formatBRL(attractionsEntry)}`);
    L.push(`  Seguro/chip: ${formatBRL(fixed)}`);
    L.push(`  Reserva 8%: ${formatBRL(contingency)}`);
    L.push(`  TOTAL: ${formatBRL(plannedTotal)}`);
    L.push(fits
      ? `  ✅ Cabe! Sobram ${formatBRL(leftover)}`
      : `  ⚠️ Estoura em ${formatBRL(-leftover)}`);
    L.push("");
    L.push(`Gerado em ${new Date().toLocaleString("pt-BR")} · VoaJá`);
    return L.join("\n");
  };

  const onPdf = () => {
    const t = document.title;
    document.title = "voaja-japao-plano";
    window.print();
    setTimeout(() => (document.title = t), 1000);
  };

  return (
    <div className="mx-auto min-h-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
      <Hero stayRows={stayRows} days={D} onPdf={onPdf} />

      <div className="anim-stagger mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatusCard label="Restante p/ gastar" value={formatBRL(remainingBudget)} sub={`de ${formatBRL(JAPAN_TRIP.totalBudgetBRL)} (voos pagos)`} />
        <StatusCard label="Planejado até agora" value={formatBRL(plannedTotal)} sub={`${usagePct}% do restante`} />
        <StatusCard
          label={fits ? "Folga" : "Estouro"}
          value={formatBRL(Math.abs(leftover))}
          sub={fits ? "dentro do orçamento ✅" : "ajuste o plano ⚠️"}
          highlight
          bad={!fits}
        />
        <StatusCard
          label="Noites planejadas"
          value={`${totalNights}/${TARGET_NIGHTS}`}
          sub={totalNights === TARGET_NIGHTS ? "bate com a viagem ✅" : "ajuste as noites ⚠️"}
          bad={totalNights !== TARGET_NIGHTS}
        />
      </div>

      <div className="anim-in card mt-3 p-3">
        <div className="flex justify-between text-[11px] text-slate-400">
          <span>Uso do orçamento restante ({formatBRL(remainingBudget)})</span>
          <span className={fits ? "text-emerald-300" : "text-rose-300"}>{usagePct}%</span>
        </div>
        <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-white/5">
          <div
            className={`bar-animated h-full rounded-full ${
              fits
                ? "bg-gradient-to-r from-emerald-400 to-teal-400"
                : "bg-gradient-to-r from-rose-500 to-red-500"
            }`}
            style={{ width: `${Math.min(100, usagePct)}%` }}
          />
        </div>
      </div>

      <nav className="sticky-tabs no-print mt-5">
        <div className="card flex flex-wrap gap-1.5 p-2">
          {TABS.map((t) => {
            const Icon = t.icon;
            const on = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold transition ${
                  on
                    ? "bg-rose-500/25 text-rose-50 ring-1 ring-inset ring-rose-400/50"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={14} /> {t.label}
                {t.id === "plano" && selectedIds.size > 0 && (
                  <span className="rounded-full bg-rose-500/40 px-1.5 text-[10px] font-bold">
                    {selectedIds.size}
                  </span>
                )}
                {t.id === "bases" && stays.length > 1 && (
                  <span className="rounded-full bg-rose-500/40 px-1.5 text-[10px] font-bold">
                    {stays.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      <main className="anim-in mt-4 space-y-5">
        {tab === "mapa" && (
          <JapanMap selectedIds={selectedIds} onToggle={togglePoi} bases={baseAreas} />
        )}

        {tab === "bases" && (
          <StaysTab
            stays={stays}
            setStays={setStays}
            stayRows={stayRows}
            legs={legs}
            budget={budget}
          />
        )}

        {tab === "transporte" && <TransportTab legs={legs} budget={budget} />}

        {tab === "roteiro" && <ItineraryTab />}

        {tab === "comida" && <FoodTab style={style} budget={budget} />}

        {tab === "compras" && <ShoppingTab />}

        {tab === "orcamento" && (
          <BudgetTab
            budget={budget}
            stayRows={stayRows}
            style={style}
            dailyStyle={dailyStyle}
            setDailyStyle={setDailyStyle}
            selectedPois={selectedPois}
          />
        )}

        {tab === "plano" && (
          <PlanTab
            budget={budget}
            stayRows={stayRows}
            legs={legs}
            style={style}
            selectedPois={selectedPois}
            onToggle={togglePoi}
            buildPlanJSON={buildPlanJSON}
            buildSummaryText={buildSummaryText}
            onPdf={onPdf}
          />
        )}
      </main>

      <footer className="mt-10 border-t border-white/10 pt-5 text-xs text-slate-400">
        Preços em BRL (¥100 ≈ R$3,30 · Mai/2026). Hospedagem = quarto/apto p/ 2 em dezembro.
        Shinkansen ~10% mais barato no app SmartEX. Reserve antes: teamLab, Shibuya Sky,
        asageiko de sumô e restaurantes concorridos. Iluminações vão até 25/dez — vocês pegam!
      </footer>
    </div>
  );
}

const HERO_IMAGES = [
  { url: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1600&q=75", alt: "Tóquio — Tokyo Tower entre prédios" },
  { url: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=1600&q=75", alt: "Toriis vermelhos de Fushimi Inari" },
  { url: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1600&q=75", alt: "Neon noturno de Tóquio" },
  { url: "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?auto=format&fit=crop&w=1600&q=75", alt: "Monte Fuji e pagode Chureito" },
];

function Hero({ stayRows, days, onPdf }) {
  return (
    <header className="anim-in card relative h-60 overflow-hidden sm:h-72">
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
      <div className="absolute inset-0 bg-gradient-to-t from-[#070a1a] via-[#070a1a]/55 to-[#070a1a]/10" />

      <div className="absolute right-4 top-4 flex items-center gap-2 no-print">
        <button type="button" className="btn-ghost backdrop-blur-md" onClick={onPdf}>
          <FileDown size={14} /> PDF
        </button>
        <a href="#/" className="btn-ghost backdrop-blur-md">
          <ArrowLeft size={14} /> Planejador
        </a>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-rose-300/90">
              VoaJá apresenta
            </div>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">
              <span className="gradient-text">Japão</span>{" "}
              <span className="text-white">2026</span>
            </h1>
            <p className="mt-1 text-xs text-slate-300 sm:text-sm">
              {JAPAN_TRIP.arrive} → {JAPAN_TRIP.depart} · {days} dias ·{" "}
              {stayRows.map((s) => `${s.city?.label} ${s.nights}n`).join(" + ")} · voos ✅
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <span className="chip backdrop-blur-md">🗺️ 96 lugares mapeados</span>
            <span className="chip backdrop-blur-md">♨️ onsen tattoo-OK</span>
            <span className="chip backdrop-blur-md">🎄 iluminações de dez</span>
          </div>
        </div>
      </div>
    </header>
  );
}

function StatusCard({ label, value, sub, highlight, bad }) {
  return (
    <div
      className={`card p-4 ${
        highlight
          ? bad
            ? "pulse-ring ring-1 ring-inset ring-rose-400/50"
            : "ring-1 ring-inset ring-emerald-400/40"
          : ""
      }`}
    >
      <div className="text-[11px] uppercase tracking-wider text-slate-400">{label}</div>
      <div className={`mt-1 truncate text-lg font-bold ${bad ? "text-rose-300" : "text-white"}`}>
        {value}
      </div>
      {sub && <div className="text-[11px] text-slate-400">{sub}</div>}
    </div>
  );
}

// ==== Aba Bases & Hotéis (multi-cidade) ====
function StaysTab({ stays, setStays, stayRows, legs, budget }) {
  const b = budget;
  const tiers = [
    { id: "hostel", label: "Hostel" },
    { id: "airbnb", label: "Airbnb" },
    { id: "midrange", label: "Rede 2-3★" },
    { id: "upscale", label: "4-5★" },
  ];

  const update = (i, patch) =>
    setStays(stays.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  const remove = (i) => setStays(stays.filter((_, idx) => idx !== i));
  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= stays.length) return;
    const next = [...stays];
    [next[i], next[j]] = [next[j], next[i]];
    setStays(next);
  };
  const addStay = () => {
    // sugere Kyoto se ainda não tem, senão Osaka
    const cities = new Set(stayRows.map((s) => s.area?.city));
    const areaId = !cities.has("kyoto") ? "kawaramachi" : !cities.has("osaka") ? "namba" : "hakone-onsen";
    setStays([...stays, { areaId, tier: "midrange", nights: 2 }]);
  };
  const setCity = (i, cityId) => {
    const firstArea = LODGING_AREAS.find((a) => a.city === cityId);
    if (firstArea) update(i, { areaId: firstArea.id });
  };

  return (
    <section className="space-y-4">
      <div className="card flex flex-wrap items-center justify-between gap-3 p-4">
        <div>
          <h3 className="text-base font-semibold text-white">Divida a viagem em bases</h3>
          <p className="text-xs text-slate-400">
            Ex.: 10 noites Tóquio + 3 Kyoto + 2 Osaka. O shinkansen entre as bases entra na
            conta sozinho. Total precisa fechar {b.TARGET_NIGHTS} noites.
          </p>
        </div>
        <div className={`text-right text-sm font-bold ${b.totalNights === b.TARGET_NIGHTS ? "text-emerald-300" : "text-rose-300"}`}>
          {b.totalNights}/{b.TARGET_NIGHTS} noites
          <div className="text-[11px] font-normal text-slate-400">
            hospedagem: {formatBRL(b.lodgingTotal)} · trens: {formatBRL(b.intercityTotal)}
          </div>
        </div>
      </div>

      {/* Presets */}
      <div className="card p-4">
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Combinações prontas (clique para aplicar):
        </div>
        <div className="flex flex-wrap gap-1.5">
          {STAY_PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => setStays(p.stays.map((s) => ({ ...s })))}
              className="rounded-lg border border-rose-400/30 bg-rose-500/10 px-2.5 py-1 text-xs text-rose-100 transition hover:bg-rose-500/20"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stays */}
      <ol className="anim-stagger space-y-3">
        {stayRows.map((s, i) => {
          const cityAreas = LODGING_AREAS.filter((a) => a.city === s.area?.city);
          return (
            <li key={i} className="card p-4">
              <div className="flex flex-wrap items-center gap-2">
                <div className="grid h-9 w-9 flex-none place-items-center rounded-full bg-rose-500/20 text-sm font-bold text-rose-100">
                  {i + 1}
                </div>

                {/* Cidade */}
                <div className="inline-flex rounded-xl border border-white/10 bg-white/5 p-1 text-xs">
                  {CITIES.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCity(i, c.id)}
                      className={`rounded-lg px-2.5 py-1.5 font-semibold transition ${
                        s.area?.city === c.id
                          ? "bg-rose-500/30 text-rose-50 ring-1 ring-inset ring-rose-400/40"
                          : "text-slate-300 hover:text-white"
                      }`}
                    >
                      {c.emoji} {c.label}
                    </button>
                  ))}
                </div>

                {/* Noites */}
                <div className="ml-auto flex items-center gap-1.5">
                  <button type="button" className="btn-ghost !px-2 !py-1.5" onClick={() => update(i, { nights: Math.max(1, s.nights - 1) })}>
                    <Minus size={13} />
                  </button>
                  <span className="w-16 text-center text-sm font-bold text-white">
                    {s.nights} noite{s.nights > 1 ? "s" : ""}
                  </span>
                  <button type="button" className="btn-ghost !px-2 !py-1.5" onClick={() => update(i, { nights: s.nights + 1 })}>
                    <Plus size={13} />
                  </button>
                </div>

                {/* Ordem / remover */}
                <div className="flex items-center gap-1">
                  <button type="button" className="btn-ghost !px-2 !py-1.5" onClick={() => move(i, -1)} disabled={i === 0}>
                    <ArrowUp size={13} />
                  </button>
                  <button type="button" className="btn-ghost !px-2 !py-1.5" onClick={() => move(i, 1)} disabled={i === stays.length - 1}>
                    <ArrowDown size={13} />
                  </button>
                  <button
                    type="button"
                    className="btn-ghost !px-2 !py-1.5 text-rose-300"
                    onClick={() => remove(i)}
                    disabled={stays.length === 1}
                    title="Remover base"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Área + tier + preço */}
              <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    {cityAreas.map((a) => {
                      const on = a.id === s.areaId;
                      const night = a.priceNight[s.tier];
                      return (
                        <button
                          key={a.id}
                          type="button"
                          onClick={() => update(i, { areaId: a.id })}
                          className={`rounded-xl border p-3 text-left text-xs transition ${
                            on
                              ? "border-rose-400/50 bg-rose-500/10"
                              : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                          }`}
                          title={a.verdict}
                        >
                          <div className="flex items-center justify-between font-bold text-white">
                            <span>{a.emoji} {a.name}</span>
                            {on && <Check size={13} className="text-rose-300" />}
                          </div>
                          <div className="mt-1 text-sm font-bold text-white">
                            {formatBRL(night)}
                            <span className="text-[10px] font-normal text-slate-400">/noite</span>
                          </div>
                          <div className="mt-1 line-clamp-2 text-[10px] text-slate-400">{a.verdict}</div>
                        </button>
                      );
                    })}
                  </div>
                  {s.area?.chains && (
                    <div className="mt-2 rounded-lg bg-cyan-500/5 p-2.5 text-[11px] text-cyan-100 ring-1 ring-inset ring-cyan-400/15">
                      🏢 Redes 2-3★ nesta área: {s.area.chains.join(" · ")}
                    </div>
                  )}
                </div>
                <div>
                  <div className="inline-flex w-full rounded-xl border border-white/10 bg-white/5 p-1 text-xs">
                    {tiers.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => update(i, { tier: t.id })}
                        className={`flex-1 rounded-lg px-2 py-1.5 font-semibold transition ${
                          s.tier === t.id
                            ? "bg-rose-500/30 text-rose-50 ring-1 ring-inset ring-rose-400/40"
                            : "text-slate-300"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 rounded-xl bg-white/[0.04] p-3 text-center">
                    <div className="text-[10px] uppercase tracking-wider text-slate-400">
                      Esta base ({s.nights}n × {formatBRL(s.night)})
                    </div>
                    <div className="text-lg font-bold text-white">{formatBRL(s.total)}</div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <button type="button" className="btn-primary w-full" onClick={addStay}>
        <Plus size={14} /> Adicionar base (Kyoto, Osaka, Hakone…)
      </button>

      {/* Trechos */}
      {legs.length > 0 && (
        <div className="card p-4">
          <h4 className="mb-2 text-sm font-bold text-white">
            <Train size={14} className="mr-1.5 inline -mt-0.5 text-cyan-300" />
            Deslocamentos entre cidades (calculados)
          </h4>
          <ul className="divide-y divide-white/5 text-xs">
            {legs.map((l, i) => (
              <li key={i} className="flex flex-wrap items-center justify-between gap-2 py-2">
                <span className="text-slate-200">
                  {l.from?.emoji} {l.from?.label} → {l.to?.emoji} {l.to?.label}
                  <span className="ml-2 text-slate-400">{l.label}</span>
                </span>
                <span className="font-semibold text-white">
                  {formatBRL(l.totalBRL)} <span className="font-normal text-slate-400">({formatBRL(l.costBRL)}/pessoa)</span>
                </span>
              </li>
            ))}
            <li className="flex justify-between py-2 font-bold text-white">
              <span>Total em trens</span>
              <span>{formatBRL(b.intercityTotal)}</span>
            </li>
          </ul>
        </div>
      )}
    </section>
  );
}

function TransportTab({ legs, budget }) {
  return (
    <section className="space-y-4">
      {legs.length > 0 && (
        <div className="card border-cyan-400/20 bg-gradient-to-r from-cyan-500/10 to-sky-500/10 p-4 text-sm text-cyan-50">
          🚄 Seu plano atual tem <strong>{legs.length} deslocamento(s)</strong> entre cidades,
          somando <strong>{formatBRL(budget.intercityTotal)}</strong> — detalhes na aba Bases.
        </div>
      )}
      <div className="anim-stagger grid grid-cols-1 gap-4 lg:grid-cols-2">
        {TRANSPORT_GUIDE.map((t) => (
          <div key={t.id} className="card card-hover p-5">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-bold text-white">{t.name}</h3>
              <span className="chip flex-none">
                {t.costBRL > 0 ? `${formatBRL(t.costBRL)} · ${t.per}` : t.per}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-300">{t.desc}</p>
            <div className="mt-2 rounded-lg bg-amber-500/10 p-2.5 text-xs text-amber-100 ring-1 ring-inset ring-amber-400/20">
              💡 {t.tip}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ItineraryTab() {
  return (
    <section className="space-y-3">
      <div className="card p-4 text-xs text-slate-300">
        Roteiro sugerido 09→22/dez: iluminações de Natal por toda parte, onsen
        tattoo-friendly, hidden gems e bloco Kyoto/Nara/Osaka nos dias 18-21 (alinhe com
        suas bases na aba Bases). Dezembro não tem torneio de sumô — mas tem treino
        matinal (asageiko), no dia 17.
      </div>
      <ol className="anim-stagger space-y-2.5">
        {JAPAN_ITINERARY.map((d) => (
          <li key={d.day} className="card card-hover flex gap-4 p-4">
            <div className="flex-none text-center">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-rose-500/15 text-xl">
                {d.icon}
              </div>
              <div className="mt-1 text-[10px] font-bold uppercase text-slate-400">Dia {d.day}</div>
              <div className="text-[10px] text-slate-500">{d.date}</div>
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-bold text-white">{d.theme}</h4>
              <ul className="mt-1.5 space-y-1 text-xs text-slate-300">
                {d.items.map((it, i) => (
                  <li key={i} className="flex gap-1.5">
                    <span className="mt-1 h-1 w-1 flex-none rounded-full bg-rose-400" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function BudgetTab({ budget, stayRows, style, dailyStyle, setDailyStyle, selectedPois }) {
  const b = budget;
  const staysLabel = stayRows.map((s) => `${s.city?.label} ${s.nights}n`).join(" + ");
  const rows = [
    { label: `🏨 Hospedagem (${staysLabel})`, value: b.lodgingTotal },
    { label: `🚄 Trens entre cidades`, value: b.intercityTotal },
    { label: `🍜 Diárias (${style.label}) × ${b.D}d × ${b.P}p`, value: b.dailyTotal },
    { label: `🎟️ Ingressos dos ${selectedPois.length} lugares`, value: b.attractionsEntry },
    { label: "🛡️ Seguro + eSIM + extras", value: b.fixed },
    { label: "🧯 Reserva de imprevistos (8%)", value: b.contingency },
  ];
  const max = Math.max(...rows.map((r) => r.value), 1);

  return (
    <section className="space-y-4">
      <div className="card border-emerald-400/20 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 p-4 text-sm text-emerald-50">
        ✈️ <strong>Voos já pagos: {formatBRL(18000)}.</strong> A conta abaixo trata só do que
        falta gastar, contra o restante de <strong>{formatBRL(b.remainingBudget)}</strong>.
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <h3 className="text-sm font-bold text-white">Estilo de gasto diário</h3>
          <div className="mt-3 space-y-1.5">
            {DAILY_STYLES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setDailyStyle(s.id)}
                className={`w-full rounded-xl border p-3 text-left text-xs transition ${
                  dailyStyle === s.id
                    ? "border-rose-400/50 bg-rose-500/10 text-white"
                    : "border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.06]"
                }`}
              >
                <div className="flex justify-between font-semibold">
                  <span>{s.label}</span>
                  <span>{formatBRL(s.foodBRL + s.transportBRL + s.funBRL)}/dia/pessoa</span>
                </div>
                <div className="mt-0.5 text-slate-400">{s.desc}</div>
                {s.meals && (
                  <div className="mt-1.5 flex flex-wrap gap-2 text-[10px] text-slate-400">
                    <span>🏪 café {formatBRL(s.meals.breakfast)}</span>
                    <span>🍛 almoço {formatBRL(s.meals.lunch)}</span>
                    <span>🔥 janta {formatBRL(s.meals.dinner)}</span>
                    <span className="ml-auto font-semibold text-slate-300">= {formatBRL(s.foodBRL)} comida/dia</span>
                  </div>
                )}
              </button>
            ))}
          </div>
          {b.attractionsSpend > 0 && (
            <div className="mt-3 rounded-lg bg-white/[0.04] p-2.5 text-[11px] text-slate-300">
              ➕ Gasto informal esperado nos lugares do plano: ~{formatBRL(b.attractionsSpend)}
              (compras/comida no local — parte já coberta na diária).
            </div>
          )}
        </div>

        <div className="card p-5">
          <header className="mb-3 flex items-end justify-between">
            <h3 className="text-sm font-bold text-white">O que falta gastar</h3>
            <div className="text-right">
              <div className="text-[11px] uppercase tracking-wider text-slate-400">Planejado</div>
              <div className="text-2xl font-bold text-white">{formatBRL(b.plannedTotal)}</div>
              <div className={`text-[11px] font-semibold ${b.fits ? "text-emerald-300" : "text-rose-300"}`}>
                {b.fits ? `✅ sobra ${formatBRL(b.leftover)}` : `⚠️ estoura ${formatBRL(-b.leftover)}`}
              </div>
            </div>
          </header>
          <ul className="space-y-2.5">
            {rows.map((r, i) => {
              const pct = Math.round((r.value / max) * 100);
              const share = Math.round((r.value / Math.max(1, b.plannedTotal)) * 100);
              return (
                <li key={i}>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-200">{r.label}</span>
                    <span className="tabular-nums font-semibold text-white">
                      {formatBRL(r.value)}{" "}
                      <span className="font-normal text-slate-400">({share}%)</span>
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded bg-white/5">
                    <div
                      className="bar-animated h-full rounded bg-gradient-to-r from-rose-500 to-red-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

function PlanTab({
  budget, stayRows, legs, style, selectedPois, onToggle,
  buildPlanJSON, buildSummaryText, onPdf,
}) {
  const [copied, setCopied] = useState(null);
  const b = budget;

  const onDownloadJSON = () => {
    downloadTextFile("voaja-plano-japao.json", JSON.stringify(buildPlanJSON(), null, 2));
  };
  const onCopyJSON = async () => {
    const ok = await copyToClipboard(JSON.stringify(buildPlanJSON(), null, 2));
    if (ok) { setCopied("json"); setTimeout(() => setCopied(null), 2000); }
  };
  const onCopyText = async () => {
    const ok = await copyToClipboard(buildSummaryText());
    if (ok) { setCopied("texto"); setTimeout(() => setCopied(null), 2000); }
  };

  const byCat = POI_CATEGORIES.map((c) => ({
    cat: c,
    pois: selectedPois.filter((p) => p.cat === c.id),
  })).filter((g) => g.pois.length > 0);

  return (
    <section className="space-y-4">
      <div className="card flex flex-wrap items-center justify-between gap-3 p-5">
        <div>
          <h3 className="text-base font-bold text-white">
            <PackageCheck size={16} className="mr-1.5 inline -mt-1 text-emerald-300" />
            Tudo que vocês escolheram, compilado
          </h3>
          <p className="text-xs text-slate-400">
            Exporte em JSON (estruturado, pronto p/ virar app) ou como resumo de texto.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 no-print">
          <button type="button" className="btn-primary" onClick={onDownloadJSON}>
            <FileJson size={14} /> Baixar .json
          </button>
          <button type="button" className="btn-ghost" onClick={onCopyJSON}>
            <ClipboardCopy size={14} /> {copied === "json" ? "Copiado!" : "Copiar JSON"}
          </button>
          <button type="button" className="btn-ghost" onClick={onCopyText}>
            <ClipboardCopy size={14} /> {copied === "texto" ? "Copiado!" : "Resumo p/ WhatsApp"}
          </button>
          <button type="button" className="btn-ghost" onClick={onPdf}>
            <FileDown size={14} /> PDF
          </button>
        </div>
      </div>

      {/* Bases resumo */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <div className="text-[11px] uppercase tracking-wider text-slate-400">Bases da viagem</div>
          <ul className="mt-2 space-y-2">
            {stayRows.map((s, i) => (
              <li key={i} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span className="font-semibold text-white">
                  {i + 1}. {s.city?.emoji} {s.city?.label} — {s.area?.name}
                  <span className="ml-2 font-normal text-slate-400">{tierLabel(s.tier)}</span>
                </span>
                <span className="text-slate-200">
                  {s.nights}n × {formatBRL(s.night)} ={" "}
                  <span className="font-bold text-white">{formatBRL(s.total)}</span>
                </span>
              </li>
            ))}
            {legs.map((l, i) => (
              <li key={`leg-${i}`} className="flex justify-between text-xs text-cyan-200/80">
                <span>🚄 {l.from?.label} → {l.to?.label} ({l.label})</span>
                <span>{formatBRL(l.totalBRL)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-5">
          <div className="text-[11px] uppercase tracking-wider text-slate-400">Conta final</div>
          <div className={`mt-1 text-lg font-bold ${b.fits ? "text-emerald-300" : "text-rose-300"}`}>
            {formatBRL(b.plannedTotal)} / {formatBRL(b.remainingBudget)}
          </div>
          <div className="text-xs text-slate-300">
            {b.fits ? `Sobram ${formatBRL(b.leftover)}` : `Estoura ${formatBRL(-b.leftover)}`}
            {" · "}{style.label}
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded bg-white/5">
            <div
              className={`bar-animated h-full rounded ${b.fits ? "bg-emerald-400" : "bg-rose-400"}`}
              style={{ width: `${Math.min(100, b.usagePct)}%` }}
            />
          </div>
        </div>
      </div>

      {selectedPois.length === 0 ? (
        <div className="card p-6 text-center text-sm text-slate-300">
          Nenhum lugar escolhido ainda — volte ao Mapa e toque em "+ Adicionar ao plano".
        </div>
      ) : (
        <div className="anim-stagger space-y-3">
          {byCat.map(({ cat, pois }) => (
            <div key={cat.id} className="card p-5">
              <h4 className="mb-2 text-sm font-bold text-white">
                {cat.emoji} {cat.label}{" "}
                <span className="font-normal text-slate-400">({pois.length})</span>
              </h4>
              <ul className="divide-y divide-white/5">
                {pois.map((p) => (
                  <li key={p.id} className="flex flex-wrap items-center gap-x-2 gap-y-1 py-2 text-xs">
                    <Check size={13} className="flex-none text-emerald-300" />
                    <span className="min-w-0 flex-1 font-semibold text-slate-100">{p.name}</span>
                    <span className="text-slate-400">{p.duration}</span>
                    <span className="w-20 text-right font-semibold text-white">
                      {p.costBRL > 0 ? formatBRL(p.costBRL) : "Grátis"}
                    </span>
                    <button
                      type="button"
                      onClick={() => onToggle(p.id)}
                      className="no-print rounded-md border border-white/10 px-1.5 py-0.5 text-[10px] text-slate-400 hover:border-rose-400/40 hover:text-rose-300"
                    >
                      remover
                    </button>
                    {p.howToBuy && (
                      <div className="ml-6 w-full text-[10px] text-cyan-200/80">
                        🎫 {p.howToBuy}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="card flex items-center justify-between p-4 text-sm">
            <span className="font-semibold text-slate-200">
              <Ticket size={14} className="mr-1.5 inline -mt-0.5 text-amber-300" />
              Total em ingressos ({selectedPois.length} lugares × {b.P} pessoas)
            </span>
            <span className="text-lg font-bold text-white">{formatBRL(b.attractionsEntry)}</span>
          </div>
        </div>
      )}

      <details className="card p-5">
        <summary className="cursor-pointer text-sm font-bold text-white">
          <FileJson size={14} className="mr-1.5 inline -mt-0.5 text-cyan-300" />
          Prévia do JSON exportado (schema voaja.japan-plan/v3)
        </summary>
        <pre className="mt-3 max-h-80 overflow-auto rounded-xl border border-white/10 bg-black/40 p-4 text-[11px] leading-relaxed text-cyan-100">
          {JSON.stringify(buildPlanJSON(), null, 2)}
        </pre>
      </details>
    </section>
  );
}

function ShoppingTab() {
  return (
    <section className="space-y-4">
      <div className="card border-amber-400/20 bg-gradient-to-r from-amber-500/10 to-orange-500/10 p-4 text-sm text-amber-50">
        🛍️ <strong>Compras ficam FORA dos cálculos do orçamento</strong> — é gasto pessoal de
        cada um. Use os links p/ pesquisar preços antes. Regra de ouro: tax-free acima de
        ¥5.000 por loja (passaporte em mãos), e Yodobashi/Bic têm cupom de turista de 5-7%.
      </div>
      <div className="anim-stagger space-y-4">
        {SHOPPING_GUIDE.map((sec) => (
          <div key={sec.id} className="card p-5">
            <h3 className="mb-3 text-sm font-bold text-white">
              {sec.emoji} {sec.label}{" "}
              <span className="font-normal text-slate-400">({sec.items.length} lugares)</span>
            </h3>
            <ul className="grid grid-cols-1 gap-2 lg:grid-cols-2">
              {sec.items.map((it) => (
                <li
                  key={it.name}
                  className="flex items-start justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 transition hover:bg-white/[0.06]"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white">{it.name}</div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-500">{it.area}</div>
                    <div className="mt-1 text-[11px] text-slate-300">{it.desc}</div>
                  </div>
                  <a
                    href={it.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost flex-none !px-2.5 !py-1.5 text-[11px]"
                    title={`Abrir site: ${it.url}`}
                  >
                    <ExternalLink size={12} /> site
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function FoodTab({ style, budget }) {
  const m = style.meals ?? { breakfast: 0, lunch: 0, dinner: 0 };
  const foodDay = style.foodBRL;
  const foodTrip = foodDay * budget.P * budget.D;
  return (
    <section className="space-y-4">
      <div className="card border-amber-400/20 bg-gradient-to-r from-amber-500/10 to-rose-500/10 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white">
              🍜 A conta da comida — no estilo de vocês
            </h3>
            <p className="mt-1 text-xs text-slate-300">
              Café no 7-Eleven → almoço na rua → janta de esquina ou hypada das redes.
              Já está DENTRO da diária do orçamento (estilo "{style.label}").
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-center">
            <MealStat emoji="🏪" label="Café" value={m.breakfast} />
            <MealStat emoji="🍛" label="Almoço" value={m.lunch} />
            <MealStat emoji="🔥" label="Janta" value={m.dinner} />
            <div className="rounded-xl bg-white/10 px-3 py-2">
              <div className="text-[10px] uppercase tracking-wider text-slate-300">Dia/pessoa</div>
              <div className="text-lg font-bold text-white">{formatBRL(foodDay)}</div>
              <div className="text-[10px] text-slate-400">
                {formatBRL(foodTrip)} na viagem ({budget.P}p)
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="anim-stagger space-y-4">
        {FOOD_GUIDE.map((sec) => (
          <div key={sec.id} className="card p-5">
            <h3 className="text-sm font-bold text-white">{sec.emoji} {sec.label}</h3>
            <p className="mt-0.5 text-[11px] text-slate-400">{sec.note}</p>
            <ul className="mt-3 grid grid-cols-1 gap-2 lg:grid-cols-2">
              {sec.items.map((it) => (
                <li
                  key={it.name}
                  className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 transition hover:bg-white/[0.06]"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white">{it.name}</div>
                    <div className="text-[11px] text-slate-400">{it.desc}</div>
                  </div>
                  <div className="flex-none text-right">
                    <div className="text-sm font-bold text-white">{formatBRL(it.priceBRL)}</div>
                    <div className="text-[10px] text-slate-500">{it.yen}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="card p-4 text-xs text-slate-300">
        💡 Dicas de ouro: água/chá do konbini (¥110) em vez de restaurante; máquinas de venda
        têm café quente (¥130); depachika depois das 19h30 = bentos gourmet pela metade;
        gorjeta NÃO existe no Japão — o preço é o preço.
      </div>
    </section>
  );
}

function MealStat({ emoji, label, value }) {
  return (
    <div className="rounded-xl bg-white/5 px-3 py-2">
      <div className="text-[10px] uppercase tracking-wider text-slate-400">{emoji} {label}</div>
      <div className="text-sm font-bold text-white">{formatBRL(value)}</div>
    </div>
  );
}
