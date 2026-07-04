'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import LineChart from '@/components/LineChart';
import { EXERCISES } from '@/lib/exercises';
import { ProgressDataPoint, PersonalRecord } from '@/lib/types';

function ProgressContent() {
  const searchParams = useSearchParams();
  const initialExercise = searchParams.get('exercise') || EXERCISES[0].id;
  const [selectedExercise, setSelectedExercise] = useState(initialExercise);
  const [data, setData] = useState<ProgressDataPoint[]>([]);
  const [prs, setPrs] = useState<PersonalRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [metric, setMetric] = useState<'maxWeight' | 'totalVolume' | 'totalSets'>('maxWeight');
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'all'>('all');
  const [showPicker, setShowPicker] = useState(false);
  const [pickerCategory, setPickerCategory] = useState<string>(() => {
    const found = EXERCISES.find(e => e.id === initialExercise);
    return found?.category || 'Push';
  });
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    setLoading(true);
    import('@/lib/storage').then(({ getWorkouts, getPersonalRecords }) => {
      const workouts = getWorkouts();
      // Calculate progress data for selected exercise
      const exerciseData: Record<string, ProgressDataPoint> = {};

      for (const w of workouts) {
        const date = new Date(w.startedAt).toISOString().split('T')[0];
        for (const ex of w.exercises) {
          if (ex.exerciseId === selectedExercise) {
            if (!exerciseData[date]) {
              exerciseData[date] = { date, maxWeight: 0, totalVolume: 0, totalSets: 0 };
            }
            const d = exerciseData[date];
            for (const set of ex.sets) {
              if (set.completed) {
                d.maxWeight = Math.max(d.maxWeight, set.weight);
                d.totalVolume += set.weight * set.reps;
                d.totalSets += 1;
              }
            }
          }
        }
      }

      const sorted = Object.values(exerciseData).sort((a, b) => a.date.localeCompare(b.date));
      setData(sorted);
      
      const allPrs = getPersonalRecords();
      setPrs(allPrs);
      setLoading(false);
    });
  }, [selectedExercise]);

  const handleSharePR = async (pr: PersonalRecord) => {
    if (isSharing) return;
    setIsSharing(true);
    
    try {
      const html2canvas = (await import('html2canvas')).default;
      const element = document.getElementById(`share-card-${pr.id}`);
      if (!element) return;
      
      // Temporarily make it visible for capture
      element.style.display = 'block';
      
      const canvas = await html2canvas(element, {
        backgroundColor: '#0F172A',
        scale: 2,
      });
      
      element.style.display = 'none';
      
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], `WorkoutSplit-PR-${pr.exerciseName}.png`, { type: 'image/png' });
        
        if (navigator.share && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: 'New Personal Record!',
              text: `Just hit a new PR on ${pr.exerciseName}: ${pr.weight}kg! 💪`,
            });
          } catch (e) {
            console.error('Share failed', e);
          }
        } else {
          // Fallback download
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `WorkoutSplit-PR-${pr.exerciseName}.png`;
          a.click();
          URL.revokeObjectURL(url);
        }
      }, 'image/png');
    } catch (e) {
      console.error(e);
    } finally {
      setIsSharing(false);
    }
  };

  const selectedDef = EXERCISES.find(e => e.id === selectedExercise);

  // Filter data by time range
  const now = new Date();
  const filteredData = data.filter(d => {
    if (timeFilter === 'all') return true;
    const date = new Date(d.date);
    const diffDays = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
    return timeFilter === 'week' ? diffDays <= 7 : diffDays <= 30;
  });

  // Chart data based on selected metric and time filter
  const chartData = filteredData.map(d => ({
    label: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: d[metric],
  }));

  // Summary stats
  const bestWeight = filteredData.length > 0 ? Math.max(...filteredData.map(d => d.maxWeight)) : 0;
  const totalVol = filteredData.reduce((sum, d) => sum + d.totalVolume, 0);
  const totalSetsAll = filteredData.reduce((sum, d) => sum + d.totalSets, 0);

  const metricLabels: Record<string, string> = {
    maxWeight: 'Max Weight (kg)',
    totalVolume: 'Volume (kg)',
    totalSets: 'Sets',
  };

  const metrics: { key: 'maxWeight' | 'totalVolume' | 'totalSets'; label: string }[] = [
    { key: 'maxWeight', label: 'Weight' },
    { key: 'totalVolume', label: 'Volume' },
    { key: 'totalSets', label: 'Sets' },
  ];

  return (
    <div style={{ paddingTop: 16 }}>
      {/* Header */}
      <h1 className="section-heading" style={{ fontSize: 24, marginBottom: 20 }}>Progress</h1>

      {/* Time Filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {([{ label: 'This Week', value: 'week' }, { label: 'This Month', value: 'month' }, { label: 'All Time', value: 'all' }] as const).map(f => (
          <button
            key={f.value}
            onClick={() => setTimeFilter(f.value)}
            style={{
              flex: 1,
              padding: '10px 8px',
              borderRadius: 9999,
              border: timeFilter === f.value ? 'none' : '1px solid var(--border-light)',
              background: timeFilter === f.value ? 'var(--primary)' : 'white',
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
              fontFamily: 'inherit',
              color: 'var(--text-primary)',
              transition: 'all 0.15s ease',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Exercise Selector — Custom */}
      <div style={{ marginBottom: 24 }}>
        {/* Selected exercise display */}
        <button
          onClick={() => setShowPicker(!showPicker)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 16px',
            borderRadius: 16,
            border: 'none',
            background: 'var(--card-bg)',
            boxShadow: 'var(--shadow-card)',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: selectedDef ? `${selectedDef.color}22` : '#f1f5f9',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: selectedDef?.color || 'var(--text-secondary)',
            }}>
              <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.5 2A2.5 2.5 0 0 0 4 4.5V9H3a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h1v4.5A2.5 2.5 0 0 0 6.5 22h1A2.5 2.5 0 0 0 10 19.5V15h4v4.5a2.5 2.5 0 0 0 2.5 2.5h1a2.5 2.5 0 0 0 2.5-2.5V15h1a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-1V4.5A2.5 2.5 0 0 0 17.5 2h-1A2.5 2.5 0 0 0 14 4.5V9h-4V4.5A2.5 2.5 0 0 0 7.5 2h-1z" />
              </svg>
            </div>
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>{selectedDef?.name}</p>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{selectedDef?.category}</p>
            </div>
          </div>
          <svg
            width={18} height={18} viewBox="0 0 24 24" fill="none"
            stroke="var(--text-secondary)" strokeWidth={2} strokeLinecap="round"
            style={{ transform: showPicker ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {/* Dropdown panel */}
        {showPicker && (
          <div className="card" style={{ marginTop: 8, padding: '12px 0', maxHeight: 320, overflowY: 'auto' }}>
            {/* Category tabs */}
            <div style={{ display: 'flex', gap: 6, padding: '0 12px 12px', borderBottom: '1px solid var(--border-light)' }}>
              {(['Push', 'Pull', 'Legs', 'Core'] as const).map(cat => {
                const catColors: Record<string, string> = { Push: '#C8F135', Pull: '#FFB4C8', Legs: '#B4F0FF', Core: '#E4B4FF' };
                return (
                  <button
                    key={cat}
                    onClick={() => setPickerCategory(cat)}
                    style={{
                      flex: 1,
                      padding: '8px 0',
                      borderRadius: 10,
                      border: 'none',
                      background: pickerCategory === cat ? catColors[cat] + '30' : 'transparent',
                      fontWeight: 600,
                      fontSize: 13,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      color: pickerCategory === cat ? 'var(--text-primary)' : 'var(--text-secondary)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Exercise list */}
            <div style={{ padding: '8px 4px 0' }}>
              {EXERCISES.filter(ex => ex.category === pickerCategory).map(ex => {
                const isSelected = ex.id === selectedExercise;
                return (
                  <button
                    key={ex.id}
                    onClick={() => {
                      setSelectedExercise(ex.id);
                      setShowPicker(false);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '10px 12px',
                      borderRadius: 12,
                      border: 'none',
                      background: isSelected ? 'rgba(200,241,53,0.12)' : 'transparent',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      textAlign: 'left',
                      transition: 'background 0.1s ease',
                    }}
                  >
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: isSelected ? 'var(--primary)' : ex.color,
                      flexShrink: 0,
                    }} />
                    <span style={{
                      fontSize: 14,
                      fontWeight: isSelected ? 700 : 500,
                      color: 'var(--text-primary)',
                      flex: 1,
                    }}>
                      {ex.name}
                    </span>
                    {isSelected && (
                      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--primary-dark)" strokeWidth={2.5}>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Metric Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {metrics.map(m => (
          <button
            key={m.key}
            onClick={() => setMetric(m.key)}
            style={{
              flex: 1,
              padding: '10px 8px',
              borderRadius: 9999,
              border: metric === m.key ? 'none' : '1px solid var(--border-light)',
              background: metric === m.key ? 'var(--primary)' : 'white',
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
              fontFamily: 'inherit',
              color: 'var(--text-primary)',
              transition: 'all 0.15s ease',
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="card" style={{ marginBottom: 24, padding: '20px 16px' }}>
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>
            {selectedDef?.name}
          </p>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
            {metricLabels[metric]} · {timeFilter === 'week' ? 'Last 7 days' : timeFilter === 'month' ? 'Last 30 days' : 'All time'}
          </p>
        </div>
        {loading ? (
          <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p className="text-secondary">Loading...</p>
          </div>
        ) : (
          <LineChart data={chartData} color="#C8F135" height={220} />
        )}
      </div>

      {/* Stats Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 24 }}>
        <div className="card" style={{ textAlign: 'center', padding: 16 }}>
          <p style={{ fontSize: 24, fontWeight: 800, lineHeight: 1 }}>{bestWeight}</p>
          <p className="text-secondary" style={{ fontSize: 11, marginTop: 6 }}>Best (kg)</p>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 16 }}>
          <p style={{ fontSize: 24, fontWeight: 800, lineHeight: 1 }}>{totalVol.toLocaleString()}</p>
          <p className="text-secondary" style={{ fontSize: 11, marginTop: 6 }}>Volume (kg)</p>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 16 }}>
          <p style={{ fontSize: 24, fontWeight: 800, lineHeight: 1 }}>{totalSetsAll}</p>
          <p className="text-secondary" style={{ fontSize: 11, marginTop: 6 }}>Total Sets</p>
        </div>
      </div>

      {/* Personal Records */}
      <div style={{ marginBottom: 28 }}>
        <h2 className="section-heading" style={{ marginBottom: 16 }}>Personal Records</h2>
        {prs.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '32px 20px' }}>
            <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'center' }}>
              <svg width={40} height={40} viewBox="0 0 24 24" fill="#C8F135">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <p style={{ fontWeight: 600, marginBottom: 4 }}>No PRs yet</p>
            <p className="text-secondary">Log workouts to track your personal records</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {prs.map((pr, i) => (
              <div
                key={pr.id || i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'var(--primary)',
                  borderRadius: 9999,
                  padding: '6px 12px 6px 6px',
                  color: '#0F172A',
                  fontWeight: 700,
                  fontSize: 13,
                  gap: 8,
                }}
              >
                <div style={{ background: '#0F172A', color: 'var(--primary)', padding: '4px 8px', borderRadius: 9999, fontSize: 11 }}>
                  {pr.weight}kg
                </div>
                <span>{pr.exerciseName}</span>
                <span style={{ opacity: 0.7, fontWeight: 500 }}>
                  on {new Date(pr.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
                
                <button 
                  onClick={() => handleSharePR(pr)}
                  disabled={isSharing}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '2px 4px',
                    opacity: isSharing ? 0.5 : 1,
                  }}
                  title="Share PR"
                >
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                    <polyline points="16 6 12 2 8 6" />
                    <line x1="12" y1="2" x2="12" y2="15" />
                  </svg>
                </button>

                {/* Hidden Share Card (Rendered only for html2canvas) */}
                <div 
                  id={`share-card-${pr.id}`} 
                  style={{ 
                    display: 'none', 
                    position: 'absolute', 
                    left: -9999,
                    width: 390, 
                    padding: 32, 
                    background: '#0F172A', 
                    border: '4px solid #C8F135',
                    borderRadius: 24,
                    textAlign: 'center',
                    fontFamily: 'sans-serif',
                  }}
                >
                  <p style={{ color: '#C8F135', fontSize: 32, fontWeight: 800, margin: '0 0 16px 0' }}>New PR 🏆</p>
                  <h1 style={{ color: 'white', fontSize: 42, fontWeight: 900, margin: '0 0 8px 0', lineHeight: 1.1 }}>
                    {pr.exerciseName}
                  </h1>
                  <p style={{ color: 'white', fontSize: 56, fontWeight: 900, margin: '0 0 24px 0' }}>
                    {pr.weight}<span style={{ fontSize: 24, opacity: 0.8 }}>kg</span>
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 32 }}>
                    <div style={{ width: 24, height: 24, borderRadius: 6, background: '#C8F135', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#0F172A' }}>W</div>
                    <span style={{ color: '#C8F135', fontSize: 16, fontWeight: 700 }}>WorkoutSplit</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProgressPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>Loading...</div>}>
      <ProgressContent />
    </Suspense>
  );
}
