'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSettings } from '@/components/SettingsContext';

const DumbbellIcon = ({ size = 80, color = 'currentColor' }: { size?: number, color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M6.5 2A2.5 2.5 0 0 0 4 4.5V9H3a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h1v4.5A2.5 2.5 0 0 0 6.5 22h1A2.5 2.5 0 0 0 10 19.5V15h4v4.5a2.5 2.5 0 0 0 2.5 2.5h1a2.5 2.5 0 0 0 2.5-2.5V15h1a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-1V4.5A2.5 2.5 0 0 0 17.5 2h-1A2.5 2.5 0 0 0 14 4.5V9h-4V4.5A2.5 2.5 0 0 0 7.5 2h-1z" />
  </svg>
);

const ChartIcon = ({ size = 80, color = 'currentColor' }: { size?: number, color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
);

const TrophyIcon = ({ size = 80, color = 'currentColor' }: { size?: number, color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="7"></circle>
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
  </svg>
);

const slides = [
  {
    icon: <DumbbellIcon />,
    heading: 'Track Every Lift',
    subtext: 'Log your sets, reps and weight in seconds. Built for the gym floor.',
  },
  {
    icon: <ChartIcon />,
    heading: 'Chase Progressive Overload',
    subtext: 'WorkoutSplit tells you exactly what to lift today based on your last session.',
  },
  {
    icon: <TrophyIcon />,
    heading: 'Celebrate Your PRs',
    subtext: 'Every personal record gets the celebration it deserves.',
  },
];

export default function OnboardingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { updateSettings } = useSettings();
  const router = useRouter();

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    await updateSettings({ onboardingComplete: true });
    router.push('/app');
  };

  // Simple swipe gesture handlers
  let touchStartX = 0;
  let touchEndX = 0;
  
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX = e.changedTouches[0].screenX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 50) handleNext();
    if (touchEndX - touchStartX > 50) handlePrev();
  };

  return (
    <div 
      style={{
        minHeight: '100vh',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Skip Button */}
      {currentSlide < slides.length - 1 && (
        <button
          onClick={handleComplete}
          style={{
            position: 'absolute',
            top: 24,
            right: 24,
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            fontSize: 16,
            fontWeight: 600,
            fontFamily: 'inherit',
            cursor: 'pointer',
            zIndex: 10,
          }}
        >
          Skip
        </button>
      )}

      {/* Slides Container */}
      <div 
        style={{
          display: 'flex',
          flex: 1,
          width: `${slides.length * 100}%`,
          transform: `translateX(-${currentSlide * (100 / slides.length)}%)`,
          transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
        }}
      >
        {slides.map((slide, i) => (
          <div 
            key={i} 
            style={{ 
              width: `${100 / slides.length}%`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 32px',
              textAlign: 'center',
            }}
          >
            <div style={{ 
              marginBottom: 40, 
              color: 'var(--lime)',
              filter: 'drop-shadow(0 8px 32px rgba(200, 241, 53, 0.6))'
            }}>
              {slide.icon}
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 16, color: 'var(--text-primary)', lineHeight: 1.2 }}>
              {slide.heading}
            </h1>
            <p style={{ fontSize: 18, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {slide.subtext}
            </p>
          </div>
        ))}
      </div>

      {/* Bottom Controls */}
      <div style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
        {/* Dots */}
        <div style={{ display: 'flex', gap: 8 }}>
          {slides.map((_, i) => (
            <div
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: i === currentSlide ? 'var(--lime)' : '#CBD5E1',
                transition: 'background-color 0.3s',
              }}
            />
          ))}
        </div>

        {/* Action Button */}
        <div style={{ width: '100%', height: 56 }}>
          {currentSlide === slides.length - 1 ? (
            <button
              onClick={handleComplete}
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'var(--lime)',
                color: 'var(--text-primary)',
                fontWeight: 700,
                fontSize: 18,
                fontFamily: 'inherit',
                border: 'none',
                borderRadius: 9999,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(200, 241, 53, 0.4)',
                transition: 'transform 0.1s',
              }}
              onPointerDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
              onPointerUp={e => e.currentTarget.style.transform = 'scale(1)'}
              onPointerLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              Get Started
            </button>
          ) : (
            <button
              onClick={handleNext}
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#F1F5F9', // slate-100
                color: 'var(--text-primary)',
                fontWeight: 600,
                fontSize: 18,
                fontFamily: 'inherit',
                border: 'none',
                borderRadius: 9999,
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
