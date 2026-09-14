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
    <section className="p-4 bg-white rounded-lg glass">
      <h2 className="text-xl font-semibold text-center">Pomodoro Timer</h2>
      <div className={`text-center text-sm font-medium capitalize ${phase === 'work' ? 'text-[#D98880]' : phase === 'shortBreak' ? 'text-[#8AA8C8]' : phase === 'longBreak' ? 'text-[#A894C8]' : ''}`}>
        {phase === 'idle' ? '' : phase === 'work' ? 'Focus Session' : phase === 'shortBreak' ? 'Short Break' : phase === 'longBreak' ? 'Long Break' : ''}
      </div>
      <div className="text-5xl font-mono text-center text-teal-400">
        {phase !== 'idle' ? formatTime(remaining) : '--:--'}
      </div>
      <div className="flex justify-center gap-2 mt-2">
        {phase === 'idle' && (
          <button className="px-4 py-2 bg-teal-600 hover:bg-teal-500 rounded transition" onClick={start}>Start</button>
        )}
        {phase !== 'idle' && !isPaused && (
          <button className="px-4 py-2 bg-teal-600 hover:bg-teal-500 rounded transition" onClick={pause}>Pause</button>
        )}
        {phase !== 'idle' && isPaused && (
          <button className="px-4 py-2 bg-teal-600 hover:bg-teal-500 rounded transition" onClick={resume}>Resume</button>
        )}
        <button className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded transition" onClick={reset}>Reset</button>
      </div>
      <div className="text-sm text-center mt-2">
        Cycles completed: {cyclesCompleted}
      </div>
    </section>
  );
}
