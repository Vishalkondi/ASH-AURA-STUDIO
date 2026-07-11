"use client";

import { useEffect, useRef, useState } from "react";
import { theme } from "@/lib/theme";
import { apiUrl } from "@/lib/api";

type Msg = { role: "user" | "assistant"; content: string };

const GREETING: Msg = {
  role: "assistant",
  content:
    "Welcome to ASH AURA STUDIO. I can tell you about our services, process, or global projects — or help you book a free consultation. What are you dreaming up?",
};

export default function Concierge() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  async function send() {
    const text = input.trim();
    if (!text || busy) return;
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch(apiUrl("concierge"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setMessages((m) => [
        ...m,
        { role: "assistant", content: data.reply || "I'm not quite sure — but our team would love to help. Do reach out via the contact form." },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "I'm momentarily offline — please try again, or use the contact form below." },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {/* Launcher */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open concierge chat"
        style={{
          position: "fixed", right: 24, bottom: 24, zIndex: 80,
          display: "flex", alignItems: "center", gap: 10,
          padding: open ? "0" : "14px 22px",
          width: open ? 54 : "auto", height: 54,
          justifyContent: "center",
          background: theme.accent, color: "#121415", border: "none", cursor: "pointer",
          fontFamily: theme.sans, fontSize: 12, letterSpacing: ".16em", textTransform: "uppercase",
          borderRadius: 999, boxShadow: "0 14px 40px rgba(0,0,0,.45)",
          transition: "all .35s cubic-bezier(.22,.61,.36,1)",
        }}
      >
        {open ? <span style={{ fontSize: 22, lineHeight: 1 }}>×</span> : <><span style={{ fontSize: 15 }}>✦</span> Ask AURA</>}
      </button>

      {/* Panel */}
      {open && (
        <div
          style={{
            position: "fixed", right: 24, bottom: 92, zIndex: 80,
            width: "min(380px, calc(100vw - 48px))", height: "min(560px, calc(100vh - 140px))",
            display: "flex", flexDirection: "column",
            background: "#121716", border: `1px solid ${theme.line}`,
            boxShadow: "0 30px 80px rgba(0,0,0,.55)",
            animation: "auraFade .4s cubic-bezier(.22,.61,.36,1) both",
          }}
        >
          <div style={{ padding: "18px 20px", borderBottom: `1px solid ${theme.line}`, display: "flex", flexDirection: "column", gap: 3 }}>
            <span style={{ fontFamily: theme.serif, fontSize: 20, letterSpacing: ".02em" }}>ASH AURA Concierge</span>
            <span style={{ fontSize: 10, letterSpacing: ".24em", textTransform: "uppercase", color: theme.accent }}>AI · replies in seconds</span>
          </div>

          <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "85%" }}>
                <div
                  style={{
                    padding: "12px 15px", fontSize: 14, lineHeight: 1.55,
                    background: m.role === "user" ? theme.accent : "rgba(176,141,87,0.08)",
                    color: m.role === "user" ? "#121415" : "#ddd8cd",
                    border: m.role === "user" ? "none" : `1px solid ${theme.line}`,
                    fontFamily: m.role === "assistant" ? theme.serif : theme.sans,
                    fontStyle: m.role === "assistant" ? "italic" : "normal",
                    fontWeight: 300,
                  }}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {busy && (
              <div style={{ alignSelf: "flex-start", fontFamily: theme.serif, fontStyle: "italic", color: "#8d887e", fontSize: 14 }}>
                typing…
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); send(); }}
            style={{ display: "flex", gap: 8, padding: 14, borderTop: `1px solid ${theme.line}` }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about services, process…"
              style={{
                flex: 1, background: "transparent", border: "none",
                borderBottom: `1px solid rgba(176,141,87,0.28)`, padding: "8px 0", fontSize: 14, outline: "none",
              }}
            />
            <button type="submit" disabled={busy}
              style={{
                background: theme.accent, color: "#121415", border: "none",
                width: 40, height: 40, cursor: busy ? "default" : "pointer", fontSize: 16, flexShrink: 0,
              }}>
              →
            </button>
          </form>
        </div>
      )}
    </>
  );
}
