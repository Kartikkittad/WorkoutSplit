'use client';

import PhoneFrame from './PhoneFrame';
import PhoneStatusBar from './PhoneStatusBar';
import MockExerciseCard from './log/MockExerciseCard';
import FloatingTarget from './log/FloatingTarget';

/**
 * Feature showcase — a logged session on an iPhone cropped at the bottom,
 * with the progressive-overload target zoomed out over the bezels.
 */
export default function OverloadPhone() {
  return (
    <div className="overload-phone-wrap" style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ position: 'relative' }}>
        <PhoneFrame width={306} height={492} cropped>
          <PhoneStatusBar />
          <div className="no-scrollbar" style={{ flex: 1, minHeight: 0, overflow: 'hidden', padding: '6px 16px 0' }}>
            {/* Section header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ font: "400 17px 'Archivo Black', sans-serif", color: '#111111', letterSpacing: '-.02em' }}>
                Exercises (2)
              </div>
              <div
                style={{
                  background: '#FFE100',
                  border: '2px solid #111111',
                  borderRadius: 999,
                  padding: '5px 10px',
                  font: "800 9.5px 'Archivo', sans-serif",
                  color: '#111111',
                }}
              >
                🔗 Add Superset
              </div>
            </div>

            <MockExerciseCard
              ex={{ name: 'Barbell Bench Press', last: '17.5lbs × 8', target: '20lbs × 8' }}
            />

            {/* Slot reserved for the target callout that floats outside the phone */}
            <div style={{ height: 110, marginTop: 16 }} />

            <MockExerciseCard
              ex={{
                name: 'Incline Barbell Ben…',
                last: '12.5lbs × 8',
                target: '15lbs × 8',
                hideTargetLine: true,
              }}
            />
          </div>
        </PhoneFrame>
        <FloatingTarget />
      </div>
    </div>
  );
}
