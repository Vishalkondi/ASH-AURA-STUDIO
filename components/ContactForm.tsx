"use client";

import { useState } from "react";
import { theme } from "@/lib/theme";
import { apiUrl } from "@/lib/api";

const field: React.CSSProperties = {
  background: "transparent", border: "none",
  borderBottom: `1px solid rgba(176,141,87,0.28)`,
  padding: "10px 0", fontSize: 16, outline: "none", width: "100%",
};
const label: React.CSSProperties = {
  fontSize: 10, letterSpacing: ".26em", textTransform: "uppercase", color: "#8d887e",
};

const DEFAULT_REPLY =
  "Your enquiry is on its way — Aishwarya and the team will be in touch within 48 hours.";

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [reply, setReply] = useState(DEFAULT_REPLY);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;
    setSending(true); setError("");
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch(apiUrl("contact"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          email: fd.get("email"),
          project_type: fd.get("project_type"),
          message: fd.get("message"),
        }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json().catch(() => ({}));
      if (data.reply) setReply(data.reply);
      setSent(true);
    } catch {
      setError("Something went wrong — please try again or email us directly.");
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14, padding: "30px 0" }}>
        <span style={{ fontFamily: theme.serif, fontStyle: "italic", fontWeight: 300, fontSize: "clamp(34px,4vw,52px)", color: theme.accent }}>
          Thank you.
        </span>
        <p style={{ fontSize: 16, lineHeight: 1.7, color: theme.textDim, maxWidth: 400, fontWeight: 300 }}>
          {reply}
        </p>
        <span style={{ fontSize: 10, letterSpacing: ".24em", textTransform: "uppercase", color: "#6f6a60", marginTop: 4 }}>
          ✦ Personalised reply by ASH AURA AI
        </span>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        <label style={label}>Name</label>
        <input name="name" type="text" required placeholder="Your full name" style={field} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        <label style={label}>Email</label>
        <input name="email" type="email" required placeholder="you@email.com" style={field} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        <label style={label}>Project Type</label>
        <select name="project_type" required defaultValue="" style={{ ...field, cursor: "pointer", appearance: "none" }}>
          <option value="" disabled>Select a service</option>
          <option>Residential Interior Design</option>
          <option>Commercial Interior Design</option>
          <option>Office Interior Design</option>
          <option>Turnkey / Other</option>
        </select>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        <label style={label}>Tell us about your space</label>
        <textarea name="message" rows={3} placeholder="Location, size, timeline, what you have in mind…"
          style={{ ...field, resize: "vertical" }} />
      </div>
      {error && <p style={{ fontSize: 13, color: "#c98d6f" }}>{error}</p>}
      <button type="submit" disabled={sending}
        style={{
          alignSelf: "flex-start", marginTop: 8, display: "inline-flex", alignItems: "center", gap: 12,
          fontFamily: theme.sans, fontSize: 12, letterSpacing: ".2em", textTransform: "uppercase",
          padding: "18px 34px", background: theme.accent, color: "#121415", border: "none",
          cursor: sending ? "default" : "pointer", opacity: sending ? 0.6 : 1,
        }}>
        {sending ? "Sending…" : "Send Enquiry"} <span style={{ fontSize: 15 }}>→</span>
      </button>
    </form>
  );
}
