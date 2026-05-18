import { Clock, Globe2, Plane, ShieldCheck, Snowflake } from "lucide-react";
import BudgetBreakdown from "./BudgetBreakdown.jsx";
import Itinerary from "./Itinerary.jsx";
import Recommendation from "./Recommendation.jsx";
import ScenarioComparison from "./ScenarioComparison.jsx";
import ReportPanel from "./ReportPanel.jsx";
import { formatBRL } from "../lib/calc.js";

export default function DestinationDetail({
  evaluation,
  params,
  selectedTier,
  onSelectTier,
  recommendationLine,
  report,
}) {
  const d = evaluation.destination;
  const scenario = evaluation.scenarios[selectedTier];
  const flight = scenario?.flight;

  return (
    <section className="space-y-5">
      <div className="card overflow-hidden">
        <div className="relative h-48 sm:h-56">
          <img
            src={d.image}
            alt={`${d.city}, ${d.country}`}
            className="absolute inset-0 h-full w-full object-cover"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/60 to-transparent" />
          <div className="relative flex h-full flex-col justify-end p-5 sm:p-6">
            <div className="text-xs uppercase tracking-widest text-slate-300/80">
              {d.region} · {d.country}
            </div>
            <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              <span className="mr-2">{d.emoji}</span>
              {d.city}
            </h2>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="chip">
                <Plane size={12} /> {d.flightHours}h de voo
              </span>
              {d.tempC && (
                <span className="chip">
                  <Snowflake size={12} /> {d.tempC.low}° a {d.tempC.high}°C (Dez/Jan)
                </span>
              )}
              <span className="chip">
                <Clock size={12} /> Melhor época: {d.bestMonths.join(" · ")}
              </span>
              <span className="chip">
                <ShieldCheck size={12} /> Segurança {d.safetyScore.toFixed(1)}/5
              </span>
              <span className="chip">
                <Globe2 size={12} /> {d.languages.join(", ")}
              </span>
              <span className="chip">{d.visaRequired ? "Visto exigido" : "Sem visto"}</span>
              <span className="chip">Moeda local: {d.currency}</span>
            </div>
          </div>
        </div>

        {d.winterNote && (
          <div className="border-t border-white/10 bg-cyan-500/5 px-5 py-3 text-sm text-cyan-100">
            <Snowflake size={14} className="mr-1.5 inline -mt-0.5" />
            <span className="font-semibold">Inverno aqui:</span> {d.winterNote}
          </div>
        )}

        <div className="flex items-center gap-2 border-t border-white/10 px-5 py-3 text-sm text-slate-200">
          <Plane size={14} className="text-indigo-300" />
          <span>
            <span className="text-slate-400">Voo estimado {params.origin}→{d.iata ?? "?"}:</span>{" "}
            <span className="font-semibold text-white">{formatBRL(flight.perPerson)}</span>
            <span className="text-slate-400"> / pessoa</span>
          </span>
          <span
            className="ml-1 inline-flex items-center gap-1 rounded-full bg-slate-500/15 px-2.5 py-1 text-xs font-semibold text-slate-300 ring-1 ring-inset ring-slate-400/30"
            title="Preço calibrado com Google Flights / Kayak para alta temporada Dez/Jan."
          >
            estimativa
          </span>
        </div>

        <div className="p-5">
          <ul className="grid grid-cols-1 gap-2 text-sm text-slate-200 sm:grid-cols-2">
            {d.highlights.map((h, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-cyan-400" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Recommendation
        evaluation={evaluation}
        params={params}
        recommendationLine={recommendationLine}
      />

      <ScenarioComparison
        evaluation={evaluation}
        params={params}
        selectedTier={selectedTier}
        onSelectTier={onSelectTier}
      />

      <BudgetBreakdown scenario={scenario} params={params} />

      <Itinerary destinationId={d.id} days={params.days} startDate={params.startDate} />

      <ReportPanel report={report} destination={d} />
    </section>
  );
}
