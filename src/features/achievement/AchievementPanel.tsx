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
    <section className="p-4 bg-blue-600 rounded-lg glass">
      <h2 className="text-xl font-semibold mb-2 text-center">Achievements</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {achievements.map(a => (
          <div
            key={a.id}
            className={`flex justify-between items-center p-3 rounded-lg glass shadow-md ${a.unlocked ? 'border-2 border-amber-500' : 'opacity-50'}
            `}
          >
            <div>
              <span className="font-medium">{a.title}</span>
              <p className="text-gray-400 text-xs">{a.description}</p>
            </div>
            <span className={a.unlocked ? 'text-amber-400' : 'text-gray-500'}>
              {a.unlocked ? 'Unlocked' : 'Locked'}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
