'use client';

import MockHeader from './dashboard/MockHeader';
import MockQuickStart from './dashboard/MockQuickStart';
import MockProgressCard from './dashboard/MockProgressCard';
import MockStreakCard from './dashboard/MockStreakCard';
import MockWeeklySummary from './dashboard/MockWeeklySummary';
import MockStatsGrid from './dashboard/MockStatsGrid';

/** The app's home screen, recreated card-for-card for the hero phone. */
export default function DashboardMockup() {
  return (
    <div
      className="no-scrollbar"
      style={{
        flex: 1,
        overflow: 'hidden',
        padding: '4px 16px 12px',
        background: '#ffffff',
      }}
    >
      <MockHeader />
      <MockQuickStart />
      <MockProgressCard />
      {/* Slot reserved for the Body Weight card, which floats outside the phone */}
      <div style={{ height: 214, marginBottom: 10 }} />
      <MockStreakCard />
      <MockWeeklySummary />
      <MockStatsGrid />
    </div>
  );
}
