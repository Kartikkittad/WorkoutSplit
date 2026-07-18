'use client';

// TEMPORARY test page for verifying BodyVisualizer3D — safe to delete.
import dynamic from 'next/dynamic';

const BodyVisualizer3D = dynamic(() => import('@/components/BodyVisualizer3D'), { ssr: false });

export default function HeatmapTestPage() {
  const muscleCounts = {
    Chest: 3, Back: 2, Shoulders: 1, Biceps: 1, Triceps: 0,
    Quads: 2, Hamstrings: 0, Glutes: 1, Core: 3, Calves: 0,
  };
  return (
    <div style={{ padding: 24, maxWidth: 420, margin: '0 auto' }}>
      <h1 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Heatmap 3D test</h1>
      <div style={{
        borderRadius: 16,
        background: 'radial-gradient(ellipse at 50% 30%, #12233d 0%, #0a1628 70%)',
        overflow: 'hidden',
      }}>
        <BodyVisualizer3D muscleCounts={muscleCounts} />
      </div>
    </div>
  );
}
