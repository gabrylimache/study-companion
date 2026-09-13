// src/features/pomodoro/PomodoroPanel.tsx
import React, { useEffect } from 'react';
import { usePomodoroStore } from './pomodoroStore';
import { useStatsStore } from '../stats/statsStore';
import { useAvatarStore } from '../avatar/avatarStore';

export default function PomodoroPanel() {
  const {
    phase,
    remaining,
    workDuration,
    shortBreakDuration,
    longBreakDuration,
    cyclesCompleted,
    isPaused,
    start,
    pause,
    resume,
    reset,
    setDurations,
  } = usePomodoroStore();

  // Update avatar based on phase (handled by bridge; keep here for UI only)
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Track previous phase to detect completions
  const [prevPhase, setPrevPhase] = React.useState<'idle' | 'work' | 'shortBreak' | 'longBreak'>('idle');
  const stats = useStatsStore();
  const avatar = useAvatarStore();

  React.useEffect(() => {
    if (prevPhase === 'work' && (phase === 'shortBreak' || phase === 'longBreak')) {
      // Work session completed
      stats.incrPomodoros();
      stats.addFocusedMinutes(workDuration / 60);
      const breakMins = phase === 'shortBreak' ? shortBreakDuration / 60 : longBreakDuration / 60;
      stats.addBreakMinutes(breakMins);
      // Show proud animation briefly
      avatar.setTarget({ kind: 'animation', key: 'proud' });
      setTimeout(() => {
        avatar.setTarget({ kind: 'animation', key: 'happy' });
      }, 2000);
    }
    setPrevPhase(phase);
  }, [phase]);

  // Simple UI – placed beside webcam per user request
  return (
    <div className="flex flex-col gap-2 p-4 bg-gray-800 rounded-lg glass">
      <h2 className="text-xl font-semibold text-center">Pomodoro Timer</h2>
      <div className="text-center text-sm font-medium capitalize">
        {phase === 'idle' ? '' : phase === 'work' ? 'Focus Session' : phase === 'shortBreak' ? 'Short Break' : phase === 'longBreak' ? 'Long Break' : ''}
      </div>
      <div className="text-3xl font-mono text-center">
        {phase !== 'idle' ? formatTime(remaining) : '--:--'}
      </div>
      <div className="flex justify-center gap-2">
        {/* Start button – only when idle */}
        {phase === 'idle' && (
          <button
            className="px-4 py-2 bg-green-600 rounded hover:bg-green-500 transition"
            onClick={start}
          >
            Start
          </button>
        )}
        {/* Pause button – when running (not idle and not paused) */}
        {phase !== 'idle' && !isPaused && (
          <button
            className="px-4 py-2 bg-yellow-600 rounded hover:bg-yellow-500 transition"
            onClick={pause}
          >
            Pause
          </button>
        )}
        {/* Resume button – when paused */}
        {phase !== 'idle' && isPaused && (
          <button
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-5 transition"
            onClick={resume}
          >
            Resume
          </button>
        )}
        <button
          className="px-4 py-2 bg-red-600 rounded hover:bg-red-500 transition"
          onClick={reset}
        >
          Reset
        </button>
      </div>
      <div className="text-sm text-center mt-2">
        Cycles completed: {cyclesCompleted}
      </div>
      {/* Optional configurable durations – hidden unless needed */}
      {/*
      <div className="mt-2">
        <label className="block">Work (min)</label>
        <input
          type="number"
          value={workDuration / 60}
          onChange={e => setDurations(Number(e.target.value) * 60, shortBreakDuration, longBreakDuration)}
          className="w-16 p-1 rounded bg-gray-700 text-center"
        />
      </div>
      */}
    </div>
  );
}
