import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft, BedDouble, Calendar, Check, ClipboardCopy, FileDown, FileJson,
  Map as MapIcon, PackageCheck, Ticket, Train, Wallet,
} from "lucide-react";
import JapanMap from "./JapanMap.jsx";
import {
  DAILY_STYLES, JAPAN_ITINERARY, JAPAN_POIS, JAPAN_TRIP,
  LODGING_AREAS, POI_CATEGORIES, TRANSPORT_GUIDE,
} from "./japanData.js";
import { formatBRL } from "../lib/calc.js";
import { copyToClipboard, downloadTextFile } from "../lib/report.js";

const STORAGE_KEY = "voaja:japan:v2";

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
  { id: "hospedagem", label: "Hospedagem", icon: BedDouble },
  { id: "transporte", label: "Transporte", icon: Train },
  { id: "roteiro", label: "Roteiro", icon: Calendar },
  { id: "orcamento", label: "Orçamento", icon: Wallet },
  { id: "plano", label: "Meu Plano", icon: PackageCheck },
];

export default function JapanApp() {
  const saved = useMemo(loadState, []);
  const [tab, setTab] = useState("mapa");
  const [selectedIds, setSelectedIds] = useState(
    () => new Set(saved?.selected ?? ["shibuya-sky", "teamlab", "sumo", "sensoji", "hakone"])
  );
  const [lodgingId, setLodgingId] = useState(saved?.lodgingId ?? "asakusa");
  const [lodgingTier, setLodgingTier] = useState(saved?.lodgingTier ?? "midrange");
  const [dailyStyle, setDailyStyle] = useState(saved?.dailyStyle ?? "comfortable");

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ selected: [...selectedIds], lodgingId, lodgingTier, dailyStyle })
      );
    } catch { /* ignore */ }
  }, [selectedIds, lodgingId, lodgingTier, dailyStyle]);

  const togglePoi = (id) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const selectedPois = JAPAN_POIS.filter((p) => selectedIds.has(p.id));
  const lodging = LODGING_AREAS.find((a) => a.id === lodgingId);
  const style = DAILY_STYLES.find((s) => s.id === dailyStyle);

  // ==== Orçamento: R$40k total, R$18k já pago em voos → R$22k restantes ====
  const P = JAPAN_TRIP.people;
  const N = JAPAN_TRIP.nights;
  const D = JAPAN_TRIP.days;
  const remainingBudget = JAPAN_TRIP.totalBudgetBRL - JAPAN_TRIP.flightsPaidBRL;

  const lodgingNight = lodging?.priceNight[lodgingTier] ?? 0;
  const lodgingTotal = lodgingNight * N; // quarto para 2
  const dailyPerPerson = style.foodBRL + style.transportBRL + style.funBRL;
  const dailyTotal = dailyPerPerson * P * D;
  const attractionsEntry = selectedPois.reduce((s, p) => s + p.costBRL, 0) * P;
  const attractionsSpend = selectedPois.reduce((s, p) => s + (p.spendBRL || 0), 0) * P;
  const fixed = 500 * P;
  const plannedSubtotal = lodgingTotal + dailyTotal + attractionsEntry + fixed;
  const contingency = Math.round(plannedSubtotal * 0.08);
  const plannedTotal = plannedSubtotal + contingency;
  const leftover = remainingBudget - plannedTotal;
  const fits = leftover >= 0;
  const usagePct = Math.min(150, Math.round((plannedTotal / remainingBudget) * 100));

  const budget = {
    remainingBudget, lodgingNight, lodgingTotal, dailyPerPerson, dailyTotal,
    attractionsEntry, attractionsSpend, fixed, plannedSubtotal, contingency,
    plannedTotal, leftover, fits, usagePct, P, N, D,
  };

  // ==== Export: estrutura JSON completa do plano ====
  const buildPlanJSON = () => ({
    app: "VoaJá · Modo Japão",
    schema: "voaja.japan-plan/v1",
    generatedAt: new Date().toISOString(),
    trip: {
      destination: "Tóquio, Japão",
      arrive: "2027-01-07",
      depart: "2027-01-22",
      days: D,
      nights: N,
      people: P,
    },
    budgetBRL: {
      total: JAPAN_TRIP.totalBudgetBRL,
      flightsPaid: JAPAN_TRIP.flightsPaidBRL,
      remaining: remainingBudget,
      planned: {
        lodging: lodgingTotal,
        dailySpend: dailyTotal,
        attractionTickets: attractionsEntry,
        fixedCosts: fixed,
        contingency8pct: contingency,
        total: plannedTotal,
      },
      leftover,
      informalSpendEstimate: attractionsSpend,
    },
    lodging: {
      area: lodging?.name,
      tier: lodgingTier,
      pricePerNightBRL: lodgingNight,
      nights: N,
      totalBRL: lodgingTotal,
      coordinates: { lat: lodging?.lat, lng: lodging?.lng },
      verdict: lodging?.verdict,
    },
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
    })),
    itinerary: JAPAN_ITINERARY.map((d) => ({
      day: d.day, date: d.date, theme: d.theme, activities: d.items,
    })),
  });

  const buildSummaryText = () => {
    const L = [];
    L.push("🇯🇵 PLANO DE VIAGEM — JAPÃO");
    L.push(`📅 07 → 22/jan (${D} dias) · ${P} pessoas`);
    L.push("");
    L.push(`💰 Orçamento total: ${formatBRL(JAPAN_TRIP.totalBudgetBRL)}`);
    L.push(`✈️ Voos (pagos): ${formatBRL(JAPAN_TRIP.flightsPaidBRL)}`);
    L.push(`💵 Restante p/ a viagem: ${formatBRL(remainingBudget)}`);
    L.push("");
    L.push(`🏨 Base: ${lodging?.emoji} ${lodging?.name} (${lodgingTier === "hostel" ? "hostel" : lodgingTier === "midrange" ? "hotel 3★" : "hotel 4-5★"})`);
    L.push(`   ${formatBRL(lodgingNight)}/noite × ${N} noites = ${formatBRL(lodgingTotal)}`);
    L.push(`🍜 Estilo diário: ${style.label} (${formatBRL(dailyPerPerson)}/dia/pessoa)`);
    L.push("");
    L.push(`🎟️ LUGARES ESCOLHIDOS (${selectedPois.length}):`);
    selectedPois.forEach((p) => {
      L.push(`  • ${p.name} — ${p.costBRL > 0 ? formatBRL(p.costBRL) + "/pessoa" : "grátis"}`);
    });
    L.push("");
    L.push("📊 CONTA FINAL:");
    L.push(`  Hospedagem: ${formatBRL(lodgingTotal)}`);
    L.push(`  Diárias (comida+metrô+lazer): ${formatBRL(dailyTotal)}`);
    L.push(`  Ingressos: ${formatBRL(attractionsEntry)}`);
    L.push(`  Seguro/chip: ${formatBRL(fixed)}`);
    L.push(`  Reserva 8%: ${formatBRL(contingency)}`);
    L.push(`  TOTAL PLANEJADO: ${formatBRL(plannedTotal)}`);
    L.push(fits
      ? `  ✅ Cabe! Sobram ${formatBRL(leftover)} do orçamento`
      : `  ⚠️ Estoura o restante em ${formatBRL(-leftover)}`);
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
      <header className="anim-in flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="floaty grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-2xl shadow-soft">
            🇯🇵
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl">
              <span className="gradient-text">Japão</span>{" "}
              <span className="text-white">· Acompanhamento da viagem</span>
            </h1>
            <p className="text-xs text-slate-400 sm:text-sm">
              {JAPAN_TRIP.arrive} → {JAPAN_TRIP.depart} · {D} dias · {P} pessoas · voos ✅ pagos
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 no-print">
          <button type="button" className="btn-ghost" onClick={onPdf}>
            <FileDown size={14} /> PDF
          </button>
          <a href="#/" className="btn-ghost">
            <ArrowLeft size={14} /> Planejador
          </a>
        </div>
      </header>

      {/* Painel de orçamento vivo */}
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
        <StatusCard label="Lugares no plano" value={selectedIds.size} sub={`${formatBRL(attractionsEntry)} em ingressos`} />
      </div>

      {/* Barra de progresso do orçamento */}
      <div className="anim-in card mt-3 p-3">
        <div className="flex justify-between text-[11px] text-slate-400">
          <span>Uso do orçamento restante ({formatBRL(remainingBudget)})</span>
          <span className={fits ? "text-emerald-300" : "text-rose-300"}>
            {usagePct}%
          </span>
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

      {/* Tabs sticky */}
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
              </button>
            );
          })}
        </div>
      </nav>

      <main className="anim-in mt-4 space-y-5">
        {tab === "mapa" && (
          <JapanMap selectedIds={selectedIds} onToggle={togglePoi} lodgingId={lodgingId} />
        )}

        {tab === "hospedagem" && (
          <LodgingTab
            lodgingId={lodgingId}
            setLodgingId={setLodgingId}
            lodgingTier={lodgingTier}
            setLodgingTier={setLodgingTier}
            nights={N}
          />
        )}

        {tab === "transporte" && <TransportTab />}

        {tab === "roteiro" && <ItineraryTab />}

        {tab === "orcamento" && (
          <BudgetTab
            budget={budget}
            lodging={lodging}
            style={style}
            dailyStyle={dailyStyle}
            setDailyStyle={setDailyStyle}
            selectedPois={selectedPois}
          />
        )}

        {tab === "plano" && (
          <PlanTab
            budget={budget}
            lodging={lodging}
            lodgingTier={lodgingTier}
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
        Preços em BRL convertidos de ienes (¥100 ≈ R$3,30 · Mai/2026). Janeiro pós-Ano Novo é
        baixa temporada — hotéis mais baratos e filas curtas. Reserve com antecedência: sumô,
        teamLab, Shibuya Sky e Ghibli (ingresso de jan abre 10/dez).
      </footer>
    </div>
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

function LodgingTab({ lodgingId, setLodgingId, lodgingTier, setLodgingTier, nights }) {
  const tiers = [
    { id: "hostel", label: "Hostel/cápsula" },
    { id: "midrange", label: "Hotel 3★" },
    { id: "upscale", label: "Hotel 4-5★" },
  ];
  return (
    <section className="space-y-4">
      <div className="card flex flex-wrap items-center justify-between gap-3 p-4">
        <div>
          <h3 className="text-base font-semibold text-white">Onde ficar — compare os bairros</h3>
          <p className="text-xs text-slate-400">
            Preço por noite do QUARTO p/ 2, janeiro (baixa temporada). A escolha aparece 🏨 no mapa.
          </p>
        </div>
        <div className="inline-flex rounded-xl border border-white/10 bg-white/5 p-1 text-xs">
          {tiers.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setLodgingTier(t.id)}
              className={`rounded-lg px-3 py-1.5 font-semibold transition ${
                lodgingTier === t.id
                  ? "bg-rose-500/30 text-rose-50 ring-1 ring-inset ring-rose-400/40"
                  : "text-slate-300"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="anim-stagger grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {LODGING_AREAS.map((a) => {
          const on = a.id === lodgingId;
          const night = a.priceNight[lodgingTier];
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => setLodgingId(a.id)}
              className={`card card-hover p-5 text-left ${on ? "ring-2 ring-rose-400/60" : ""}`}
            >
              <div className="flex items-start justify-between">
                <div className="text-lg font-bold text-white">
                  {a.emoji} {a.name}
                </div>
                {on && <span className="badge-ok">Sua base</span>}
              </div>
              <div className="mt-2 text-2xl font-bold text-white">
                {formatBRL(night)}
                <span className="text-xs font-normal text-slate-400"> /noite</span>
              </div>
              <div className="text-[11px] text-slate-400">
                {nights} noites: {formatBRL(night * nights)}
              </div>
              <ul className="mt-3 space-y-1 text-xs text-slate-300">
                {a.pros.map((p, i) => (
                  <li key={i}>✅ {p}</li>
                ))}
                {a.cons.map((c, i) => (
                  <li key={i} className="text-slate-400">⚠️ {c}</li>
                ))}
              </ul>
              <div className="mt-3 rounded-lg bg-white/[0.04] p-2.5 text-xs italic text-slate-200">
                {a.verdict}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function TransportTab() {
  return (
    <section className="anim-stagger grid grid-cols-1 gap-4 lg:grid-cols-2">
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
    </section>
  );
}

function ItineraryTab() {
  return (
    <section className="space-y-3">
      <div className="card p-4 text-xs text-slate-300">
        Roteiro sugerido 07→22/jan com o torneio de sumô (10-24/jan) e extensão opcional
        Kyoto/Nara/Osaka nos dias 18-21. Ajuste os day trips pelo tempo — Fuji só em dia limpo.
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

function BudgetTab({ budget, lodging, style, dailyStyle, setDailyStyle, selectedPois }) {
  const b = budget;
  const rows = [
    { label: `🏨 Hospedagem ${lodging?.name} · ${b.N} noites`, value: b.lodgingTotal },
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
                {b.fits
                  ? `✅ sobra ${formatBRL(b.leftover)}`
                  : `⚠️ estoura ${formatBRL(-b.leftover)}`}
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
  budget, lodging, lodgingTier, style, selectedPois, onToggle,
  buildPlanJSON, buildSummaryText, onPdf,
}) {
  const [copied, setCopied] = useState(null); // "json" | "texto"
  const b = budget;

  const onDownloadJSON = () => {
    downloadTextFile(
      "voaja-plano-japao.json",
      JSON.stringify(buildPlanJSON(), null, 2)
    );
  };
  const onCopyJSON = async () => {
    const ok = await copyToClipboard(JSON.stringify(buildPlanJSON(), null, 2));
    if (ok) {
      setCopied("json");
      setTimeout(() => setCopied(null), 2000);
    }
  };
  const onCopyText = async () => {
    const ok = await copyToClipboard(buildSummaryText());
    if (ok) {
      setCopied("texto");
      setTimeout(() => setCopied(null), 2000);
    }
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
            Exporte em JSON (estruturado, pronto p/ virar app) ou como resumo de texto p/ mandar
            no WhatsApp. O PDF imprime esta página inteira.
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

      {/* Resumo do plano */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="card p-5">
          <div className="text-[11px] uppercase tracking-wider text-slate-400">Base</div>
          <div className="mt-1 text-lg font-bold text-white">
            {lodging?.emoji} {lodging?.name}
          </div>
          <div className="text-xs text-slate-300">
            {lodgingTier === "hostel" ? "Hostel/cápsula" : lodgingTier === "midrange" ? "Hotel 3★" : "Hotel 4-5★"}{" "}
            · {formatBRL(b.lodgingNight)}/noite · {b.N} noites
          </div>
          <div className="mt-1 text-sm font-semibold text-white">{formatBRL(b.lodgingTotal)}</div>
        </div>
        <div className="card p-5">
          <div className="text-[11px] uppercase tracking-wider text-slate-400">Estilo diário</div>
          <div className="mt-1 text-lg font-bold text-white">{style.label}</div>
          <div className="text-xs text-slate-300">
            {formatBRL(b.dailyPerPerson)}/dia/pessoa · comida + metrô + lazer
          </div>
          <div className="mt-1 text-sm font-semibold text-white">{formatBRL(b.dailyTotal)} na viagem</div>
        </div>
        <div className="card p-5">
          <div className="text-[11px] uppercase tracking-wider text-slate-400">Conta final</div>
          <div className={`mt-1 text-lg font-bold ${b.fits ? "text-emerald-300" : "text-rose-300"}`}>
            {formatBRL(b.plannedTotal)} / {formatBRL(b.remainingBudget)}
          </div>
          <div className="text-xs text-slate-300">
            {b.fits ? `Sobram ${formatBRL(b.leftover)}` : `Estoura ${formatBRL(-b.leftover)}`}
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded bg-white/5">
            <div
              className={`bar-animated h-full rounded ${b.fits ? "bg-emerald-400" : "bg-rose-400"}`}
              style={{ width: `${Math.min(100, b.usagePct)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Lugares por categoria */}
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
                  <li key={p.id} className="flex flex-wrap items-center gap-2 py-2 text-xs">
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

      {/* Prévia do JSON */}
      <details className="card p-5">
        <summary className="cursor-pointer text-sm font-bold text-white">
          <FileJson size={14} className="mr-1.5 inline -mt-0.5 text-cyan-300" />
          Prévia do JSON exportado (schema voaja.japan-plan/v1)
        </summary>
        <pre className="mt-3 max-h-80 overflow-auto rounded-xl border border-white/10 bg-black/40 p-4 text-[11px] leading-relaxed text-cyan-100">
          {JSON.stringify(buildPlanJSON(), null, 2)}
        </pre>
      </details>
    </section>
  );
}
