'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import LineChart from '@/components/LineChart';
import { EXERCISES } from '@/lib/exercises';
import { ProgressDataPoint, PersonalRecord, Workout } from '@/lib/types';
import { useSettings } from '@/components/SettingsContext';
import BodyHeatmapSVG from '@/components/BodyHeatmapSVG';

const BarChartIcon = ({ size = 24, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" x2="12" y1="20" y2="10"/>
    <line x1="18" x2="18" y1="20" y2="4"/>
    <line x1="6" x2="6" y1="20" y2="16"/>
  </svg>
);

const FlameIcon = ({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 23c-4.97 0-9-3.58-9-8 0-2.52 1.17-4.7 2.5-6.37A25.16 25.16 0 0 0 8.37 4.9a1 1 0 0 1 1.63.37c.43 1.11 1.13 2.34 2.16 3.3.08-.9.39-1.96 1.12-3.06A10.15 10.15 0 0 1 15.67.79a1 1 0 0 1 1.53.78c.05 1.42.52 3.13 1.55 4.68C20.13 8.3 21 10.53 21 13c0 5.5-4.03 10-9 10z" />
  </svg>
);

function ProgressContent() {
  const searchParams = useSearchParams();
  const { weightUnit } = useSettings();
  const initialExercise = searchParams.get('exercise') || EXERCISES[0].id;
  const [selectedExercise, setSelectedExercise] = useState(initialExercise);
  const [data, setData] = useState<ProgressDataPoint[]>([]);
  const [prs, setPrs] = useState<PersonalRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [metric, setMetric] = useState<'maxWeight' | 'totalVolume' | 'totalSets'>('maxWeight');
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'all'>('all');
  const [showPicker, setShowPicker] = useState(false);
  const [pickerCategory, setPickerCategory] = useState<string>(() => {
    const found = EXERCISES.find(e => e.id === initialExercise);
    return found?.category || 'Push';
  });
  const [isSharing, setIsSharing] = useState(false);
  const [prImages, setPrImages] = useState<Record<string, string>>({});


  const muscleCounts = useMemo(() => {
    const EXERCISE_TO_MUSCLE: Record<string, string> = {
      'bench-press': 'Chest', 'incline-db-press': 'Chest', 'chest-fly': 'Chest', 'machine-chest-press': 'Chest', 'pec-deck': 'Chest', 'dips': 'Chest',
      'overhead-press': 'Shoulders', 'lateral-raise': 'Shoulders', 'front-raise': 'Shoulders', 'tricep-pushdown': 'Triceps', 'skull-crushers': 'Triceps', 'close-grip-bench': 'Triceps',
      'deadlift': 'Back', 'barbell-row': 'Back', 'pull-up': 'Back', 'lat-pulldown': 'Back', 'seated-cable-row': 'Back', 't-bar-row': 'Back', 'shrugs': 'Back', 'straight-arm-pulldown': 'Back',
      'bicep-curl': 'Biceps', 'hammer-curl': 'Biceps', 'preacher-curl': 'Biceps', 'face-pull': 'Shoulders',
      'squat': 'Quads', 'leg-press': 'Quads', 'front-squat': 'Quads', 'hack-squat': 'Quads', 'lunges': 'Quads', 'bulgarian-split-squat': 'Quads', 'leg-extension': 'Quads',
      'romanian-deadlift': 'Hamstrings', 'leg-curl': 'Hamstrings', 'hip-thrust': 'Glutes', 'calf-raise': 'Calves',
      'plank': 'Core', 'cable-crunch': 'Core', 'hanging-leg-raise': 'Core', 'ab-wheel': 'Core', 'russian-twist': 'Core', 'crunches': 'Core', 'back-extension': 'Core'
    };
    const counts: Record<string, number> = {
      Chest: 0, Back: 0, Shoulders: 0, Biceps: 0, Triceps: 0,
      Quads: 0, Hamstrings: 0, Glutes: 0, Core: 0, Calves: 0
    };
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    workouts.filter(w => new Date(w.startedAt) >= sevenDaysAgo).forEach(w => {
      w.exercises.forEach(ex => {
        if (ex.sets.some(s => s.completed)) {
          const m = EXERCISE_TO_MUSCLE[ex.exerciseId];
          if (m in counts) counts[m]++;
        }
      });
    });
    return counts;
  }, [workouts]);

  const getMuscleColor = (muscle: string) => {
    const count = muscleCounts[muscle] || 0;
    if (count === 0) return '#F1F5F9';
    if (count === 1) return '#D9F99D';
    if (count === 2) return '#A3E635';
    return '#65A30D';
  };

  useEffect(() => {
    setLoading(true);
    import('@/lib/storage').then(async ({ getWorkouts, getPersonalRecords }) => {
      const workouts = await getWorkouts();
      setWorkouts(workouts);
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
      
      const allPrs = await getPersonalRecords();
      setPrs(allPrs);
      setLoading(false);
    });
  }, [selectedExercise]);

  const handleSharePR = async (pr: PersonalRecord) => {
    if (isSharing) return;
    setIsSharing(true);
    
    try {
      const html2canvas = (await import('html2canvas')).default;
      const element = document.getElementById(`share-card-${pr.id || pr.exerciseId}`);
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
              text: `Just hit a new PR on ${pr.exerciseName}: ${pr.weight}${weightUnit}! 💪`,
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
    maxWeight: `Max Weight (${weightUnit})`,
    totalVolume: `Volume (${weightUnit})`,
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
        ) : chartData.length < 2 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 220, textAlign: 'center' }}>
            <div style={{ marginBottom: 16, filter: 'drop-shadow(0 8px 24px rgba(200, 241, 53, 0.4))' }}>
              <BarChartIcon size={64} color="var(--lime)" />
            </div>
            <p style={{ fontWeight: 700, fontSize: 18, marginBottom: 8, color: 'var(--text-primary)' }}>Not enough data yet</p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Log at least 2 sessions of this exercise to see your progress chart</p>
          </div>
        ) : (
          <LineChart data={chartData} color="#C8F135" height={220} />
        )}
      </div>

      {/* Stats Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 24 }}>
        <div className="card" style={{ textAlign: 'center', padding: 16 }}>
          <p style={{ fontSize: 24, fontWeight: 800, lineHeight: 1 }}>{bestWeight}</p>
          <p className="text-secondary" style={{ fontSize: 11, marginTop: 6 }}>Best ({weightUnit})</p>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 16 }}>
          <p style={{ fontSize: 24, fontWeight: 800, lineHeight: 1 }}>{totalVol.toLocaleString()}</p>
          <p className="text-secondary" style={{ fontSize: 11, marginTop: 6 }}>Volume ({weightUnit})</p>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 16 }}>
          <p style={{ fontSize: 24, fontWeight: 800, lineHeight: 1 }}>{totalSetsAll}</p>
          <p className="text-secondary" style={{ fontSize: 11, marginTop: 6 }}>Total Sets</p>
        </div>
      </div>

      {/* ─── Muscle Group Heatmap ─── */}
      {(() => {
        const [bodyView, setBodyView] = useState<'front' | 'back'>('front');
        const EXERCISE_TO_MUSCLE: Record<string, string> = {
          'bench-press': 'Chest', 'incline-db-press': 'Chest', 'chest-fly': 'Chest', 'machine-chest-press': 'Chest', 'pec-deck': 'Chest', 'dips': 'Chest',
          'overhead-press': 'Shoulders', 'lateral-raise': 'Shoulders', 'front-raise': 'Shoulders', 'tricep-pushdown': 'Triceps', 'skull-crushers': 'Triceps', 'close-grip-bench': 'Triceps',
          'deadlift': 'Back', 'barbell-row': 'Back', 'pull-up': 'Back', 'lat-pulldown': 'Back', 'seated-cable-row': 'Back', 't-bar-row': 'Back', 'shrugs': 'Back', 'straight-arm-pulldown': 'Back',
          'bicep-curl': 'Biceps', 'hammer-curl': 'Biceps', 'preacher-curl': 'Biceps', 'face-pull': 'Shoulders',
          'squat': 'Quads', 'leg-press': 'Quads', 'front-squat': 'Quads', 'hack-squat': 'Quads', 'lunges': 'Quads', 'bulgarian-split-squat': 'Quads', 'leg-extension': 'Quads',
          'romanian-deadlift': 'Hamstrings', 'leg-curl': 'Hamstrings', 'hip-thrust': 'Glutes', 'calf-raise': 'Calves',
          'plank': 'Core', 'cable-crunch': 'Core', 'hanging-leg-raise': 'Core', 'ab-wheel': 'Core', 'russian-twist': 'Core', 'crunches': 'Core', 'back-extension': 'Core'
        };

        const muscleCounts = useMemo(() => {
          const counts: Record<string, number> = {
            Chest: 0, Back: 0, Shoulders: 0, Biceps: 0, Triceps: 0,
            Quads: 0, Hamstrings: 0, Glutes: 0, Core: 0, Calves: 0
          };
          const now = new Date();
          const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          workouts.filter(w => new Date(w.startedAt) >= sevenDaysAgo).forEach(w => {
            w.exercises.forEach(ex => {
              if (ex.sets.some(s => s.completed)) {
                const m = EXERCISE_TO_MUSCLE[ex.exerciseId];
                if (m in counts) counts[m]++;
              }
            });
          });
          return counts;
        }, [workouts]);

        return (
          <div className="card" style={{ padding: 18, marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700 }}>Muscle Group Heatmap</h2>
              <button
                onClick={() => setBodyView(v => v === 'front' ? 'back' : 'front')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  border: '1px solid #E2E8F0', background: '#F8FAFC', borderRadius: 9999,
                  padding: '5px 12px', cursor: 'pointer', fontFamily: 'inherit',
                  fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)',
                  transition: 'all 0.2s ease',
                }}
              >
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                  <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                  <path d="M21 21v-5h-5" />
                </svg>
                {bodyView === 'front' ? 'Front' : 'Back'}
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0', minHeight: 300 }}>
              <BodyHeatmapSVG muscleCounts={muscleCounts} view={bodyView} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 16, marginTop: 14, marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 12, height: 12, borderRadius: 3, background: '#B4DEC4', border: '1px solid #6AAE7B' }} /><span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>0x</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 12, height: 12, borderRadius: 3, background: '#FFDA6B' }} /><span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>1x</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 12, height: 12, borderRadius: 3, background: '#FF9F43' }} /><span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>2x</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 12, height: 12, borderRadius: 3, background: '#EE5A24' }} /><span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>3x+</span></div>
            </div>

            <div style={{ textAlign: 'center', borderTop: '1px solid var(--border-light)', paddingTop: 12, marginTop: 4 }}>
              {(() => {
                let maxCount = 0;
                let maxMuscle = '';
                for (const [muscle, c] of Object.entries(muscleCounts)) {
                  if (c > maxCount) { maxCount = c; maxMuscle = muscle; }
                }
                if (maxCount === 0) return <p style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>No workouts logged in the last 7 days</p>;
                return (
                  <p style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <span>Most trained this week: {maxMuscle}</span>
                    <FlameIcon size={16} color="#ff8c32" />
                  </p>
                );
              })()}
            </div>
          </div>
        );
      })()}

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
                  on {new Date(pr.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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
                
                {/* Photo upload for background */}
                <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', opacity: 0.8, padding: '2px 4px' }} title="Add background image">
                  <input 
                    type="file" 
                    accept="image/*" 
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = URL.createObjectURL(file);
                        setPrImages(prev => ({ ...prev, [pr.id || pr.exerciseId]: url }));
                      }
                    }}
                  />
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                  {prImages[pr.id || pr.exerciseId] && (
                    <img 
                      src={prImages[pr.id || pr.exerciseId]} 
                      alt="Selected background" 
                      style={{ width: 16, height: 16, borderRadius: 4, objectFit: 'cover', marginLeft: 8, border: '1px solid rgba(255,255,255,0.2)' }}
                    />
                  )}
                </label>

                {/* Hidden Share Card (Rendered only for html2canvas) */}
                <div 
                  id={`share-card-${pr.id || pr.exerciseId}`} 
                  style={{ 
                    display: 'none', 
                    position: 'absolute', 
                    left: -9999,
                  }}
                >
                  <div style={{
                    width: 540,
                    height: 960,
                    padding: '64px 48px',
                    backgroundColor: '#050505',
                    backgroundImage: prImages[pr.id || pr.exerciseId] 
                      ? `linear-gradient(to bottom, rgba(5,5,5,0.2) 0%, rgba(5,5,5,0.8) 100%), url(${prImages[pr.id || pr.exerciseId]})` 
                      : `
                          radial-gradient(circle at 50% 50%, rgba(200, 241, 53, 0.15) 0%, transparent 60%), 
                          linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
                        `,
                    backgroundSize: prImages[pr.id || pr.exerciseId] ? 'cover' : '100% 100%, 32px 32px, 32px 32px',
                    backgroundPosition: prImages[pr.id || pr.exerciseId] ? 'center' : '0 0, -1px -1px, -1px -1px',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontFamily: '"Orbitron", sans-serif',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden',
                    textAlign: 'center'
                  }}>
                    
                    {/* Top spacer for breathing room */}
                    <div style={{ flex: 1 }} />

                    {/* Middle part: PR info */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>


                      <h1 style={{ fontSize: 40, fontWeight: 900, margin: '0 0 24px 0', lineHeight: 1.1, textTransform: 'uppercase', letterSpacing: -1, textShadow: prImages[pr.id || pr.exerciseId] ? '0 4px 12px rgba(0,0,0,0.5)' : 'none' }}>
                        {pr.exerciseName}
                      </h1>
                      
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, justifyContent: 'center' }}>
                        <p style={{ fontSize: 80, fontWeight: 900, margin: 0, lineHeight: 0.9, color: '#C8F135', letterSpacing: -4, textShadow: prImages[pr.id || pr.exerciseId] ? '0 8px 24px rgba(0,0,0,0.8)' : '0 0 60px rgba(200,241,53,0.2)' }}>
                          {pr.weight}
                        </p>
                        <span style={{ fontSize: 32, color: 'white', fontWeight: 800, opacity: 0.9, textShadow: prImages[pr.id || pr.exerciseId] ? '0 4px 12px rgba(0,0,0,0.5)' : 'none' }}>{weightUnit}</span>
                      </div>
                    </div>

                    <div style={{ flex: 1 }} />

                    {/* Bottom part: Branding & Data */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, width: '100%' }}>
                      {/* WorkoutSplit Logo (Text only) */}
                      <div style={{ color: 'white', fontSize: 18, fontWeight: 900, letterSpacing: 2, marginBottom: 32 }}>
                        WORKOUTSPLIT
                      </div>

                      {/* Data Row like Strava */}
                      <div style={{ display: 'flex', justifyContent: 'center', gap: 48, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 24, width: '90%' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
                          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontFamily: 'sans-serif', letterSpacing: 1, textTransform: 'uppercase' }}>Date</span>
                          <span style={{ color: 'white', fontSize: 18, fontWeight: 700, letterSpacing: 1 }}>
                            {new Date(pr.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                        
                        {pr.reps > 0 && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
                            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontFamily: 'sans-serif', letterSpacing: 1, textTransform: 'uppercase' }}>Reps</span>
                            <span style={{ color: 'white', fontSize: 18, fontWeight: 700, letterSpacing: 1 }}>{pr.reps}</span>
                          </div>
                        )}
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
                          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontFamily: 'sans-serif', letterSpacing: 1, textTransform: 'uppercase' }}>Type</span>
                          <span style={{ color: '#C8F135', fontSize: 18, fontWeight: 700, letterSpacing: 1 }}>PR</span>
                        </div>
                      </div>
                    </div>
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
