import type { Metadata } from "next";
import Script from "next/script";
import VisitTracker from "@/components/VisitTracker";
import "./globals.css";

export const metadata: Metadata = {
  title: "ASH AURA STUDIO — Luxury Interior Design",
  description:
    "Luxury interior design for homes, offices & commercial spaces. Personalised, functional interiors designed all over the globe. Principal Designer: Aishwarya Alatagi.",
  openGraph: {
    title: "ASH AURA STUDIO — Luxury Interior Design",
    description: "Designing timeless spaces across the globe.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <div className="grain" aria-hidden />
        <VisitTracker />
        {children}
        {plausibleDomain ? (
          <Script
            defer
            data-domain={plausibleDomain}
            src="https://plausible.io/js/script.js"
            strategy="afterInteractive"
          />
        ) : null}
      </body>
    </html>
  );
}
