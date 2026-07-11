"use client";

import { useEffect } from "react";
import { apiUrl } from "@/lib/api";

// Fire-and-forget visit beacon. Runs once per page load.
// Stores an anonymous visitor id in localStorage for unique-visitor counts.
export default function VisitTracker() {
  useEffect(() => {
    try {
      const KEY = "aura_visitor_id";
      let vid = localStorage.getItem(KEY);
      if (!vid) {
        vid =
          (crypto?.randomUUID && crypto.randomUUID()) ||
          Math.random().toString(36).slice(2) + Date.now().toString(36);
        localStorage.setItem(KEY, vid);
      }

      const params = new URLSearchParams(window.location.search);
      const payload = {
        path: window.location.pathname || "/",
        referrer: document.referrer || "",
        utm_source: params.get("utm_source") || undefined,
        utm_medium: params.get("utm_medium") || undefined,
        utm_campaign: params.get("utm_campaign") || undefined,
        visitor_id: vid,
      };

      const url = apiUrl("track" as never);
      const body = JSON.stringify(payload);
      // Prefer sendBeacon so it survives navigation; fall back to fetch.
      if (navigator.sendBeacon) {
        navigator.sendBeacon(url, new Blob([body], { type: "application/json" }));
      } else {
        fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      /* analytics must never break the page */
    }
  }, []);

  return null;
}
