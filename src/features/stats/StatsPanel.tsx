// src/features/stats/StatsPanel.tsx
import React from 'react';
import { useStatsStore } from './statsStore';
import { usePomodoroStore } from '../pomodoro/pomodoroStore';


export default function StatsPanel() {
  const {
    totalPomodoros,
    totalFocusedMinutes,
    totalBreakMinutes,
    longestStreak,
  } = useStatsStore();
  const { cyclesCompleted } = usePomodoroStore();

  return (
    <section className="p-6 bg-[#2A313A] rounded-xl shadow-2xl glass border border-[#3A434E]">
      <h2 className="text-2xl font-bold mb-4 text-center text-[#E8EAF0]">Study Statistics</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div className="bg-[#2A313A] border border-[#3A434E] rounded-xl p-6 shadow-lg flex flex-col items-center">
          <span role="img" aria-label="completed" className="text-3xl mb-2">✅</span>
          <div className="text-sm text-[#AEB7C4] uppercase mb-1">Completed Pomodoros</div>
          <div className="text-4xl font-bold text-[#7FA88F]">{totalPomodoros}</div>
        </div>
        <div className="bg-[#2A313A] border border-[#3A434E] rounded-xl p-6 shadow-lg flex flex-col items-center">
          <span role="img" aria-label="focus" className="text-3xl mb-2">🔥</span>
          <div className="text-sm text-[#AEB7C4] uppercase mb-1">Focus Minutes</div>
          <div className="text-4xl font-bold text-[#D28C8C]">{totalFocusedMinutes}</div>
        </div>
        <div className="bg-[#2A313A] border border-[#3A434E] rounded-xl p-6 shadow-lg flex flex-col items-center">
          <span role="img" aria-label="break" className="text-3xl mb-2">⏰</span>
          <div className="text-sm text-[#AEB7C4] uppercase mb-1">Break Minutes</div>
          <div className="text-4xl font-bold text-[#7DA6C6]">{totalBreakMinutes}</div>
        </div>
        <div className="bg-[#2A313A] border border-[#3A434E] rounded-xl p-6 shadow-lg flex flex-col items-center">
          <span role="img" aria-label="streak" className="text-3xl mb-2">📈</span>
          <div className="text-sm text-[#AEB7C4] uppercase mb-1">Current Streak</div>
          <div className="text-4xl font-bold text-[#7FA88F]">{cyclesCompleted}</div>
        </div>
        <div className="bg-[#2A313A] border border-[#3A434E] rounded-xl p-6 shadow-lg flex flex-col items-center">
          <span role="img" aria-label="longest" className="text-3xl mb-2">🏅</span>
          <div className="text-sm text-[#AEB7C4] uppercase mb-1">Longest Streak</div>
          <div className="text-4xl font-bold text-[#7FA88F]">{longestStreak}</div>
        </div>
      </div>
    </section>
  );
}
