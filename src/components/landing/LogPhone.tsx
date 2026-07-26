'use client';

import PhoneFrame from './PhoneFrame';
import PhoneStatusBar from './PhoneStatusBar';
import MockWorkoutName from './log/MockWorkoutName';
import MockExercisePicker from './log/MockExercisePicker';
import FloatingExercises from './log/FloatingExercises';

/**
 * Feature showcase — the Log Workout screen on an iPhone cropped at the
 * bottom, so the device runs into the section rule, with a couple of
 * exercise rows popping out past the bezels.
 */
export default function LogPhone() {
  return (
    <div className="log-phone-wrap" style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ position: 'relative' }}>
        <PhoneFrame width={306} height={470} cropped>
          <PhoneStatusBar />
          <div className="no-scrollbar" style={{ flex: 1, minHeight: 0, overflow: 'hidden', padding: '6px 16px 0' }}>
            <MockWorkoutName />
            <MockExercisePicker />
            {/* Slot reserved for the rows that float outside the phone */}
            <div style={{ height: 142, marginTop: 12 }} />
          </div>
        </PhoneFrame>
        <FloatingExercises />
      </div>
    </div>
  );
}
