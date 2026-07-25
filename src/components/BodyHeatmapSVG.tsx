'use client';

import React from 'react';
import MuscleHeatmap2D from './MuscleHeatmap2D';

interface BodyHeatmapSVGProps {
  muscleCounts: Record<string, number>;
  view?: 'front' | 'back';
}

export default function BodyHeatmapSVG({ muscleCounts }: BodyHeatmapSVGProps) {
  return <MuscleHeatmap2D muscleCounts={muscleCounts} />;
}
