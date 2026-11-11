/*
 * Gera os arquivos de "Levar para o celular" a partir dos mesmos dados do site:
 *   public/export/japao-pedro-gio.ics  → calendário (iPhone: toque e "Adicionar todos")
 *   public/export/japao-lugares.csv    → lugares para importar no Google My Maps
 * Roda sozinho antes do build (npm run build → prebuild).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { ROUTE_DAYS } from "../src/japan/routeData.js";
import { KLOOK_ITEMS } from "../src/japan/klookData.js";
import { FLIGHTS, STAYS } from "../src/japan/tripData.js";
import { TRAIN_EVENTS } from "../src/japan/trainsData.js";

const SITE = "https://pedrolofiego.github.io/claude";
const OUT = new URL("../public/export/", import.meta.url);
mkdirSync(OUT, { recursive: true });

const byId = Object.fromEntries(KLOOK_ITEMS.map((i) => [i.id, i]));
const enc = encodeURIComponent;
const mapsSearch = (q) => `https://www.google.com/maps/search/?api=1&query=${enc(q)}`;
const voucherUrl = (f) => `${SITE}/vouchers/${f}`;

// "Qua 09/12" → { y, m, d }
const dayDate = (label) => {
  const [dd, mm] = label.split(" ")[1].split("/").map(Number);
  return { y: 2026, m: mm, d: dd };
};
const pad = (n) => String(n).padStart(2, "0");
const ymd = ({ y, m, d }) => `${y}${pad(m)}${pad(d)}`;
const nextDay = ({ y, m, d }) => {
  const t = new Date(Date.UTC(y, m - 1, d + 1));
  return { y: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate() };
};
const hhmm = (s) => {
  const m = /(\d{1,2}):(\d{2})/.exec(s || "");
  return m ? [Number(m[1]), Number(m[2])] : null;
};
// Duração aproximada a partir do texto ("~1h30", "20 min", "Dia inteiro").
const durationMin = (txt = "") => {
  if (/dia inteiro/i.test(txt)) return 10 * 60;
  const h = /(\d+)\s*h\s*(\d{2})?/i.exec(txt);
  if (h) return Number(h[1]) * 60 + (h[2] ? Number(h[2]) : 0);
  const m = /(\d+)\s*min/i.exec(txt);
  if (m) return Number(m[1]);
  return 90;
};

// ---------- ICS ----------
const esc = (s) => String(s).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
// Dobra linhas em 75 bytes (regra do formato).
const fold = (line) => {
  const out = [];
  let cur = "";
  let bytes = 0;
  for (const ch of line) {
    const b = Buffer.byteLength(ch);
    if (bytes + b > 74) {
      out.push(cur);
      cur = " " + ch;
      bytes = 1 + b;
    } else {
      cur += ch;
      bytes += b;
    }
  }
  out.push(cur);
  return out.join("\r\n");
};
const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
const L = [
  "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//VoaJa//Japao Pedro e Gio//PT", "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
  "X-WR-CALNAME:Japão · Pedro & Gio", "X-WR-TIMEZONE:Asia/Tokyo",
  "BEGIN:VTIMEZONE", "TZID:Asia/Tokyo", "BEGIN:STANDARD", "DTSTART:19700101T000000", "TZOFFSETFROM:+0900", "TZOFFSETTO:+0900", "TZNAME:JST", "END:STANDARD", "END:VTIMEZONE",
];
const ev = (fields) => {
  L.push("BEGIN:VEVENT", `DTSTAMP:${stamp}`, ...fields, "END:VEVENT");
};

for (const d of ROUTE_DAYS) {
  const date = dayDate(d.date);
  const stops = [d.from, ...d.slots.filter((s) => s.map).map((s) => s.map), d.end].filter(Boolean);
  const routeUrl = stops.length > 2 ? `https://www.google.com/maps/dir/${stops.map((q) => enc(q)).join("/")}/` : null;
  const plan = d.slots.map((s) => (s.time === "—" ? `• ${s.what}` : `${s.time} — ${s.what}`)).join("\n");
  ev([
    `UID:voaja-japao-dia-${d.n}@pedrolofiego.github.io`,
    `DTSTART;VALUE=DATE:${ymd(date)}`, `DTEND;VALUE=DATE:${ymd(nextDay(date))}`,
    `SUMMARY:${esc(`🇯🇵 Dia ${d.n} · ${d.title}`)}`,
    `DESCRIPTION:${esc([plan, routeUrl && `\nRota do dia no Google Maps: ${routeUrl}`, d.sleep && `\nDorme em: ${d.sleep}`, d.tip && `\nDica: ${d.tip}`, `\nRoteiro completo: ${SITE}/#/japao/roteiro/rota`].filter(Boolean).join("\n"))}`,
    "TRANSP:TRANSPARENT",
  ]);

  // Um evento com horário para cada ingresso do dia.
  for (const s of d.slots) {
    const i = s.klookId && byId[s.klookId];
    if (!i) continue;
    const t = hhmm(s.time) || hhmm(i.time);
    if (!t) continue; // cupons, que valem a viagem toda, já estão no dia 1
    const start = new Date(Date.UTC(date.y, date.m - 1, date.d, t[0], t[1]));
    const end = new Date(start.getTime() + durationMin(i.duration) * 60000);
    const f = (x) => `${x.getUTCFullYear()}${pad(x.getUTCMonth() + 1)}${pad(x.getUTCDate())}T${pad(x.getUTCHours())}${pad(x.getUTCMinutes())}00`;
    const status = i.status === "pago" ? "✅ Pago" : i.status === "carrinho" ? "⚠️ Falta pagar" : "⏳ Venda ainda não abriu";
    const desc = [
      `${status}${i.ref ? ` · Reserva ${i.ref}` : ""} · 2 pessoas`,
      i.howTo && `\nNa entrada: ${i.howTo}`,
      i.voucherNote && `\n${i.voucherNote}`,
      ...(i.vouchers || []).map((v) => `\n🎟️ ${v.label}: ${voucherUrl(v.file)}`),
      `\nMapa: ${mapsSearch(s.map || `${i.lat},${i.lng}`)}`,
      `Klook: ${i.url}`,
    ].filter(Boolean).join("\n");
    ev([
      `UID:voaja-japao-${i.id}@pedrolofiego.github.io`,
      `DTSTART;TZID=Asia/Tokyo:${f(start)}`, `DTEND;TZID=Asia/Tokyo:${f(end)}`,
      `SUMMARY:${esc(`🎟️ ${i.name}`)}`,
      `LOCATION:${esc(s.map || i.place || "")}`,
      i.lat ? `GEO:${i.lat};${i.lng}` : null,
      `URL:${i.vouchers?.length ? voucherUrl(i.vouchers[0].file) : i.url}`,
      `DESCRIPTION:${esc(desc)}`,
      "BEGIN:VALARM", "ACTION:DISPLAY", `DESCRIPTION:${esc(i.name)}`, "TRIGGER:-PT60M", "END:VALARM",
    ].filter(Boolean));
  }
}
// ---------- Voos ----------
const utc = (iso) => iso.replace(/[-:]/g, "").replace(/Z$/, "00Z");
for (const f of FLIGHTS) {
  ev([
    `UID:voaja-japao-voo-${f.n}@pedrolofiego.github.io`,
    `DTSTART:${utc(f.utc[0])}`, `DTEND:${utc(f.utc[1])}`,
    `SUMMARY:${esc(`✈️ ${f.n} ${f.from} → ${f.to}`)}`,
    `LOCATION:${esc(f.from)}`,
    `DESCRIPTION:${esc([`${f.local} (horário local)`, f.note, "KLM · Pedro e Giovanna · código da reserva no app KLM / e-mail \"Booking confirmed Salvador < > Tokyo\"", "Check-in online abre 30h antes no app KLM."].join("\n"))}`,
    "BEGIN:VALARM", "ACTION:DISPLAY", `DESCRIPTION:${esc(`Voo ${f.n}`)}`, "TRIGGER:-PT3H", "END:VALARM",
  ]);
}

// ---------- Hotéis: check-in e check-out ----------
const local = (iso) => iso.replace(/[-:]/g, "") + "00";
const plus = (iso, min) => {
  const d = new Date(iso + ":00Z");
  d.setUTCMinutes(d.getUTCMinutes() + min);
  return d.toISOString().slice(0, 16);
};
for (const h of STAYS) {
  if (!h.checkInISO) continue;
  const info = [
    h.booking && `Reserva: ${h.booking}`,
    h.checkinCode,
    `Endereço: ${h.address}`,
    `Telefone: ${h.phone}`,
    `${h.nights} noite(s) · ${h.room}`,
    h.extra,
    h.cancel && `Cancelamento: ${h.cancel}`,
    `Mapa: ${mapsSearch(h.name + ", " + h.address)}`,
  ].filter(Boolean).join("\n");
  ev([
    `UID:voaja-japao-hotel-in-${h.id}@pedrolofiego.github.io`,
    `DTSTART;TZID=Asia/Tokyo:${local(h.checkInISO)}`, `DTEND;TZID=Asia/Tokyo:${local(plus(h.checkInISO, 30))}`,
    `SUMMARY:${esc(`🏨 Check-in · ${h.name}`)}`,
    `LOCATION:${esc(`${h.name}, ${h.address}`)}`,
    `GEO:${h.lat};${h.lng}`,
    `DESCRIPTION:${esc(info)}`,
    "TRANSP:TRANSPARENT",
  ]);
  ev([
    `UID:voaja-japao-hotel-out-${h.id}@pedrolofiego.github.io`,
    `DTSTART;TZID=Asia/Tokyo:${local(plus(h.checkOutISO, -30))}`, `DTEND;TZID=Asia/Tokyo:${local(h.checkOutISO)}`,
    `SUMMARY:${esc(`🧳 Check-out até ${h.checkOutISO.slice(11)} · ${h.name}`)}`,
    `LOCATION:${esc(`${h.name}, ${h.address}`)}`,
    `DESCRIPTION:${esc(info)}`,
    "BEGIN:VALARM", "ACTION:DISPLAY", `DESCRIPTION:${esc("Check-out")}`, "TRIGGER:-PT60M", "END:VALARM",
  ]);
}

// ---------- Trens entre cidades ----------
for (const t of TRAIN_EVENTS) {
  ev([
    `UID:voaja-japao-trem-${t.id}@pedrolofiego.github.io`,
    `DTSTART;TZID=Asia/Tokyo:${local(t.start)}`, `DTEND;TZID=Asia/Tokyo:${local(t.end)}`,
    `SUMMARY:${esc(t.title)}`,
    `LOCATION:${esc(t.where)}`,
    `DESCRIPTION:${esc(`${t.desc}\n\nOpções, preços e links: ${SITE}/#/japao/organizar/transporte`)}`,
    "BEGIN:VALARM", "ACTION:DISPLAY", `DESCRIPTION:${esc(t.title)}`, "TRIGGER:-PT60M", "END:VALARM",
  ]);
}

L.push("END:VCALENDAR");
writeFileSync(new URL("japao-pedro-gio.ics", OUT), L.map(fold).join("\r\n") + "\r\n");

// ---------- CSV para o Google My Maps ----------
const csvCell = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
const rows = [["Nome", "Endereço", "Dia", "Hora", "Tipo", "Descrição"]];
const seen = new Set();
const KIND = { klook: "Ingresso", comprar: "Ingresso (comprar)", perna: "Bater perna", comida: "Comer", transp: "Deslocamento", livre: "Livre" };
for (const d of ROUTE_DAYS) {
  for (const s of d.slots) {
    const i = s.klookId && byId[s.klookId];
    if (!s.map && !i?.lat) continue;
    if (i?.id?.startsWith("cupom")) continue; // cupom não é um lugar
    const addr = i?.lat && !s.map ? `${i.lat}, ${i.lng}` : `${s.map}, Japan`;
    const name = i ? i.name : s.map;
    const key = `${d.n}|${name}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const desc = [s.what, i?.ref && `Reserva ${i.ref}`, i?.howTo && `Na entrada: ${i.howTo}`, ...(i?.vouchers || []).map((v) => `${v.label}: ${voucherUrl(v.file)}`)].filter(Boolean).join(" | ");
    rows.push([name, addr, `Dia ${d.n} · ${d.date}`, s.time, i ? (i.status === "pago" ? "Ingresso pago" : "Ingresso") : KIND[s.kind] || "", desc]);
  }
}
// Hotéis
for (const h of STAYS) {
  rows.push([h.name, h.address || `${h.name}, Japan`, `Hotel · ${h.checkIn}–${h.checkOut}`, "", "Hotel", [h.booking, h.phone && `Tel. ${h.phone}`].filter(Boolean).join(" | ")]);
}
writeFileSync(new URL("japao-lugares.csv", OUT), "\uFEFF" + rows.map((r) => r.map(csvCell).join(",")).join("\r\n") + "\r\n");

console.log(`export: ${L.filter((l) => l === "BEGIN:VEVENT").length} eventos no calendário, ${rows.length - 1} lugares no CSV`);
