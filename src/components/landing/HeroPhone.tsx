'use client';

import PhoneFrame from './PhoneFrame';
import PhoneStatusBar from './PhoneStatusBar';
import DashboardMockup from './DashboardMockup';
import FloatingWeightCard from './FloatingWeightCard';
import HeatmapPhone from './HeatmapPhone';

/**
 * Hero showcase — an iPhone cropped at the bottom edge of the hero, showing
 * the top half of the dashboard with the Body Weight card popped out, plus a
 * smaller heatmap phone tucked in behind it on the left.
 */
export default function HeroPhone() {
  return (
    <div className="hero-phone-wrap" style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
      <div style={{ position: 'relative' }}>
        <HeatmapPhone />

        <div style={{ position: 'relative', zIndex: 10 }}>
          <PhoneFrame width={318} height={566} cropped>
            <PhoneStatusBar />
            <DashboardMockup />
          </PhoneFrame>
          <FloatingWeightCard />
        </div>
      </div>
    </div>
  );
}
