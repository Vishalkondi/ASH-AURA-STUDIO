import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/server";

export const runtime = "nodejs";

function extractJson(text: string): string {
  let t = text.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  const a = t.indexOf("{");
  const b = t.lastIndexOf("}");
  if (a >= 0 && b > a) t = t.slice(a, b + 1);
  return t;
}

type Analysis = {
  reply: string;
  summary: string;
  scope: string;
  priority: "High" | "Medium" | "Low";
  next_step: string;
};

const FALLBACK_REPLY =
  "Thank you — your enquiry is on its way. Aishwarya and the team will be in touch within 48 hours.";

export async function POST(req: Request) {
  try {
    const { name, email, project_type, message } = await req.json();
    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
    }

    // ---- AI lead analysis (best-effort) ----
    let analysis: Partial<Analysis> = {};
    try {
      const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      const prompt =
        "You are the client-relations lead at ASH AURA STUDIO, a luxury interior design studio. " +
        "A prospect just submitted an enquiry. Do two things:\n" +
        "1) Write a warm, elegant, personalised reply (2-3 sentences) addressed to them by first name, referencing their project, reassuring them of a response within 48 hours. Sophisticated, never salesy.\n" +
        "2) Give the studio a quick internal read on the lead.\n\n" +
        `Name: ${name}\nEmail: ${email}\nProject type: ${project_type || "unspecified"}\nMessage: ${message || "(none)"}\n\n` +
        "Respond with ONLY minified JSON in this exact shape:\n" +
        '{"reply":"...","summary":"one-line internal summary","scope":"estimated scope/scale","priority":"High|Medium|Low","next_step":"suggested next action"}';

      const msg = await anthropic.messages.create({
        model: "claude-3-5-haiku-latest",
        max_tokens: 700,
        messages: [{ role: "user", content: prompt }],
      });
      const raw = msg.content
        .filter((b) => b.type === "text")
        .map((b) => (b as { text: string }).text)
        .join("");
      analysis = JSON.parse(extractJson(raw)) as Analysis;
    } catch (e) {
      console.error("enquiry AI analysis failed:", e);
    }

    // ---- Persist ----
    const supabase = createAdminSupabase();
    const { error } = await supabase.from("enquiries").insert({
      name,
      email,
      project_type: project_type || null,
      message: message || null,
      ai_reply: analysis.reply || null,
      ai_summary: analysis.summary || null,
      ai_scope: analysis.scope || null,
      ai_priority: analysis.priority || null,
      ai_next_step: analysis.next_step || null,
    });
    if (error) throw error;

    return NextResponse.json({ ok: true, reply: analysis.reply || FALLBACK_REPLY });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Could not send your enquiry." }, { status: 500 });
  }
}
