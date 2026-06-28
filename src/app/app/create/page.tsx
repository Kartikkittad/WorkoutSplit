'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { EXERCISES, CATEGORIES } from '@/lib/exercises';
import type { SplitDay } from '@/lib/types';

/* ── Filled SVG Icons ── */
const BackIcon = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
  </svg>
);

const PlusIcon = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
  </svg>
);

const CloseIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
  </svg>
);

const CheckIcon = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
  </svg>
);

const DAY_PRESETS = ['Push', 'Pull', 'Legs', 'Upper', 'Lower', 'Full Body', 'Arms', 'Back', 'Chest', 'Shoulders'];

export default function CreateSplitPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [splitName, setSplitName] = useState('');
  const [days, setDays] = useState<SplitDay[]>([]);
  const [editingDayIndex, setEditingDayIndex] = useState<number | null>(null);
  const [exerciseFilter, setExerciseFilter] = useState('All');
  const [saving, setSaving] = useState(false);

  // Step 2: Add a day
  const addDay = useCallback((name: string) => {
    setDays(prev => [...prev, { name, exerciseIds: [] }]);
  }, []);

  const removeDay = useCallback((index: number) => {
    setDays(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Step 3: Toggle exercise for a day
  const toggleExercise = useCallback((exerciseId: string) => {
    if (editingDayIndex === null) return;
    setDays(prev => prev.map((day, i) => {
      if (i !== editingDayIndex) return day;
      const has = day.exerciseIds.includes(exerciseId);
      return {
        ...day,
        exerciseIds: has
          ? day.exerciseIds.filter(id => id !== exerciseId)
          : [...day.exerciseIds, exerciseId],
      };
    }));
  }, [editingDayIndex]);

  // Save split
  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const { saveSplit, setActiveSplit } = await import('@/lib/storage');
      const split = saveSplit({
        id: '',
        name: splitName,
        days,
        createdAt: new Date().toISOString(),
      });
      setActiveSplit(split.id);
      router.push('/app');
    } catch {
      setSaving(false);
    }
  };

  const canProceed = step === 1 ? splitName.trim().length > 0
    : step === 2 ? days.length > 0
    : days.every(d => d.exerciseIds.length > 0);

  const filteredExercises = exerciseFilter === 'All'
    ? EXERCISES
    : EXERCISES.filter(e => e.category === exerciseFilter);

  return (
    <div style={{ paddingTop: 16, paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <button
          onClick={() => {
            if (step === 1) router.back();
            else if (step === 3 && editingDayIndex !== null) setEditingDayIndex(null);
            else setStep(prev => (prev - 1) as 1 | 2 | 3);
          }}
          style={{
            width: 40, height: 40, borderRadius: '50%', border: 'none',
            background: 'var(--input-bg)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer', color: 'var(--text-primary)',
          }}
        >
          <BackIcon />
        </button>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 20, fontWeight: 700 }}>Create Your Split</h1>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Step {step} of 3</p>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 4, borderRadius: 2, background: 'var(--input-bg)', marginBottom: 28 }}>
        <div style={{
          height: '100%', borderRadius: 2, background: 'var(--primary)',
          width: `${(step / 3) * 100}%`, transition: 'width 0.3s ease',
        }} />
      </div>

      {/* ── STEP 1: Name ── */}
      {step === 1 && (
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Name your split</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>
            Give your workout routine a name you will remember.
          </p>
          <input
            type="text"
            value={splitName}
            onChange={e => setSplitName(e.target.value)}
            placeholder="e.g., Push Pull Legs"
            maxLength={40}
            style={{
              width: '100%', padding: '14px 16px', borderRadius: 14,
              border: '2px solid var(--border-light)', background: 'var(--input-bg)',
              fontSize: 16, fontWeight: 600, fontFamily: 'inherit',
              outline: 'none', transition: 'border-color 0.15s ease',
            }}
            onFocus={e => e.target.style.borderColor = '#C8F135'}
            onBlur={e => e.target.style.borderColor = 'var(--border-light)'}
            autoFocus
          />
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 16 }}>
            {['Push Pull Legs', 'Upper Lower', 'Full Body', 'Bro Split'].map(preset => (
              <button
                key={preset}
                onClick={() => setSplitName(preset)}
                style={{
                  padding: '8px 16px', borderRadius: 9999, border: '1px solid var(--border-light)',
                  background: splitName === preset ? 'var(--primary)' : 'white',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── STEP 2: Days ── */}
      {step === 2 && (
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Add your days</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>
            Choose which workout days are in your split.
          </p>

          {/* Added days */}
          {days.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {days.map((day, i) => (
                <div key={i} className="card" style={{
                  padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 700 }}>Day {i + 1}: {day.name}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      {day.exerciseIds.length} exercises selected
                    </p>
                  </div>
                  <button
                    onClick={() => removeDay(i)}
                    style={{
                      width: 32, height: 32, borderRadius: '50%', border: 'none',
                      background: 'rgba(239,68,68,0.08)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                      color: '#ef4444',
                    }}
                  >
                    <CloseIcon />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Day preset buttons */}
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Tap to add
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {DAY_PRESETS.map(preset => (
              <button
                key={preset}
                onClick={() => addDay(preset)}
                style={{
                  padding: '10px 18px', borderRadius: 14, border: '1px solid var(--border-light)',
                  background: 'white', fontSize: 14, fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                <PlusIcon /> {preset}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── STEP 3: Exercises ── */}
      {step === 3 && editingDayIndex === null && (
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Pick exercises</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>
            Tap a day to add exercises from the library.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {days.map((day, i) => (
              <button
                key={i}
                onClick={() => setEditingDayIndex(i)}
                className="card card-hover"
                style={{
                  padding: '16px', display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', cursor: 'pointer', border: 'none',
                  fontFamily: 'inherit', textAlign: 'left', width: '100%',
                  background: day.exerciseIds.length > 0 ? 'rgba(200,241,53,0.08)' : 'white',
                }}
              >
                <div>
                  <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>{day.name}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                    {day.exerciseIds.length > 0
                      ? `${day.exerciseIds.length} exercises`
                      : 'No exercises yet — tap to add'}
                  </p>
                </div>
                {day.exerciseIds.length > 0 ? (
                  <svg width={20} height={20} viewBox="0 0 24 24" fill="#7a9a0a">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                ) : (
                  <svg width={18} height={18} viewBox="0 0 24 24" fill="var(--text-secondary)">
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── STEP 3: Exercise picker for a day ── */}
      {step === 3 && editingDayIndex !== null && (
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
            {days[editingDayIndex].name} — Select Exercises
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 16 }}>
            {days[editingDayIndex].exerciseIds.length} selected
          </p>

          {/* Category filter */}
          <div className="scroll-row" style={{ marginBottom: 16, gap: 6 }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setExerciseFilter(cat)}
                style={{
                  padding: '8px 16px', borderRadius: 9999, flexShrink: 0,
                  border: exerciseFilter === cat ? 'none' : '1px solid var(--border-light)',
                  background: exerciseFilter === cat ? 'var(--primary)' : 'white',
                  fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Exercise list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filteredExercises.map(ex => {
              const isSelected = days[editingDayIndex].exerciseIds.includes(ex.id);
              return (
                <button
                  key={ex.id}
                  onClick={() => toggleExercise(ex.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                    borderRadius: 14, border: isSelected ? '2px solid #C8F135' : '1px solid var(--border-light)',
                    background: isSelected ? 'rgba(200,241,53,0.08)' : 'white',
                    cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', width: '100%',
                  }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: `${ex.color}25`, display: 'flex',
                    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <svg width={18} height={18} viewBox="0 0 24 24" fill={ex.color}>
                      <path d="M6.5 2A2.5 2.5 0 0 0 4 4.5V9H3a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h1v4.5A2.5 2.5 0 0 0 6.5 22h1A2.5 2.5 0 0 0 10 19.5V15h4v4.5a2.5 2.5 0 0 0 2.5 2.5h1a2.5 2.5 0 0 0 2.5-2.5V15h1a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-1V4.5A2.5 2.5 0 0 0 17.5 2h-1A2.5 2.5 0 0 0 14 4.5V9h-4V4.5A2.5 2.5 0 0 0 7.5 2h-1z" />
                    </svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 600 }}>{ex.name}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                      {ex.category} · {ex.defaultSets}×{ex.defaultReps}
                    </p>
                  </div>
                  {isSelected && (
                    <svg width={22} height={22} viewBox="0 0 24 24" fill="#7a9a0a">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setEditingDayIndex(null)}
            className="btn-primary"
            style={{ width: '100%', marginTop: 20 }}
          >
            Done — {days[editingDayIndex].exerciseIds.length} exercises
          </button>
        </div>
      )}

      {/* ── Bottom action button ── */}
      {!(step === 3 && editingDayIndex !== null) && (
        <div style={{
          position: 'fixed', bottom: 80, left: 0, right: 0,
          padding: '16px 20px', maxWidth: 390, margin: '0 auto',
        }}>
          <button
            className="btn-primary"
            disabled={!canProceed}
            onClick={() => {
              if (step === 3) handleSave();
              else setStep(prev => (prev + 1) as 1 | 2 | 3);
            }}
            style={{
              width: '100%', opacity: canProceed ? 1 : 0.5,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            {step === 3 ? (
              <>{saving ? 'Saving...' : <><CheckIcon /> Save Split</>}</>
            ) : (
              'Continue'
            )}
          </button>
        </div>
      )}
    </div>
  );
}
