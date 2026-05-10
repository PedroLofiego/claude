import { useEffect, useMemo, useState } from "react";
import { Plane, Snowflake } from "lucide-react";
import InputForm from "./components/InputForm.jsx";
import DestinationGrid from "./components/DestinationGrid.jsx";
import DestinationDetail from "./components/DestinationDetail.jsx";
import { DESTINATIONS, ORIGIN_CITIES, TRIP_WINDOW } from "./data/destinations.js";
import { buildRecommendationLine, evaluateAll } from "./lib/calc.js";
import { buildReportText } from "./lib/report.js";

const DEFAULT_ORIGIN_CODE = "SSA";
const DEFAULT_ORIGIN =
  ORIGIN_CITIES.find((c) => c.code === DEFAULT_ORIGIN_CODE) ?? ORIGIN_CITIES[0];

// Default refletindo a viagem de Dez/Jan (22-25 dez → 6-9 jan): 16 dias, dupla.
const DEFAULT_PARAMS = {
  origin: DEFAULT_ORIGIN.code,
  originLabel: DEFAULT_ORIGIN.label,
  budget: 30000,
  days: 16,
  people: 2,
};

function loadParams() {
  try {
    const raw = localStorage.getItem("voaja:params:v3");
    if (!raw) return DEFAULT_PARAMS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_PARAMS, ...parsed };
  } catch {
    return DEFAULT_PARAMS;
  }
}

export default function App() {
  const [params, setParams] = useState(loadParams);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedTier, setSelectedTier] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem("voaja:params:v3", JSON.stringify(params));
    } catch {
      /* ignore */
    }
  }, [params]);

  const evaluations = useMemo(
    () => evaluateAll(DESTINATIONS, params),
    [params]
  );

  // Garante que sempre exista um destino selecionado (o melhor ranqueado).
  const activeId = selectedId ?? evaluations[0]?.destination.id;
  const activeEval = useMemo(
    () => evaluations.find((e) => e.destination.id === activeId) ?? evaluations[0],
    [evaluations, activeId]
  );

  // Tier selecionado segue o recomendado quando o usuário não escolheu manualmente
  // ou quando muda de destino.
  const tierToShow = selectedTier ?? activeEval?.bestTier ?? "comfortable";

  useEffect(() => {
    setSelectedTier(null);
  }, [activeId]);

  const recommendationLine = useMemo(() => {
    if (!activeEval) return "";
    // Quando o usuário escolhe um tier diferente do recomendado, ainda usamos
    // o melhor tier para a frase principal — o cenário escolhido aparece nos cards.
    return buildRecommendationLine(activeEval, params);
  }, [activeEval, params]);

  const report = useMemo(() => {
    if (!activeEval) return "";
    return buildReportText(
      { ...activeEval, bestTier: tierToShow },
      params,
      recommendationLine
    );
  }, [activeEval, params, recommendationLine, tierToShow]);

  return (
    <div className="mx-auto min-h-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:py-10">
      <Header />

      <main className="mt-6 space-y-6">
        <TripWindowBanner />
        <InputForm params={params} onChange={setParams} />
        <Summary evaluations={evaluations} params={params} />
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
          <div className="text-sm font-semibold text-white">
            {TRIP_WINDOW.label}
          </div>
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
            VoaJá · Planejador de Orçamento
          </h1>
          <p className="text-xs text-slate-400 sm:text-sm">
            Compare destinos internacionais, simule cenários e descubra se a viagem cabe no bolso.
          </p>
        </div>
      </div>
      <span className="chip">v0.2 · 14 destinos · Réveillon edition</span>
    </header>
  );
}

function Summary({ evaluations, params }) {
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
    <div
      className={`card p-4 ${
        highlight ? "ring-1 ring-inset ring-emerald-400/30" : ""
      }`}
    >
      <div className="text-[11px] uppercase tracking-wider text-slate-400">{label}</div>
      <div className="mt-1 text-2xl font-bold text-white">{value}</div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="mt-10 border-t border-white/10 pt-5 text-xs text-slate-400">
      Dados de custo, voos e itinerários são estimativas (mock) baseadas em médias de mercado.
      Antes de comprar, confirme tarifas em buscadores como Skyscanner/Kiwi e diárias em Booking/Airbnb.
      Substitua os mocks em <code className="rounded bg-white/10 px-1">src/data</code> por integrações reais quando disponíveis.
    </footer>
  );
}
