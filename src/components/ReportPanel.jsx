import { useState } from "react";
import { ClipboardCopy, Download, FileDown, FileText, Printer } from "lucide-react";
import { copyToClipboard, downloadTextFile } from "../lib/report.js";

function slugify(name) {
  return (name || "viagem")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function ReportPanel({ report, destination }) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(true);

  const onCopy = async () => {
    const ok = await copyToClipboard(report);
    setCopied(ok);
    if (ok) setTimeout(() => setCopied(false), 2000);
  };

  const onDownload = () => {
    downloadTextFile(`relatorio-${slugify(destination?.city)}.txt`, report);
  };

  const onPrint = () => window.print();
  const onPdf = () => {
    // Browser print dialog → "Salvar como PDF". CSS @media print já formata.
    const originalTitle = document.title;
    document.title = `voaja-${slugify(destination?.city)}-relatorio`;
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };

  return (
    <div className="card p-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FileText size={18} className="text-indigo-300" />
          <h3 className="text-base font-semibold text-white">Relatório final</h3>
        </div>
        <div className="flex flex-wrap gap-2 no-print">
          <button type="button" className="btn-ghost" onClick={() => setOpen((v) => !v)}>
            {open ? "Ocultar prévia" : "Ver prévia"}
          </button>
          <button type="button" className="btn-ghost" onClick={onPrint}>
            <Printer size={14} /> Imprimir
          </button>
          <button type="button" className="btn-ghost" onClick={onDownload}>
            <Download size={14} /> .txt
          </button>
          <button type="button" className="btn-primary" onClick={onPdf}>
            <FileDown size={14} /> Exportar PDF
          </button>
          <button type="button" className="btn-ghost" onClick={onCopy}>
            <ClipboardCopy size={14} />
            {copied ? "Copiado!" : "Copiar"}
          </button>
        </div>
      </header>

      {open && (
        <pre className="mt-4 max-h-[480px] overflow-auto whitespace-pre-wrap rounded-xl border border-white/10 bg-black/40 p-4 text-[12.5px] leading-relaxed text-slate-100">
          {report}
        </pre>
      )}
    </div>
  );
}
