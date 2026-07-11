// Resolves an endpoint name to a full URL.
// If NEXT_PUBLIC_API_URL is set, calls the NestJS backend (e.g. http://localhost:4000/concept).
// Otherwise falls back to the built-in Next.js route handlers (/api/concept).
const BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

export function apiUrl(name: "concept" | "contact" | "concierge" | "subscribe" | "track"): string {
  return BASE ? `${BASE}/${name}` : `/api/${name}`;
}
