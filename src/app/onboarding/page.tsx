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

const MaleIcon = ({ size = 36, color = 'currentColor' }: { size?: number, color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M21 3h-6c-.55 0-1 .45-1 1s.45 1 1 1h3.59l-5.3 5.29c-1.15-.8-2.52-1.29-4-1.29-3.87 0-7 3.13-7 7s3.13 7 7 7 7-3.13 7-7c0-1.48-.49-2.85-1.29-4l5.29-5.3V9c0 .55.45 1 1 1s1-.45 1-1V3c0-.55-.45-1-1-1zM9.5 20c-2.48 0-4.5-2.02-4.5-4.5S7.02 11 9.5 11s4.5 2.02 4.5 4.5S11.98 20 9.5 20z"/>
  </svg>
);

const FemaleIcon = ({ size = 36, color = 'currentColor' }: { size?: number, color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 2c-3.87 0-7 3.13-7 7 0 3.07 1.98 5.67 4.75 6.6L9.75 18H8c-.55 0-1 .45-1 1s.45 1 1 1h1.75v1.75c0 .55.45 1 1 1s1-.45 1-1V20H14c.55 0 1-.45 1-1s-.45-1-1-1h-1.75v-2.4c2.77-.93 4.75-3.53 4.75-6.6 0-3.87-3.13-7-7-7zm0 12c-2.48 0-4.5-2.02-4.5-4.5S9.52 5 12 5s4.5 2.02 4.5 4.5S14.48 14 12 14z"/>
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
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | null>(null);
  const { updateSettings } = useSettings();
  const router = useRouter();

  const totalSlides = 4;

  const handleNext = async () => {
    if (currentSlide === 0) {
      if (name.trim() && gender) {
        await updateSettings({ userName: name.trim(), userGender: gender });
      }
    }
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    if (name.trim() && gender) {
      await updateSettings({ userName: name.trim(), userGender: gender, onboardingComplete: true });
    } else {
      await updateSettings({ onboardingComplete: true });
    }
    router.push('/');
  };

  // Simple swipe gesture handlers
  let touchStartX = 0;
  let touchEndX = 0;
  
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX = e.changedTouches[0].screenX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 50) {
      if (currentSlide === 0) {
        if (name.trim() && gender) handleNext();
      } else {
        handleNext();
      }
    }
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
      {currentSlide > 0 && currentSlide < totalSlides - 1 && (
        <button
          onClick={handleComplete}
          style={{
            position: 'absolute',
            top: 'calc(24px + env(safe-area-inset-top))',
            right: 'calc(24px + env(safe-area-inset-right))',
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
          width: `${totalSlides * 100}%`,
          transform: `translateX(-${currentSlide * (100 / totalSlides)}%)`,
          transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
        }}
      >
        {/* Slide 1 — Welcome + Gender + Name */}
        <div 
          style={{ 
            width: `${100 / totalSlides}%`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '0 24px',
            textAlign: 'left',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: 'var(--text-primary)', lineHeight: 1.2 }}>
              Welcome to LiftPulse
            </h1>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)' }}>
              Let's set up your profile
            </p>
          </div>

          {/* Name input */}
          <div style={{ marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
              What should we call you?
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name"
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '16px',
                border: '1px solid var(--border-light)',
                backgroundColor: 'var(--input-bg)',
                fontSize: 16,
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />
          </div>

          {/* Gender selection */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
            <label style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
              I am
            </label>
            <div style={{ display: 'flex', gap: 16 }}>
              {/* Male Card */}
              <button
                type="button"
                onClick={() => setGender('male')}
                style={{
                  flex: 1,
                  height: 110,
                  borderRadius: 24,
                  border: gender === 'male' ? '2px solid #C8F135' : '2px solid #E2E8F0',
                  backgroundColor: gender === 'male' ? 'rgba(200, 241, 53, 0.1)' : 'var(--card-bg)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <MaleIcon size={36} color={gender === 'male' ? 'var(--text-primary)' : 'var(--text-secondary)'} />
                <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>Male</span>
              </button>

              {/* Female Card */}
              <button
                type="button"
                onClick={() => setGender('female')}
                style={{
                  flex: 1,
                  height: 110,
                  borderRadius: 24,
                  border: gender === 'female' ? '2px solid #C8F135' : '2px solid #E2E8F0',
                  backgroundColor: gender === 'female' ? 'rgba(200, 241, 53, 0.1)' : 'var(--card-bg)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <FemaleIcon size={36} color={gender === 'female' ? 'var(--text-primary)' : 'var(--text-secondary)'} />
                <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>Female</span>
              </button>
            </div>
          </div>
        </div>

        {/* Existing Slides */}
        {slides.map((slide, i) => (
          <div 
            key={i} 
            style={{ 
              width: `${100 / totalSlides}%`,
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
      <div style={{ padding: '32px 24px calc(24px + env(safe-area-inset-bottom))', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
        {/* Dots */}
        <div style={{ display: 'flex', gap: 8 }}>
          {Array.from({ length: totalSlides }).map((_, i) => (
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
          {currentSlide === 0 ? (
            <button
              onClick={handleNext}
              disabled={!name.trim() || !gender}
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: (name.trim() && gender) ? 'var(--lime)' : '#CBD5E1',
                color: 'var(--text-primary)',
                fontWeight: 700,
                fontSize: 18,
                fontFamily: 'inherit',
                border: 'none',
                borderRadius: 9999,
                cursor: (name.trim() && gender) ? 'pointer' : 'not-allowed',
                boxShadow: (name.trim() && gender) ? '0 4px 14px rgba(200, 241, 53, 0.4)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              Next
            </button>
          ) : currentSlide === totalSlides - 1 ? (
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
