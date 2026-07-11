import { NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email || !/.+@.+\..+/.test(email)) {
      return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
    }
    const supabase = createAdminSupabase();
    const { error } = await supabase.from("subscribers").insert({ email });
    // Ignore duplicate-email unique violations (23505) — treat as success.
    if (error && error.code !== "23505") throw error;
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Could not subscribe." }, { status: 500 });
  }
}
