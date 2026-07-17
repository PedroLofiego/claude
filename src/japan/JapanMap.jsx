import { useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Check, Clock, Plus, Train } from "lucide-react";
import { JAPAN_POIS, POI_CATEGORIES } from "./japanData.js";
import { formatBRL } from "../lib/calc.js";

function catOf(id) {
  return POI_CATEGORIES.find((c) => c.id === id);
}

function makeIcon(emoji, color, selected) {
  return L.divIcon({
    className: "",
    html: `<div style="
      display:grid;place-items:center;width:34px;height:34px;border-radius:50%;
      background:${selected ? "#22c55e" : color};font-size:16px;
      border:2.5px solid ${selected ? "#bbf7d0" : "rgba(255,255,255,.85)"};
      box-shadow:0 2px 8px rgba(0,0,0,.45);cursor:pointer;">${emoji}</div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -18],
  });
}

const hotelIcon = L.divIcon({
  className: "",
  html: `<div style="
    display:grid;place-items:center;width:30px;height:30px;border-radius:8px;
    background:#0ea5e9;font-size:14px;border:2px solid rgba(255,255,255,.85);
    box-shadow:0 2px 8px rgba(0,0,0,.45);">🏨</div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -16],
});

export default function JapanMap({ selectedIds, onToggle, bases = [] }) {
  const [activeCats, setActiveCats] = useState(() => new Set(POI_CATEGORIES.map((c) => c.id)));
  const [onlySelected, setOnlySelected] = useState(false);

  const toggleCat = (id) => {
    setActiveCats((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const visible = useMemo(
    () =>
      JAPAN_POIS.filter(
        (p) => activeCats.has(p.cat) && (!onlySelected || selectedIds.has(p.id))
      ),
    [activeCats, onlySelected, selectedIds]
  );

  const baseList = bases.length ? bases : [];

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-wrap items-center gap-1.5 border-b border-white/10 p-3">
        {POI_CATEGORIES.map((c) => {
          const on = activeCats.has(c.id);
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => toggleCat(c.id)}
              className={`rounded-full border px-2.5 py-1 text-xs font-medium transition ${
                on
                  ? "border-white/20 bg-white/10 text-white"
                  : "border-white/5 bg-white/[0.02] text-slate-500"
              }`}
              style={on ? { borderColor: c.color + "66" } : undefined}
            >
              {c.emoji} {c.label}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => setOnlySelected((v) => !v)}
          className={`ml-auto rounded-full border px-2.5 py-1 text-xs font-semibold ${
            onlySelected
              ? "border-emerald-400/50 bg-emerald-500/20 text-emerald-100"
              : "border-white/10 bg-white/5 text-slate-300"
          }`}
        >
          <Check size={11} className="mr-1 inline -mt-0.5" />
          Só meu plano ({selectedIds.size})
        </button>
      </div>

      <div className="h-[520px] w-full">
        <MapContainer
          center={[35.68, 139.75]}
          zoom={12}
          scrollWheelZoom
          style={{ height: "100%", width: "100%", background: "#0b1020" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          {baseList.map((base) => (
            <Marker key={base.id} position={[base.lat, base.lng]} icon={hotelIcon}>
              <Popup>
                <div style={{ minWidth: 180 }}>
                  <strong>🏨 Base: {base.name}</strong>
                  <div style={{ fontSize: 12, marginTop: 4 }}>{base.verdict}</div>
                </div>
              </Popup>
            </Marker>
          ))}
          {visible.map((p) => {
            const cat = catOf(p.cat);
            const isSel = selectedIds.has(p.id);
            return (
              <Marker
                key={p.id}
                position={[p.lat, p.lng]}
                icon={makeIcon(cat.emoji, cat.color, isSel)}
              >
                <Popup maxWidth={300}>
                  <div style={{ minWidth: 220, fontSize: 13, lineHeight: 1.45 }}>
                    <strong style={{ fontSize: 14 }}>{cat.emoji} {p.name}</strong>
                    <div style={{ margin: "6px 0" }}>{p.desc}</div>
                    <div style={{ fontSize: 12, color: "#555" }}>
                      🎟️ Entrada: <strong>{p.costBRL > 0 ? formatBRL(p.costBRL) + "/pessoa" : "Grátis"}</strong>
                      {p.spendBRL > 0 && <> · gasto típico ~{formatBRL(p.spendBRL)}</>}
                      <br />⏱ {p.duration}
                      <br />🚇 {p.transport}
                    </div>
                    <div style={{ fontSize: 12, marginTop: 6, fontStyle: "italic" }}>💡 {p.tip}</div>
                    <button
                      onClick={() => onToggle(p.id)}
                      style={{
                        marginTop: 8, width: "100%", padding: "7px 10px", borderRadius: 8,
                        border: "none", cursor: "pointer", fontWeight: 700, fontSize: 12.5,
                        background: isSel ? "#dc2626" : "#4f46e5", color: "#fff",
                      }}
                    >
                      {isSel ? "✕ Remover do plano" : "+ Adicionar ao plano"}
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      <div className="border-t border-white/10 p-3">
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          {visible.length} lugares no mapa · clique no marcador p/ preço, transporte e dica
        </div>
        <ul className="grid max-h-64 grid-cols-1 gap-1 overflow-auto sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((p) => {
            const isSel = selectedIds.has(p.id);
            const cat = catOf(p.cat);
            return (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => onToggle(p.id)}
                  className={`flex w-full items-center gap-2 rounded-lg border px-2.5 py-1.5 text-left text-xs transition ${
                    isSel
                      ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-50"
                      : "border-white/5 bg-white/[0.03] text-slate-300 hover:bg-white/[0.07]"
                  }`}
                >
                  <span>{cat.emoji}</span>
                  <span className="flex-1 truncate">{p.name}</span>
                  <span className="flex-none font-semibold">
                    {p.costBRL > 0 ? formatBRL(p.costBRL) : "Grátis"}
                  </span>
                  {isSel ? (
                    <Check size={12} className="flex-none text-emerald-300" />
                  ) : (
                    <Plus size={12} className="flex-none text-slate-500" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
