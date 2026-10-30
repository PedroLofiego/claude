import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle, CalendarDays, Check, Clock, ExternalLink, MapPin, MessageCircle,
  PlayCircle, RotateCcw, ShoppingCart, Star, ThumbsDown, ThumbsUp, X,
} from "lucide-react";
import { KLOOK_ITEMS, KLOOK_STATUS, KLOOK_UPDATED } from "./klookData.js";
import { copyToClipboard, formatBRL } from "../lib/format.js";

/*
 * Página para Pedro e Gio escolherem os passeios da Klook.
 * Cada um marca "Quero / Talvez / Não". As escolhas ficam salvas no aparelho
 * e viajam no link: quem recebe o link vê as escolhas do outro e completa as suas.
 */

const KEY = "voaja:klook:v1";
const PEOPLE = [
  { id: "p", name: "Pedro", emoji: "🧑" },
  { id: "g", name: "Gio", emoji: "👩" },
];
const VOTES = {
  q: { label: "Quero", icon: ThumbsUp, on: "bg-emerald-500 text-white border-emerald-400" },
  t: { label: "Talvez", icon: null, on: "bg-amber-400 text-slate-900 border-amber-300" },
  n: { label: "Não", icon: ThumbsDown, on: "bg-rose-500 text-white border-rose-400" },
};
const CITY = {
  toquio: { label: "Tóquio", emoji: "🗼" },
  kyoto: { label: "Kyoto", emoji: "🎎" },
  osaka: { label: "Osaka", emoji: "🐙" },
};

// "skytree.q,sumo.n" <-> { skytree: "q", sumo: "n" }
const encode = (o) => Object.entries(o).map(([k, v]) => `${k}.${v}`).join(",");
const decode = (s) =>
  Object.fromEntries(
    (s || "").split(",").map((x) => x.split(".")).filter(([k, v]) => k && VOTES[v] && KLOOK_ITEMS.some((i) => i.id === k))
  );

function readLinkVotes() {
  const q = window.location.hash.split("?")[1];
  if (!q) return null;
  const params = new URLSearchParams(q);
  const out = {};
  PEOPLE.forEach((p) => { if (params.get(p.id)) out[p.id] = decode(params.get(p.id)); });
  return Object.keys(out).length ? out : null;
}

function loadVotes() {
  let saved = { p: {}, g: {} };
  try { saved = { ...saved, ...JSON.parse(localStorage.getItem(KEY) || "{}") }; } catch { /* sem armazenamento */ }
  const fromLink = readLinkVotes();
  // O link traz as escolhas mais novas de quem mandou; junta com as daqui.
  if (fromLink) PEOPLE.forEach((p) => { if (fromLink[p.id]) saved[p.id] = { ...saved[p.id], ...fromLink[p.id] }; });
  return saved;
}

function verdict(item, votes) {
  const a = votes.p[item.id], b = votes.g[item.id];
  if (!a || !b) return { key: "pend", label: "Falta alguém escolher", cls: "text-slate-400" };
  if (a === "n" && b === "n") return { key: "out", label: "Os dois disseram não — tirar do carrinho", cls: "text-rose-300" };
  if (a === "q" && b === "q") return { key: "yes", label: "Fechado: os dois querem", cls: "text-emerald-300" };
  if ((a === "q" || b === "q") && a !== "n" && b !== "n") return { key: "yes", label: "Fechado (um quer, outro topa)", cls: "text-emerald-300" };
  return { key: "talk", label: "Conversar — opiniões diferentes", cls: "text-amber-300" };
}

export default function KlookPicker() {
  const [votes, setVotes] = useState(loadVotes);
  const [city, setCity] = useState("todas");
  const [copied, setCopied] = useState(false);
  const cameFromLink = useMemo(() => !!readLinkVotes(), []);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(votes)); } catch { /* ignore */ }
  }, [votes]);

  const vote = (person, id, v) =>
    setVotes((prev) => {
      const mine = { ...prev[person] };
      if (mine[id] === v) delete mine[id]; else mine[id] = v;
      return { ...prev, [person]: mine };
    });

  const list = KLOOK_ITEMS.filter((i) => city === "todas" || i.city === city);
  const days = [];
  list.forEach((i) => {
    let d = days.find((x) => x.iso === i.dateISO);
    if (!d) days.push((d = { iso: i.dateISO, label: i.day, city: i.city, items: [] }));
    d.items.push(i);
  });
  days.sort((a, b) => a.iso.localeCompare(b.iso));
  days.forEach((d) => d.items.sort((a, b) => sortTime(a.time) - sortTime(b.time)));

  const closed = KLOOK_ITEMS.filter((i) => verdict(i, votes).key === "yes");
  const talk = KLOOK_ITEMS.filter((i) => verdict(i, votes).key === "talk");
  const out = KLOOK_ITEMS.filter((i) => verdict(i, votes).key === "out");
  const totalClosed = closed.reduce((s, i) => s + i.priceBRL, 0);
  const counts = PEOPLE.map((p) => KLOOK_ITEMS.filter((i) => votes[p.id][i.id]).length);

  const shareLink = () => {
    const base = window.location.href.split("#")[0];
    return `${base}#/japao/passeios/klook?p=${encode(votes.p)}&g=${encode(votes.g)}`;
  };
  const shareText = () => {
    const line = (i) => `• ${i.day} ${i.time.split(" ")[0]} — ${i.name}`;
    const parts = ["🇯🇵 Passeios da Klook — nossas escolhas"];
    if (closed.length) parts.push("", `✅ Fechados (${formatBRL(totalClosed)} para os dois):`, ...closed.map(line));
    if (talk.length) parts.push("", "🤔 Conversar:", ...talk.map(line));
    if (out.length) parts.push("", "❌ Tirar do carrinho:", ...out.map(line));
    parts.push("", "Abra para ver e marcar as suas:", shareLink());
    return parts.join("\n");
  };
  const onCopy = async () => {
    if (await copyToClipboard(shareText())) { setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  return (
    <div className="space-y-5">
      {/* Como funciona */}
      <section className="card p-5">
        <div className="flex flex-wrap items-start gap-4">
          <div className="w-full min-w-0 sm:w-auto sm:flex-1">
            <h2 className="flex items-center gap-2 text-base font-bold text-white">
              <ShoppingCart size={18} className="text-rose-300" /> {KLOOK_ITEMS.filter((i) => i.status !== "sem-venda").length} passeios já estão no carrinho da Klook
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-300">
              Todos com <b className="text-white">2 ingressos</b>, já na data e horário que encaixam no roteiro. Nada foi pago.
              Cada um marca <b className="text-emerald-300">Quero</b>, <b className="text-amber-300">Talvez</b> ou <b className="text-rose-300">Não</b> no
              próprio nome. Depois toque em <b className="text-white">Mandar no WhatsApp</b>: o link leva as suas escolhas, e quem abre completa as dele(a).
            </p>
            <p className="mt-2 text-xs text-slate-400">
              Preços da Klook em {KLOOK_UPDATED}, para os dois, convertidos para real — podem mudar até a compra.
            </p>
          </div>
          <div className="flex gap-2">
            {PEOPLE.map((p, idx) => (
              <div key={p.id} className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-center">
                <div className="text-lg" aria-hidden>{p.emoji}</div>
                <div className="text-xs font-semibold text-white">{p.name}</div>
                <div className="text-xs text-slate-400">{counts[idx]}/{KLOOK_ITEMS.length}</div>
              </div>
            ))}
          </div>
        </div>
        {cameFromLink && (
          <p className="mt-3 rounded-xl border border-sky-400/30 bg-sky-500/10 px-3 py-2 text-sm text-sky-100">
            Você abriu um link com escolhas — elas já aparecem abaixo. Marque as suas e mande de volta.
          </p>
        )}
      </section>

      {/* Filtro por cidade */}
      <div className="no-print flex gap-1 overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.04] p-1 [scrollbar-width:none]">
        {[["todas", "Todas", "📅"], ...Object.entries(CITY).map(([k, c]) => [k, c.label, c.emoji])].map(([k, label, emoji]) => (
          <button key={k} type="button" onClick={() => setCity(k)}
            className={`filter-pill flex-1 whitespace-nowrap rounded-xl px-3 py-2 text-sm font-semibold ${
              city === k ? "bg-white text-slate-900 shadow" : "text-slate-300 hover:bg-white/5"
            }`}>
            <span aria-hidden>{emoji}</span> {label}
          </button>
        ))}
      </div>

      {/* Dias */}
      {days.map((d) => (
        <section key={d.iso}>
          <h2 className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-300">
            <CalendarDays size={16} className="text-rose-300" /> {d.label}
            <span className="font-normal normal-case text-slate-400">· {CITY[d.city].emoji} {CITY[d.city].label}</span>
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {d.items.map((i) => (
              <KlookCard key={i.id} item={i} votes={votes} onVote={vote} />
            ))}
          </div>
        </section>
      ))}

      {/* Resultado */}
      <section className="card p-5">
        <h2 className="text-base font-bold text-white">Batendo o martelo</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <Tally title="Fechados" n={closed.length} cls="text-emerald-300" extra={closed.length ? `${formatBRL(totalClosed)} para os dois` : ""} />
          <Tally title="Conversar" n={talk.length} cls="text-amber-300" />
          <Tally title="Tirar do carrinho" n={out.length} cls="text-rose-300" />
        </div>
        {closed.length > 0 && (
          <ul className="mt-3 space-y-1 text-sm text-slate-200">
            {closed.map((i) => (
              <li key={i.id} className="flex justify-between gap-3">
                <span>{i.day} · {i.time.split(" ")[0]} — {i.name}</span>
                <span className="flex-none text-slate-400">{formatBRL(i.priceBRL)}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="no-print mt-4 flex flex-wrap gap-2">
          <a href={`https://wa.me/?text=${encodeURIComponent(shareText())}`} target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-400">
            <MessageCircle size={16} /> Mandar no WhatsApp
          </a>
          <button type="button" onClick={onCopy}
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-slate-100 hover:bg-white/5">
            {copied ? <Check size={16} /> : null} {copied ? "Copiado!" : "Copiar resumo + link"}
          </button>
          <button type="button" onClick={() => setVotes({ p: {}, g: {} })}
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-400 hover:text-slate-200">
            <RotateCcw size={15} /> Limpar escolhas
          </button>
        </div>
        <p className="mt-3 text-xs text-slate-400">
          Os “tirar do carrinho” o Pedro remove na Klook. Itens sem venda aberta (Shibuya Sky, Kaiyukan e teleférico de Kobe) não estão no carrinho — comprar em novembro.
        </p>
      </section>
    </div>
  );
}

function sortTime(t) {
  const m = /(\d{1,2}):(\d{2})/.exec(t || "");
  return m ? +m[1] * 60 + +m[2] : 0; // "Dia todo" vem primeiro
}

function Tally({ title, n, cls, extra }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <div className={`text-2xl font-extrabold ${cls}`}>{n}</div>
      <div className="text-sm font-semibold text-white">{title}</div>
      {extra && <div className="text-xs text-slate-400">{extra}</div>}
    </div>
  );
}

function KlookCard({ item: i, votes, onVote }) {
  const st = KLOOK_STATUS[i.status];
  const v = verdict(i, votes);
  const maps = `https://www.google.com/maps/search/?api=1&query=${i.lat},${i.lng}`;
  const yt = `https://www.youtube.com/results?search_query=${encodeURIComponent(i.video)}`;
  return (
    <article className="card overflow-hidden">
      <div className="relative h-40 bg-slate-800 sm:h-44">
        <img src={i.img} alt="" loading="lazy" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <span className={`absolute left-3 top-3 rounded-full border px-2.5 py-1 text-xs font-semibold backdrop-blur ${st.cls}`}>{st.label}</span>
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
          <div className="rounded-xl bg-black/55 px-3 py-1.5 backdrop-blur">
            <div className="text-xs text-slate-300">{i.day}</div>
            <div className="text-lg font-extrabold leading-tight text-white">{i.time}</div>
          </div>
          <div className="rounded-xl bg-black/55 px-3 py-1.5 text-right backdrop-blur">
            <div className="text-xs text-slate-300">para os dois</div>
            <div className="text-lg font-extrabold leading-tight text-white">≈ {formatBRL(i.priceBRL)}</div>
          </div>
        </div>
      </div>

      <div className="space-y-3 p-4">
        <div>
          <h3 className="text-base font-bold leading-snug text-white">{i.name}</h3>
          <p className="text-xs text-slate-400">{i.pkg}</p>
        </div>
        <p className="text-sm leading-relaxed text-slate-200">{i.why}</p>

        <div className="rounded-xl bg-white/[0.04] p-3 text-sm leading-relaxed text-slate-300">
          <b className="text-white">No roteiro: </b>{i.fits}
        </div>
        {i.conflict && (
          <Note tone="amber"><b>Escolher um: </b>{i.conflict}.</Note>
        )}
        {i.warn && <Note tone="amber">{i.warn}</Note>}
        {i.salesNote && <Note tone="sky">{i.salesNote}</Note>}

        <dl className="grid grid-cols-1 gap-x-4 gap-y-1.5 text-sm sm:grid-cols-2">
          <Info icon={Clock} label="Duração" value={i.duration} />
          <Info icon={Star} label="Nota" value={`${i.rating} · ${i.reviews}`} />
          <Info icon={MapPin} label="Onde" value={i.place} wide />
          {i.otherTimes && <Info icon={CalendarDays} label="Outros horários" value={i.otherTimes} wide />}
          {i.cancel && <Info icon={RotateCcw} label="Cancelamento" value={i.cancel} wide />}
        </dl>

        <div className="no-print flex flex-wrap gap-2">
          <ExtLink href={i.url} icon={ExternalLink}>Ver na Klook</ExtLink>
          <ExtLink href={yt} icon={PlayCircle}>Vídeos</ExtLink>
          <ExtLink href={maps} icon={MapPin}>Mapa</ExtLink>
        </div>

        <div className="space-y-2 border-t border-white/10 pt-3">
          {PEOPLE.map((p) => (
            <div key={p.id} className="flex items-center gap-2">
              <span className="w-16 flex-none text-sm font-semibold text-slate-200"><span aria-hidden>{p.emoji}</span> {p.name}</span>
              <div className="grid flex-1 grid-cols-3 gap-1.5">
                {Object.entries(VOTES).map(([k, cfg]) => {
                  const on = votes[p.id][i.id] === k;
                  const Icon = cfg.icon;
                  return (
                    <button key={k} type="button" aria-pressed={on} onClick={() => onVote(p.id, i.id, k)}
                      className={`filter-pill inline-flex items-center justify-center gap-1 rounded-lg border px-2 py-2 text-xs font-bold ${
                        on ? cfg.on : "border-white/10 text-slate-300 hover:bg-white/5"
                      }`}>
                      {Icon && <Icon size={13} />} {cfg.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          <p className={`text-xs font-semibold ${v.cls}`}>{v.key === "out" ? <X size={12} className="mr-1 inline" /> : null}{v.label}</p>
        </div>
      </div>
    </article>
  );
}

function Note({ tone, children }) {
  const cls = tone === "sky"
    ? "border-sky-400/30 bg-sky-500/10 text-sky-100"
    : "border-amber-400/30 bg-amber-500/10 text-amber-100";
  return (
    <p className={`flex gap-2 rounded-xl border px-3 py-2 text-sm leading-relaxed ${cls}`}>
      <AlertTriangle size={16} className="mt-0.5 flex-none" /> <span>{children}</span>
    </p>
  );
}

function Info({ icon: Icon, label, value, wide }) {
  return (
    <div className={`flex gap-2 ${wide ? "sm:col-span-2" : ""}`}>
      <Icon size={15} className="mt-0.5 flex-none text-slate-400" />
      <div><dt className="inline text-slate-400">{label}: </dt><dd className="inline text-slate-100">{value}</dd></div>
    </div>
  );
}

function ExtLink({ href, icon: Icon, children }) {
  return (
    <a href={href} target="_blank" rel="noreferrer"
      className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 text-sm font-semibold text-slate-100 hover:bg-white/5">
      <Icon size={15} /> {children}
    </a>
  );
}
