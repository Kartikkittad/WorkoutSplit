'use client';

import PhoneFrame from './PhoneFrame';
import PhoneStatusBar from './PhoneStatusBar';
import MockChipRow from './progress/MockChipRow';
import MockExerciseSelect from './progress/MockExerciseSelect';
import MockProgressChart from './progress/MockProgressChart';
import MockProgressStats from './progress/MockProgressStats';

/** Feature showcase — the Progress screen on an iPhone cropped at the bottom. */
export default function ProgressPhone() {
  return (
    <div className="progress-phone-wrap" style={{ display: 'flex', justifyContent: 'center' }}>
      <PhoneFrame width={306} height={550} cropped>
        <PhoneStatusBar />
        <div className="no-scrollbar" style={{ flex: 1, minHeight: 0, overflow: 'hidden', padding: '6px 16px 0' }}>
          <div style={{ font: "400 19px 'Archivo Black', sans-serif", color: '#111111', letterSpacing: '-.02em', marginBottom: 12 }}>
            Progress
          </div>

          <MockChipRow chips={['Exercises', 'Calories', 'Intensity']} active="Exercises" />
          <MockChipRow chips={['This Week', 'This Month', 'All Time']} active="All Time" marginBottom={12} />

          <MockExerciseSelect />

          <MockChipRow chips={['Weight', 'Volume', 'Sets']} active="Weight" marginBottom={12} />

          <MockProgressChart />
          <MockProgressStats />
        </div>
      </PhoneFrame>
    </div>
  );
}
