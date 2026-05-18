import { useEffect, useState } from "react";
import { Check, ExternalLink, Loader2, Plug, X } from "lucide-react";

export default function SettingsDialog({
  open,
  initialWorkerUrl,
  onSave,
  onClose,
  onTest,
}) {
  const [url, setUrl] = useState(initialWorkerUrl ?? "");
  const [status, setStatus] = useState({ kind: "idle", message: "" });

  useEffect(() => {
    if (open) {
      setUrl(initialWorkerUrl ?? "");
      setStatus({ kind: "idle", message: "" });
    }
  }, [open, initialWorkerUrl]);

  if (!open) return null;

  const cleanUrl = url.trim().replace(/\/+$/, "");

  async function handleTest() {
    if (!cleanUrl) {
      setStatus({ kind: "error", message: "Cole a URL do worker primeiro." });
      return;
    }
    setStatus({ kind: "loading", message: "Testando conexão..." });
    try {
      const resp = await fetch(cleanUrl + "/");
      const data = await resp.json();
      if (resp.ok && data?.ok) {
        setStatus({ kind: "ok", message: "Worker respondeu OK. Pronto para uso." });
      } else {
        setStatus({
          kind: "error",
          message: `Resposta inesperada (${resp.status}): ${JSON.stringify(data).slice(0, 200)}`,
        });
      }
    } catch (err) {
      setStatus({ kind: "error", message: err.message ?? String(err) });
    }
  }

  function handleSave() {
    onSave(cleanUrl);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-3 sm:items-center sm:p-6 no-print"
      onClick={onClose}
    >
      <div
        className="card w-full max-w-lg p-5 sm:p-6"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <header className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <Plug size={18} className="text-cyan-300" />
            <h3 className="text-base font-semibold text-white">
              Integração Amadeus (voos reais)
            </h3>
          </div>
          <button onClick={onClose} className="btn-ghost !p-2" aria-label="Fechar">
            <X size={16} />
          </button>
        </header>

        <p className="text-sm text-slate-300">
          Cole a URL pública do seu Cloudflare Worker (veja
          <code className="mx-1 rounded bg-white/10 px-1.5 py-0.5 text-xs">/worker/README.md</code>
          para deploy). Sem isso, o app usa preços estimados mock.
        </p>

        <label className="label mt-4">Worker URL</label>
        <input
          type="url"
          className="input"
          placeholder="https://voaja-amadeus.seuuser.workers.dev"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          autoFocus
        />

        {status.kind !== "idle" && (
          <div
            className={`mt-3 rounded-lg px-3 py-2 text-xs ${
              status.kind === "ok"
                ? "bg-emerald-500/10 text-emerald-200 ring-1 ring-inset ring-emerald-400/30"
                : status.kind === "error"
                ? "bg-rose-500/10 text-rose-200 ring-1 ring-inset ring-rose-400/30"
                : "bg-cyan-500/10 text-cyan-200 ring-1 ring-inset ring-cyan-400/30"
            }`}
          >
            {status.kind === "loading" && (
              <Loader2 size={12} className="mr-1 inline animate-spin" />
            )}
            {status.kind === "ok" && <Check size={12} className="mr-1 inline" />}
            {status.message}
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs">
          <a
            href="https://developers.amadeus.com/register"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-cyan-300 hover:underline"
          >
            <ExternalLink size={12} /> Pegar credenciais Amadeus
          </a>
          <a
            href="https://dash.cloudflare.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-cyan-300 hover:underline"
          >
            <ExternalLink size={12} /> Cloudflare Workers
          </a>
        </div>

        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <button type="button" className="btn-ghost" onClick={handleTest}>
            Testar conexão
          </button>
          <button type="button" className="btn-primary" onClick={handleSave}>
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
