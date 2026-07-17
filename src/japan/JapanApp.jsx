import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft, BedDouble, Calendar, FileDown, Map as MapIcon,
  Printer, Ticket, Train, Wallet,
} from "lucide-react";
import JapanMap from "./JapanMap.jsx";
import {
  DAILY_STYLES, JAPAN_ITINERARY, JAPAN_POIS, JAPAN_TRIP,
  LODGING_AREAS, TRANSPORT_GUIDE,
} from "./japanData.js";
import { formatBRL } from "../lib/calc.js";

const STORAGE_KEY = "voaja:japan:v1";

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
  { id: "roteiro", label: "Roteiro 16 dias", icon: Calendar },
  { id: "orcamento", label: "Orçamento", icon: Wallet },
];

export default function JapanApp() {
  const saved = useMemo(loadState, []);
  const [tab, setTab] = useState("mapa");
  const [selectedIds, setSelectedIds] = useState(() => new Set(saved?.selected ?? ["shibuya-sky", "teamlab", "sumo", "sensoji", "hakone"]));
  const [lodgingId, setLodgingId] = useState(saved?.lodgingId ?? "asakusa");
  const [lodgingTier, setLodgingTier] = useState(saved?.lodgingTier ?? "midrange");
  const [dailyStyle, setDailyStyle] = useState(saved?.dailyStyle ?? "comfortable");
  const [flightPerPerson, setFlightPerPerson] = useState(saved?.flightPerPerson ?? 7000);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        selected: [...selectedIds], lodgingId, lodgingTier, dailyStyle, flightPerPerson,
      }));
    } catch { /* ignore */ }
  }, [selectedIds, lodgingId, lodgingTier, dailyStyle, flightPerPerson]);

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

  // ==== Orçamento ====
  const P = JAPAN_TRIP.people;
  const N = JAPAN_TRIP.nights;
  const D = JAPAN_TRIP.days;
  const flightTotal = flightPerPerson * P;
  const lodgingTotal = (lodging?.priceNight[lodgingTier] ?? 0) * N; // quarto p/ 2
  const dailyPerPerson = style.foodBRL + style.transportBRL + style.funBRL;
  const dailyTotal = dailyPerPerson * P * D;
  const attractionsEntry = selectedPois.reduce((s, p) => s + p.costBRL, 0) * P;
  const attractionsSpend = selectedPois.reduce((s, p) => s + (p.spendBRL || 0), 0) * P;
  const fixed = 500 * P;
  const subtotal = flightTotal + lodgingTotal + dailyTotal + attractionsEntry + fixed;
  const contingency = Math.round(subtotal * 0.08);
  const total = subtotal + contingency;

  const onPdf = () => {
    const t = document.title;
    document.title = "voaja-japao-plano";
    window.print();
    setTimeout(() => (document.title = t), 1000);
  };

  return (
    <div className="mx-auto min-h-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-rose-500 to-red-600 text-xl shadow-soft">
            🇯🇵
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              Japão · Acompanhamento da viagem
            </h1>
            <p className="text-xs text-slate-400 sm:text-sm">
              {JAPAN_TRIP.arrive} → {JAPAN_TRIP.depart} · {D} dias · {P} pessoas
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 no-print">
          <button type="button" className="btn-ghost" onClick={onPdf}>
            <FileDown size={14} /> Exportar PDF
          </button>
          <a href="#/" className="btn-ghost">
            <ArrowLeft size={14} /> Planejador
          </a>
        </div>
      </header>

      {/* Barra de status do plano */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatusCard label="Lugares no plano" value={selectedIds.size} sub="toque no mapa p/ adicionar" />
        <StatusCard label="Base escolhida" value={`${lodging?.emoji} ${lodging?.name}`} sub={`${formatBRL(lodging?.priceNight[lodgingTier] ?? 0)}/noite (quarto)`} />
        <StatusCard label="Ingressos do plano" value={formatBRL(attractionsEntry)} sub={`p/ ${P} pessoas`} />
        <StatusCard label="Total estimado" value={formatBRL(total)} sub="tudo incluído" highlight />
      </div>

      {/* Tabs */}
      <nav className="no-print mt-5 flex flex-wrap gap-1.5">
        {TABS.map((t) => {
          const Icon = t.icon;
          const on = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-sm font-semibold transition ${
                on
                  ? "border-rose-400/50 bg-rose-500/20 text-rose-50"
                  : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              <Icon size={14} /> {t.label}
            </button>
          );
        })}
      </nav>

      <main className="mt-4 space-y-5">
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

        {tab === "roteiro" && <ItineraryTab selectedIds={selectedIds} />}

        {tab === "orcamento" && (
          <BudgetTab
            {...{
              flightPerPerson, setFlightPerPerson, flightTotal,
              lodging, lodgingTier, lodgingTotal, N, P, D,
              style, dailyStyle, setDailyStyle, dailyPerPerson, dailyTotal,
              selectedPois, attractionsEntry, attractionsSpend,
              fixed, subtotal, contingency, total,
            }}
          />
        )}
      </main>

      <footer className="mt-10 border-t border-white/10 pt-5 text-xs text-slate-400">
        Preços em BRL convertidos de ienes (¥100 ≈ R$3,30 · Mai/2026). Janeiro pós-Ano Novo é
        BAIXA temporada no Japão: hotéis mais baratos e filas curtas — exceto o torneio de sumô.
        Confirme tarifas e reserve Shibuya Sky, teamLab, sumô e Ghibli com antecedência.
      </footer>
    </div>
  );
}

function StatusCard({ label, value, sub, highlight }) {
  return (
    <div className={`card p-4 ${highlight ? "ring-1 ring-inset ring-rose-400/40" : ""}`}>
      <div className="text-[11px] uppercase tracking-wider text-slate-400">{label}</div>
      <div className="mt-1 truncate text-lg font-bold text-white">{value}</div>
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
            Preço por noite do QUARTO para 2 pessoas, janeiro (baixa temporada). Clique para
            escolher sua base — ela aparece no mapa 🏨.
          </p>
        </div>
        <div className="inline-flex rounded-xl border border-white/10 bg-white/5 p-1 text-xs">
          {tiers.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setLodgingTier(t.id)}
              className={`rounded-lg px-3 py-1.5 font-semibold ${
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {LODGING_AREAS.map((a) => {
          const on = a.id === lodgingId;
          const night = a.priceNight[lodgingTier];
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => setLodgingId(a.id)}
              className={`card card-hover p-5 text-left ${
                on ? "ring-2 ring-rose-400/60" : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="text-lg font-bold text-white">
                  {a.emoji} {a.name}
                </div>
                {on && <span className="badge-ok">Sua base</span>}
              </div>
              <div className="mt-2 text-2xl font-bold text-white">
                {formatBRL(night)}
                <span className="text-xs font-normal text-slate-400"> /noite (quarto p/ 2)</span>
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
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {TRANSPORT_GUIDE.map((t) => (
        <div key={t.id} className="card p-5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-bold text-white">{t.name}</h3>
            <span className="chip flex-none">
              {t.costBRL > 0 ? `${formatBRL(t.costBRL)} ${t.per}` : t.per}
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

function ItineraryTab({ selectedIds }) {
  return (
    <section className="space-y-3">
      <div className="card p-4 text-xs text-slate-300">
        Roteiro sugerido para 07→22/jan com o torneio de sumô (10-24/jan) e extensão opcional
        Kyoto/Nara/Osaka nos dias 18-21. Ajuste os day trips pelo TEMPO — Fuji só aparece em dia limpo.
      </div>
      <ol className="space-y-2.5">
        {JAPAN_ITINERARY.map((d) => (
          <li key={d.day} className="card flex gap-4 p-4">
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

function BudgetTab(p) {
  const rows = [
    { label: `✈️ Voo SSA ⇄ Tóquio (${p.P}× ${formatBRL(p.flightPerPerson)})`, value: p.flightTotal },
    { label: `🏨 Hospedagem ${p.lodging?.name} · ${p.N} noites`, value: p.lodgingTotal },
    { label: `🍜 Diária (${p.style.label}: comida+metrô+lazer) × ${p.D}d × ${p.P}p`, value: p.dailyTotal },
    { label: `🎟️ Ingressos dos ${p.selectedPois.length} lugares do plano`, value: p.attractionsEntry },
    { label: "🛡️ Seguro + eSIM + extras fixos", value: p.fixed },
    { label: "🧯 Reserva de imprevistos (8%)", value: p.contingency },
  ];
  const max = Math.max(...rows.map((r) => r.value), 1);

  return (
    <section className="space-y-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <h3 className="text-sm font-bold text-white">Ajustes</h3>
          <label className="label mt-3">Voo por pessoa (ida+volta, R$)</label>
          <input
            type="number"
            className="input"
            step={100}
            value={p.flightPerPerson}
            onChange={(e) => p.setFlightPerPerson(Number(e.target.value) || 0)}
          />
          <div className="mt-1 text-[11px] text-slate-400">
            Referência: SSA⇄NRT R$6.500-8.000 alta; promos GRU chegam a R$4.500-5.500.
          </div>
          <label className="label mt-4">Estilo de gasto diário</label>
          <div className="space-y-1.5">
            {DAILY_STYLES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => p.setDailyStyle(s.id)}
                className={`w-full rounded-xl border p-3 text-left text-xs transition ${
                  p.dailyStyle === s.id
                    ? "border-rose-400/50 bg-rose-500/10 text-white"
                    : "border-white/10 bg-white/[0.03] text-slate-300"
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
        </div>

        <div className="card p-5">
          <header className="mb-3 flex items-end justify-between">
            <h3 className="text-sm font-bold text-white">Orçamento total</h3>
            <div className="text-right">
              <div className="text-[11px] uppercase tracking-wider text-slate-400">Total</div>
              <div className="text-2xl font-bold text-white">{formatBRL(p.total)}</div>
              <div className="text-[11px] text-slate-400">
                {formatBRL(p.total / p.P)}/pessoa · {formatBRL(p.total / p.D)}/dia
              </div>
            </div>
          </header>
          <ul className="space-y-2.5">
            {rows.map((r, i) => {
              const pct = Math.round((r.value / max) * 100);
              const share = Math.round((r.value / Math.max(1, p.total)) * 100);
              return (
                <li key={i}>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-200">{r.label}</span>
                    <span className="tabular-nums font-semibold text-white">
                      {formatBRL(r.value)} <span className="font-normal text-slate-400">({share}%)</span>
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded bg-white/5">
                    <div
                      className="h-full rounded bg-gradient-to-r from-rose-500 to-red-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
          {p.attractionsSpend > 0 && (
            <div className="mt-3 rounded-lg bg-white/[0.04] p-2.5 text-[11px] text-slate-300">
              ➕ Gasto informal esperado nos lugares do plano (comida/compras já cobertas na
              diária): ~{formatBRL(p.attractionsSpend)} — considere na reserva.
            </div>
          )}
        </div>
      </div>

      <div className="card p-5">
        <h3 className="mb-2 text-sm font-bold text-white">
          <Ticket size={14} className="mr-1.5 inline -mt-0.5 text-amber-300" />
          Ingressos do seu plano ({p.selectedPois.length})
        </h3>
        {p.selectedPois.length === 0 ? (
          <p className="text-xs text-slate-400">
            Nenhum lugar no plano ainda — vá na aba Mapa e toque em "+ Adicionar ao plano".
          </p>
        ) : (
          <ul className="divide-y divide-white/5 text-xs">
            {p.selectedPois.map((poi) => (
              <li key={poi.id} className="flex items-center justify-between py-2">
                <span className="text-slate-200">{poi.name}</span>
                <span className="font-semibold text-white">
                  {poi.costBRL > 0 ? `${formatBRL(poi.costBRL)}/pessoa` : "Grátis"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
