'use client';

import PhoneFrame from './PhoneFrame';
import PhoneStatusBar from './PhoneStatusBar';
import MockHeatmapCard from './heatmap/MockHeatmapCard';

/**
 * The hero's secondary phone — sits behind and to the left of the main one,
 * showing nothing but the muscle heatmap.
 */
export default function HeatmapPhone() {
  return (
    <div className="hero-heatmap-phone">
      <PhoneFrame width={252} height={540} cropped>
        <PhoneStatusBar />
        <div className="no-scrollbar" style={{ flex: 1, minHeight: 0, overflow: 'hidden', padding: '4px 12px 0' }}>
          <MockHeatmapCard />
        </div>
      </PhoneFrame>
    </div>
  );
}
