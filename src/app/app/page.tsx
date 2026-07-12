'use client';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';

import ProgressCircle from '@/components/ProgressCircle';
import ExerciseCard from '@/components/ExerciseCard';
import LineChart from '@/components/LineChart';
import { EXERCISES } from '@/lib/exercises';
import { Workout, BodyWeightEntry } from '@/lib/types';
import { useSettings } from '@/components/SettingsContext';

/* ── SVG Icon Components (Filled) ── */
const BellIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2a1 1 0 0 1 1 1v.7A7 7 0 0 1 19 10.5v3.09l1.45 2.9A1 1 0 0 1 19.55 18H4.45a1 1 0 0 1-.9-1.51L5 13.59V10.5A7 7 0 0 1 11 3.7V3a1 1 0 0 1 1-1zM9.17 20a3 3 0 0 0 5.66 0H9.17z" />
  </svg>
);

const FlameIcon = ({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 23c-4.97 0-9-3.58-9-8 0-2.52 1.17-4.7 2.5-6.37A25.16 25.16 0 0 0 8.37 4.9a1 1 0 0 1 1.63.37c.43 1.11 1.13 2.34 2.16 3.3.08-.9.39-1.96 1.12-3.06A10.15 10.15 0 0 1 15.67.79a1 1 0 0 1 1.53.78c.05 1.42.52 3.13 1.55 4.68C20.13 8.3 21 10.53 21 13c0 5.5-4.03 10-9 10z" />
  </svg>
);

const DumbbellIcon = ({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M6.5 2A2.5 2.5 0 0 0 4 4.5V9H3a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h1v4.5A2.5 2.5 0 0 0 6.5 22h1A2.5 2.5 0 0 0 10 19.5V15h4v4.5a2.5 2.5 0 0 0 2.5 2.5h1a2.5 2.5 0 0 0 2.5-2.5V15h1a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-1V4.5A2.5 2.5 0 0 0 17.5 2h-1A2.5 2.5 0 0 0 14 4.5V9h-4V4.5A2.5 2.5 0 0 0 7.5 2h-1z" />
  </svg>
);

const ClockIcon = ({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm.5 11H7v-1.5h4V7h1.5v6z" />
  </svg>
);

const TargetIcon = ({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-1 14.5v-9l7 4.5-7 4.5z" />
  </svg>
);

const LayersIcon = ({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 2L2 7l10 5 10-5L12 2z" />
    <path d="M2 17l10 5 10-5" opacity="0.7" />
    <path d="M2 12l10 5 10-5" opacity="0.85" />
  </svg>
);

const ScaleIcon = ({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/>
    <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/>
    <path d="M7 21h10"/>
    <path d="M12 3v18"/>
    <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>
  </svg>
);

const TrophyFilledIcon = ({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v3c0 2.44 1.72 4.48 4 4.92 1 .58 2.13.92 3.35.98V18H8v2h8v-2h-2.35v-2.1c1.22-.06 2.35-.4 3.35-.98 2.28-.44 4-2.48 4-4.92V7c0-1.1-.9-2-2-2zm-12 5V7h2v3c0 .55-.45 1-1 1s-1-.45-1-1zm11 0c0 .55-.45 1-1 1s-1-.45-1-1V7h2v3z" />
  </svg>
);

/* ── Category Icon helper ── */
function getCategoryIcon(category: string) {
  switch (category) {
    case 'Push':
      return <DumbbellIcon size={20} color="#7a9a0a" />;
    case 'Pull':
      return (
        <svg width={20} height={20} viewBox="0 0 24 24" fill="#c74080">
          <path d="M13.5 5.5C14.6 5.5 15.5 4.6 15.5 3.5S14.6 1.5 13.5 1.5 11.5 2.4 11.5 3.5s.9 2 2 2zM9.89 19.38l1-4.38L13 17v6h2v-7.5l-2.11-2 .61-3A7.06 7.06 0 0 0 19 13v-2a5.06 5.06 0 0 1-4.1-2l-1-1.6a2.06 2.06 0 0 0-1.7-1 1.76 1.76 0 0 0-.7.1L6 9v5h2V10.1l2.1-.8-1.7 8.1L4 16v2l5.89 1.38z" />
        </svg>
      );
    case 'Legs':
      return (
        <svg width={20} height={20} viewBox="0 0 24 24" fill="#0a8aaa">
          <path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3A7.06 7.06 0 0 0 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 9v5h2v-3.8l1.4-.6L7 19h2.9z" />
        </svg>
      );
    case 'Core':
      return (
        <svg width={20} height={20} viewBox="0 0 24 24" fill="#9a50d0">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
        </svg>
      );
    default:
      return <DumbbellIcon size={20} />;
  }
}


export default function HomePage() {
  const router = useRouter();
  const { weightUnit, userName } = useSettings();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSplit, setActiveSplit] = useState<{ name: string; days: { name: string; exerciseIds: string[] }[] } | null>(null);
  const [bodyWeights, setBodyWeights] = useState<BodyWeightEntry[]>([]);
  const [currentWeightInput, setCurrentWeightInput] = useState<string>('');
  const [weightTimeframe, setWeightTimeframe] = useState<'7d' | '30d' | 'all'>('7d');
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredBodyWeights = useMemo(() => {
    if (weightTimeframe === 'all') return bodyWeights;
    const now = Date.now();
    const msInDay = 24 * 60 * 60 * 1000;
    const days = weightTimeframe === '7d' ? 7 : 30;
    return bodyWeights.filter(w => (now - new Date(w.date).getTime()) <= days * msInDay);
  }, [bodyWeights, weightTimeframe]);

  useEffect(() => {
    import('@/lib/storage').then(async ({ migrateFromLocalStorage }) => {
      await migrateFromLocalStorage();
      const { seedSampleData } = await import('@/lib/seed');
      await seedSampleData();
      
      const { getWorkouts, getActiveSplit, getBodyWeights } = await import('@/lib/storage');
      setWorkouts(await getWorkouts());
      setActiveSplit(await getActiveSplit());
      
      const weights = await getBodyWeights();
      setBodyWeights(weights);
      
      // Pre-fill input if there's a weight logged today
      const today = new Date().toISOString().split('T')[0];
      // Search from the end to get the most recently logged weight today
      const todaysWeight = [...weights].reverse().find(w => w.date.startsWith(today));
      if (todaysWeight) {
        setCurrentWeightInput(todaysWeight.weight.toString());
      }
      
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (workouts.length === 0) return;

    const calculateStreak = async () => {
      const getLocalYYYYMMDD = (dateStr: string) => {
        const d = new Date(dateStr);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const workoutDates = new Set<string>();
      workouts.forEach(w => {
        workoutDates.add(getLocalYYYYMMDD(w.startedAt));
      });

      const todayStr = getLocalYYYYMMDD(new Date().toISOString());
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = getLocalYYYYMMDD(yesterday.toISOString());

      let current = 0;
      let checkDate = workoutDates.has(todayStr) ? todayStr : (workoutDates.has(yesterdayStr) ? yesterdayStr : null);

      if (checkDate) {
        current = 1;
        let curr = new Date(checkDate);
        while (true) {
          curr.setDate(curr.getDate() - 1);
          const prevDateStr = getLocalYYYYMMDD(curr.toISOString());
          if (workoutDates.has(prevDateStr)) {
            current++;
          } else {
            break;
          }
        }
      }

      // Longest streak
      const ascDates = Array.from(workoutDates).sort((a, b) => a.localeCompare(b));
      let longest = 0;
      let tempStreak = 0;
      let prevDate: Date | null = null;

      ascDates.forEach(dateStr => {
        const currentDate = new Date(dateStr);
        if (!prevDate) {
          tempStreak = 1;
        } else {
          const prevDayExpected = new Date(currentDate);
          prevDayExpected.setDate(prevDayExpected.getDate() - 1);
          const prevDayExpectedStr = getLocalYYYYMMDD(prevDayExpected.toISOString());
          const prevDateStr = getLocalYYYYMMDD(prevDate.toISOString());

          if (prevDateStr === prevDayExpectedStr) {
            tempStreak++;
          } else {
            tempStreak = 1;
          }
        }
        longest = Math.max(longest, tempStreak);
        prevDate = currentDate;
      });

      setCurrentStreak(current);
      setLongestStreak(longest);

      // Save to Dexie settings
      const { db } = await import('@/lib/dexie');
      await db.settings.put({ key: 'current_streak', value: current });
      await db.settings.put({ key: 'longest_streak', value: longest });

      // Check milestones
      if (current === 3 || current === 7 || current === 30) {
        const lastShown = localStorage.getItem('last_shown_milestone_streak');
        if (lastShown !== current.toString()) {
          let msg = '';
          if (current === 3) msg = 'You are on a roll!';
          else if (current === 7) msg = 'One week strong!';
          else if (current === 30) msg = 'Unstoppable!';

          setToastMessage(msg);
          localStorage.setItem('last_shown_milestone_streak', current.toString());
        }
      }
    };

    calculateStreak();
  }, [workouts]);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleSaveBodyWeight = async () => {
    const weight = parseFloat(currentWeightInput);
    if (isNaN(weight) || weight <= 0) return;
    
    const { saveBodyWeight, getBodyWeights } = await import('@/lib/storage');
    await saveBodyWeight(weight);
    setBodyWeights(await getBodyWeights());
  };

  // Calculate today's stats
  const today = new Date().toDateString();
  const todaysWorkouts = workouts.filter(w => new Date(w.startedAt).toDateString() === today);
  const todaysExercises = todaysWorkouts.reduce((sum, w) => sum + w.exercises.length, 0);
  const totalSetsToday = todaysWorkouts.reduce((sum, w) => 
    sum + w.exercises.reduce((s, ex) => s + ex.sets.filter(set => set.completed).length, 0), 0);
  const completionPercent = todaysWorkouts.length > 0 ? Math.min(Math.round((totalSetsToday / Math.max(todaysWorkouts.reduce((s,w) => s + w.exercises.reduce((a,e) => a + e.sets.length, 0), 0), 1)) * 100), 100) : 0;

  // KPI calculations
  // Duration in minutes from completed workouts
  const totalDuration = todaysWorkouts.reduce((sum, w) => {
    if (w.completedAt) {
      return sum + Math.round((new Date(w.completedAt).getTime() - new Date(w.startedAt).getTime()) / 60000);
    }
    return sum;
  }, 0);

  // Calorie estimate using MET method:
  // Weight training MET ≈ 5.5, assuming ~75kg bodyweight
  // Formula: calories = MET × bodyweight(kg) × duration(hours)
  // Fallback: volume-based estimate when no duration available
  const caloriesBurned = totalDuration > 0
    ? Math.round(5.5 * 75 * (totalDuration / 60))
    : todaysWorkouts.reduce((sum, w) =>
        sum + w.exercises.reduce((s, ex) =>
          s + ex.sets.reduce((setSum, set) =>
            setSum + (set.completed ? Math.round(set.weight * set.reps * 0.05) : 0), 0), 0), 0);

  // Greeting based on time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  // Recent exercises from history for "Today's Exercises" section
  const recentExerciseIds = [...new Set(workouts.flatMap(w => w.exercises.map(e => e.exerciseId)))].slice(0, 5);

  return (
    <div style={{ paddingTop: 16 }}>
      {/* Page Header — Greeting */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="/icon-192.png" alt="WorkoutSplit" width={40} height={40} style={{ borderRadius: 12 }} />
          <div>
            <p className="text-secondary" style={{ marginBottom: 2 }}>{greeting}</p>
            <h1 style={{ fontSize: 22, fontWeight: 700 }}>{userName}</h1>
          </div>
        </div>
        <button 
          style={{ width: 44, height: 44, borderRadius: '50%', border: 'none', background: 'var(--input-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-primary)' }}
          aria-label="Notifications"
        >
          <BellIcon size={20} />
        </button>
      </div>

      {/* Workout Progress Card — Lime accent */}
      <div 
        className="card" 
        style={{ background: 'var(--primary)', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
        onClick={() => router.push('/app/log')}
      >
        <div>
          <p style={{ fontSize: 14, fontWeight: 600, opacity: 0.7, marginBottom: 4 }}>Workout Progress!</p>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Today&apos;s Workout</h2>
          <p style={{ fontSize: 13, fontWeight: 500 }}>
            {todaysExercises > 0 ? `${todaysExercises} exercises completed` : 'No exercises yet — tap to start!'}
          </p>
        </div>
        <ProgressCircle 
          percentage={completionPercent} 
          size={72} 
          strokeWidth={7} 
          color="var(--text-primary)"
          bgColor="rgba(0,0,0,0.1)"
        >
          <span style={{ fontSize: 16, fontWeight: 800 }}>{completionPercent}%</span>
        </ProgressCircle>
      </div>

      {/* ── Body Weight Tracker ── */}
      <div className="card" style={{ marginBottom: 16, padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>Body Weight</h2>
          <select 
            className="text-secondary" 
            style={{ 
              fontSize: 13, 
              fontWeight: 600, 
              background: 'transparent', 
              border: 'none', 
              outline: 'none', 
              cursor: 'pointer',
              appearance: 'none',
              paddingRight: 16,
              backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394a3b8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right center',
              backgroundSize: '10px auto',
              fontFamily: 'inherit'
            }}
            value={weightTimeframe}
            onChange={(e) => setWeightTimeframe(e.target.value as any)}
          >
            <option value="7d" style={{ background: 'var(--card-bg)', color: 'var(--text-primary)' }}>Trend (Last 7d)</option>
            <option value="30d" style={{ background: 'var(--card-bg)', color: 'var(--text-primary)' }}>Trend (Last 30d)</option>
            <option value="all" style={{ background: 'var(--card-bg)', color: 'var(--text-primary)' }}>Trend (All Time)</option>
          </select>
        </div>
        
        {filteredBodyWeights.length > 0 ? (
          <div style={{ marginBottom: 16 }}>
            <LineChart 
              data={filteredBodyWeights.map(w => ({ label: new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), value: w.weight }))} 
              color="#38bdf8" 
              height={80} 
              hideAxes={true}
            />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 16px', textAlign: 'center', marginBottom: 16 }}>
            <div style={{ marginBottom: 12, filter: 'drop-shadow(0 4px 16px rgba(200, 241, 53, 0.4))' }}>
              <ScaleIcon size={48} color="var(--lime)" />
            </div>
            <p className="text-secondary" style={{ fontSize: 14, fontWeight: 500 }}>Log your weight today to start tracking</p>
          </div>
        )}
        
        <div style={{ display: 'flex', gap: 8, width: '100%' }}>
          <input
            type="number"
            step="0.1"
            value={currentWeightInput}
            onChange={(e) => setCurrentWeightInput(e.target.value)}
            placeholder={`Weight (${weightUnit})`}
            style={{
              flex: 1,
              minWidth: 0,
              height: 44,
              background: 'var(--input-bg)',
              border: 'none',
              borderRadius: 12,
              padding: '0 16px',
              fontSize: 16,
              fontWeight: 600,
              color: 'var(--text-primary)',
              outline: 'none',
              fontFamily: 'inherit',
            }}
          />
          <button
            onClick={handleSaveBodyWeight}
            disabled={!currentWeightInput || isNaN(parseFloat(currentWeightInput))}
            style={{
              height: 44,
              background: 'var(--primary)',
              color: '#0F172A',
              border: 'none',
              borderRadius: 12,
              padding: '0 20px',
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              fontFamily: 'inherit',
              opacity: (!currentWeightInput || isNaN(parseFloat(currentWeightInput))) ? 0.5 : 1,
            }}
          >
            Log Weight
          </button>
        </div>
      </div>

      {/* ─── Streak Tracker Card ─── */}
      <div 
        className="card" 
        style={{ 
          background: currentStreak >= 7 ? '#C8F135' : 'white', 
          color: '#0F172A', 
          marginBottom: 16, 
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'all 0.3s ease',
          boxShadow: 'var(--shadow-card)',
          borderRadius: 24, // rounded-3xl
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <FlameIcon size={36} color={currentStreak >= 7 ? '#0F172A' : '#ff8c32'} />
          <div style={{ textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontSize: 24, fontWeight: 900, lineHeight: 1 }}>{currentStreak}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: currentStreak >= 7 ? '#0F172A' : 'var(--text-secondary)' }}>day streak</span>
            </div>
            {currentStreak === 0 && (
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4, fontWeight: 600 }}>
                Start your streak today!
              </p>
            )}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: currentStreak >= 7 ? '#334155' : '#94a3b8' }}>
            Best: {longestStreak} days
          </span>
        </div>
      </div>

      {/* ── Create Split CTA (if no active split) ── */}
      {!loading && !activeSplit && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 16px', textAlign: 'center' }}>
          <div style={{ marginBottom: 16, filter: 'drop-shadow(0 8px 24px rgba(200, 241, 53, 0.5))' }}>
            <DumbbellIcon size={64} color="var(--lime)" />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>No workout yet</h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24 }}>Create your first split to get started</p>
          <button
            onClick={() => router.push('/app/create')}
            style={{
              padding: '16px 32px',
              backgroundColor: 'var(--lime)',
              color: 'var(--text-primary)',
              fontWeight: 700,
              fontSize: 16,
              border: 'none',
              borderRadius: 9999,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(200, 241, 53, 0.4)',
            }}
          >
            Create Split
          </button>
        </div>
      )}

      {/* ── KPI Stats Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
        <div className="card" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,140,50,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <FlameIcon size={20} color="#ff8c32" />
          </div>
          <div>
            <p style={{ fontSize: 18, fontWeight: 800, lineHeight: 1.1 }}>{caloriesBurned}</p>
            <p style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 500 }}>Calories</p>
          </div>
        </div>
        <div className="card" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(200,241,53,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <LayersIcon size={20} color="#7a9a0a" />
          </div>
          <div>
            <p style={{ fontSize: 18, fontWeight: 800, lineHeight: 1.1 }}>{totalSetsToday}</p>
            <p style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 500 }}>Sets</p>
          </div>
        </div>
        <div className="card" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(56,189,248,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ClockIcon size={20} color="#38bdf8" />
          </div>
          <div>
            <p style={{ fontSize: 18, fontWeight: 800, lineHeight: 1.1 }}>{totalDuration > 0 ? `${totalDuration}m` : '-'}</p>
            <p style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 500 }}>Duration</p>
          </div>
        </div>
        <div className="card" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(168,85,247,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <TargetIcon size={20} color="#a855f7" />
          </div>
          <div>
            <p style={{ fontSize: 18, fontWeight: 800, lineHeight: 1.1 }}>{todaysExercises}</p>
            <p style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 500 }}>Exercises</p>
          </div>
        </div>
      </div>

      {/* Today's Exercises Section */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 className="section-heading">
            Today&apos;s Exercises{' '}
            <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)' }}>({todaysExercises})</span>
          </h2>
          <button 
            className="text-secondary" 
            style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}
            onClick={() => router.push('/app/history')}
          >
            See all
          </button>
        </div>
        
        {todaysWorkouts.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '32px 20px' }}>
            <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'center' }}>
              <DumbbellIcon size={36} color="var(--text-secondary)" />
            </div>
            <p style={{ fontWeight: 600, marginBottom: 4 }}>No workouts today yet</p>
            <p className="text-secondary" style={{ marginBottom: 16 }}>Start your first workout to track progress</p>
            <button className="btn-primary" onClick={() => router.push('/app/log')}>Start Workout</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {todaysWorkouts.map((workout, i) => (
              <div key={i} className="card card-hover" onClick={() => router.push('/app/history')} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700 }}>{workout.name}</h3>
                  <span style={{ fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 9999, background: 'rgba(200,241,53,0.2)' }}>
                    {workout.exercises.length} exercises
                  </span>
                </div>
                {workout.exercises.slice(0, 3).map((ex, j) => {
                  const exerciseDef = EXERCISES.find(e => e.id === ex.exerciseId);
                  return (
                    <div
                      key={j}
                      onClick={(e) => { e.stopPropagation(); router.push(`/app/progress?exercise=${ex.exerciseId}`); }}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: j < Math.min(workout.exercises.length, 3) - 1 ? '1px solid #f1f5f9' : 'none', cursor: 'pointer' }}
                    >
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: exerciseDef ? `${exerciseDef.color}20` : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {getCategoryIcon(exerciseDef?.category || 'Push')}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 14, fontWeight: 600 }}>{ex.exerciseName}</p>
                        <p className="text-secondary" style={{ fontSize: 12 }}>{ex.sets.filter(s => s.completed).length}/{ex.sets.length} sets</p>
                      </div>
                      <svg width={16} height={16} viewBox="0 0 24 24" fill="var(--text-secondary)">
                        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z" />
                      </svg>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Featured Workout — Dark card */}
      <div 
        className="card card-hover" 
        style={{ background: 'var(--nav-bg)', color: 'white', marginBottom: 28, cursor: 'pointer', padding: 24 }}
        onClick={() => router.push('/app/log?preset=upper')}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, opacity: 0.7 }}>
              <ClockIcon size={13} color="rgba(255,255,255,0.7)" /> 90min
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, opacity: 0.7 }}>
              <FlameIcon size={13} color="rgba(255,255,255,0.7)" /> 1,200kcal
            </span>
          </div>
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Upper Body Workout</h2>
        <p style={{ fontSize: 13, opacity: 0.6 }}>Bench Press, Overhead Press, Rows &amp; more</p>
      </div>

      {/* Popular Exercises — Horizontal scroll */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 className="section-heading">Popular Exercises</h2>
          <button 
            className="text-secondary" 
            style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}
            onClick={() => router.push('/app/log')}
          >
            See all
          </button>
        </div>
        <div className="scroll-row">
          {EXERCISES.slice(0, 6).map(ex => {
            // Count real workout data for this exercise
            const exerciseWorkouts = workouts.filter(w =>
              w.exercises.some(e => e.exerciseId === ex.id)
            );
            const totalMin = exerciseWorkouts.reduce((sum, w) => {
              if (w.durationMinutes) return sum + w.durationMinutes;
              return sum;
            }, 0);

            return (
              <ExerciseCard
                key={ex.id}
                icon={getCategoryIcon(ex.category)}
                name={ex.name}
                workoutCount={exerciseWorkouts.length}
                duration={totalMin}
                color={ex.color}
                onClick={() => router.push(`/app/log?add=${ex.id}`)}
              />
            );
          })}
        </div>
      </div>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: 80,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#0F172A',
            color: 'white',
            padding: '12px 24px',
            borderRadius: 9999,
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
            zIndex: 9999,
            fontWeight: 700,
            fontSize: 14,
            whiteSpace: 'nowrap',
            animation: 'slideUp 0.3s ease-out',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          {currentStreak === 3 && <FlameIcon size={18} color="#ff8c32" />}
          {currentStreak === 7 && <DumbbellIcon size={18} color="#C8F135" />}
          {currentStreak === 30 && <TrophyFilledIcon size={18} color="#fbbf24" />}
          <span>{toastMessage}</span>
          <style>{`
            @keyframes slideUp {
              from { transform: translate(-50%, 20px); opacity: 0; }
              to { transform: translate(-50%, 0); opacity: 1; }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
