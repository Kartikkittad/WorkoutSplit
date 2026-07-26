'use client';

import PhoneFrame from './PhoneFrame';
import PhoneStatusBar from './PhoneStatusBar';
import MockSessionExerciseCard from './rest/MockSessionExerciseCard';
import FloatingRestTimer from './rest/FloatingRestTimer';

/**
 * Feature showcase — a live session cropped at the bottom, with the rest
 * timer zoomed out over the bezels.
 */
export default function RestPhone() {
  return (
    <div className="rest-phone-wrap" style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ position: 'relative' }}>
        <PhoneFrame width={306} height={444} cropped>
          <PhoneStatusBar />
          <div className="no-scrollbar" style={{ flex: 1, minHeight: 0, overflow: 'hidden', padding: '6px 16px 0' }}>
            <div style={{ font: "400 17px 'Archivo Black', sans-serif", color: '#111111', letterSpacing: '-.02em', marginBottom: 12 }}>
              Exercises (1)
            </div>

            <MockSessionExerciseCard />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '16px 0 12px' }}>
              <div style={{ font: "400 17px 'Archivo Black', sans-serif", color: '#111111', letterSpacing: '-.02em' }}>
                Add Exercise
              </div>
              <div
                style={{
                  border: '2px solid #111111',
                  borderRadius: 999,
                  padding: '5px 13px',
                  font: "700 10px 'Archivo', sans-serif",
                  color: '#111111',
                  background: '#ffffff',
                }}
              >
                Show
              </div>
            </div>

            {/* Slot reserved for the rest timer that floats outside the phone */}
            <div style={{ height: 108 }} />

            <div
              style={{
                background: '#FFF7B0',
                border: '2px solid #111111',
                borderRadius: 999,
                padding: '13px 0',
                textAlign: 'center',
                font: "800 13px 'Archivo', sans-serif",
                color: '#9a9a8a',
              }}
            >
              Finish Workout
            </div>
          </div>
        </PhoneFrame>
        <FloatingRestTimer />
      </div>
    </div>
  );
}
