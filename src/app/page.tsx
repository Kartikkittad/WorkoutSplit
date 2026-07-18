'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { isStandalone } from '@/lib/pwa';

/* -------------------------------------------------- */
/*  Install instructions                               */
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
/*  Scroll reveal hook                                 */
/* -------------------------------------------------- */
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

/* -------------------------------------------------- */
/*  Animated section wrapper                           */
/* -------------------------------------------------- */
function RevealSection({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const { ref, visible } = useScrollReveal();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* -------------------------------------------------- */
/*  Animated counter                                   */
/* -------------------------------------------------- */
function AnimatedNumber({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const elRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect(); } },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const duration = 1200;
    const steps = 30;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [started, target]);

  return <span ref={elRef}>{count}{suffix}</span>;
}

/* -------------------------------------------------- */
/*  Stagger children                                   */
/* -------------------------------------------------- */
function StaggerGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  const { ref, visible } = useScrollReveal();
  return (
    <div ref={ref} className={className}>
      {Array.isArray(children) ? children.map((child, i) => (
        <div
          key={i}
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(24px)',
            transition: `opacity 0.5s ease ${0.08 * i}s, transform 0.5s ease ${0.08 * i}s`,
          }}
        >
          {child}
        </div>
      )) : children}
    </div>
  );
}

/* -------------------------------------------------- */
/*  Constants                                          */
/* -------------------------------------------------- */
const SECTION_WIDTH = 960;
const SECTION_PX = 'clamp(20px, 5vw, 24px)';

/* -------------------------------------------------- */
/*  Page                                               */
/* -------------------------------------------------- */
export default function LandingPage() {
  const router = useRouter();
  const [platform, setPlatform] = useState<Platform>('ios');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // If running as installed PWA, skip the landing page and go into the app
    // (or onboarding on first run).
    if (isStandalone()) {
      const obComplete = localStorage.getItem('onboarding_complete') === 'true';
      router.replace(obComplete ? '/app' : '/onboarding');
    }
  }, [router]);

  const scrollToInstall = useCallback(() => {
    document.getElementById('install')?.scrollIntoView({ behavior: 'smooth' });
  }, []);



  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', overflow: 'hidden' }}>

      {/* ═══════════════════ NAV ═══════════════════ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        background: 'rgba(245,245,240,0.82)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,0,0,0.04)',
      }}>
        <div style={{ maxWidth: SECTION_WIDTH, margin: '0 auto', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800 }}>W</div>
            <span style={{ fontSize: 17, fontWeight: 700 }}>WorkoutSplit</span>
          </div>
          <button onClick={scrollToInstall} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '9px 16px', borderRadius: 9999,
            background: 'var(--primary)', color: 'var(--text-primary)',
            fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer',
            fontFamily: 'inherit',
          }} aria-label="Install App">
            <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
            Install
          </button>
        </div>
      </nav>

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section style={{ paddingTop: 110, paddingBottom: 40, textAlign: 'center', position: 'relative' }}>

        {/* ─── Animated Floating Blobs ─── */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '70%', pointerEvents: 'none', overflow: 'hidden' }}>
          <div className="hero-blob hero-blob-1" />
          <div className="hero-blob hero-blob-2" />
          <div className="hero-blob hero-blob-3" />
        </div>

        <div style={{ maxWidth: SECTION_WIDTH, margin: '0 auto', padding: `0 ${SECTION_PX}`, position: 'relative', zIndex: 1 }}>

          {/* Trust pills */}
          <div style={{
            display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 32,
            opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(10px)',
            transition: 'all 0.5s ease 0.1s',
          }}>
            {[
              { label: 'No Ads', icon: <svg width={12} height={12} viewBox="0 0 24 24" fill="#6d8a0a"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/></svg> },
              { label: '100% Free', icon: <svg width={12} height={12} viewBox="0 0 24 24" fill="#6d8a0a"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1.5 14.59l-3.5-3.5 1.41-1.41L10.5 12.77l5.09-5.09L17 9.09l-6.5 6.5z"/></svg> },
              { label: 'Works Offline', icon: <svg width={12} height={12} viewBox="0 0 24 24" fill="#6d8a0a"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg> },
            ].map((tag) => (
              <span key={tag.label} style={{
                padding: '6px 14px', borderRadius: 9999, fontSize: 12, fontWeight: 600,
                background: 'white', border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                display: 'inline-flex', alignItems: 'center', gap: 5,
              }}>
                {tag.icon} {tag.label}
              </span>
            ))}
          </div>

          {/* Headline — no description */}
          <h1 style={{
            fontSize: 'clamp(40px, 8vw, 72px)', fontWeight: 800,
            lineHeight: 1.05, letterSpacing: -2,
            maxWidth: 680, margin: '0 auto 40px',
            opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(14px)',
            transition: 'all 0.6s ease 0.15s',
          }}>
            Every Rep Counted.{' '}
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #a8d010, #C8F135, #d4f54a)',
              WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
            }}>
              Every PR Earned.
            </span>
          </h1>

          {/* CTA */}
          <div style={{
            display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 56,
            opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(14px)',
            transition: 'all 0.6s ease 0.25s',
          }}>
            <button onClick={scrollToInstall} className="btn-primary" style={{
              fontSize: 16, padding: '0 36px',
              boxShadow: '0 6px 28px rgba(200,241,53,0.35)',
              display: 'inline-flex', alignItems: 'center', gap: 8,
              border: 'none', cursor: 'pointer', fontFamily: 'inherit',
            }}>
              <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
              Install Now
            </button>
          </div>

          {/* ─── iPhone Mockup with Live Dashboard ─── */}
          <div style={{
            position: 'relative', maxWidth: 300, margin: '0 auto',
            marginBottom: -120,
            opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(60px)',
            transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s',
            zIndex: 20,
          }}>
            {/* ─── Yellow Glow behind phone ─── */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              pointerEvents: 'none', zIndex: 0, overflow: 'visible',
            }}>
              <div className="phone-glow" />
            </div>
            {/* iPhone shell */}
            <div style={{
              borderRadius: 48, overflow: 'hidden', position: 'relative', zIndex: 1,
              background: '#0a0a0a',
              padding: 4,
              boxShadow: '0 50px 120px rgba(0,0,0,0.2), 0 16px 48px rgba(0,0,0,0.12), inset 0 0 0 1px rgba(255,255,255,0.06)',
            }}>
              {/* Screen area */}
              <div style={{ borderRadius: 44, overflow: 'hidden', position: 'relative', background: '#F5F5F0', height: 580 }}>
                {/* Status bar */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, zIndex: 4,
                  padding: '6px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#0a0a0a', letterSpacing: 0.3 }}>9:41</span>
                  <div />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    {/* Signal bars */}
                    <svg width={12} height={10} viewBox="0 0 16 12" fill="#0a0a0a">
                      <rect x="0" y="9" width="3" height="3" rx="0.5" />
                      <rect x="4.5" y="6" width="3" height="6" rx="0.5" />
                      <rect x="9" y="3" width="3" height="9" rx="0.5" />
                      <rect x="13.5" y="0" width="2.5" height="12" rx="0.5" />
                    </svg>
                    {/* WiFi */}
                    <svg width={11} height={9} viewBox="0 0 24 18" fill="#0a0a0a">
                      <path d="M12 18l2.12-2.12a3 3 0 0 0-4.24 0L12 18zm-4.24-4.24l1.41 1.41a4.48 4.48 0 0 1 5.66 0l1.41-1.41a6.48 6.48 0 0 0-8.48 0zm-2.83-2.83l1.41 1.41a7.98 7.98 0 0 1 11.32 0l1.41-1.41a9.97 9.97 0 0 0-14.14 0zM1.1 8.1l1.41 1.41c4.69-4.69 12.29-4.69 16.97 0l1.41-1.41C15.26 2.47 6.64 2.47 1.1 8.1z" />
                    </svg>
                    {/* Battery */}
                    <svg width={18} height={9} viewBox="0 0 28 13" fill="#0a0a0a">
                      <rect x="0" y="0" width="24" height="12" rx="2.5" stroke="#0a0a0a" strokeWidth="1" fill="none" />
                      <rect x="2" y="2" width="18" height="8" rx="1" fill="#0a0a0a" />
                      <path d="M25 4v5a2 2 0 0 0 0-5z" fill="#0a0a0a" opacity="0.4" />
                    </svg>
                  </div>
                </div>

                {/* Dynamic Island */}
                <div style={{
                  position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
                  width: 90, height: 26, background: '#0a0a0a', borderRadius: 20, zIndex: 5,
                }} />

                {/* ─── Live Dashboard UI ─── */}
                <div style={{ padding: '48px 16px 16px', fontSize: 13, fontFamily: 'inherit', overflow: 'hidden', height: '100%' }}>

                  {/* Greeting */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <div>
                      <p style={{ fontSize: 11, color: '#6b7280', marginBottom: 1 }}>Good Morning</p>
                      <p style={{ fontSize: 16, fontWeight: 700 }}>Kartik 👋</p>
                    </div>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%', background: '#f3f4f6',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <svg width={14} height={14} viewBox="0 0 24 24" fill="#1a1a2e"><path d="M12 2a1 1 0 0 1 1 1v.7A7 7 0 0 1 19 10.5v3.09l1.45 2.9A1 1 0 0 1 19.55 18H4.45a1 1 0 0 1-.9-1.51L5 13.59V10.5A7 7 0 0 1 11 3.7V3a1 1 0 0 1 1-1zM9.17 20a3 3 0 0 0 5.66 0H9.17z"/></svg>
                    </div>
                  </div>

                  {/* Workout Progress Card */}
                  <div style={{
                    background: '#C8F135', borderRadius: 16, padding: '14px 16px',
                    marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    <div>
                      <p style={{ fontSize: 10, fontWeight: 600, opacity: 0.7, marginBottom: 2 }}>Workout Progress!</p>
                      <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>Today&apos;s Workout</p>
                      <p style={{ fontSize: 9, fontWeight: 500 }}>No exercises yet — tap to start!</p>
                    </div>
                    <div style={{
                      width: 48, height: 48, borderRadius: '50%',
                      border: '4px solid rgba(0,0,0,0.1)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 800, flexShrink: 0,
                    }}>0%</div>
                  </div>

                  {/* Today's Exercises Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <p style={{ fontSize: 13, fontWeight: 700 }}>Today&apos;s Exercises <span style={{ fontWeight: 500, color: '#9ca3af' }}>(0)</span></p>
                    <p style={{ fontSize: 10, color: '#9ca3af', fontWeight: 600 }}>See all</p>
                  </div>

                  {/* Empty State Card */}
                  <div style={{
                    background: 'white', borderRadius: 16, padding: '20px 14px',
                    textAlign: 'center', marginBottom: 14, border: '1px solid rgba(0,0,0,0.04)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  }}>
                    <div style={{ marginBottom: 6, display: 'flex', justifyContent: 'center' }}>
                      <svg width={28} height={28} viewBox="0 0 24 24" fill="#64748b"><path d="M6.5 2A2.5 2.5 0 0 0 4 4.5V9H3a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h1v4.5A2.5 2.5 0 0 0 6.5 22h1A2.5 2.5 0 0 0 10 19.5V15h4v4.5a2.5 2.5 0 0 0 2.5 2.5h1a2.5 2.5 0 0 0 2.5-2.5V15h1a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-1V4.5A2.5 2.5 0 0 0 17.5 2h-1A2.5 2.5 0 0 0 14 4.5V9h-4V4.5A2.5 2.5 0 0 0 7.5 2h-1z"/></svg>
                    </div>
                    <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 2 }}>No workouts today yet</p>
                    <p style={{ fontSize: 10, color: '#9ca3af', marginBottom: 10 }}>Start your first workout to track progress</p>
                    <div style={{
                      display: 'inline-block', background: '#0a0a0a', color: 'white',
                      padding: '8px 20px', borderRadius: 9999, fontSize: 11, fontWeight: 700,
                    }}>Start Workout</div>
                  </div>

                  {/* Upper Body Workout Card */}
                  <div style={{
                    background: '#0f1729', color: 'white', borderRadius: 16,
                    padding: '14px 16px',
                  }}>
                    <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
                      <span style={{ fontSize: 9, opacity: 0.7, display: 'flex', alignItems: 'center', gap: 3 }}><svg width={9} height={9} viewBox="0 0 24 24" fill="rgba(255,255,255,0.7)"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm.5 11H7v-1.5h4V7h1.5v6z"/></svg>90min</span>
                      <span style={{ fontSize: 9, opacity: 0.7, display: 'flex', alignItems: 'center', gap: 3 }}><svg width={9} height={9} viewBox="0 0 24 24" fill="rgba(255,255,255,0.7)"><path d="M12 23c-4.97 0-9-3.58-9-8 0-2.52 1.17-4.7 2.5-6.37A25.16 25.16 0 0 0 8.37 4.9a1 1 0 0 1 1.63.37c.43 1.11 1.13 2.34 2.16 3.3.08-.9.39-1.96 1.12-3.06A10.15 10.15 0 0 1 15.67.79a1 1 0 0 1 1.53.78c.05 1.42.52 3.13 1.55 4.68C20.13 8.3 21 10.53 21 13c0 5.5-4.03 10-9 10z"/></svg>1,200kcal</span>
                    </div>
                    <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 3 }}>Upper Body Workout</p>
                    <p style={{ fontSize: 9, opacity: 0.6 }}>Bench Press, Overhead Press, Rows &amp; more</p>
                  </div>
                </div>

                {/* ─── Floating Bottom Nav ─── */}
                <div style={{
                  position: 'absolute', bottom: 12, left: 12, right: 12,
                  background: '#0f1729', borderRadius: 22,
                  padding: '10px 8px 12px',
                  display: 'flex', justifyContent: 'space-around', alignItems: 'center',
                  boxShadow: '0 -4px 24px rgba(0,0,0,0.15)',
                }}>
                  {/* Home — active */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    <span style={{ fontSize: 8, fontWeight: 700, color: 'white' }}>Home</span>
                    <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#C8F135' }} />
                  </div>
                  {/* Log */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                    <span style={{ fontSize: 8, fontWeight: 600, color: 'rgba(255,255,255,0.45)' }}>Log</span>
                  </div>
                  {/* History */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span style={{ fontSize: 8, fontWeight: 600, color: 'rgba(255,255,255,0.45)' }}>History</span>
                  </div>
                  {/* Progress */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                    </svg>
                    <span style={{ fontSize: 8, fontWeight: 600, color: 'rgba(255,255,255,0.45)' }}>Progress</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Side button (power) */}
            <div style={{
              position: 'absolute', top: 120, right: -2,
              width: 3, height: 56, background: '#2a2a2a', borderRadius: '0 2px 2px 0',
            }} />
            {/* Volume buttons */}
            <div style={{
              position: 'absolute', top: 105, left: -2,
              width: 3, height: 32, background: '#2a2a2a', borderRadius: '2px 0 0 2px',
            }} />
            <div style={{
              position: 'absolute', top: 148, left: -2,
              width: 3, height: 32, background: '#2a2a2a', borderRadius: '2px 0 0 2px',
            }} />
          </div>

        </div>
      </section>

      {/* ═══════════════════ STATS BAR ═══════════════════ */}
      <RevealSection>
        <section style={{ padding: '140px 0 48px', background: 'white', borderTop: '1px solid rgba(0,0,0,0.04)', borderBottom: '1px solid rgba(0,0,0,0.04)', position: 'relative', zIndex: 30 }}>
          <div style={{ maxWidth: SECTION_WIDTH, margin: '0 auto', padding: `0 ${SECTION_PX}`, display: 'flex', justifyContent: 'center', gap: 'clamp(28px, 8vw, 72px)', flexWrap: 'wrap', textAlign: 'center' }}>
            {[
              { value: <AnimatedNumber target={20} suffix="+" />, label: 'Exercises' },
              { value: <AnimatedNumber target={100} suffix="%" />, label: 'Free Forever' },
              { value: <AnimatedNumber target={0} />, label: 'Ads. Ever.' },
              { value: '<5s', label: 'To Install' },
            ].map((stat) => (
              <div key={stat.label}>
                <div style={{ fontSize: 'clamp(28px, 5vw, 38px)', fontWeight: 800, lineHeight: 1 }}>{stat.value}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 6 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </section>
      </RevealSection>

      {/* ═══════════════════ FEATURES ═══════════════════ */}
      <section style={{ padding: '88px 0' }}>
        <div style={{ maxWidth: SECTION_WIDTH, margin: '0 auto', padding: `0 ${SECTION_PX}` }}>
          <RevealSection>
            <div style={{ textAlign: 'center', marginBottom: 52 }}>
              <span style={{
                display: 'inline-block', padding: '6px 16px', borderRadius: 9999,
                background: '#C8F13520', color: '#6d8a0a', fontSize: 12, fontWeight: 700,
                marginBottom: 14, letterSpacing: 1, textTransform: 'uppercase',
              }}>
                Features
              </span>
              <h2 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 800, lineHeight: 1.12, letterSpacing: -0.5 }}>
                Built for lifters who hate{' '}
                <span style={{ textDecoration: 'line-through', opacity: 0.25 }}>bloated apps</span>{' '}
                excuses.
              </h2>
            </div>
          </RevealSection>

          <StaggerGrid className="landing-features-grid">
            {[
              { icon: <svg width={24} height={24} viewBox="0 0 24 24" fill="currentColor"><path d="M4 5v14h3V5H4zm6.5 0v14h3V5h-3zM17 5v14h3V5h-3z"/></svg>, title: 'Workout Splits', desc: 'Create Push/Pull/Legs, Upper/Lower or fully custom splits. Your plan, your way.' },
              { icon: <svg width={24} height={24} viewBox="0 0 24 24" fill="currentColor"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>, title: 'Progressive Overload', desc: 'Tells you exactly what to lift today based on your last session. +2.5kg at a time.' },
              { icon: <svg width={24} height={24} viewBox="0 0 24 24" fill="currentColor"><path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0 0 11 15.9V19H7v2h10v-2h-4v-3.1a5.01 5.01 0 0 0 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/></svg>, title: 'PR Detection', desc: 'Auto detects every personal record in real time. Every new max gets celebrated.' },
              { icon: <svg width={24} height={24} viewBox="0 0 24 24" fill="currentColor"><path d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42A8.962 8.962 0 0 0 12 4c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/></svg>, title: 'Rest Timer', desc: 'Built in countdown with vibration alert. Never guess your rest time again.' },
              { icon: <svg width={24} height={24} viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 3h1.5v2H13V6h1.5v3.5H10V6zm-3 0h1.5v3.5H7V6zm5.5 12H7v-1.5h5.5V18zm0-3H7v-1.5h5.5V15zm4.5 3h-3v-1.5h3V18zm0-3h-3v-1.5h3V15zm0-3H7v-1.5h10V12z"/></svg>, title: 'Plate Calculator', desc: 'Tell it your target weight. It tells you exactly which plates to load each side.' },
              { icon: <svg width={24} height={24} viewBox="0 0 24 24" fill="currentColor"><path d="M5 20h2V10H5v10zm6 0h2V4h-2v16zm6 0h2v-6h-2v6z"/></svg>, title: 'Progress Charts', desc: 'See your strength curve over weeks and months. Line charts per exercise.' },
              { icon: <svg width={24} height={24} viewBox="0 0 24 24" fill="currentColor"><path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z"/></svg>, title: 'Muscle Heatmap', desc: 'Visual map of which muscle groups you trained this week. Spot weak points instantly.' },
              { icon: <svg width={24} height={24} viewBox="0 0 24 24" fill="currentColor"><path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"/></svg>, title: 'Streak Tracker', desc: 'Consecutive workout streaks with milestone celebrations at 3, 7 and 30 days.' },
              { icon: <svg width={24} height={24} viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.1 0 2 .9 2 2 0 .18-.03.35-.07.51L13.42 10h1.24c.52.63.84 1.44.84 2.32V13H8.5v-.68c0-.88.32-1.69.84-2.32h1.24l-.51-1.49A1.99 1.99 0 0 1 12 6zm5 11H7v-1.5h10V17z"/></svg>, title: 'Body Weight Log', desc: 'Track your weight daily with a 14 day trend chart. See the bigger picture.' },
              { icon: <svg width={24} height={24} viewBox="0 0 24 24" fill="currentColor"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>, title: 'Superset Support', desc: 'Group 2 exercises as a superset. Log both, then rest. Clean and simple.' },
              { icon: <svg width={24} height={24} viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm3 11c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg>, title: 'Private by Design', desc: 'No account. No cloud. No ads. Your data never leaves your device. Ever.' },
              { icon: <svg width={24} height={24} viewBox="0 0 24 24" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>, title: 'Export Your Data', desc: 'Download your full workout history as CSV anytime. Your data, your control.' },
            ].map((f, i) => {
              const accents = [
                { tint: '#C8F135', fill: '#6d8a0a' }, // lime
                { tint: '#22C3E6', fill: '#0a7a9a' }, // cyan
                { tint: '#A855F7', fill: '#7c3aed' }, // purple
                { tint: '#FB923C', fill: '#c2410c' }, // orange
                { tint: '#EC4899', fill: '#be185d' }, // pink
              ];
              const accent = accents[i % accents.length];
              return (
                <div key={f.title} className="landing-feature-card">
                  <div style={{
                    width: 48, height: 48, borderRadius: 14,
                    background: accent.tint + '22', color: accent.fill,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 16,
                  }}>
                    {f.icon}
                  </div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>{f.title}</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--text-secondary)', margin: 0 }}>{f.desc}</p>
                </div>
              );
            })}
          </StaggerGrid>
        </div>
      </section>

      {/* ═══════════════════ HOW IT WORKS ═══════════════════ */}
      <section style={{ padding: '88px 0', background: 'white' }}>
        <div style={{ maxWidth: SECTION_WIDTH, margin: '0 auto', padding: `0 ${SECTION_PX}` }}>
          <RevealSection>
            <div style={{ textAlign: 'center', marginBottom: 52 }}>
              <span style={{
                display: 'inline-block', padding: '6px 16px', borderRadius: 9999,
                background: '#C8F13520', color: '#6d8a0a', fontSize: 12, fontWeight: 700,
                marginBottom: 14, letterSpacing: 1, textTransform: 'uppercase',
              }}>
                Get Started
              </span>
              <h2 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 800, lineHeight: 1.12 }}>
                Ready in three steps
              </h2>
            </div>
          </RevealSection>

          <div style={{ maxWidth: 560, margin: '0 auto' }}>
            {[
              { num: '1', title: 'Install the App', desc: 'Add to your home screen in under 5 seconds. No app store needed.', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg> },
              { num: '2', title: 'Pick Your Exercises', desc: '20+ exercises across Push, Pull, Legs, and Core — or start with a suggested workout.', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0-6a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/></svg> },
              { num: '3', title: 'Start Lifting', desc: 'Log sets in real-time, use the rest timer, and finish strong.', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor"><path d="M6.5 2A2.5 2.5 0 0 0 4 4.5V9H3a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h1v4.5A2.5 2.5 0 0 0 6.5 22h1A2.5 2.5 0 0 0 10 19.5V15h4v4.5a2.5 2.5 0 0 0 2.5 2.5h1a2.5 2.5 0 0 0 2.5-2.5V15h1a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-1V4.5A2.5 2.5 0 0 0 17.5 2h-1A2.5 2.5 0 0 0 14 4.5V9h-4V4.5A2.5 2.5 0 0 0 7.5 2h-1z"/></svg> },
            ].map((step, i) => (
              <RevealSection key={step.num} delay={i * 0.1}>
                <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: '50%',
                      background: 'var(--primary)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      fontSize: 20, fontWeight: 800,
                    }}>
                      {step.num}
                    </div>
                    {i < 2 && <div style={{ width: 2, height: 40, background: '#C8F13560', margin: '8px 0' }} />}
                  </div>
                  <div style={{ paddingTop: 2, paddingBottom: i < 2 ? 16 : 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ display: 'flex' }}>{step.icon}</span>
                      <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{step.title}</h3>
                    </div>
                    <p style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--text-secondary)', margin: 0 }}>{step.desc}</p>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ COMPARISON ═══════════════════ */}
      <section style={{ padding: '88px 0' }}>
        <div style={{ maxWidth: SECTION_WIDTH, margin: '0 auto', padding: `0 ${SECTION_PX}` }}>
          <RevealSection>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <h2 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 800, lineHeight: 1.12 }}>
                Why not another app?
              </h2>
              <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginTop: 10 }}>
                Most fitness apps are designed to take your money. We&apos;re built different.
              </p>
            </div>
          </RevealSection>

          <RevealSection delay={0.1}>
            <div style={{ background: 'white', borderRadius: 24, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.05)', maxWidth: 640, margin: '0 auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '14px 20px', background: '#f8f8f5', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                <div />
                <div style={{ textAlign: 'center', fontSize: 13, fontWeight: 800 }}>
                  <span style={{ background: 'var(--primary)', padding: '4px 12px', borderRadius: 8 }}>WorkoutSplit</span>
                </div>
                <div style={{ textAlign: 'center', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Others</div>
              </div>
              {[
                { f: 'Price', o: 'Free forever', t: '$9.99/mo' },
                { f: 'Ads', o: 'None', t: 'Everywhere' },
                { f: 'Account', o: 'Not needed', t: 'Required' },
                { f: 'Privacy', o: 'On-device', t: 'Cloud / 3rd party' },
                { f: 'Size', o: '< 1 MB', t: '50–200 MB' },
                { f: 'Offline', o: 'Always', t: 'Sometimes' },
              ].map((r, i) => (
                <div key={r.f} style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '12px 20px',
                  borderBottom: i < 5 ? '1px solid rgba(0,0,0,0.04)' : 'none',
                }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{r.f}</div>
                  <div style={{ textAlign: 'center', fontSize: 13, fontWeight: 600, color: '#4a7a0a' }}>✓ {r.o}</div>
                  <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-secondary)' }}>✗ {r.t}</div>
                </div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ═══════════════════ INSTALL ═══════════════════ */}
      <section id="install" style={{ padding: '88px 0', background: 'white' }}>
        <div style={{ maxWidth: SECTION_WIDTH, margin: '0 auto', padding: `0 ${SECTION_PX}` }}>
          <RevealSection>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <span style={{
                display: 'inline-block', padding: '6px 16px', borderRadius: 9999,
                background: '#C8F13520', color: '#6d8a0a', fontSize: 12, fontWeight: 700,
                marginBottom: 14, letterSpacing: 1, textTransform: 'uppercase',
              }}>
                Install Guide
              </span>
              <h2 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 800, lineHeight: 1.12 }}>
                Add to your home screen
              </h2>
              <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginTop: 10 }}>
                No app store. No downloads. Just your browser.
              </p>
            </div>
          </RevealSection>

          <RevealSection delay={0.1}>
            <div style={{ maxWidth: 560, margin: '0 auto' }}>
              {/* Platform tabs */}
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 28 }}>
                {([['ios', 'iPhone', <svg key="i" width={14} height={14} viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83z"/><path d="M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>], ['android', 'Android', <svg key="a" width={14} height={14} viewBox="0 0 24 24" fill="currentColor"><path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V7H6v11zM3.5 7C2.67 7 2 7.67 2 8.5v7c0 .83.67 1.5 1.5 1.5S5 16.33 5 15.5v-7C5 7.67 4.33 7 3.5 7zm17 0c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zm-4.97-5.84l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48A5.84 5.84 0 0 0 12 0c-.96 0-1.86.23-2.66.63L7.85.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31A5.97 5.97 0 0 0 6 6h12c0-1.79-.79-3.4-2.03-4.49-.15-.13-.31-.26-.47-.38.01.01.02.02.03.03zM10 4H9V3h1v1zm5 0h-1V3h1v1z"/></svg>], ['desktop', 'Desktop', <svg key="d" width={14} height={14} viewBox="0 0 24 24" fill="currentColor"><path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7l-2 3v1h8v-1l-2-3h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 12H3V4h18v10z"/></svg>]] as [Platform, string, React.ReactNode][]).map(([key, label, icon]) => (
                  <button key={key} onClick={() => setPlatform(key)} style={{
                    padding: '10px 22px', borderRadius: 9999,
                    border: platform === key ? 'none' : '1px solid rgba(0,0,0,0.07)',
                    background: platform === key ? 'var(--primary)' : 'white',
                    fontWeight: 700, fontSize: 13, cursor: 'pointer',
                    fontFamily: 'inherit', color: 'var(--text-primary)',
                    transition: 'all 0.15s',
                    boxShadow: platform === key ? '0 4px 16px rgba(200,241,53,0.3)' : 'none',
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                  }}>
                    {icon} {label}
                  </button>
                ))}
              </div>

              {/* Steps */}
              <div style={{ background: 'var(--bg)', borderRadius: 24, padding: 'clamp(24px, 5vw, 32px)', border: '1px solid rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  {INSTALL_STEPS[platform].map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                        background: 'var(--primary)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        fontWeight: 800, fontSize: 13,
                      }}>
                        {i + 1}
                      </div>
                      <p style={{ fontSize: 14, lineHeight: 1.55, margin: 0, paddingTop: 5 }}>
                        {item.step}{item.bold && <strong>{item.bold}</strong>}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>



      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer style={{ padding: '28px 24px 36px', textAlign: 'center', borderTop: '1px solid rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 10 }}>
          <div style={{ width: 24, height: 24, borderRadius: 7, background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800 }}>W</div>
          <span style={{ fontSize: 14, fontWeight: 700 }}>WorkoutSplit</span>
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
          Free forever · No ads · Your data stays on your device
        </p>
      </footer>

      {/* ═══════════════════ STYLES ═══════════════════ */}
      <style>{`
        @keyframes floatUp {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes phoneGlow {
          0%, 100% { transform: scale(0.95); opacity: 0.7; }
          50% { transform: scale(1.1); opacity: 1; }
        }
        .phone-glow {
          width: 550px;
          height: 750px;
          border-radius: 50%;
          background: radial-gradient(ellipse at center, rgba(200,241,53,0.5) 0%, rgba(200,241,53,0.25) 30%, rgba(200,241,53,0.08) 55%, transparent 70%);
          filter: blur(40px);
          animation: phoneGlow 5s ease-in-out infinite;
          flex-shrink: 0;
        }
        .landing-features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .landing-feature-card {
          background: white;
          border-radius: 22px;
          padding: 26px;
          height: 100%;
          border: 1px solid rgba(0,0,0,0.05);
          box-shadow: 0 1px 3px rgba(0,0,0,0.03);
          transition: all 0.2s ease;
        }
        .landing-feature-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1);
        }
        @media (max-width: 768px) {
          .landing-features-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 480px) {
          .landing-features-grid {
            grid-template-columns: 1fr;
          }
        }
        /* ─── Hero Floating Blobs ─── */
        .hero-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          will-change: transform;
        }
        .hero-blob-1 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(200,241,53,0.25) 0%, rgba(200,241,53,0.08) 50%, transparent 70%);
          top: -10%;
          left: 10%;
          animation: blobDrift1 12s ease-in-out infinite;
        }
        .hero-blob-2 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(168,208,16,0.18) 0%, rgba(180,220,30,0.06) 50%, transparent 70%);
          top: 40%;
          right: -5%;
          animation: blobDrift2 15s ease-in-out infinite;
        }
        .hero-blob-3 {
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(200,241,53,0.15) 0%, rgba(200,241,53,0.04) 50%, transparent 70%);
          bottom: 5%;
          left: -5%;
          animation: blobDrift3 18s ease-in-out infinite;
        }
        @keyframes blobDrift1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(80px, 40px) scale(1.1); }
          50% { transform: translate(-30px, 80px) scale(0.95); }
          75% { transform: translate(50px, -20px) scale(1.05); }
        }
        @keyframes blobDrift2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(-60px, 50px) scale(1.08); }
          50% { transform: translate(40px, -30px) scale(0.92); }
          75% { transform: translate(-20px, -60px) scale(1.04); }
        }
        @keyframes blobDrift3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(70px, -40px) scale(1.12); }
          66% { transform: translate(-50px, 30px) scale(0.9); }
        }
      `}</style>
    </div>
  );
}
