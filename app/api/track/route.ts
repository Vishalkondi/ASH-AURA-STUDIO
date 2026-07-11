import { NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/server";

export const runtime = "nodejs";

function deviceFromUA(ua: string): string {
  const s = (ua || "").toLowerCase();
  if (/ipad|tablet/.test(s)) return "tablet";
  if (/mobi|android|iphone/.test(s)) return "mobile";
  return "desktop";
}

function sourceFrom(referrer: string, utm?: string | null): string {
  if (utm) return utm.toLowerCase();
  const r = (referrer || "").toLowerCase();
  if (!r) return "direct";
  if (r.includes("instagram")) return "instagram";
  if (r.includes("google")) return "google";
  if (r.includes("facebook") || r.includes("fb.")) return "facebook";
  if (r.includes("whatsapp") || r.includes("wa.me")) return "whatsapp";
  if (r.includes("linkedin")) return "linkedin";
  try {
    return new URL(referrer).hostname.replace(/^www\./, "");
  } catch {
    return "other";
  }
}

// Fallback tracker for when NEXT_PUBLIC_API_URL is not set (single-service mode).
export async function POST(req: Request) {
  try {
    const b = await req.json().catch(() => ({}));
    const ua = req.headers.get("user-agent") || "";
    const country =
      req.headers.get("x-vercel-ip-country") ||
      req.headers.get("cf-ipcountry") ||
      null;

    const supabase = createAdminSupabase();
    await supabase.from("visits").insert({
      path: b.path || "/",
      referrer: b.referrer || null,
      source: sourceFrom(b.referrer || "", b.utm_source),
      device: deviceFromUA(ua),
      utm_source: b.utm_source || null,
      utm_medium: b.utm_medium || null,
      utm_campaign: b.utm_campaign || null,
      country,
      visitor_id: b.visitor_id || null,
      user_agent: ua.slice(0, 400),
    });
    return NextResponse.json({ ok: true });
  } catch {
    // Never fail the beacon.
    return NextResponse.json({ ok: true });
  }
}
