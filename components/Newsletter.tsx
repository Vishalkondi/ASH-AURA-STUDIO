"use client";

import { useState } from "react";
import { theme } from "@/lib/theme";
import { apiUrl } from "@/lib/api";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch(apiUrl("subscribe"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) setDone(true);
    } catch {
      /* silent */
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <p style={{ fontFamily: theme.serif, fontStyle: "italic", fontSize: 18, color: theme.accent }}>
        You&apos;re on the list — thank you.
      </p>
    );
  }

  return (
    <form onSubmit={submit} style={{ display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}>
      <input
        type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        style={{
          background: "transparent", border: "none", borderBottom: `1px solid rgba(176,141,87,0.35)`,
          padding: "10px 0", fontSize: 15, outline: "none", minWidth: 220,
        }}
      />
      <button type="submit" disabled={busy}
        style={{
          fontFamily: theme.sans, fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase",
          padding: "12px 22px", background: "transparent", color: theme.accent,
          border: `1px solid ${theme.accent}`, cursor: busy ? "default" : "pointer",
        }}>
        {busy ? "…" : "Subscribe"}
      </button>
    </form>
  );
}
