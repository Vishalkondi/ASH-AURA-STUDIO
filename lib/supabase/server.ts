import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createClient as createRawClient } from "@supabase/supabase-js";

// Request-scoped client that respects the anon key + RLS (uses cookies).
export async function createServerSupabase() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // called from a Server Component — safe to ignore
          }
        },
      },
    }
  );
}

// Elevated client for trusted server work (admin dashboard, writes that bypass RLS).
// NEVER import this into a Client Component.
export function createAdminSupabase() {
  return createRawClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
