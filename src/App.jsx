import { useEffect, useMemo, useState } from "react";
import { Loader2, Plane, RefreshCw, Settings, Snowflake } from "lucide-react";
import InputForm from "./components/InputForm.jsx";
import DestinationGrid from "./components/DestinationGrid.jsx";
import DestinationDetail from "./components/DestinationDetail.jsx";
import SettingsDialog from "./components/SettingsDialog.jsx";
import { DESTINATIONS, ORIGIN_CITIES, TRIP_WINDOW } from "./data/destinations.js";
import { buildRecommendationLine, evaluateAll } from "./lib/calc.js";
import { buildReportText } from "./lib/report.js";
import {
  cacheKey,
  clearCache,
  computeReturnDate,
  fetchFlight,
  getCache,
  getConfig,
  setCache,
  setConfig,
} from "./lib/amadeus.js";

const DEFAULT_ORIGIN_CODE = "SSA";
const DEFAULT_ORIGIN =
  ORIGIN_CITIES.find((c) => c.code === DEFAULT_ORIGIN_CODE) ?? ORIGIN_CITIES[0];

const DEFAULT_PARAMS = {
  origin: DEFAULT_ORIGIN.code,
  originLabel: DEFAULT_ORIGIN.label,
  budget: 30000,
  days: 16,
  people: 2,
  startDate: "2026-12-23",
};

function loadParams() {
  try {
    const raw = localStorage.getItem("voaja:params:v4");
    if (!raw) return DEFAULT_PARAMS;
    return { ...DEFAULT_PARAMS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PARAMS;
  }
}

// Filtra overrides pelo conjunto atual (origem/datas/pessoas).
// Resultados antigos com parâmetros diferentes não devem influenciar o cálculo.
function activeOverrides(cache, params) {
  const returnDate = computeReturnDate(params.startDate, params.days);
  const out = {};
  for (const d of DESTINATIONS) {
    const key = cacheKey({
      origin: params.origin,
      destination: d.iata,
      departureDate: params.startDate,
      returnDate,
      adults: params.people,
    });
    const hit = cache[key];
    if (hit && Number.isFinite(hit.perPersonBRL)) {
      out[d.id] = {
        perPersonBRL: hit.perPersonBRL,
        totalBRL: hit.totalBRL,
        source: hit.source ?? "amadeus",
        fetchedAt: hit.fetchedAt,
        carrier: hit.carrier,
        stops: hit.stops,
      };
    }
  }
  return out;
}

export default function App() {
  const [params, setParams] = useState(loadParams);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedTier, setSelectedTier] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const [config, setConfigState] = useState(getConfig);
  const [cache, setCacheState] = useState(getCache);
  const [busy, setBusy] = useState({}); // { destinationId: true }
  const [globalBusy, setGlobalBusy] = useState(false);
  const [lastError, setLastError] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem("voaja:params:v4", JSON.stringify(params));
    } catch {
      /* ignore */
    }
  }, [params]);

  const overrides = useMemo(() => activeOverrides(cache, params), [cache, params]);

  const evaluations = useMemo(
    () => evaluateAll(DESTINATIONS, params, overrides),
    [params, overrides]
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
    if (!activeEval) return "";
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

  async function refreshOne(destination) {
    if (!config.workerUrl) {
      setSettingsOpen(true);
      return;
    }
    if (!destination.iata) {
      setLastError(`Sem código IATA para ${destination.city}`);
      return;
    }
    setBusy((b) => ({ ...b, [destination.id]: true }));
    setLastError(null);
    try {
      const returnDate = computeReturnDate(params.startDate, params.days);
      const result = await fetchFlight({
        workerUrl: config.workerUrl,
        origin: params.origin,
        destination: destination.iata,
        departureDate: params.startDate,
        returnDate,
        adults: params.people,
      });
      if (!Number.isFinite(result?.perPersonBRL)) {
        throw new Error("Amadeus não retornou tarifa para essa rota nessas datas.");
      }
      const key = cacheKey({
        origin: params.origin,
        destination: destination.iata,
        departureDate: params.startDate,
        returnDate,
        adults: params.people,
      });
      const nextCache = { ...cache, [key]: result };
      setCache(nextCache);
      setCacheState(nextCache);
    } catch (err) {
      setLastError(`${destination.city}: ${err.message ?? err}`);
    } finally {
      setBusy((b) => {
        const { [destination.id]: _, ...rest } = b;
        return rest;
      });
    }
  }

  async function refreshAll() {
    if (!config.workerUrl) {
      setSettingsOpen(true);
      return;
    }
    setGlobalBusy(true);
    setLastError(null);
    const errors = [];
    // Sequencial com pequena pausa (test API limita a ~10 req/s)
    for (const d of DESTINATIONS) {
      if (!d.iata) continue;
      try {
        await refreshOne(d);
      } catch (err) {
        errors.push(`${d.city}: ${err.message}`);
      }
      await new Promise((r) => setTimeout(r, 150));
    }
    setGlobalBusy(false);
    if (errors.length) setLastError(errors.join(" | "));
  }

  function saveWorkerUrl(workerUrl) {
    const next = { ...config, workerUrl };
    setConfig(next);
    setConfigState(next);
  }

  function clearAllFlights() {
    clearCache();
    setCacheState({});
  }

  const overrideCount = Object.keys(overrides).length;

  return (
    <div className="mx-auto min-h-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:py-10">
      <Header onOpenSettings={() => setSettingsOpen(true)} hasWorker={!!config.workerUrl} />

      <main className="mt-6 space-y-6">
        <TripWindowBanner />
        <InputForm params={params} onChange={setParams} />

        <FlightSourceBar
          overrideCount={overrideCount}
          totalCount={DESTINATIONS.length}
          hasWorker={!!config.workerUrl}
          onRefreshAll={refreshAll}
          onClearAll={clearAllFlights}
          onOpenSettings={() => setSettingsOpen(true)}
          globalBusy={globalBusy}
          lastError={lastError}
        />

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
            onRefreshFlight={() => refreshOne(activeEval.destination)}
            refreshing={!!busy[activeEval.destination.id]}
            hasWorker={!!config.workerUrl}
          />
        )}
      </main>

      <Footer />

      <SettingsDialog
        open={settingsOpen}
        initialWorkerUrl={config.workerUrl}
        onSave={saveWorkerUrl}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}

function FlightSourceBar({
  overrideCount,
  totalCount,
  hasWorker,
  onRefreshAll,
  onClearAll,
  onOpenSettings,
  globalBusy,
  lastError,
}) {
  return (
    <section className="card flex flex-wrap items-center justify-between gap-3 p-4">
      <div className="text-sm text-slate-200">
        <span className="font-semibold text-white">Voos:</span>{" "}
        {hasWorker ? (
          overrideCount > 0 ? (
            <>
              <span className="badge-ok ml-1">
                {overrideCount}/{totalCount} via Amadeus
              </span>
              <span className="ml-2 text-slate-400">
                Restante usa estimativas mock.
              </span>
            </>
          ) : (
            <span className="text-slate-400">
              Worker conectado. Clique em "Buscar voos reais" para atualizar.
            </span>
          )
        ) : (
          <span className="text-slate-400">
            Usando preços mock (calibrados em mai/26). Conecte um worker Amadeus para preços ao vivo.
          </span>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2 no-print">
        {hasWorker && (
          <>
            <button type="button" className="btn-ghost" onClick={onClearAll} disabled={globalBusy}>
              Limpar cache
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={onRefreshAll}
              disabled={globalBusy}
            >
              {globalBusy ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <RefreshCw size={14} />
              )}
              Buscar voos reais
            </button>
          </>
        )}
        <button type="button" className="btn-ghost" onClick={onOpenSettings}>
          <Settings size={14} /> Amadeus
        </button>
      </div>
      {lastError && (
        <div className="w-full rounded-lg bg-rose-500/10 px-3 py-2 text-xs text-rose-200 ring-1 ring-inset ring-rose-400/30">
          {lastError}
        </div>
      )}
    </section>
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

function Header({ onOpenSettings, hasWorker }) {
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
      <div className="flex items-center gap-2">
        <span className="chip">v0.4 · 20 destinos · Amadeus</span>
        <button
          type="button"
          onClick={onOpenSettings}
          className="btn-ghost !px-2.5"
          title={hasWorker ? "Worker conectado" : "Configurar worker Amadeus"}
          aria-label="Configurações"
        >
          <Settings size={16} />
        </button>
      </div>
    </header>
  );
}

function Summary({ evaluations, params }) {
  const total = evaluations.length;
  const fitting = evaluations.filter((e) => e.fits).length;
  const premiumFits = evaluations.filter((e) => e.tierFits.premium).length;
  const comfortFits = evaluations.filter((e) => e.tierFits.comfortable).length;

  // O parâmetro params é mantido para evolução futura (ex.: mostrar média de gasto).
  void params;

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
      Dados de custo e itinerários são estimativas (mock) baseadas em médias de mercado.
      Os voos podem ser substituídos por preços ao vivo da Amadeus configurando um worker (
      <code className="rounded bg-white/10 px-1">/worker/README.md</code>). Antes de comprar,
      sempre confirme tarifas em Skyscanner/Kiwi e diárias em Booking/Airbnb.
    </footer>
  );
}
