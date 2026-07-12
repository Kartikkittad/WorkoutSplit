'use client';

import { useState } from 'react';
import { useSettings } from '@/components/SettingsContext';
import { db } from '@/lib/dexie';

export default function SettingsPage() {
  const { userName, weightUnit, restTimerDuration, updateSettings } = useSettings();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleExportCSV = async () => {
    try {
      const workouts = await db.workouts.toArray();
      let csv = 'Date,Workout Name,Exercise,Set,Weight,Reps\n';
      
      workouts.forEach(w => {
        const date = new Date(w.startedAt).toISOString().split('T')[0];
        w.exercises.forEach(ex => {
          ex.sets.forEach(set => {
            if (set.completed) {
              csv += `${date},"${w.name}","${ex.exerciseName}",${set.setNumber},${set.weight},${set.reps}\n`;
            }
          });
        });
      });

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `WorkoutSplit_History_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export CSV', err);
      alert('Failed to export CSV');
    }
  };

  const handleResetData = async () => {
    setResetting(true);
    try {
      await db.delete();
      localStorage.clear();
      window.location.href = '/';
    } catch (err) {
      console.error('Failed to reset data', err);
      alert('Failed to reset data');
      setResetting(false);
    }
  };

  return (
    <div style={{ padding: '24px 16px 96px' }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Settings</h1>
      
      {/* Profile Section */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: 'var(--text-secondary)' }}>Profile</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label style={{ fontSize: 14, fontWeight: 600 }}>Your Name</label>
          <input 
            type="text" 
            value={userName} 
            onChange={e => updateSettings({ userName: e.target.value })}
            className="input-field"
            placeholder="Athlete"
          />
        </div>
      </div>

      {/* App Section */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: 'var(--text-secondary)' }}>App Preferences</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Weight Unit */}
          <div>
            <label style={{ fontSize: 14, fontWeight: 600, display: 'block', marginBottom: 8 }}>Weight Unit</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {['kg', 'lbs'].map(unit => (
                <button
                  key={unit}
                  onClick={() => updateSettings({ weightUnit: unit as 'kg' | 'lbs' })}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: 12,
                    border: '1px solid',
                    borderColor: weightUnit === unit ? 'var(--lime)' : 'var(--border)',
                    backgroundColor: weightUnit === unit ? 'rgba(200, 241, 53, 0.1)' : 'transparent',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    fontFamily: 'inherit',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {unit}
                </button>
              ))}
            </div>
          </div>

          {/* Rest Timer Duration */}
          <div>
            <label style={{ fontSize: 14, fontWeight: 600, display: 'block', marginBottom: 8 }}>Default Rest Timer</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[30, 60, 90, 120].map(duration => (
                <button
                  key={duration}
                  onClick={() => updateSettings({ restTimerDuration: duration })}
                  style={{
                    flex: 1,
                    minWidth: '20%',
                    padding: '10px',
                    borderRadius: 12,
                    border: '1px solid',
                    borderColor: restTimerDuration === duration ? 'var(--lime)' : 'var(--border)',
                    backgroundColor: restTimerDuration === duration ? 'rgba(200, 241, 53, 0.1)' : 'transparent',
                    fontWeight: 600,
                    fontFamily: 'inherit',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {duration}s
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Data Section */}
      <div className="card">
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: 'var(--text-secondary)' }}>Data Management</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button 
            onClick={handleExportCSV}
            style={{
              padding: '12px',
              borderRadius: 12,
              border: '1px solid var(--border)',
              backgroundColor: 'transparent',
              fontWeight: 600,
              fontFamily: 'inherit',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export Workout History (CSV)
          </button>

          {showResetConfirm ? (
            <div style={{ padding: 12, borderRadius: 12, border: '1px solid #fee2e2', backgroundColor: '#fef2f2', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <p style={{ color: '#991b1b', fontSize: 14, fontWeight: 500, margin: 0, textAlign: 'center' }}>
                This will delete all your workouts, splits and progress. Are you sure?
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  style={{
                    flex: 1, padding: '10px', borderRadius: 8, border: 'none', backgroundColor: '#e2e8f0', color: '#475569', fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer'
                  }}
                  disabled={resetting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleResetData}
                  style={{
                    flex: 1, padding: '10px', borderRadius: 8, border: 'none', backgroundColor: '#ef4444', color: 'white', fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer'
                  }}
                  disabled={resetting}
                >
                  {resetting ? 'Resetting...' : 'Yes, Delete All'}
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setShowResetConfirm(true)}
              style={{
                padding: '12px',
                borderRadius: 12,
                border: '1px solid #fee2e2',
                color: '#ef4444',
                backgroundColor: 'transparent',
                fontWeight: 600,
                fontFamily: 'inherit',
                cursor: 'pointer',
              }}
            >
              Reset All Data
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
