// src/features/stats/StatsPanel.tsx
import React from 'react';
import { useStatsStore } from './statsStore';

export default function StatsPanel() {
  const {
    totalPomodoros,
    totalFocusedMinutes,
    totalBreakMinutes,
    longestStreak,
  } = useStatsStore();

  return (
    <section className="p-4 bg-gray-800 rounded-lg glass">
      <h2 className="text-xl font-semibold mb-2 text-center">Study Statistics</h2>
      <ul className="list-none space-y-1 text-sm">
        <li>Completed Pomodoros: {totalPomodoros}</li>
        <li>Total Focus Minutes: {totalFocusedMinutes}</li>
        <li>Total Break Minutes: {totalBreakMinutes}</li>
        <li>Current Streak: {/* placeholder, can be derived from stats later */}0</li>
        <li>Longest Streak: {longestStreak}</li>
      </ul>
    </section>
  );
}
