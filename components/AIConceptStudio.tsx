"use client";

import { useState } from "react";
import { theme } from "@/lib/theme";
import { apiUrl } from "@/lib/api";
import type { Concept } from "@/lib/types";

const ROOMS = [
  "Living Room", "Master Bedroom", "Kitchen & Dining", "Home Office",
  "Full Home", "Retail / Commercial", "Restaurant / Café",
];
const STYLES = [
  "Warm Contemporary", "Modern Minimal", "Classic Luxe", "Japandi",
  "Mid-Century Modern", "Bohemian Eclectic", "Dark & Moody",
];

const field: React.CSSProperties = {
  background: "transparent",
  border: "none",
  borderBottom: `1px solid rgba(176,141,87,0.28)`,
  padding: "12px 0",
  fontSize: 16,
  outline: "none",
  width: "100%",
};
const label: React.CSSProperties = {
  fontSize: 10, letterSpacing: ".26em", textTransform: "uppercase", color: "#8d887e",
};

export default function AIConceptStudio() {
  const [room, setRoom] = useState(ROOMS[0]);
  const [style, setStyle] = useState(STYLES[0]);
  const [brief, setBrief] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [result, setResult] = useState<Concept | null>(null);

  async function generate() {
    if (loading) return;
    setLoading(true); setError(false); setResult(null);
    try {
      const res = await fetch(apiUrl("concept"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ room, style, brief: brief.slice(0, 600) }),
      });
      if (!res.ok) throw new Error("bad status");
      const data = await res.json();
      setResult(data.concept as Concept);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(310px,1fr))",
        gap: "clamp(28px,4vw,60px)",
        alignItems: "start",
      }}
    >
      {/* FORM */}
      <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          <label style={label}>Room / Space</label>
          <select style={{ ...field, cursor: "pointer", appearance: "none" }}
            value={room} onChange={(e) => setRoom(e.target.value)}>
            {ROOMS.map((r) => <option key={r}>{r}</option>)}
          </select>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          <label style={label}>Aesthetic Direction</label>
          <select style={{ ...field, cursor: "pointer", appearance: "none" }}
            value={style} onChange={(e) => setStyle(e.target.value)}>
            {STYLES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          <label style={label}>
            Tell us more{" "}
            <span style={{ textTransform: "none", letterSpacing: 0, color: "#6f6a60" }}>(optional)</span>
          </label>
          <textarea rows={3} value={brief} onChange={(e) => setBrief(e.target.value)}
            placeholder="Size, light, mood, must-keep pieces, colours you love or avoid…"
            style={{ ...field, resize: "vertical" }} />
        </div>
        <button onClick={generate} disabled={loading}
          style={{
            alignSelf: "flex-start", marginTop: 6, display: "inline-flex", alignItems: "center", gap: 12,
            fontFamily: theme.sans, fontSize: 12, letterSpacing: ".2em", textTransform: "uppercase",
            padding: "18px 34px", background: theme.accent, color: "#121415", border: "none",
            cursor: loading ? "default" : "pointer", opacity: loading ? 0.55 : 1, transition: "opacity .3s ease",
          }}>
          <span>{loading ? "Composing…" : "Generate Concept"}</span>
          <span style={{ fontSize: 15 }}>✦</span>
        </button>
        <p style={{ fontSize: 11, lineHeight: 1.6, color: "#6f6a60", fontWeight: 300 }}>
          AI-generated concepts are a starting point, not a final design. Every ASH AURA project is crafted by hand.
        </p>
      </div>

      {/* OUTPUT */}
      <div style={{
        position: "relative", minHeight: 420, border: `1px solid ${theme.line}`,
        background: "rgba(12,16,15,0.5)", padding: "clamp(26px,3vw,40px)",
      }}>
        {!loading && !error && !result && (
          <div style={centerBox}>
            <span style={{ fontFamily: theme.serif, fontSize: 44, color: theme.accent }}>✦</span>
            <p style={{ fontFamily: theme.serif, fontStyle: "italic", fontSize: 22, color: "#8d887e", maxWidth: 300, lineHeight: 1.5 }}>
              Your concept will appear here.
            </p>
          </div>
        )}
        {loading && (
          <div style={centerBox}>
            <span style={{
              display: "block", width: 34, height: 34, borderRadius: "50%",
              border: "2px solid rgba(176,141,87,0.25)", borderTopColor: theme.accent,
              animation: "auraSpin .8s linear infinite",
            }} />
            <p style={{ fontFamily: theme.serif, fontStyle: "italic", fontSize: 22, color: theme.textDim }}>
              Composing your concept…
            </p>
          </div>
        )}
        {error && (
          <div style={centerBox}>
            <p style={{ fontFamily: theme.serif, fontStyle: "italic", fontSize: 22, color: "#c98d6f" }}>
              We couldn&apos;t compose that one.
            </p>
            <p style={{ fontSize: 14, color: "#8d887e", maxWidth: 280, lineHeight: 1.6 }}>
              Please try again in a moment.
            </p>
          </div>
        )}
        {!loading && result && <ConceptView room={room} style={style} c={result} />}
      </div>
    </div>
  );
}

const centerBox: React.CSSProperties = {
  height: "100%", minHeight: 360, display: "flex", flexDirection: "column",
  alignItems: "center", justifyContent: "center", textAlign: "center", gap: 18,
};

function ConceptView({ room, style, c }: { room: string; style: string; c: Concept }) {
  const eyebrow = { fontSize: 10, letterSpacing: ".26em", textTransform: "uppercase", color: "#8d887e", marginBottom: 14 } as React.CSSProperties;
  return (
    <div style={{ animation: "auraFade .6s cubic-bezier(.22,.61,.36,1) both" }}>
      <span style={{ fontSize: 10, letterSpacing: ".3em", textTransform: "uppercase", color: theme.accent }}>
        {room} · {style}
      </span>
      <h3 style={{ fontFamily: theme.serif, fontWeight: 400, fontSize: "clamp(28px,3vw,40px)", lineHeight: 1.1, margin: "12px 0 16px" }}>
        {c.title}
      </h3>
      <p style={{ fontFamily: theme.serif, fontStyle: "italic", fontWeight: 300, fontSize: "clamp(17px,1.5vw,21px)", lineHeight: 1.55, color: "#ddd8cd", marginBottom: 30 }}>
        {c.concept}
      </p>

      {c.palette?.length > 0 && (
        <>
          <div style={eyebrow}>Palette</div>
          <div style={{ display: "flex", gap: 10, marginBottom: 30 }}>
            {c.palette.slice(0, 6).map((col, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1, minWidth: 0 }}>
                <div style={{ height: 56, background: col.hex, border: "1px solid rgba(255,255,255,0.06)" }} />
                <div style={{ fontSize: 10, color: "#cbc7bd", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{col.name}</div>
                <div style={{ fontFamily: "monospace", fontSize: 10, color: "#6f6a60" }}>{col.hex}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {c.materials?.length > 0 && (
        <>
          <div style={eyebrow}>Materials &amp; Finishes</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 30 }}>
            {c.materials.map((m, i) => (
              <span key={i} style={{ fontSize: 12, color: "#ddd8cd", padding: "8px 14px", border: `1px solid rgba(176,141,87,0.24)` }}>{m}</span>
            ))}
          </div>
        </>
      )}

      {c.signature_pieces?.length > 0 && (
        <>
          <div style={eyebrow}>Signature Pieces</div>
          <ul style={{ listStyle: "none", margin: "0 0 28px", padding: 0 }}>
            {c.signature_pieces.map((p, i) => (
              <li key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0", borderTop: `1px solid ${theme.line}` }}>
                <span style={{ width: 6, height: 6, background: theme.accent, transform: "rotate(45deg)", flexShrink: 0 }} />
                <span style={{ fontSize: 15, fontWeight: 300, color: "#ddd8cd" }}>{p}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {c.designer_note && (
        <div style={{ display: "flex", gap: 14, paddingTop: 22, borderTop: `1px solid rgba(176,141,87,0.24)` }}>
          <span style={{ fontSize: 10, letterSpacing: ".24em", textTransform: "uppercase", color: theme.accent, flexShrink: 0, paddingTop: 3 }}>Studio Note</span>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: theme.textDim, fontWeight: 300 }}>{c.designer_note}</p>
        </div>
      )}

      <a href="#contact" style={{ display: "inline-flex", alignItems: "center", gap: 10, marginTop: 28, fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: theme.accent, borderBottom: `1px solid ${theme.accent}`, paddingBottom: 5 }}>
        Bring this concept to life →
      </a>
    </div>
  );
}
