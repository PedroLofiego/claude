import { useEffect, useMemo, useState } from "react";
import { Plane, Snowflake } from "lucide-react";
import InputForm from "./components/InputForm.jsx";
import DestinationGrid from "./components/DestinationGrid.jsx";
import DestinationDetail from "./components/DestinationDetail.jsx";
import MultiTripBuilder from "./components/MultiTripBuilder.jsx";
import MultiTripView from "./components/MultiTripView.jsx";
import { DESTINATIONS, ORIGIN_CITIES, TRIP_WINDOW } from "./data/destinations.js";
import {
  buildComboRecommendationLine,
  buildRecommendationLine,
  evaluateAll,
  evaluateCombo,
} from "./lib/calc.js";
import { buildReportText } from "./lib/report.js";

const DEFAULT_ORIGIN_CODE = "SSA";
const DEFAULT_ORIGIN =
  ORIGIN_CITIES.find((c) => c.code === DEFAULT_ORIGIN_CODE) ?? ORIGIN_CITIES[0];

const DEFAULT_PARAMS = {
  origin: DEFAULT_ORIGIN.code,
  originLabel: DEFAULT_ORIGIN.label,
  budget: 30000,
  days: 17,
  people: 2,
  startDate: "2026-12-23",
  returnDate: "2027-01-08",
  mode: "single",
  legs: [],
  hasItalianPassport: true,
};

function loadParams() {
  try {
    const raw = localStorage.getItem("voaja:params:v6");
    if (!raw) return DEFAULT_PARAMS;
    return { ...DEFAULT_PARAMS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PARAMS;
  }
}

export default function App() {
  const [params, setParams] = useState(loadParams);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedTier, setSelectedTier] = useState(null);
  const [selectedComboTier, setSelectedComboTier] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem("voaja:params:v6", JSON.stringify(params));
    } catch {
      /* ignore */
    }
  }, [params]);

  const isCombo = params.mode === "combo";

  // ===== Modo único =====
  const evaluations = useMemo(
    () => (isCombo ? [] : evaluateAll(DESTINATIONS, params)),
    [params, isCombo]
  );
  const activeId = selectedId ?? evaluations[0]?.destination.id;
  const activeEval = useMemo(
    () => evaluations.find((e) => e.destination.id === activeId) ?? evaluations[0],
    [evaluations, activeId]
  );
  const tierToShow = selectedTier ?? activeEval?.bestTier ?? "comfortable";

  useEffect(() => {
    setSelectedTier(null);
  }, [activeId]);

  const recommendationLine = useMemo(() => {
    if (isCombo || !activeEval) return "";
    return buildRecommendationLine(activeEval, params);
  }, [activeEval, params, isCombo]);

  const report = useMemo(() => {
    if (isCombo || !activeEval) return "";
    return buildReportText(
      { ...activeEval, bestTier: tierToShow },
      params,
      recommendationLine
    );
  }, [activeEval, params, recommendationLine, tierToShow, isCombo]);

  // ===== Modo combo =====
  const legs = useMemo(
    () =>
      (params.legs ?? [])
        .map((l) => ({
          destinationId: l.destinationId,
          days: l.days,
          destination: DESTINATIONS.find((d) => d.id === l.destinationId),
        }))
        .filter((l) => l.destination),
    [params.legs]
  );

  const totalLegDays = legs.reduce((s, l) => s + l.days, 0);

  // Sincroniza params.days no modo combo (soma dos dias por destino)
  useEffect(() => {
    if (isCombo && totalLegDays !== params.days) {
      setParams((p) => ({ ...p, days: totalLegDays || 1 }));
    }
  }, [isCombo, totalLegDays, params.days]);

  const comboEval = useMemo(() => {
    if (!isCombo) return null;
    return evaluateCombo(legs, params);
  }, [isCombo, legs, params]);

  const comboTier = selectedComboTier ?? comboEval?.bestTier ?? "comfortable";

  const comboRecLine = useMemo(() => {
    if (!comboEval || legs.length === 0) return "";
    return buildComboRecommendationLine(comboEval, params);
  }, [comboEval, legs.length, params]);

  return (
    <div className="mx-auto min-h-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:py-10">
      <Header />

      <main className="mt-6 space-y-6">
        <TripWindowBanner />
        <InputForm params={params} onChange={setParams} />

        {!isCombo && (
          <>
            <Summary evaluations={evaluations} />
            <DestinationGrid
              evaluations={evaluations}
              params={params}
              selectedId={activeId}
              onSelect={setSelectedId}
            />
            {activeEval && (
              <DestinationDetail
                evaluation={activeEval}
                params={params}
                selectedTier={tierToShow}
                onSelectTier={setSelectedTier}
                recommendationLine={recommendationLine}
                report={report}
              />
            )}
          </>
        )}

        {isCombo && (
          <>
            <MultiTripBuilder
              legs={params.legs ?? []}
              onChange={(newLegs) => setParams({ ...params, legs: newLegs })}
              totalDays={totalLegDays}
              targetDays={params.days}
            />
            <MultiTripView
              comboEval={comboEval}
              params={params}
              selectedTier={comboTier}
              onSelectTier={setSelectedComboTier}
              recommendationLine={comboRecLine}
            />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

function TripWindowBanner() {
  return (
    <div className="card flex flex-wrap items-center justify-between gap-3 border-cyan-400/20 bg-gradient-to-r from-indigo-500/15 to-cyan-500/15 p-4">
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-cyan-500/20 text-cyan-200">
          <Snowflake size={16} />
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-wider text-cyan-200/80">
            Janela de viagem
          </div>
          <div className="text-sm font-semibold text-white">{TRIP_WINDOW.label}</div>
        </div>
      </div>
      <div className="text-xs text-cyan-100/90 sm:max-w-md sm:text-right">
        {TRIP_WINDOW.season}
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 text-white shadow-soft">
          <Plane size={18} />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
            VoaJá <span className="text-slate-500">·</span> Planejador de Orçamento
          </h1>
          <p className="text-xs text-slate-400 sm:text-sm">
            Compare destinos internacionais, monte combos de várias cidades e simule cenários.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <a href="#/japao" className="btn cta-japan">
          <span className="text-base leading-none">🇯🇵</span>
          Viagem escolhida: Japão
          <span aria-hidden="true" className="cta-arrow">→</span>
        </a>
        <span className="chip">v1.0 · 40 destinos</span>
      </div>
    </header>
  );
}

function Summary({ evaluations }) {
  const total = evaluations.length;
  const fitting = evaluations.filter((e) => e.fits).length;
  const premiumFits = evaluations.filter((e) => e.tierFits.premium).length;
  const comfortFits = evaluations.filter((e) => e.tierFits.comfortable).length;

  return (
    <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <SummaryCard label="Destinos analisados" value={total} />
      <SummaryCard label="Cabem no orçamento" value={`${fitting}/${total}`} highlight />
      <SummaryCard label="Comportam Confortável" value={comfortFits} />
      <SummaryCard label="Comportam Premium" value={premiumFits} />
    </section>
  );
}

function SummaryCard({ label, value, highlight }) {
  return (
    <div className={`card p-4 ${highlight ? "ring-1 ring-inset ring-emerald-400/30" : ""}`}>
      <div className="text-[11px] uppercase tracking-wider text-slate-400">{label}</div>
      <div className="mt-1 text-2xl font-bold text-white">{value}</div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="mt-10 border-t border-white/10 pt-5 text-xs text-slate-400">
      Dados de custo e itinerários são estimativas calibradas com base em pesquisas no Google
      Flights, Kayak, Decolar, Numbeo e blogs/YouTube de viajantes brasileiros (Mai/2026).
      Modo combo soma destinos com voo open-jaw (multi-trecho) + transporte regional estimado.
      Sempre confirme tarifas em Skyscanner/Kiwi e diárias em Booking/Airbnb antes de comprar.
    </footer>
  );
}
