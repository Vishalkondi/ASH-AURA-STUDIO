import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Msg = { role: "user" | "assistant"; content: string };

const SYSTEM =
  "You are the ASH AURA STUDIO concierge — a warm, knowledgeable assistant for a luxury interior design studio led by principal designer Aishwarya Alatagi. " +
  "The studio designs residential, commercial and office interiors worldwide and offers: space planning, 3D visualisation & rendering, furniture & material selection, and turnkey interior solutions. " +
  "The first consultation is free. Help visitors understand services, process (Consultation → Concept & Moodboard → 3D Visualisation → Execution → Styling & Handover), and gently guide serious enquiries toward booking a free consultation via the contact form. " +
  "Keep replies concise (2-4 sentences), elegant and genuinely helpful. Never invent specific prices; explain that pricing is tailored per project after the free consultation.";

export async function POST(req: Request) {
  try {
    const { messages } = (await req.json()) as { messages: Msg[] };
    const trimmed = (messages || []).slice(-10);

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const msg = await anthropic.messages.create({
      model: "claude-3-5-haiku-latest",
      max_tokens: 500,
      system: SYSTEM,
      messages: trimmed.map((m) => ({ role: m.role, content: m.content })),
    });

    const reply = msg.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { text: string }).text)
      .join("")
      .trim();

    return NextResponse.json({ reply });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "The concierge is momentarily unavailable." },
      { status: 500 }
    );
  }
}
