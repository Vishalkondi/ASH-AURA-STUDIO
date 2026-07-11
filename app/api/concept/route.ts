import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/server";
import type { Concept } from "@/lib/types";

export const runtime = "nodejs";

function extractJson(text: string): string {
  let t = text.trim().replace(/^```(?:json)?/i, "").replace(/```$/,"").trim();
  const a = t.indexOf("{");
  const b = t.lastIndexOf("}");
  if (a >= 0 && b > a) t = t.slice(a, b + 1);
  return t;
}

export async function POST(req: Request) {
  try {
    const { room = "Living Room", style = "Warm Contemporary", brief = "" } =
      await req.json();

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const prompt =
      "You are the lead interior designer at ASH AURA STUDIO, a luxury studio working in a dark, elegant, timeless style. " +
      "Create a concise, refined interior concept for this brief.\n" +
      `Room: ${room}\nAesthetic direction: ${style}\nClient notes: ${brief || "none"}\n\n` +
      "Respond with ONLY valid minified JSON (no markdown, no code fences) in exactly this shape:\n" +
      '{"title":"evocative 2-4 word concept name","concept":"2-3 sentence design vision, elegant and specific","palette":[{"name":"colour name","hex":"#RRGGBB"}],"materials":["material or finish"],"signature_pieces":["a specific furniture or lighting piece"],"designer_note":"one warm sentence of pro advice"}\n' +
      "Give exactly 5 palette colours (real hex), 4 materials, and 3 signature_pieces. Keep all copy sophisticated and free of clichés.";

    const msg = await anthropic.messages.create({
      model: "claude-3-5-haiku-latest",
      max_tokens: 1100,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = msg.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { text: string }).text)
      .join("");

    const concept = JSON.parse(extractJson(raw)) as Concept;

    // Persist (best-effort — never block the response on a DB error).
    try {
      const supabase = createAdminSupabase();
      await supabase.from("concepts").insert({
        room,
        style,
        brief: brief || null,
        title: concept.title,
        concept: concept.concept,
        palette: concept.palette,
        materials: concept.materials,
        signature_pieces: concept.signature_pieces,
        designer_note: concept.designer_note,
      });
    } catch (e) {
      console.error("concept save failed:", e);
    }

    return NextResponse.json({ concept });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Could not generate a concept right now." },
      { status: 500 }
    );
  }
}
