import { createAdminSupabase } from "@/lib/supabase/server";
import { theme } from "@/lib/theme";
import type { Enquiry, ConceptRow } from "@/lib/types";

export const dynamic = "force-dynamic";

function Gate() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ maxWidth: 420, textAlign: "center" }}>
        <h1 style={{ fontFamily: theme.serif, fontWeight: 300, fontSize: 42 }}>Studio Admin</h1>
        <p style={{ color: theme.textDim, marginTop: 16, lineHeight: 1.7, fontWeight: 300 }}>
          Append <code style={{ color: theme.accent }}>?token=YOUR_ADMIN_TOKEN</code> to the URL to view enquiries and concepts.
          Set <code style={{ color: theme.accent }}>ADMIN_TOKEN</code> in your environment.
        </p>
      </div>
    </main>
  );
}

const priorityColor: Record<string, string> = {
  High: "#c98d6f",
  Medium: theme.accent,
  Low: "#7a8466",
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const expected = process.env.ADMIN_TOKEN;
  if (!expected || token !== expected) return <Gate />;

  const supabase = createAdminSupabase();
  const since = (days: number) => { const d = new Date(); d.setDate(d.getDate() - days); return d.toISOString(); };
  const startOfToday = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();

  const [{ data: enquiries }, { data: concepts }, { count: subs }, { data: visits }] = await Promise.all([
    supabase.from("enquiries").select("*").order("created_at", { ascending: false }).limit(100),
    supabase.from("concepts").select("*").order("created_at", { ascending: false }).limit(60),
    supabase.from("subscribers").select("*", { count: "exact", head: true }),
    supabase.from("visits").select("path,source,device,country,visitor_id,created_at").order("created_at", { ascending: false }).limit(5000),
  ]);

  const eList = (enquiries || []) as Enquiry[];
  const cList = (concepts || []) as ConceptRow[];

  type V = { path: string | null; source: string | null; device: string | null; country: string | null; visitor_id: string | null; created_at: string };
  const vList = (visits || []) as V[];
  const vTotals = {
    total: vList.length,
    today: vList.filter((v) => v.created_at >= startOfToday).length,
    week: vList.filter((v) => v.created_at >= since(7)).length,
    month: vList.filter((v) => v.created_at >= since(30)).length,
    unique: new Set(vList.map((v) => v.visitor_id || "").filter(Boolean)).size,
  };
  const tally = (key: keyof V, limit = 8) => {
    const m = new Map<string, number>();
    for (const v of vList) { const k = (v[key] as string) || "unknown"; m.set(k, (m.get(k) || 0) + 1); }
    return [...m.entries()].map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count).slice(0, limit);
  };
  const topPages = tally("path", 8);
  const sources = tally("source", 8);
  const devices = tally("device", 3);
  const countries = tally("country", 6);
  const dailyMap = new Map<string, number>();
  for (const v of vList) { if (v.created_at >= since(14)) { const d = v.created_at.slice(0, 10); dailyMap.set(d, (dailyMap.get(d) || 0) + 1); } }
  const daily: { day: string; count: number }[] = [];
  for (let i = 13; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); const key = d.toISOString().slice(0, 10); daily.push({ day: key, count: dailyMap.get(key) || 0 }); }
  const dailyMax = Math.max(1, ...daily.map((d) => d.count));

  return (
    <main style={{ minHeight: "100vh", padding: "clamp(24px,5vw,72px)", maxWidth: 1200, margin: "0 auto" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16, marginBottom: 48 }}>
        <div>
          <span style={{ fontFamily: "monospace", fontSize: 12, letterSpacing: ".2em", color: theme.accent }}>ASH AURA · ADMIN</span>
          <h1 style={{ fontFamily: theme.serif, fontWeight: 300, fontSize: "clamp(34px,5vw,56px)", marginTop: 10 }}>Studio Dashboard</h1>
        </div>
        <div style={{ display: "flex", gap: 36, flexWrap: "wrap" }}>
          <Stat label="Visitors" value={vTotals.total} />
          <Stat label="Enquiries" value={eList.length} />
          <Stat label="Concepts" value={cList.length} />
          <Stat label="Subscribers" value={subs ?? 0} />
        </div>
      </header>

      <section style={{ marginBottom: 64 }}>
        <h2 style={sectionH}>Visitor Analytics</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 16, marginBottom: 24 }}>
          <MetricCard label="Today" value={vTotals.today} />
          <MetricCard label="Last 7 days" value={vTotals.week} />
          <MetricCard label="Last 30 days" value={vTotals.month} />
          <MetricCard label="All time" value={vTotals.total} />
          <MetricCard label="Unique visitors" value={vTotals.unique} />
        </div>

        <div style={card}>
          <span style={{ fontSize: 10, letterSpacing: ".24em", textTransform: "uppercase", color: theme.accent }}>Visits · last 14 days</span>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 120, marginTop: 18 }}>
            {daily.map((d) => (
              <div key={d.day} title={`${d.day}: ${d.count}`} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%", justifyContent: "flex-end" }}>
                <div style={{ width: "100%", height: `${(d.count / dailyMax) * 100}%`, minHeight: d.count ? 3 : 0, background: theme.accent, opacity: d.count ? 1 : 0.15, borderRadius: "2px 2px 0 0", transition: "height .3s ease" }} />
                <span style={{ fontSize: 8, color: "#6f6a60" }}>{d.day.slice(8, 10)}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16, marginTop: 16 }}>
          <BreakdownCard title="Top Pages" rows={topPages} />
          <BreakdownCard title="Sources" rows={sources} />
          <BreakdownCard title="Devices" rows={devices} />
          <BreakdownCard title="Countries" rows={countries} />
        </div>
      </section>

      <section style={{ marginBottom: 64 }}>
        <h2 style={sectionH}>Enquiries</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {eList.length === 0 && <Empty>No enquiries yet.</Empty>}
          {eList.map((e) => (
            <article key={e.id} style={card}>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10, alignItems: "baseline" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap" }}>
                  <span style={{ fontFamily: theme.serif, fontSize: 24 }}>{e.name || "—"}</span>
                  <a href={`mailto:${e.email}`} style={{ fontSize: 13, color: theme.accent }}>{e.email}</a>
                  {e.project_type && <span style={tag}>{e.project_type}</span>}
                </div>
                {e.ai_priority && (
                  <span style={{ fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", color: priorityColor[e.ai_priority] || theme.accent }}>
                    ● {e.ai_priority} priority
                  </span>
                )}
              </div>
              {e.message && <p style={{ color: theme.textDim, marginTop: 14, lineHeight: 1.6, fontWeight: 300 }}>{e.message}</p>}

              {(e.ai_summary || e.ai_next_step) && (
                <div style={{ marginTop: 18, padding: 18, background: "rgba(176,141,87,0.06)", border: `1px solid ${theme.line}`, display: "flex", flexDirection: "column", gap: 10 }}>
                  <span style={{ fontSize: 10, letterSpacing: ".24em", textTransform: "uppercase", color: theme.accent }}>✦ AI Lead Analysis</span>
                  {e.ai_summary && <Row k="Summary" v={e.ai_summary} />}
                  {e.ai_scope && <Row k="Scope" v={e.ai_scope} />}
                  {e.ai_next_step && <Row k="Next step" v={e.ai_next_step} />}
                </div>
              )}
              <time style={{ display: "block", marginTop: 14, fontSize: 11, letterSpacing: ".1em", color: "#6f6a60" }}>
                {new Date(e.created_at).toLocaleString()}
              </time>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 style={sectionH}>AI Concepts</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 16 }}>
          {cList.length === 0 && <Empty>No concepts generated yet.</Empty>}
          {cList.map((c) => (
            <article key={c.id} style={card}>
              <span style={{ fontSize: 10, letterSpacing: ".22em", textTransform: "uppercase", color: theme.accent }}>{c.room} · {c.style}</span>
              <h3 style={{ fontFamily: theme.serif, fontSize: 22, margin: "8px 0 10px" }}>{c.title}</h3>
              <p style={{ fontSize: 13, color: theme.textDim, lineHeight: 1.6, fontWeight: 300 }}>{c.concept}</p>
              {Array.isArray(c.palette) && (
                <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
                  {c.palette.slice(0, 6).map((p, i) => (
                    <span key={i} title={`${p.name} ${p.hex}`} style={{ width: 22, height: 22, background: p.hex, border: "1px solid rgba(255,255,255,.08)" }} />
                  ))}
                </div>
              )}
              <time style={{ display: "block", marginTop: 14, fontSize: 11, color: "#6f6a60" }}>{new Date(c.created_at).toLocaleDateString()}</time>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

const sectionH: React.CSSProperties = {
  fontFamily: theme.serif, fontWeight: 300, fontSize: 30, marginBottom: 20,
  paddingBottom: 12, borderBottom: `1px solid ${theme.line}`,
};
const card: React.CSSProperties = {
  border: `1px solid ${theme.line}`, background: "rgba(12,16,15,0.5)", padding: "22px 24px",
};
const tag: React.CSSProperties = {
  fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", color: "#cbc7bd",
  padding: "4px 10px", border: `1px solid ${theme.line}`,
};

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ textAlign: "right" }}>
      <div style={{ fontFamily: theme.serif, fontSize: 38, color: theme.accent, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 10, letterSpacing: ".2em", textTransform: "uppercase", color: "#8d887e", marginTop: 6 }}>{label}</div>
    </div>
  );
}
function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ ...card, padding: "20px 22px" }}>
      <div style={{ fontFamily: theme.serif, fontSize: 34, color: theme.accent, lineHeight: 1 }}>{value.toLocaleString()}</div>
      <div style={{ fontSize: 10, letterSpacing: ".2em", textTransform: "uppercase", color: "#8d887e", marginTop: 8 }}>{label}</div>
    </div>
  );
}
function BreakdownCard({ title, rows }: { title: string; rows: { label: string; count: number }[] }) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <div style={card}>
      <span style={{ fontSize: 10, letterSpacing: ".24em", textTransform: "uppercase", color: theme.accent }}>{title}</span>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
        {rows.length === 0 && <span style={{ fontSize: 13, color: "#6f6a60", fontStyle: "italic" }}>No data yet.</span>}
        {rows.map((r) => (
          <div key={r.label} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
              <span style={{ color: "#ddd8cd", fontWeight: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 180 }}>{r.label}</span>
              <span style={{ color: theme.accent }}>{r.count}</span>
            </div>
            <div style={{ height: 4, background: "rgba(176,141,87,0.12)" }}>
              <div style={{ width: `${(r.count / max) * 100}%`, height: "100%", background: theme.accent }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
function Row({ k, v }: { k: string; v: string }) {
  return (
    <div style={{ display: "flex", gap: 12, fontSize: 13 }}>
      <span style={{ color: "#8d887e", minWidth: 78, flexShrink: 0 }}>{k}</span>
      <span style={{ color: "#ddd8cd", fontWeight: 300 }}>{v}</span>
    </div>
  );
}
function Empty({ children }: { children: React.ReactNode }) {
  return <p style={{ color: "#6f6a60", fontStyle: "italic", fontFamily: theme.serif, fontSize: 18 }}>{children}</p>;
}
