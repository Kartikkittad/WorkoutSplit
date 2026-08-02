"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { isStandalone } from "@/lib/pwa";
import HeroPhone from "@/components/landing/HeroPhone";
import LogPhone from "@/components/landing/LogPhone";
import OverloadPhone from "@/components/landing/OverloadPhone";
import RestPhone from "@/components/landing/RestPhone";
import ProgressPhone from "@/components/landing/ProgressPhone";

/* -------------------------------------------------- */
/*  Types & Install Steps Data                        */
/* -------------------------------------------------- */
type Platform = "ios" | "android";

const INSTALL_STEPS: Record<Platform, { step: string; bold?: string }[]> = {
  ios: [
    { step: "Open this page in ", bold: "Safari" },
    { step: "Tap the ", bold: "Share button (□↑) at the bottom" },
    { step: "Scroll down and tap ", bold: '"Add to Home Screen"' },
    { step: "Tap ", bold: '"Add" in the top right' },
    { step: "WorkoutSplit appears on your home screen!" },
  ],
  android: [
    { step: "Open this page in ", bold: "Chrome" },
    { step: "Tap the ", bold: "three dots (⋮) menu" },
    { step: "Tap ", bold: '"Add to Home screen" or "Install app"' },
    { step: "Tap ", bold: '"Install" in the popup' },
    { step: "WorkoutSplit appears in your app drawer!" },
  ],
};

/* -------------------------------------------------- */
/*  Scroll Reveal Hook                                */
/* -------------------------------------------------- */
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting || entry.intersectionRatio > 0) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: "50px 0px 50px 0px" },
    );

    observer.observe(el);

    const timer = setTimeout(() => setVisible(true), 600);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  return { ref, visible };
}

/* -------------------------------------------------- */
/*  Reveal Section Component                          */
/* -------------------------------------------------- */
function RevealSection({
  children,
  delay = 0,
  style,
  className,
  id,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
  className?: string;
  id?: string;
}) {
  const { ref, visible } = useScrollReveal();
  return (
    <div
      id={id}
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* -------------------------------------------------- */
/*  Main Landing Page Component                       */
/* -------------------------------------------------- */
export default function LandingPage() {
  const router = useRouter();
  const [platform, setPlatform] = useState<Platform>("ios");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Auto detect platform
    if (typeof navigator !== "undefined") {
      const ua = navigator.userAgent;
      if (/Android/.test(ua)) setPlatform("android");
      else setPlatform("ios");
    }

    // Skip landing if running inside standalone PWA
    if (isStandalone()) {
      const obComplete = localStorage.getItem("onboarding_complete") === "true";
      router.replace(obComplete ? "/app" : "/onboarding");
    }
  }, [router]);

  const scrollToInstall = useCallback(() => {

    document.getElementById("steps")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const marqueeItems = [
    "No guilt trips",
    "No subscriptions",
    "No ads",
    "1-Click Cloud Sync",
    "Skip days freely",
    "It still works",
    "No guilt trips",
    "No subscriptions",
    "No ads",
    "Email Login",
    "Skip days freely",
    "It still works",
  ];

  return (

    <div
      style={{
        overflowX: "clip",
        background: "#FFFFFF",
        color: "#111111",
        fontFamily: "'Archivo', sans-serif",
      }}
    >
      {/* ═══════════════════ NAV ═══════════════════ */}
      <nav
        className="landing-nav"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "#ffffff",
          borderBottom: "2px solid #111111",
        }}
      >
        <div
          className="landing-measure"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img
            src="/logo.png"
            alt="WorkoutSplit Logo"
            className="landing-nav-logo-img"
            style={{ width: 44, height: 44, objectFit: "contain" }}
          />
          <span
            className="landing-nav-logo-title"
            style={{
              font: "900 20px 'Archivo Black', sans-serif",
              letterSpacing: "-.03em",
              color: "#111111",
            }}
          >
            WorkoutSplit
          </span>
          <span
            style={{
              background: "#FFE100",
              border: "2px solid #111111",
              borderRadius: 999,
              padding: "2px 9px",
              font: "800 10px 'Space Grotesk', monospace",
              letterSpacing: ".1em",
              color: "#111111",
              flexShrink: 0,
            }}
          >
            BETA
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            className="landing-nav-links"
            style={{ font: "600 13.5px 'Archivo', sans-serif" }}
          >
            <a
              href="#features"
              style={{ color: "#111111", textDecoration: "none" }}
            >
              Features
            </a>
            <a
              href="#steps"
              style={{ color: "#111111", textDecoration: "none" }}
            >
              How it works
            </a>
          </div>
          <button
            onClick={scrollToInstall}
            style={{
              background: "#FFE100",
              color: "#111111",
              border: "2px solid #111111",
              borderRadius: 999,
              padding: "9px 18px",
              font: "800 13px 'Archivo', sans-serif",
              boxShadow: "3px 3px 0 #111111",
              cursor: "pointer",
              transition: "all 0.15s ease",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translate(2px, 2px)";
              e.currentTarget.style.boxShadow = "1px 1px 0 #111111";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translate(0, 0)";
              e.currentTarget.style.boxShadow = "3px 3px 0 #111111";
            }}
          >
            Install free
          </button>
          </div>
        </div>
      </nav>

      {/* ═══════════════════ HERO ═══════════════════ */}
      <header
        className="landing-hero"
        style={{
          position: "relative",
          background: "#FFE100",
          borderBottom: "2px solid #111111",
        }}
      >
        <div
          className="landing-hero-inner landing-measure"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 32,
            alignItems: "end",
            width: "100%",
          }}
        >
        <div
          style={{
            paddingBottom: 40,
            maxWidth: 640,
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(24px)",
            transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div style={{ marginBottom: 16 }}>
            <img
              src="/logo.png"
              alt="WorkoutSplit Logo"
              style={{ width: 60, height: 60, objectFit: "contain" }}
            />
          </div>

          <h1
            style={{
              margin: "0 0 20px",
              font: "400 clamp(32px, 7vw, 76px)/1.0 'Archivo Black', sans-serif",
              letterSpacing: "-.03em",
              color: "#111111",
            }}
          >
            Built for beginners.
            <br />
            Perfect for the lazy.
          </h1>

          <p
            style={{
              margin: "0 0 28px",
              font: "500 17.5px/1.55 'Archivo', sans-serif",
              maxWidth: 500,
              color: "#222222",
            }}
          >
            Zero guilt if you skipped last week. No complex setup. Open the app, hit your target weights, and close it.
            Fitness on autopilot.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button
              onClick={scrollToInstall}
              className="landing-hero-btn"
              style={{
                textDecoration: "none",
                color: "#FFE100",
                background: "#111111",
                border: "2px solid #111111",
                borderRadius: 999,
                padding: "16px 28px",
                font: "800 15px 'Archivo', sans-serif",
                boxShadow: "4px 4px 0 #ffffff",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translate(3px, 3px)";
                e.currentTarget.style.boxShadow = "1px 1px 0 #ffffff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translate(0, 0)";
                e.currentTarget.style.boxShadow = "4px 4px 0 #ffffff";
              }}
            >
              Install now, it's free
            </button>

            <a
              href="#features"
              className="landing-hero-btn"
              style={{
                textDecoration: "none",
                background: "#ffffff",
                color: "#111111",
                border: "2px solid #111111",
                borderRadius: 999,
                padding: "16px 28px",
                font: "800 15px 'Archivo', sans-serif",
                boxShadow: "4px 4px 0 #111111",
                display: "inline-flex",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translate(3px, 3px)";
                e.currentTarget.style.boxShadow = "1px 1px 0 #111111";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translate(0, 0)";
                e.currentTarget.style.boxShadow = "4px 4px 0 #111111";
              }}
            >
              See what it does
            </a>
          </div>

          <p
            style={{
              margin: "18px 0 0",
              font: "700 13px 'Space Grotesk', monospace",
              letterSpacing: ".04em",
              color: "#5c5200",
            }}
          >
            Beta: early release, still under active development.
          </p>
        </div>

          {/* Hero phone */}
          <HeroPhone />
        </div>
      </header>

      {/* ═══════════════════ MARQUEE ═══════════════════ */}
      <div
        style={{
          background: "#111111",
          color: "#FFE100",
          overflow: "hidden",
          padding: "13px 0",
          borderBottom: "2px solid #111111",
          whiteSpace: "nowrap",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            gap: 0,
            animation: "marquee 22s linear infinite",
          }}
        >
          {marqueeItems.map((m, i) => (
            <span
              key={i}
              style={{
                font: "800 14px 'Space Grotesk', monospace",
                letterSpacing: ".1em",
                textTransform: "uppercase",
                padding: "0 28px",
                borderRight: "2px solid #FFE100",
              }}
            >
              {m}
            </span>
          ))}
        </div>
      </div>

      {/* ═══════════════════ STATS ═══════════════════ */}
      <section
        className="landing-measure landing-stats"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
        }}
      >
        {[
          { n: "100%", l: "Free." },
          { n: "0", l: "Guilt notifications" },
          { n: "No", l: "Ads" },
        ].map((s, i) => (
          <RevealSection
            key={i}
            delay={i * 0.1}
            style={{
              padding: "clamp(24px, 5vw, 44px) clamp(8px, 2vw, 20px)",
              textAlign: "center",
              borderRight: i < 2 ? "2px solid #111111" : "none",
              background: "#ffffff",
              transition: "background 0.2s ease",
            }}
          >
            <div
              style={{
                font: "400 clamp(32px, 8vw, 52px) 'Archivo Black', sans-serif",
                letterSpacing: "-.03em",
                color: "#111111",
              }}
            >
              {s.n}
            </div>
            <div
              style={{
                font: "700 clamp(9px, 2vw, 12px) 'Space Grotesk', monospace",
                letterSpacing: ".12em",
                textTransform: "uppercase",
                color: "#666666",
                marginTop: 4,
              }}
            >
              {s.l}
            </div>
          </RevealSection>
        ))}
      </section>

      {/* ═══════════════════ FEATURES ═══════════════════ */}
      <section
        id="features"
        className="landing-section-pad"
        style={{ padding: "60px 40px 0", maxWidth: 1240, margin: "0 auto" }}
      >
        {/* Feature 1 */}
        <RevealSection
          className="feature-log-row"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 40,
            alignItems: "stretch",
          }}
        >
          <div style={{ alignSelf: "center", padding: "40px 0" }}>
            <div
              style={{
                font: "700 13px 'Space Grotesk', monospace",
                letterSpacing: ".14em",
                color: "#8a7500",
                marginBottom: 12,
              }}
            >
              01 / SPLITS
            </div>
            <h3
              style={{
                margin: "0 0 16px",
                font: "400 32px/1.1 'Archivo Black', sans-serif",
                letterSpacing: "-.02em",
                color: "#111111",
              }}
            >
              Personalized to your comfort
            </h3>
            <p
              style={{
                margin: "0 0 20px",
                font: "500 16.5px/1.6 'Archivo', sans-serif",
                color: "#333333",
                maxWidth: 440,
              }}
            >
              Push/Pull/Legs or Upper/Lower. Pick one and the app plans your
              week. Miss a day? It quietly reshuffles. No red X, no shame.
            </p>
          </div>
          <LogPhone />
        </RevealSection>

        {/* Feature 2 */}
        <RevealSection
          className="feature-log-row feature-log-row--tall"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 40,
            alignItems: "stretch",
            borderTop: "2px solid #111111",
          }}
        >
          <div className="feature-copy" style={{ order: 1, alignSelf: "center", padding: "40px 0" }}>
            <div
              style={{
                font: "700 13px 'Space Grotesk', monospace",
                letterSpacing: ".14em",
                color: "#8a7500",
                marginBottom: 12,
              }}
            >
              02 / AUTOPILOT
            </div>
            <h3
              style={{
                margin: "0 0 16px",
                font: "400 32px/1.1 'Archivo Black', sans-serif",
                letterSpacing: "-.02em",
                color: "#111111",
              }}
            >
              It tells you exactly what to lift
            </h3>
            <p
              style={{
                margin: "0 0 20px",
                font: "500 16.5px/1.6 'Archivo', sans-serif",
                color: "#333333",
                maxWidth: 440,
              }}
            >
              No programming knowledge needed. The app looks at your last
              session and gives you today's numbers. You just do the number.
              That's progressive overload without the homework.
            </p>
          </div>
          <div className="feature-media" style={{ order: 0 }}>
            <OverloadPhone />
          </div>
        </RevealSection>

        {/* Feature 3 */}
        <RevealSection
          className="feature-log-row feature-log-row--rest"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 60,
            alignItems: "stretch",
            borderTop: "2px solid #111111",
          }}
        >
          <div style={{ alignSelf: "center", padding: "50px 0" }}>
            <div
              style={{
                font: "700 13px 'Space Grotesk', monospace",
                letterSpacing: ".14em",
                color: "#8a7500",
                marginBottom: 12,
              }}
            >
              03 / REST TIMER
            </div>
            <h3
              style={{
                margin: "0 0 16px",
                font: "400 32px/1.1 'Archivo Black', sans-serif",
                letterSpacing: "-.02em",
                color: "#111111",
              }}
            >
              A timer for resters
            </h3>
            <p
              style={{
                margin: "0 0 20px",
                font: "500 16.5px/1.6 'Archivo', sans-serif",
                color: "#333333",
                maxWidth: 440,
              }}
            >
              Finish a set and the countdown starts itself. It buzzes when it's
              time to move again, so you can zone out between sets without
              losing the plot.
            </p>
          </div>
          <RestPhone />
        </RevealSection>

        {/* Feature 4 */}
        <RevealSection
          className="feature-log-row feature-log-row--progress"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 60,
            alignItems: "stretch",
            borderTop: "2px solid #111111",
          }}
        >
          <div className="feature-copy" style={{ order: 1, alignSelf: "center", padding: "50px 0" }}>
            <div
              style={{
                font: "700 13px 'Space Grotesk', monospace",
                letterSpacing: ".14em",
                color: "#8a7500",
                marginBottom: 12,
              }}
            >
              04 / PROGRESS
            </div>
            <h3
              style={{
                margin: "0 0 16px",
                font: "400 32px/1.1 'Archivo Black', sans-serif",
                letterSpacing: "-.02em",
                color: "#111111",
              }}
            >
              Proof you're getting stronger
            </h3>
            <p
              style={{
                margin: "0 0 20px",
                font: "500 16.5px/1.6 'Archivo', sans-serif",
                color: "#333333",
                maxWidth: 440,
              }}
            >
              One chart per exercise, PRs detected automatically. Even if you
              only show up twice a week, the line still goes up, and you'll see
              it.
            </p>
          </div>
          <div className="feature-media" style={{ order: 0 }}>
            <ProgressPhone />
          </div>
        </RevealSection>
      </section>

      {/* ═══════════════════ STEPS & INSTALL ═══════════════════ */}
      <section
        id="steps"
        className="landing-steps"
        style={{
          background: "#FFE100",
          borderTop: "2px solid #111111",
          borderBottom: "2px solid #111111",
          padding: "90px 40px",
        }}
      >
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <RevealSection style={{ textAlign: "center", marginBottom: 50 }}>
            <h2
              style={{
                margin: 0,
                font: "400 clamp(32px, 4.5vw, 52px)/1.05 'Archivo Black', sans-serif",
                letterSpacing: "-.02em",
                color: "#111111",
              }}
            >
              Lazy-proof in 3 steps
            </h2>
            <p
              style={{
                margin: "14px 0 0",
                font: "500 17px 'Archivo', sans-serif",
                color: "#222222",
              }}
            >
              If this takes you more than 60 seconds, email us. Seriously.
            </p>
          </RevealSection>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 22,
            }}
          >
            {[
              {
                n: "1",
                t: "Install it",
                b: "Add to your home screen straight from the browser. No app store required. Fast email login.",
              },
              {
                n: "2",
                t: "Pick a split",
                b: "Choose Push/Pull/Legs or Upper/Lower. The app fills in the exercises. You change nothing unless you want to.",
              },
              {
                n: "3",
                t: "Do the numbers",
                b: "Show up whenever. Lift what the screen says. Tap done. The app handles everything else.",
              },
            ].map((st, i) => (
              <RevealSection
                key={i}
                delay={i * 0.1}
                style={{
                  background: "#ffffff",
                  border: "2px solid #111111",
                  borderRadius: 18,
                  padding: "30px 26px",
                  boxShadow: "5px 5px 0 #111111",
                  transition: "all 0.15s ease",
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    background: "#FFE100",
                    border: "2px solid #111111",
                    borderRadius: 12,
                    display: "grid",
                    placeItems: "center",
                    font: "400 20px 'Archivo Black', sans-serif",
                    marginBottom: 18,
                    color: "#111111",
                  }}
                >
                  {st.n}
                </div>
                <h3
                  style={{
                    margin: "0 0 10px",
                    font: "800 19px 'Archivo', sans-serif",
                    color: "#111111",
                  }}
                >
                  {st.t}
                </h3>
                <p
                  style={{
                    margin: 0,
                    font: "500 14.5px/1.55 'Archivo', sans-serif",
                    color: "#444444",
                  }}
                >
                  {st.b}
                </p>
              </RevealSection>
            ))}
          </div>

          {/* Interactive Install Guide Tab Selector */}
          <div
            style={{
              marginTop: 60,
              background: "#ffffff",
              border: "2px solid #111111",
              borderRadius: 20,
              padding: 28,
              boxShadow: "6px 6px 0 #111111",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 16,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  font: "800 18px 'Archivo', sans-serif",
                  color: "#111111",
                }}
              >
                How to Add to Home Screen:
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {(["ios", "android"] as Platform[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPlatform(p)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: 999,
                      border: "2px solid #111111",
                      background: platform === p ? "#111111" : "#ffffff",
                      color: platform === p ? "#FFE100" : "#111111",
                      font: "800 12px 'Space Grotesk', monospace",
                      cursor: "pointer",
                      textTransform: "uppercase",
                      letterSpacing: ".05em",
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <ol
              style={{
                paddingLeft: 20,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {INSTALL_STEPS[platform].map((s, idx) => (
                <li
                  key={idx}
                  style={{
                    font: "500 15px 'Archivo', sans-serif",
                    color: "#333333",
                  }}
                >
                  {s.step}
                  {s.bold && (
                    <strong style={{ color: "#111111", fontWeight: 800 }}>
                      {s.bold}
                    </strong>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ═══════════════════ FINAL CTA ═══════════════════ */}
      <section
        className="landing-cta"
        style={{
          background: "#111111",
          color: "#ffffff",
          padding: "90px 40px",
          textAlign: "center",
        }}
      >
        <RevealSection>
          <h2
            style={{
              margin: "0 0 16px",
              font: "400 clamp(36px, 5vw, 64px)/1.02 'Archivo Black', sans-serif",
              letterSpacing: "-.02em",
              color: "#FFE100",
            }}
          >
            Still reading?
            <br />
            That's more effort than the app needs.
          </h2>
          <p
            style={{
              margin: "0 0 34px",
              font: "500 17px 'Archivo', sans-serif",
              color: "#aaaaaa",
            }}
          >
            Free. 1-Click Cloud Sync. No ads. Your data is synced securely in the cloud.
          </p>
          <button
            onClick={scrollToInstall}
            style={{
              display: "inline-block",
              background: "#FFE100",
              color: "#111111",
              border: "2px solid #FFE100",
              borderRadius: 999,
              padding: "18px 44px",
              font: "800 17px 'Archivo', sans-serif",
              boxShadow: "5px 5px 0 #ffffff",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translate(3px, 3px)";
              e.currentTarget.style.boxShadow = "1px 1px 0 #ffffff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translate(0, 0)";
              e.currentTarget.style.boxShadow = "5px 5px 0 #ffffff";
            }}
          >
            Install WorkoutSplit
          </button>
        </RevealSection>
      </section>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer
        className="landing-footer"
        style={{
          background: "#111111",
          borderTop: "1px solid #333333",
          color: "#888888",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <img
            src="/logo-dark.png"
            alt="WorkoutSplit Logo"
            style={{ width: 42, height: 42, objectFit: "contain" }}
          />
          <span
            style={{
              font: "800 16px 'Archivo', sans-serif",
              color: "#ffffff",
              letterSpacing: "-.01em",
            }}
          >
            WorkoutSplit
          </span>
        </div>
        <div style={{ font: "500 12.5px 'Archivo', sans-serif" }}>
          Beta · Free · No ads · Built for the gloriously inconsistent
        </div>
      </footer>
    </div>
  );
}
