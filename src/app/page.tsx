'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { isStandalone } from '@/lib/pwa';

/* -------------------------------------------------- */
/*  Types & Install Steps Data                        */
/* -------------------------------------------------- */
type Platform = 'ios' | 'android' | 'desktop';

const INSTALL_STEPS: Record<Platform, { step: string; bold?: string }[]> = {
  ios: [
    { step: 'Open this page in ', bold: 'Safari' },
    { step: 'Tap the ', bold: 'Share button (□↑) at the bottom' },
    { step: 'Scroll down and tap ', bold: '"Add to Home Screen"' },
    { step: 'Tap ', bold: '"Add" in the top right' },
    { step: 'WorkoutSplit appears on your home screen!' },
  ],
  android: [
    { step: 'Open this page in ', bold: 'Chrome' },
    { step: 'Tap the ', bold: 'three dots (⋮) menu' },
    { step: 'Tap ', bold: '"Add to Home screen" or "Install app"' },
    { step: 'Tap ', bold: '"Install" in the popup' },
    { step: 'WorkoutSplit appears in your app drawer!' },
  ],
  desktop: [
    { step: 'Open this page in ', bold: 'Chrome or Edge' },
    { step: 'Click the ', bold: 'install icon (⊕) in the address bar' },
    { step: 'Click ', bold: '"Install" in the popup' },
    { step: 'WorkoutSplit opens as a standalone window!' },
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

    if (!('IntersectionObserver' in window)) {
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
      { threshold: 0.05, rootMargin: '50px 0px 50px 0px' }
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
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
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
  const [platform, setPlatform] = useState<Platform>('ios');
  const [mounted, setMounted] = useState(false);
  const [contactSent, setContactSent] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Auto detect platform
    if (typeof navigator !== 'undefined') {
      const ua = navigator.userAgent;
      if (/iPhone|iPad|iPod/.test(ua)) setPlatform('ios');
      else if (/Android/.test(ua)) setPlatform('android');
      else setPlatform('desktop');
    }

    // Skip landing if running inside standalone PWA
    if (isStandalone()) {
      const obComplete = localStorage.getItem('onboarding_complete') === 'true';
      router.replace(obComplete ? '/app' : '/onboarding');
    }
  }, [router]);

  const scrollToInstall = useCallback(() => {
    document.getElementById('steps')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
  };

  const marqueeItems = [
    'No streaks',
    'No guilt trips',
    'No subscriptions',
    'No ads',
    'No account',
    'Skip days freely',
    'It still works',
    'No streaks',
    'No guilt trips',
    'No subscriptions',
    'No ads',
    'No account',
    'Skip days freely',
    'It still works',
  ];

  return (
    <div style={{ overflowX: 'hidden', background: '#FFFFFF', color: '#111111', fontFamily: "'Archivo', sans-serif" }}>

      {/* ═══════════════════ NAV ═══════════════════ */}
      <nav className="landing-nav" style={{
        position: 'sticky', top: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: '#ffffff', borderBottom: '2px solid #111111'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/logo.png" alt="WorkoutSplit Logo" className="landing-nav-logo-img" style={{ width: 44, height: 44, objectFit: 'contain' }} />
          <span className="landing-nav-logo-title" style={{ font: "900 20px 'Archivo Black', sans-serif", letterSpacing: '-.03em', color: '#111111' }}>
            WorkoutSplit
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div className="landing-nav-links" style={{ font: "600 13.5px 'Archivo', sans-serif" }}>
            <a href="#features" style={{ color: '#111111', textDecoration: 'none' }}>Features</a>
            <a href="#steps" style={{ color: '#111111', textDecoration: 'none' }}>How it works</a>
            <a href="#contact" style={{ color: '#111111', textDecoration: 'none' }}>Collaborate</a>
          </div>
          <button
            onClick={scrollToInstall}
            style={{
              background: '#FFE100', color: '#111111', border: '2px solid #111111',
              borderRadius: 999, padding: '9px 18px', font: "800 13px 'Archivo', sans-serif",
              boxShadow: '3px 3px 0 #111111', cursor: 'pointer', transition: 'all 0.15s ease', flexShrink: 0
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translate(2px, 2px)';
              e.currentTarget.style.boxShadow = '1px 1px 0 #111111';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translate(0, 0)';
              e.currentTarget.style.boxShadow = '3px 3px 0 #111111';
            }}
          >
            Install free
          </button>
        </div>
      </nav>

      {/* ═══════════════════ HERO ═══════════════════ */}
      <header className="landing-hero" style={{
        position: 'relative', background: '#FFE100', borderBottom: '2px solid #111111',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 32, alignItems: 'end', maxWidth: '100%'
      }}>
        <div style={{
          paddingBottom: 40, maxWidth: 640,
          opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(24px)',
          transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>

          <div style={{ marginBottom: 16 }}>
            <img src="/logo.png" alt="WorkoutSplit Logo" style={{ width: 60, height: 60, objectFit: 'contain' }} />
          </div>

          <h1 style={{
            margin: '0 0 20px', font: "400 clamp(32px, 7vw, 76px)/1.0 'Archivo Black', sans-serif",
            letterSpacing: '-.03em', color: '#111111'
          }}>
            Built for beginners.<br />
            Perfect for the lazy.
          </h1>

          <p style={{
            margin: '0 0 28px', font: "500 17.5px/1.55 'Archivo', sans-serif",
            maxWidth: 480, color: '#222222'
          }}>
            The workout app that doesn't care if you skipped last week. Open it, lift what it tells you, close it. That's the whole app.
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button
              onClick={scrollToInstall}
              className="landing-hero-btn"
              style={{
                textDecoration: 'none', color: '#FFE100', background: '#111111',
                border: '2px solid #111111', borderRadius: 999, padding: '16px 28px',
                font: "800 15px 'Archivo', sans-serif", boxShadow: '4px 4px 0 #ffffff',
                cursor: 'pointer', transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translate(3px, 3px)';
                e.currentTarget.style.boxShadow = '1px 1px 0 #ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translate(0, 0)';
                e.currentTarget.style.boxShadow = '4px 4px 0 #ffffff';
              }}
            >
              ⬇ Install now — it's free
            </button>

            <a
              href="#features"
              className="landing-hero-btn"
              style={{
                textDecoration: 'none', background: '#ffffff', color: '#111111',
                border: '2px solid #111111', borderRadius: 999, padding: '16px 28px',
                font: "800 15px 'Archivo', sans-serif", boxShadow: '4px 4px 0 #111111',
                display: 'inline-flex', transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translate(3px, 3px)';
                e.currentTarget.style.boxShadow = '1px 1px 0 #111111';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translate(0, 0)';
                e.currentTarget.style.boxShadow = '4px 4px 0 #111111';
              }}
            >
              See what it does
            </a>
          </div>
        </div>

        {/* Hero phone */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
          <div style={{
            width: 300, background: '#111111', borderRadius: '38px 38px 0 0',
            padding: '12px 12px 0', animation: 'floaty 5s ease-in-out infinite'
          }}>
            <div style={{ background: '#ffffff', borderRadius: '28px 28px 0 0', overflow: 'hidden', height: 480 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 18px 4px', font: "700 11px 'Space Grotesk', monospace", color: '#111111' }}>
                <span>9:41</span>
                <span>●●●</span>
              </div>

              <div style={{ padding: '14px 16px' }}>
                <div style={{ font: "600 11px 'Archivo', sans-serif", color: '#888888' }}>Good morning, lazy legend</div>
                <div style={{ font: "800 20px 'Archivo', sans-serif", margin: '2px 0 14px', color: '#111111' }}>Today: Push Day</div>

                {/* Main Card */}
                <div style={{ background: '#FFE100', border: '2px solid #111111', borderRadius: 14, padding: 14, marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ font: "800 14px 'Archivo', sans-serif", color: '#111111' }}>Bench Press</div>
                      <div style={{ font: "500 11px 'Archivo', sans-serif", color: '#333333' }}>3 × 8 · 42.5 kg</div>
                    </div>
                    <div style={{ background: '#111111', color: '#FFE100', borderRadius: 999, padding: '6px 12px', font: "800 11px 'Archivo', sans-serif" }}>
                      Start
                    </div>
                  </div>
                </div>

                {/* List Rows */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { name: 'Overhead Press', sub: '3 × 10 · 25 kg', tag: 'NEXT' },
                    { name: 'Incline Dumbbell', sub: '3 × 12 · 14 kg', tag: '—' },
                    { name: 'Triceps Pushdown', sub: '3 × 15 · 20 kg', tag: '—' },
                  ].map((r, i) => (
                    <div key={i} style={{ border: '2px solid #eeeeee', borderRadius: 12, padding: '11px 13px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ font: "700 12.5px 'Archivo', sans-serif", color: '#111111' }}>{r.name}</div>
                        <div style={{ font: "500 10.5px 'Archivo', sans-serif", color: '#999999' }}>{r.sub}</div>
                      </div>
                      <div style={{ font: "700 11px 'Space Grotesk', monospace", color: r.tag === 'NEXT' ? '#111111' : '#bbbbbb' }}>{r.tag}</div>
                    </div>
                  ))}
                </div>

                {/* Mini Bars */}
                <div style={{ marginTop: 14, display: 'flex', gap: 6, alignItems: 'flex-end', height: 52 }}>
                  {[
                    { h: '40%', c: '#111111' }, { h: '55%', c: '#111111' }, { h: '48%', c: '#FFE100' },
                    { h: '65%', c: '#111111' }, { h: '72%', c: '#FFE100' }, { h: '60%', c: '#111111' }, { h: '88%', c: '#FFE100' },
                  ].map((b, i) => (
                    <div
                      key={i}
                      style={{
                        flex: 1, background: b.c, border: '2px solid #111111',
                        borderRadius: '5px 5px 0 0', height: b.h, transformOrigin: 'bottom',
                        animation: 'barGrow .8s ease both'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ═══════════════════ MARQUEE ═══════════════════ */}
      <div style={{
        background: '#111111', color: '#FFE100', overflow: 'hidden',
        padding: '13px 0', borderBottom: '2px solid #111111', whiteSpace: 'nowrap'
      }}>
        <div style={{ display: 'inline-flex', gap: 0, animation: 'marquee 22s linear infinite' }}>
          {marqueeItems.map((m, i) => (
            <span key={i} style={{
              font: "800 14px 'Space Grotesk', monospace", letterSpacing: '.1em',
              textTransform: 'uppercase', padding: '0 28px', borderRight: '2px solid #FFE100'
            }}>
              {m}
            </span>
          ))}
        </div>
      </div>

      {/* ═══════════════════ STATS ═══════════════════ */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', borderBottom: '2px solid #111111' }}>
        {[
          { n: '100%', l: 'Free. Forever.' },
          { n: '0', l: 'Guilt notifications' },
          { n: '<1 MB', l: 'Smaller than one selfie' },
        ].map((s, i) => (
          <RevealSection
            key={i}
            delay={i * 0.1}
            style={{
              padding: '44px 20px', textAlign: 'center',
              borderRight: i < 2 ? '2px solid #111111' : 'none',
              background: '#ffffff', transition: 'background 0.2s ease'
            }}
          >
            <div style={{ font: "400 52px 'Archivo Black', sans-serif", letterSpacing: '-.03em', color: '#111111' }}>{s.n}</div>
            <div style={{ font: "700 12px 'Space Grotesk', monospace", letterSpacing: '.12em', textTransform: 'uppercase', color: '#666666', marginTop: 4 }}>{s.l}</div>
          </RevealSection>
        ))}
      </section>

      {/* ═══════════════════ FEATURES ═══════════════════ */}
      <section id="features" className="landing-section-pad" style={{ padding: '60px 40px 40px', maxWidth: 1160, margin: '0 auto' }}>
        <RevealSection style={{ textAlign: 'center', marginBottom: 70 }}>
          <div style={{
            display: 'inline-block', background: '#FFE100', border: '2px solid #111111',
            borderRadius: 999, padding: '6px 18px', font: "700 12px 'Space Grotesk', monospace",
            letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 20, color: '#111111'
          }}>
            Only what matters
          </div>
          <h2 style={{ margin: 0, font: "400 clamp(34px, 4.5vw, 56px)/1.05 'Archivo Black', sans-serif", letterSpacing: '-.02em', color: '#111111' }}>
            Four features.<br />Because you won't use ten.
          </h2>
        </RevealSection>

        {/* Feature 1 */}
        <RevealSection style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 40, alignItems: 'center', padding: '40px 0', borderTop: '2px solid #111111'
        }}>
          <div>
            <div style={{ font: "700 13px 'Space Grotesk', monospace", letterSpacing: '.14em', color: '#8a7500', marginBottom: 12 }}>01 / SPLITS</div>
            <h3 style={{ margin: '0 0 16px', font: "400 32px/1.1 'Archivo Black', sans-serif", letterSpacing: '-.02em', color: '#111111' }}>
              Splits that forgive you
            </h3>
            <p style={{ margin: '0 0 20px', font: "500 16.5px/1.6 'Archivo', sans-serif", color: '#333333', maxWidth: 440 }}>
              Push/Pull/Legs or Upper/Lower — pick one and the app plans your week. Miss a day? It quietly reshuffles. No red X, no broken streak, no shame.
            </p>
            <div style={{ display: 'inline-block', background: '#FFFBD6', border: '2px solid #111111', borderRadius: 10, padding: '10px 16px', font: "700 13.5px 'Archivo', sans-serif", color: '#111111' }}>
              "Consistency" is optional here.
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: 260, background: '#111111', borderRadius: 34, padding: 10, boxShadow: '8px 8px 0 #FFE100' }}>
              <div style={{ background: '#ffffff', borderRadius: 26, overflow: 'hidden', height: 380, padding: '16px 14px' }}>
                <div style={{ font: "800 13px 'Archivo', sans-serif", marginBottom: 14, color: '#111111' }}>This week</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                  {[
                    { day: 'Mon · Push', what: 'Chest, shoulders, triceps', tag: 'DONE ✓', bg: '#FFE100', bd: '#111111' },
                    { day: 'Wed · Pull', what: 'Back & biceps', tag: 'TODAY', bg: '#ffffff', bd: '#111111' },
                    { day: 'Fri · Legs', what: 'Quads, hams, calves', tag: '—', bg: '#ffffff', bd: '#eeeeee' },
                    { day: 'Sun · Skipped', what: "It's fine. Really.", tag: '😌', bg: '#fafafa', bd: '#eeeeee' },
                  ].map((sr, idx) => (
                    <div key={idx} style={{ border: `2px solid ${sr.bd}`, background: sr.bg, borderRadius: 12, padding: '12px 13px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ font: "800 12.5px 'Archivo', sans-serif", color: '#111111' }}>{sr.day}</div>
                        <div style={{ font: "500 10.5px 'Archivo', sans-serif", color: '#777777' }}>{sr.what}</div>
                      </div>
                      <div style={{ font: "800 10px 'Space Grotesk', monospace", color: '#111111' }}>{sr.tag}</div>
                    </div>
                  ))}
                  <div style={{ textAlign: 'center', font: "500 10.5px 'Archivo', sans-serif", color: '#999999', marginTop: 6 }}>
                    Skipped Tuesday? It just shuffles. No lecture.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RevealSection>

        {/* Feature 2 */}
        <RevealSection style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 40, alignItems: 'center', padding: '40px 0', borderTop: '2px solid #111111'
        }}>
          <div style={{ order: 1 }}>
            <div style={{ font: "700 13px 'Space Grotesk', monospace", letterSpacing: '.14em', color: '#8a7500', marginBottom: 12 }}>02 / AUTOPILOT</div>
            <h3 style={{ margin: '0 0 16px', font: "400 32px/1.1 'Archivo Black', sans-serif", letterSpacing: '-.02em', color: '#111111' }}>
              It tells you exactly what to lift
            </h3>
            <p style={{ margin: '0 0 20px', font: "500 16.5px/1.6 'Archivo', sans-serif", color: '#333333', maxWidth: 440 }}>
              No programming knowledge needed. The app looks at your last session and gives you today's numbers. You just do the number. That's progressive overload without the homework.
            </p>
            <div style={{ display: 'inline-block', background: '#FFFBD6', border: '2px solid #111111', borderRadius: 10, padding: '10px 16px', font: "700 13.5px 'Archivo', sans-serif", color: '#111111' }}>
              Thinking is the app's job now.
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', order: 0 }}>
            <div style={{ width: 260, background: '#111111', borderRadius: 34, padding: 10, boxShadow: '8px 8px 0 #FFE100' }}>
              <div style={{ background: '#ffffff', borderRadius: 26, overflow: 'hidden', height: 380, padding: '16px 14px' }}>
                <div style={{ font: "800 13px 'Archivo', sans-serif", marginBottom: 14, color: '#111111' }}>Bench Press</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ background: '#FFE100', border: '2px solid #111111', borderRadius: 14, padding: 14 }}>
                    <div style={{ font: "700 10px 'Space Grotesk', monospace", letterSpacing: '.1em', marginBottom: 6, color: '#111111' }}>TODAY'S TARGET</div>
                    <div style={{ font: "400 22px 'Archivo Black', sans-serif", color: '#111111' }}>42.5 kg × 8</div>
                    <div style={{ font: "500 11px 'Archivo', sans-serif", marginTop: 4, color: '#333333' }}>Last time: 40 kg × 8 · +2.5 kg 💪</div>
                  </div>
                  <div style={{ border: '2px solid #eeeeee', borderRadius: 12, padding: '11px 13px', font: "600 11.5px 'Archivo', sans-serif", color: '#555555' }}>Set 1 — 8 reps ✓</div>
                  <div style={{ border: '2px solid #eeeeee', borderRadius: 12, padding: '11px 13px', font: "600 11.5px 'Archivo', sans-serif", color: '#555555' }}>Set 2 — 8 reps ✓</div>
                  <div style={{ border: '2px dashed #ccccbb', borderRadius: 12, padding: '11px 13px', font: "600 11.5px 'Archivo', sans-serif", color: '#888888', animation: 'pulse 2s ease-in-out infinite' }}>Set 3 — waiting on you…</div>
                  <div style={{ textAlign: 'center', font: "500 10.5px 'Archivo', sans-serif", color: '#999999', marginTop: 4 }}>
                    No thinking. No spreadsheets. Just do the number.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RevealSection>

        {/* Feature 3 */}
        <RevealSection style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 60, alignItems: 'center', padding: '50px 0', borderTop: '2px solid #111111'
        }}>
          <div>
            <div style={{ font: "700 13px 'Space Grotesk', monospace", letterSpacing: '.14em', color: '#8a7500', marginBottom: 12 }}>03 / REST TIMER</div>
            <h3 style={{ margin: '0 0 16px', font: "400 32px/1.1 'Archivo Black', sans-serif", letterSpacing: '-.02em', color: '#111111' }}>
              A timer for professional resters
            </h3>
            <p style={{ margin: '0 0 20px', font: "500 16.5px/1.6 'Archivo', sans-serif", color: '#333333', maxWidth: 440 }}>
              Finish a set and the countdown starts itself. It buzzes when it's time to move again — so you can zone out between sets without losing the plot.
            </p>
            <div style={{ display: 'inline-block', background: '#FFFBD6', border: '2px solid #111111', borderRadius: 10, padding: '10px 16px', font: "700 13.5px 'Archivo', sans-serif", color: '#111111' }}>
              Resting is 50% of lifting. We timed it.
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: 260, background: '#111111', borderRadius: 34, padding: 10, boxShadow: '8px 8px 0 #FFE100' }}>
              <div style={{ background: '#ffffff', borderRadius: 26, overflow: 'hidden', height: 380, padding: '16px 14px', textAlign: 'center' }}>
                <div style={{ font: "800 13px 'Archivo', sans-serif", marginBottom: 20, textAlign: 'left', color: '#111111' }}>Rest Timer</div>
                <div style={{
                  width: 140, height: 140, border: '8px solid #FFE100', borderRadius: '50%',
                  margin: '0 auto', display: 'grid', placeItems: 'center', borderTopColor: '#111111'
                }}>
                  <div>
                    <div style={{ font: "400 34px 'Archivo Black', sans-serif", color: '#111111' }}>1:30</div>
                    <div style={{ font: "700 10px 'Space Grotesk', monospace", letterSpacing: '.1em', color: '#999999' }}>REST</div>
                  </div>
                </div>
                <div style={{ margin: '22px auto 0', background: '#111111', color: '#FFE100', borderRadius: 999, padding: '10px 24px', font: "800 12px 'Archivo', sans-serif", display: 'inline-block' }}>
                  Skip rest →
                </div>
                <div style={{ marginTop: 16, font: "500 11px 'Archivo', sans-serif", color: '#888888' }}>
                  Vibrates when done. Go scroll your phone.
                </div>
              </div>
            </div>
          </div>
        </RevealSection>

        {/* Feature 4 */}
        <RevealSection style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 60, alignItems: 'center', padding: '50px 0', borderTop: '2px solid #111111'
        }}>
          <div style={{ order: 1 }}>
            <div style={{ font: "700 13px 'Space Grotesk', monospace", letterSpacing: '.14em', color: '#8a7500', marginBottom: 12 }}>04 / PROGRESS</div>
            <h3 style={{ margin: '0 0 16px', font: "400 32px/1.1 'Archivo Black', sans-serif", letterSpacing: '-.02em', color: '#111111' }}>
              Proof you're getting stronger
            </h3>
            <p style={{ margin: '0 0 20px', font: "500 16.5px/1.6 'Archivo', sans-serif", color: '#333333', maxWidth: 440 }}>
              One chart per exercise, PRs detected automatically. Even if you only show up twice a week, the line still goes up — and you'll see it.
            </p>
            <div style={{ display: 'inline-block', background: '#FFFBD6', border: '2px solid #111111', borderRadius: 10, padding: '10px 16px', font: "700 13.5px 'Archivo', sans-serif", color: '#111111' }}>
              Lazy ≠ not improving.
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', order: 0 }}>
            <div style={{ width: 260, background: '#111111', borderRadius: 34, padding: 10, boxShadow: '8px 8px 0 #FFE100' }}>
              <div style={{ background: '#ffffff', borderRadius: 26, overflow: 'hidden', height: 380, padding: '16px 14px' }}>
                <div style={{ font: "400 24px 'Archivo Black', sans-serif", marginBottom: 2, color: '#111111' }}>+12.5 kg</div>
                <div style={{ font: "500 11px 'Archivo', sans-serif", color: '#888888', marginBottom: 18 }}>Bench press · last 8 weeks</div>
                <div style={{ display: 'flex', gap: 7, alignItems: 'flex-end', height: 140, borderBottom: '2px solid #111111' }}>
                  {[
                    { h: '30%', c: '#eeeeee' }, { h: '38%', c: '#eeeeee' }, { h: '36%', c: '#eeeeee' }, { h: '50%', c: '#FFE100' },
                    { h: '58%', c: '#eeeeee' }, { h: '64%', c: '#FFE100' }, { h: '74%', c: '#eeeeee' }, { h: '92%', c: '#FFE100' },
                  ].map((cb, i) => (
                    <div key={i} style={{ flex: 1, background: cb.c, border: '2px solid #111111', borderBottom: 'none', borderRadius: '6px 6px 0 0', height: cb.h, animation: 'barGrow 1s ease both' }} />
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', font: "700 9px 'Space Grotesk', monospace", color: '#aaaaaa', marginTop: 6 }}>
                  <span>W1</span><span>W8</span>
                </div>
                <div style={{ marginTop: 16, border: '2px solid #eeeeee', borderRadius: 12, padding: '10px 12px', font: "600 11px 'Archivo', sans-serif", color: '#111111' }}>
                  🏆 New PR detected — 47.5 kg
                </div>
              </div>
            </div>
          </div>
        </RevealSection>
      </section>

      {/* ═══════════════════ STEPS & INSTALL ═══════════════════ */}
      <section id="steps" style={{
        background: '#FFE100', borderTop: '2px solid #111111', borderBottom: '2px solid #111111',
        padding: '90px 40px', marginTop: 60
      }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <RevealSection style={{ textAlign: 'center', marginBottom: 50 }}>
            <h2 style={{ margin: 0, font: "400 clamp(32px, 4.5vw, 52px)/1.05 'Archivo Black', sans-serif", letterSpacing: '-.02em', color: '#111111' }}>
              Lazy-proof in 3 steps
            </h2>
            <p style={{ margin: '14px 0 0', font: "500 17px 'Archivo', sans-serif", color: '#222222' }}>
              If this takes you more than 60 seconds, email us. Seriously.
            </p>
          </RevealSection>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 22 }}>
            {[
              { n: '1', t: 'Install it', b: 'Add to your home screen straight from the browser. No app store, no account, no email. Under 5 seconds.' },
              { n: '2', t: 'Pick a split', b: 'Choose Push/Pull/Legs or Upper/Lower. The app fills in the exercises. You change nothing unless you want to.' },
              { n: '3', t: 'Do the numbers', b: 'Show up whenever. Lift what the screen says. Tap done. The app handles everything else.' },
            ].map((st, i) => (
              <RevealSection
                key={i}
                delay={i * 0.1}
                style={{
                  background: '#ffffff', border: '2px solid #111111', borderRadius: 18,
                  padding: '30px 26px', boxShadow: '5px 5px 0 #111111', transition: 'all 0.15s ease'
                }}
              >
                <div style={{
                  width: 44, height: 44, background: '#FFE100', border: '2px solid #111111',
                  borderRadius: 12, display: 'grid', placeItems: 'center',
                  font: "400 20px 'Archivo Black', sans-serif", marginBottom: 18, color: '#111111'
                }}>{st.n}</div>
                <h3 style={{ margin: '0 0 10px', font: "800 19px 'Archivo', sans-serif", color: '#111111' }}>{st.t}</h3>
                <p style={{ margin: 0, font: "500 14.5px/1.55 'Archivo', sans-serif", color: '#444444' }}>{st.b}</p>
              </RevealSection>
            ))}
          </div>

          {/* Interactive Install Guide Tab Selector */}
          <div style={{ marginTop: 60, background: '#ffffff', border: '2px solid #111111', borderRadius: 20, padding: 28, boxShadow: '6px 6px 0 #111111' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
              <div style={{ font: "800 18px 'Archivo', sans-serif", color: '#111111' }}>
                How to Add to Home Screen:
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {(['ios', 'android', 'desktop'] as Platform[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPlatform(p)}
                    style={{
                      padding: '8px 16px', borderRadius: 999, border: '2px solid #111111',
                      background: platform === p ? '#111111' : '#ffffff',
                      color: platform === p ? '#FFE100' : '#111111',
                      font: "800 12px 'Space Grotesk', monospace", cursor: 'pointer',
                      textTransform: 'uppercase', letterSpacing: '.05em'
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <ol style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {INSTALL_STEPS[platform].map((s, idx) => (
                <li key={idx} style={{ font: "500 15px 'Archivo', sans-serif", color: '#333333' }}>
                  {s.step}
                  {s.bold && <strong style={{ color: '#111111', fontWeight: 800 }}>{s.bold}</strong>}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ═══════════════════ CONTACT / COLLABORATE ═══════════════════ */}
      <section id="contact" style={{ padding: '100px 40px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 70, alignItems: 'start' }}>
          <RevealSection>
            <div style={{
              display: 'inline-block', background: '#FFE100', border: '2px solid #111111',
              borderRadius: 999, padding: '6px 18px', font: "700 12px 'Space Grotesk', monospace",
              letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 20, color: '#111111'
            }}>
              Say hi
            </div>
            <h2 style={{ margin: '0 0 18px', font: "400 clamp(32px, 4vw, 48px)/1.08 'Archivo Black', sans-serif", letterSpacing: '-.02em', color: '#111111' }}>
              Contact & collaborate
            </h2>
            <p style={{ margin: '0 0 30px', font: "500 16.5px/1.6 'Archivo', sans-serif", color: '#333333', maxWidth: 420 }}>
              Gym owner, trainer, creator, or just someone with a good idea? We build WorkoutSplit in the open and we answer every message.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 400 }}>
              <a
                href="mailto:hello@workoutsplit.app"
                style={{
                  textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 14,
                  border: '2px solid #111111', borderRadius: 14, padding: '15px 18px',
                  background: '#ffffff', color: '#111111', transition: 'all 0.15s ease'
                }}
              >
                <span style={{ width: 36, height: 36, background: '#FFE100', border: '2px solid #111111', borderRadius: 10, display: 'grid', placeItems: 'center', fontStyle: 'normal' }}>✉</span>
                <span>
                  <span style={{ display: 'block', font: "800 14px 'Archivo', sans-serif" }}>hello@workoutsplit.app</span>
                  <span style={{ display: 'block', font: "500 12px 'Archivo', sans-serif", color: '#777777' }}>Replies within 24h — we're not lazy about that</span>
                </span>
              </a>

              <div
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  border: '2px solid #111111', borderRadius: 14, padding: '15px 18px',
                  background: '#ffffff', color: '#111111'
                }}
              >
                <span style={{ width: 36, height: 36, background: '#FFE100', border: '2px solid #111111', borderRadius: 10, display: 'grid', placeItems: 'center', fontStyle: 'normal' }}>🤝</span>
                <span>
                  <span style={{ display: 'block', font: "800 14px 'Archivo', sans-serif" }}>Partner with us</span>
                  <span style={{ display: 'block', font: "500 12px 'Archivo', sans-serif", color: '#777777' }}>Gyms, coaches & creators — free co-branded plans</span>
                </span>
              </div>
            </div>
          </RevealSection>

          {/* Form */}
          <RevealSection delay={0.1}>
            <form
              onSubmit={handleContactSubmit}
              style={{
                background: '#ffffff', border: '2px solid #111111', borderRadius: 20,
                padding: 34, boxShadow: '7px 7px 0 #FFE100', display: 'flex', flexDirection: 'column', gap: 16
              }}
            >
              <div style={{ font: "800 18px 'Archivo', sans-serif", color: '#111111' }}>Drop us a line</div>

              <label style={{ display: 'block' }}>
                <span style={{ display: 'block', font: "700 12px 'Space Grotesk', monospace", letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 6, color: '#111111' }}>
                  Name
                </span>
                <input
                  type="text"
                  required
                  placeholder="Your name"
                  style={{
                    width: '100%', boxSizing: 'border-box', border: '2px solid #111111',
                    borderRadius: 10, padding: '12px 14px', font: "500 14px 'Archivo', sans-serif",
                    outline: 'none', background: '#ffffff', color: '#111111'
                  }}
                />
              </label>

              <label style={{ display: 'block' }}>
                <span style={{ display: 'block', font: "700 12px 'Space Grotesk', monospace", letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 6, color: '#111111' }}>
                  Email
                </span>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  style={{
                    width: '100%', boxSizing: 'border-box', border: '2px solid #111111',
                    borderRadius: 10, padding: '12px 14px', font: "500 14px 'Archivo', sans-serif",
                    outline: 'none', background: '#ffffff', color: '#111111'
                  }}
                />
              </label>

              <label style={{ display: 'block' }}>
                <span style={{ display: 'block', font: "700 12px 'Space Grotesk', monospace", letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 6, color: '#111111' }}>
                  What's on your mind?
                </span>
                <textarea
                  rows={4}
                  required
                  placeholder="Idea, feedback, collab, or just say hi…"
                  style={{
                    width: '100%', boxSizing: 'border-box', border: '2px solid #111111',
                    borderRadius: 10, padding: '12px 14px', font: "500 14px 'Archivo', sans-serif",
                    outline: 'none', resize: 'vertical', background: '#ffffff', color: '#111111'
                  }}
                />
              </label>

              <button
                type="submit"
                style={{
                  background: contactSent ? '#FFE100' : '#111111',
                  color: contactSent ? '#111111' : '#FFE100',
                  border: '2px solid #111111', borderRadius: 999, padding: 15,
                  font: "800 15px 'Archivo', sans-serif", cursor: 'pointer',
                  boxShadow: '4px 4px 0 #FFE100', transition: 'all 0.15s ease'
                }}
              >
                {contactSent ? "Sent! We'll reply soon ✓" : 'Send message →'}
              </button>
            </form>
          </RevealSection>
        </div>
      </section>

      {/* ═══════════════════ FINAL CTA ═══════════════════ */}
      <section style={{ background: '#111111', color: '#ffffff', padding: '90px 40px', textAlign: 'center' }}>
        <RevealSection>
          <h2 style={{
            margin: '0 0 16px', font: "400 clamp(36px, 5vw, 64px)/1.02 'Archivo Black', sans-serif",
            letterSpacing: '-.02em', color: '#FFE100'
          }}>
            Still reading?<br />That's more effort than the app needs.
          </h2>
          <p style={{ margin: '0 0 34px', font: "500 17px 'Archivo', sans-serif", color: '#aaaaaa' }}>
            Free forever. No account. No ads. Your data stays on your phone.
          </p>
          <button
            onClick={scrollToInstall}
            style={{
              display: 'inline-block', background: '#FFE100', color: '#111111',
              border: '2px solid #FFE100', borderRadius: 999, padding: '18px 44px',
              font: "800 17px 'Archivo', sans-serif", boxShadow: '5px 5px 0 #ffffff',
              cursor: 'pointer', transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translate(3px, 3px)';
              e.currentTarget.style.boxShadow = '1px 1px 0 #ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translate(0, 0)';
              e.currentTarget.style.boxShadow = '5px 5px 0 #ffffff';
            }}
          >
            ⬇ Install WorkoutSplit
          </button>
        </RevealSection>
      </section>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer className="landing-footer" style={{
        background: '#111111', borderTop: '1px solid #333333', color: '#888888',
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', flexWrap: 'wrap', gap: 12
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <img src="/logo-dark.png" alt="WorkoutSplit Logo" style={{ width: 42, height: 42, objectFit: 'contain' }} />
          <span style={{ font: "800 16px 'Archivo', sans-serif", color: '#ffffff', letterSpacing: '-.01em' }}>WorkoutSplit</span>
        </div>
        <div style={{ font: "500 12.5px 'Archivo', sans-serif" }}>
          Free forever · No ads · Built for the gloriously inconsistent
        </div>
      </footer>

    </div>
  );
}
