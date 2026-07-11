"use client";

import { useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { theme } from "@/lib/theme";
import Reveal from "./Reveal";
import CountUp from "./CountUp";
import AIConceptStudio from "./AIConceptStudio";
import ContactForm from "./ContactForm";
import Newsletter from "./Newsletter";
import Concierge from "./Concierge";

const EASE = [0.22, 0.61, 0.36, 1] as const;

const SERVICES = [
  "Residential Interior Design",
  "Commercial Interior Design",
  "Office Interior Design",
  "Space Planning",
  "3D Visualisation & Rendering",
  "Furniture & Material Selection",
  "Turnkey Interior Solutions",
];

const PROCESS = [
  ["01", "Consultation", "A free first conversation to understand your space, lifestyle and vision."],
  ["02", "Concept & Moodboard", "Layouts, palettes and material directions tailored to how you live."],
  ["03", "3D Visualisation", "Photoreal renders, so you experience the room before it is built."],
  ["04", "Execution & Turnkey", "We manage trades, materials and timelines from start to finish."],
  ["05", "Styling & Handover", "Final furnishing and styling, then the keys to a finished space."],
];

const WHY = [
  "Personalised design concepts",
  "Global design services",
  "Functional & aesthetic spaces",
  "End-to-end design support",
  "Free initial consultation",
];

const REVIEWS = [
  ["Ash Aura turned our apartment into somewhere we never want to leave — every corner feels considered.", "Priya & Rohan M.", "Dubai"],
  ["Working across continents was effortless. The final room matched the 3D renders down to the last detail.", "L. Fernandes", "Lisbon"],
  ["Elegant, calm and entirely ours. They handled everything from concept to the very last cushion.", "Aarti S.", "Bengaluru"],
];

const NAV = [
  ["#about", "About"],
  ["#services", "Services"],
  ["#work", "Work"],
  ["#ai", "AI Studio"],
  ["#why", "Why Us"],
];

const MARQUEE = ["Residential", "Commercial", "Office", "Space Planning", "3D Visualisation", "Turnkey", "Timeless Interiors"];

export default function Site() {
  const { scrollYProgress, scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 800], [0, 112]);
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // sticky nav state
  useMotionValueEvent(scrollY, "change", (v) => {
    const s = v > 40;
    setScrolled((prev) => (prev !== s ? s : prev));
  });

  return (
    <div style={{ position: "relative", width: "100%", background: theme.bg, color: theme.text }}>
      {/* progress bar */}
      <motion.div style={{ position: "fixed", top: 0, left: 0, height: 2, width: "100%", transformOrigin: "0 50%", background: theme.accent, zIndex: 70, scaleX: scrollYProgress }} />

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: scrolled ? "15px clamp(24px,6vw,88px)" : "22px clamp(24px,6vw,88px)",
        background: scrolled ? "rgba(15,17,18,0.86)" : "transparent",
        borderBottom: `1px solid ${scrolled ? "rgba(176,141,87,0.18)" : "transparent"}`,
        backdropFilter: scrolled ? "blur(14px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(14px)" : "none",
        transition: "all .5s ease",
      }}>
        <a href="#top" style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
          <span style={{ fontFamily: theme.serif, fontSize: 21, letterSpacing: ".34em", fontWeight: 500 }}>ASH&nbsp;AURA</span>
          <span style={{ fontFamily: theme.sans, fontSize: 9, letterSpacing: ".52em", color: theme.accent, marginTop: 5, paddingLeft: 2 }}>STUDIO</span>
        </a>
        <div className="nav-desktop" style={{ display: "flex", alignItems: "center", gap: "clamp(22px,3vw,40px)" }}>
          {NAV.map(([href, label]) => (
            <a key={href} href={href} style={{ fontSize: 12, letterSpacing: ".2em", textTransform: "uppercase", color: label === "AI Studio" ? theme.accent : "#cbc7bd" }}>{label}</a>
          ))}
          <a href="#contact" style={{ fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", padding: "13px 24px", border: `1px solid ${theme.accent}`, color: theme.accent }}>Free Consultation</a>
        </div>
        <button className="nav-burger" onClick={() => setMenu(true)} aria-label="Open menu"
          style={{ display: "none", flexDirection: "column", alignItems: "flex-end", gap: 6, width: 30, height: 26, background: "transparent", border: "none", cursor: "pointer" }}>
          <span style={{ width: 28, height: 1.5, background: theme.text }} />
          <span style={{ width: 20, height: 1.5, background: theme.text }} />
        </button>
      </nav>

      {/* MOBILE MENU */}
      {menu && (
        <div style={{ position: "fixed", inset: 0, zIndex: 60, background: "rgba(11,13,14,0.985)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }}>
          <button onClick={() => setMenu(false)} aria-label="Close menu" style={{ position: "absolute", top: 24, right: 26, width: 42, height: 42, background: "transparent", border: "none", color: theme.text, fontSize: 30, cursor: "pointer" }}>×</button>
          {[...NAV, ["#contact", "Contact"]].map(([href, label]) => (
            <a key={href} href={href} onClick={() => setMenu(false)} style={{ fontFamily: theme.serif, fontWeight: 300, fontSize: 36, color: label === "AI Studio" ? theme.accent : theme.text, padding: 9 }}>{label}</a>
          ))}
        </div>
      )}

      {/* HERO */}
      <header id="top" style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "flex-end", padding: "clamp(28px,6vw,88px)", paddingBottom: "clamp(56px,9vh,110px)", overflow: "hidden" }}>
        <motion.img src="/images/render-living-room.jpeg" alt="Warm luxe living room 3D render" style={{ position: "absolute", top: "-14%", left: 0, width: "100%", height: "128%", objectFit: "cover", y: heroY }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(15,17,18,.62) 0%, rgba(15,17,18,.28) 38%, rgba(13,15,16,.86) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 220px 40px rgba(10,12,12,.7)" }} />
        <div style={{ position: "absolute", left: "-8%", bottom: "-6%", width: "min(760px,70%)", height: "min(760px,70%)", background: "radial-gradient(circle, rgba(176,141,87,.20) 0%, rgba(176,141,87,0) 68%)", pointerEvents: "none" }} />

        <motion.div
          style={{ position: "relative", zIndex: 2, maxWidth: 1180, width: "100%" }}
          initial="hide" animate="show"
          variants={{ show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } } }}
        >
          {(() => {
            const item = { hide: { opacity: 0, y: 34 }, show: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE } } };
            return (
              <>
                <motion.div variants={item} style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 30 }}>
                  <span style={{ width: 46, height: 1, background: theme.accent }} />
                  <span style={{ fontSize: 12, letterSpacing: ".42em", textTransform: "uppercase", color: theme.accent }}>Luxury Interior Design Studio</span>
                </motion.div>
                <motion.h1 variants={item} style={{ fontFamily: theme.serif, fontWeight: 300, fontSize: "clamp(58px,11vw,168px)", lineHeight: 0.92, letterSpacing: "-.01em", marginBottom: 26 }}>
                  ASH AURA<br /><em style={{ fontStyle: "italic", fontWeight: 400 }}>STUDIO</em>
                </motion.h1>
                <motion.p variants={item} style={{ fontFamily: theme.serif, fontSize: "clamp(20px,2.5vw,30px)", fontWeight: 300, color: "#d8d3c8", maxWidth: 640, lineHeight: 1.45, marginBottom: 44 }}>
                  Luxury interior design for homes, offices &amp; commercial spaces — crafting timeless interiors all over the globe.
                </motion.p>
                <motion.div variants={item} style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "30px 40px" }}>
                  <a href="#contact" style={{ display: "inline-flex", alignItems: "center", gap: 14, fontSize: 12, letterSpacing: ".2em", textTransform: "uppercase", padding: "18px 34px", background: theme.accent, color: "#121415" }}>
                    Free Design Consultation <span style={{ fontSize: 15 }}>→</span>
                  </a>
                  <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.3 }}>
                    <span style={{ fontSize: 10, letterSpacing: ".32em", textTransform: "uppercase", color: "#8d887e" }}>Principal Designer</span>
                    <span style={{ fontFamily: theme.serif, fontSize: 23, fontWeight: 400 }}>Aishwarya Alatagi</span>
                  </div>
                </motion.div>
              </>
            );
          })()}
        </motion.div>
      </header>

      {/* ABOUT */}
      <Section id="about">
        <Reveal style={{ marginBottom: "clamp(40px,6vw,72px)" }}>
          <span style={mono}>01 / ABOUT</span>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "clamp(40px,6vw,88px)", alignItems: "end" }}>
          <Reveal>
            <h2 style={{ fontFamily: theme.serif, fontWeight: 300, fontSize: "clamp(34px,4.6vw,62px)", lineHeight: 1.08, marginBottom: 30 }}>
              Personalised interiors where <em style={{ fontStyle: "italic", color: theme.accent }}>elegance</em> meets the way you live.
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.85, color: theme.textDim, maxWidth: 520, fontWeight: 300 }}>
              At ASH AURA STUDIO we create personalised, functional interiors that blend elegance, comfort and individuality. From private residences to commercial spaces and offices, every project is shaped around the people who use it — and delivered with precision, anywhere in the world.
            </p>
          </Reveal>
          <Reveal delay={0.12}>
            <div style={{ position: "relative", aspectRatio: "4/5", minHeight: 340 }}>
              <img src="/images/render-bedroom-dark.jpeg" alt="Skyline Nocturne bedroom 3D render" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", border: `1px solid ${theme.line}` }} />
              <span style={{ position: "absolute", bottom: -1, left: -1, width: 60, height: 60, borderBottom: `1px solid ${theme.accent}`, borderLeft: `1px solid ${theme.accent}` }} />
              <span style={{ position: "absolute", top: -1, right: -1, width: 60, height: 60, borderTop: `1px solid ${theme.accent}`, borderRight: `1px solid ${theme.accent}` }} />
            </div>
          </Reveal>
        </div>
      </Section>

      {/* GLOBE STATEMENT */}
      <Panel>
        <Reveal style={{ textAlign: "center" }}>
          <span style={{ fontSize: 11, letterSpacing: ".4em", textTransform: "uppercase", color: theme.accent }}>Without borders</span>
          <p style={{ fontFamily: theme.serif, fontWeight: 300, fontSize: "clamp(36px,7vw,98px)", lineHeight: 1.05, marginTop: 24 }}>
            We Design Interiors<br /><em style={{ fontStyle: "italic" }}>All Over the Globe.</em>
          </p>
        </Reveal>
      </Panel>

      {/* STATS */}
      <section style={{ padding: "clamp(54px,7vw,88px) clamp(24px,6vw,88px)", borderBottom: `1px solid ${theme.line}` }}>
        <Reveal>
          <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: "clamp(30px,4vw,56px)", textAlign: "center" }}>
            {([["Projects Delivered", 120, "+"], ["Countries Served", 15, "+"], ["Years of Craft", 8, ""], ["Bespoke Design", 100, "%"]] as const).map(([label, n, suf]) => (
              <div key={label}>
                <div style={{ fontFamily: theme.serif, fontWeight: 300, fontSize: "clamp(46px,5.5vw,74px)", color: theme.accent, lineHeight: 1 }}>
                  <CountUp to={n} suffix={suf} />
                </div>
                <div style={{ fontSize: 11, letterSpacing: ".26em", textTransform: "uppercase", color: "#9a958b", marginTop: 14 }}>{label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* SERVICES */}
      <Section id="services">
        <Reveal style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 20, marginBottom: "clamp(44px,6vw,76px)" }}>
          <div>
            <span style={mono}>02 / SERVICES</span>
            <h2 style={{ fontFamily: theme.serif, fontWeight: 300, fontSize: "clamp(34px,4.6vw,62px)", lineHeight: 1.05, marginTop: 18 }}>What we do</h2>
          </div>
          <p style={{ fontSize: 15, lineHeight: 1.75, color: "#9a958b", maxWidth: 360, fontWeight: 300 }}>Full-service design, from first concept sketch to the final styled room — handled end to end.</p>
        </Reveal>
        <Reveal>
          <div style={{ borderTop: `1px solid ${theme.line}` }}>
            {SERVICES.map((s, i) => (
              <div key={s} style={{ display: "flex", alignItems: "baseline", gap: 22, padding: "28px 8px", borderBottom: `1px solid ${theme.line}` }}>
                <span style={{ fontFamily: "monospace", fontSize: 12, color: theme.accent, minWidth: 26 }}>{String(i + 1).padStart(2, "0")}</span>
                <span style={{ fontFamily: theme.serif, fontSize: "clamp(22px,2.4vw,30px)", fontWeight: 400 }}>{s}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </Section>

      {/* PROCESS */}
      <Panel id="process">
        <Reveal style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 20, marginBottom: "clamp(44px,6vw,76px)" }}>
          <div>
            <span style={mono}>03 / OUR PROCESS</span>
            <h2 style={{ fontFamily: theme.serif, fontWeight: 300, fontSize: "clamp(34px,4.6vw,62px)", lineHeight: 1.05, marginTop: 18 }}>From first call to final cushion</h2>
          </div>
          <p style={{ fontSize: 15, lineHeight: 1.75, color: "#9a958b", maxWidth: 360, fontWeight: 300 }}>A calm, transparent journey — you always know exactly what happens next.</p>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(205px,1fr))", gap: "clamp(22px,2.5vw,40px)" }}>
          {PROCESS.map(([n, t, d], i) => (
            <Reveal key={n} delay={i * 0.09}>
              <div style={{ borderTop: `1px solid rgba(176,141,87,0.26)`, paddingTop: 22 }}>
                <span style={{ fontFamily: "monospace", fontSize: 12, color: theme.accent }}>{n}</span>
                <h3 style={{ fontFamily: theme.serif, fontWeight: 400, fontSize: 24, margin: "14px 0 12px" }}>{t}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: "#a9a499", fontWeight: 300 }}>{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Panel>

      {/* SELECTED WORK */}
      <Section id="work">
        <Reveal style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 20, marginBottom: "clamp(40px,5vw,64px)" }}>
          <div>
            <span style={mono}>04 / SELECTED WORK</span>
            <h2 style={{ fontFamily: theme.serif, fontWeight: 300, fontSize: "clamp(34px,4.6vw,62px)", lineHeight: 1.05, marginTop: 18 }}>A glimpse of our interiors</h2>
          </div>
          <p style={{ fontSize: 15, lineHeight: 1.75, color: "#9a958b", maxWidth: 360, fontWeight: 300 }}>From first concept render to the finished room — residences and spaces realised across the globe.</p>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,300px),1fr))", gap: "clamp(12px,1.4vw,20px)" }}>
          <GalleryImg src="/images/render-living-room.jpeg" tag="Residential · Living" title="The Warm Luxe Living Room" wide />
          <GalleryImg src="/images/render-bedroom-dark.jpeg" tag="Residential · Bedroom" title="Skyline Nocturne" />
          <GalleryImg src="/images/render-bedroom-study.jpeg" tag="Residential · Bedroom" title="Sage & Study Suite" />
          <GalleryImg src="/images/render-bedroom-gold.jpeg" tag="Residential · Bedroom" title="Golden Hour Suite" />
          <GalleryImg src="/images/render-tv-unit.jpeg" tag="Custom Furniture · Joinery" title="Bespoke Media Wall" />
          <GalleryImg src="/images/render-kids-playroom.jpeg" tag="Residential · Kids" title="Little Dreamer Playroom" />
          <GalleryImg src="/images/render-kids-pink.jpeg" tag="Residential · Kids" title="Dream Big Retreat" />
        </div>
      </Section>

      {/* AI CONCEPT STUDIO */}
      <Panel id="ai">
        <Reveal style={{ marginBottom: "clamp(40px,5vw,64px)", maxWidth: 720 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={mono}>05 / AI CONCEPT STUDIO</span>
            <span style={{ fontSize: 9, letterSpacing: ".22em", textTransform: "uppercase", color: "#121415", background: theme.accent, padding: "4px 9px" }}>Beta</span>
          </div>
          <h2 style={{ fontFamily: theme.serif, fontWeight: 300, fontSize: "clamp(34px,4.6vw,62px)", lineHeight: 1.05, marginTop: 18 }}>
            Design your space with <em style={{ fontStyle: "italic", color: theme.accent }}>AI</em>
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: theme.textDim, fontWeight: 300, marginTop: 20 }}>
            Tell us about your room and get an instant, studio-grade concept — palette, materials and signature pieces — in seconds. A first spark before we design it for real.
          </p>
        </Reveal>
        <Reveal delay={0.12}><AIConceptStudio /></Reveal>
      </Panel>

      {/* WHY */}
      <Panel id="why">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "clamp(44px,6vw,88px)", alignItems: "center" }}>
          <Reveal>
            <div style={{ position: "relative", aspectRatio: "1/1", minHeight: 320 }}>
              <img src="/images/render-bedroom-gold.jpeg" alt="Golden Hour Suite completed project" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", border: `1px solid ${theme.line}` }} />
              <span style={{ position: "absolute", top: -1, left: -1, width: 60, height: 60, borderTop: `1px solid ${theme.accent}`, borderLeft: `1px solid ${theme.accent}` }} />
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <span style={mono}>06 / WHY CHOOSE US</span>
            <h2 style={{ fontFamily: theme.serif, fontWeight: 300, fontSize: "clamp(34px,4.6vw,58px)", lineHeight: 1.08, margin: "18px 0 38px" }}>A studio that stays with you, start to finish.</h2>
            <ul style={{ listStyle: "none" }}>
              {WHY.map((w, i) => (
                <li key={w} style={{ display: "flex", alignItems: "center", gap: 18, padding: "18px 0", borderTop: `1px solid ${theme.line}`, borderBottom: i === WHY.length - 1 ? `1px solid ${theme.line}` : "none" }}>
                  <span style={{ width: 7, height: 7, background: theme.accent, transform: "rotate(45deg)", flexShrink: 0 }} />
                  <span style={{ fontSize: 17, fontWeight: 300, color: "#ddd8cd" }}>{w}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Panel>

      {/* TESTIMONIALS */}
      <Section id="reviews">
        <Reveal style={{ marginBottom: "clamp(44px,6vw,72px)" }}>
          <span style={mono}>07 / KIND WORDS</span>
          <h2 style={{ fontFamily: theme.serif, fontWeight: 300, fontSize: "clamp(34px,4.6vw,62px)", lineHeight: 1.05, marginTop: 18 }}>What our clients say</h2>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(290px,1fr))", gap: "clamp(24px,3vw,40px)" }}>
          {REVIEWS.map(([quote, who, city], i) => (
            <Reveal key={who} delay={i * 0.11}>
              <figure style={{ display: "flex", flexDirection: "column", gap: 20, padding: "34px 30px", border: `1px solid ${theme.line}`, height: "100%" }}>
                <span style={{ fontFamily: theme.serif, fontSize: 56, lineHeight: 0.5, height: 22, color: theme.accent }}>&ldquo;</span>
                <blockquote style={{ fontFamily: theme.serif, fontStyle: "italic", fontWeight: 300, fontSize: "clamp(19px,1.6vw,23px)", lineHeight: 1.5, color: "#ddd8cd", margin: 0 }}>{quote}</blockquote>
                <figcaption style={{ display: "flex", flexDirection: "column", gap: 3, marginTop: "auto" }}>
                  <span style={{ fontSize: 13, color: theme.text }}>{who}</span>
                  <span style={{ fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", color: "#8d887e" }}>{city}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* MARQUEE */}
      <section style={{ position: "relative", overflow: "hidden", padding: "clamp(38px,5.5vw,72px) 0", background: theme.panel, borderTop: `1px solid ${theme.line}`, borderBottom: `1px solid ${theme.line}` }}>
        <div style={{ display: "flex", width: "max-content", whiteSpace: "nowrap", animation: "auraMarquee 32s linear infinite" }}>
          {[0, 1].map((k) => (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: 40, paddingRight: 40, fontFamily: theme.serif, fontStyle: "italic", fontWeight: 300, fontSize: "clamp(28px,4vw,54px)", color: "rgba(233,229,221,.5)" }}>
              {MARQUEE.map((m) => (
                <span key={m} style={{ display: "flex", alignItems: "center", gap: 40 }}>
                  {m}<span style={{ color: theme.accent, fontStyle: "normal", fontSize: ".42em" }}>✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <Section id="contact">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: "clamp(48px,7vw,100px)" }}>
          <Reveal>
            <span style={mono}>08 / CONTACT</span>
            <h2 style={{ fontFamily: theme.serif, fontWeight: 300, fontSize: "clamp(38px,5.2vw,76px)", lineHeight: 1.02, margin: "18px 0 30px" }}>
              Let&apos;s create something <em style={{ fontStyle: "italic", color: theme.accent }}>timeless.</em>
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: theme.textDim, maxWidth: 440, fontWeight: 300, marginBottom: 40 }}>
              Tell us about your space. Your first consultation is on us — wherever in the world you are.
            </p>
            <div style={{ borderTop: `1px solid ${theme.line}`, maxWidth: 460 }}>
              {[["Address", "Add your studio address"], ["Phone", "+91 00000 00000"], ["Email", "hello@ashaurastudio.com"], ["Instagram", "@ashaurastudio"], ["WhatsApp", "+91 00000 00000"]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 24, padding: "20px 0", borderBottom: `1px solid ${theme.line}` }}>
                  <span style={{ fontSize: 11, letterSpacing: ".24em", textTransform: "uppercase", color: "#8d887e" }}>{k}</span>
                  <span style={{ fontFamily: theme.serif, fontSize: 20, color: "#ddd8cd", textAlign: "right" }}>{v}</span>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.12} style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <ContactForm />
          </Reveal>
        </div>
      </Section>

      {/* FOOTER */}
      <footer style={{ padding: "clamp(56px,8vw,96px) clamp(24px,6vw,88px) 40px", background: theme.bgDeep, borderTop: `1px solid rgba(176,141,87,0.14)` }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 40, alignItems: "flex-start", paddingBottom: "clamp(40px,6vw,70px)" }}>
            <div>
              <div style={{ fontFamily: theme.serif, fontSize: "clamp(30px,4vw,52px)", fontWeight: 300, letterSpacing: ".06em" }}>ASH AURA STUDIO</div>
              <p style={{ fontFamily: theme.serif, fontStyle: "italic", fontSize: 20, color: theme.accent, marginTop: 10 }}>We design interiors all over the globe.</p>
              <div style={{ marginTop: 26 }}>
                <span style={{ fontSize: 10, letterSpacing: ".3em", textTransform: "uppercase", color: "#6f6a60", display: "block", marginBottom: 12 }}>Join the studio letter</span>
                <Newsletter />
              </div>
            </div>
            <div style={{ display: "flex", gap: "clamp(34px,5vw,70px)" }}>
              <FooterCol title="Explore" links={[["#about", "About"], ["#services", "Services"], ["#work", "Work"], ["#ai", "AI Studio"], ["#contact", "Contact"]]} />
              <FooterCol title="Connect" links={[["#", "Instagram"], ["#", "WhatsApp"], ["#", "Email"]]} />
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 14, paddingTop: 28, borderTop: `1px solid rgba(176,141,87,0.12)` }}>
            <span style={{ fontSize: 12, color: "#79746a" }}>© 2026 ASH AURA STUDIO. All Rights Reserved.</span>
            <span style={{ fontSize: 12, letterSpacing: ".18em", textTransform: "uppercase", color: "#79746a" }}>Principal Designer — Aishwarya Alatagi</span>
          </div>
        </div>
      </footer>

      <Concierge />

      <style>{`
        @media (max-width: 860px) {
          .nav-desktop { display: none !important; }
          .nav-burger { display: flex !important; }
        }
      `}</style>
    </div>
  );
}

const mono: React.CSSProperties = { fontFamily: "monospace", fontSize: 12, letterSpacing: ".2em", color: theme.accent };

function Section({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <section id={id} style={{ position: "relative", padding: "clamp(90px,13vw,168px) clamp(24px,6vw,88px)", borderTop: `1px solid rgba(176,141,87,0.06)` }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>{children}</div>
    </section>
  );
}
function Panel({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <section id={id} style={{ position: "relative", padding: "clamp(90px,13vw,168px) clamp(24px,6vw,88px)", background: theme.panel, borderTop: `1px solid ${theme.line}`, borderBottom: `1px solid ${theme.line}` }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>{children}</div>
    </section>
  );
}
function GalleryImg({ src, tag, title, wide, contain }: { src: string; tag: string; title: string; wide?: boolean; contain?: boolean }) {
  return (
    <Reveal style={{ gridColumn: wide ? "1 / -1" : undefined }}>
      <figure style={{ position: "relative", margin: 0, aspectRatio: wide ? "24/9" : "4/3", overflow: "hidden", background: contain ? "#f1efe9" : "#16191a" }}>
        <img src={src} alt={title} style={{ width: "100%", height: "100%", objectFit: contain ? "contain" : "cover", display: "block" }} />
        <figcaption style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: wide ? "26px 28px" : "18px 20px", display: "flex", flexDirection: "column", gap: 4, background: "linear-gradient(transparent,rgba(12,14,15,.82))" }}>
          <span style={{ fontSize: wide ? 10 : 9, letterSpacing: ".28em", textTransform: "uppercase", color: theme.accent }}>{tag}</span>
          <span style={{ fontFamily: theme.serif, fontSize: wide ? "clamp(22px,2.4vw,30px)" : 21 }}>{title}</span>
        </figcaption>
      </figure>
    </Reveal>
  );
}
function FooterCol({ title, links }: { title: string; links: string[][] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <span style={{ fontSize: 10, letterSpacing: ".3em", textTransform: "uppercase", color: "#6f6a60", marginBottom: 4 }}>{title}</span>
      {links.map(([href, label], i) => (
        <a key={i} href={href} style={{ fontSize: 14, color: "#cbc7bd" }}>{label}</a>
      ))}
    </div>
  );
}
