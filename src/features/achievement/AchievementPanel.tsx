// src/features/achievement/AchievementPanel.tsx
import React, { useEffect } from 'react';
import { useAchievementStore } from './achievementStore';
import { useStatsStore } from '../stats/statsStore';

export default function AchievementPanel() {
  const { achievements, evaluate } = useAchievementStore();
  const stats = useStatsStore();

  // Re‑evaluate whenever stats change
  useEffect(() => {
    evaluate();
  }, [stats.totalPomodoros, stats.totalFocusedMinutes, stats.totalBreakMinutes]);

  return (
    <section className="p-4 bg-gray-800 rounded-lg glass">
      <h2 className="text-xl font-semibold mb-2 text-center">Achievements</h2>
      <ul className="list-none space-y-2 text-sm">
        {achievements.map(a => (
          <li key={a.id} className="flex justify-between items-center">
            <div>
              <span className="font-medium">{a.title}</span>
              <p className="text-gray-400 text-xs">{a.description}</p>
            </div>
            <span className={a.unlocked ? 'text-green-400' : 'text-gray-500'}>
              {a.unlocked ? 'Unlocked' : 'Locked'}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
