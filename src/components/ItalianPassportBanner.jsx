import { CheckCircle2, Sparkles } from "lucide-react";

export default function ItalianPassportBanner({ destination, params }) {
  if (!params?.hasItalianPassport) return null;

  const isEU = destination.euSchengen === true;
  const isUK = destination.country === "Escócia";

  if (isEU) {
    return (
      <div className="card overflow-hidden ring-1 ring-inset ring-green-500/30">
        <div className="flex items-center gap-3 bg-gradient-to-r from-green-500/20 via-white/5 to-rose-500/20 px-5 py-3">
          <span className="text-2xl">🇮🇹</span>
          <div className="flex-1">
            <div className="text-sm font-semibold text-white">
              <Sparkles size={14} className="mr-1 inline -mt-0.5 text-green-300" />
              Cidadania italiana = vantagens reais em {destination.city}
            </div>
            <div className="text-xs text-slate-300">
              {destination.country} faz parte do espaço {isEU ? "Schengen" : "Schengen/UE"} —
              você entra como cidadã(o) europeu(a), sem limite de 90 dias.
            </div>
          </div>
        </div>
        <ul className="grid gap-1.5 px-5 py-3 text-xs text-slate-200 sm:grid-cols-2">
          <Perk text="Fila de UE/EEE no aeroporto (mais rápida)" />
          <Perk text="Sem limite de 90 dias — pode estender" />
          <Perk text="TESSERA TEAM/EHIC: saúde pública reduzida" />
          <Perk text="Pode trabalhar legalmente se quiser" />
          <Perk text="Aluguel residencial sem comprovante consular" />
          <Perk text="Reentrada no Brasil sem perder direito UE" />
        </ul>
      </div>
    );
  }

  if (isUK) {
    return (
      <div className="card overflow-hidden ring-1 ring-inset ring-blue-500/30">
        <div className="flex items-center gap-3 bg-gradient-to-r from-blue-500/20 via-white/5 to-red-500/20 px-5 py-3">
          <span className="text-2xl">🇮🇹</span>
          <div className="flex-1">
            <div className="text-sm font-semibold text-white">
              Reino Unido (pós-Brexit) — ainda assim vantagens
            </div>
            <div className="text-xs text-slate-300">
              Não há mais livre circulação, mas Italianos têm acesso a eGates como brasileiros.
              Stay até 6 meses sem visto.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Non-EU destinations: just a soft note that italian passport offers very minor advantages
  return null;
}

function Perk({ text }) {
  return (
    <li className="flex gap-1.5">
      <CheckCircle2 size={14} className="mt-0.5 flex-none text-green-400" />
      <span>{text}</span>
    </li>
  );
}
