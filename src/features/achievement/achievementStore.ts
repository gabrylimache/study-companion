// src/features/achievement/achievementStore.ts
import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { localStorageUtil } from '../../lib/localStorage';
import { useStatsStore } from '../stats/statsStore';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  // criteria receives current stats and returns boolean
  criteria: (stats: ReturnType<typeof useStatsStore.getState>) => boolean;
}

const STORAGE_KEY = 'achievementState';

export const useAchievementStore = create<{ achievements: Achievement[]; evaluate: () => void }>()(
  devtools(set => {
    const persisted: Partial<Record<string, boolean>> = localStorageUtil.load<Record<string, boolean>>(STORAGE_KEY, {});

    const base: Omit<Achievement, 'unlocked'>[] = [
      {
        id: 'fourPomodoros',
        title: 'Four‑Pomodoro Master',
        description: 'Complete 4 pomodoro sessions',
        criteria: stats => stats.totalPomodoros >= 4,
      },
      {
        id: 'oneHour',
        title: 'One‑Hour Scholar',
        description: 'Study for a total of 60 minutes',
        criteria: stats => stats.totalFocusedMinutes >= 60,
      },
      {
        id: 'threeDayStreak',
        title: 'Three‑Day Streak',
        description: 'Study on three consecutive days',
        // For simplicity we approximate using totalPomodoros >= 3 (real streak logic could be added later)
        criteria: stats => stats.totalPomodoros >= 3,
      },
    ];

    const initAchievements = base.map(a => ({
      ...a,
      unlocked: persisted[a.id] ?? false,
    }));

    const evaluate = () => {
      // Defensive: handle case where state may not yet have achievements (e.g., during initial evaluation)
      set(state => {
        const stats = useStatsStore.getState();
        const current = state?.achievements ?? initAchievements;
        const updated = current.map(a => {
          if (!a.unlocked && a.criteria(stats)) {
            // unlock and persist
            const newPersist = { ...persisted, [a.id]: true };
            localStorageUtil.save(STORAGE_KEY, newPersist);
            return { ...a, unlocked: true };
          }
          return a;
        });
        return { achievements: updated };
      });
    };

    // Run evaluation initially to sync with any existing stats
    evaluate();

    return { achievements: initAchievements, evaluate };
  })
);
