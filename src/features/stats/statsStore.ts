// src/features/stats/statsStore.ts
import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { localStorageUtil } from '../../lib/localStorage';

export interface StatsState {
  totalPomodoros: number;
  totalFocusedMinutes: number;
  totalBreakMinutes: number;
  longestStreak: number;
  // Increment helpers
  incrPomodoros: () => void;
  addFocusedMinutes: (mins: number) => void;
  addBreakMinutes: (mins: number) => void;
  reset: () => void;
}

const STORAGE_KEY = 'statsState';

export const useStatsStore = create<StatsState>()(
  devtools(set => {
    const persisted = localStorageUtil.load<StatsState>(STORAGE_KEY, null as any);
    const defaults = {
      totalPomodoros: 0,
      totalFocusedMinutes: 0,
      totalBreakMinutes: 0,
      longestStreak: 0,
    };
    const initial = persisted ? { ...defaults, ...persisted } : defaults;

    const save = (state: Partial<StatsState>) => {
      localStorageUtil.save(STORAGE_KEY, { ...initial, ...state });
    };

    return {
      ...initial,
      incrPomodoros: () => set(state => {
        const newState = { totalPomodoros: state.totalPomodoros + 1 };
        save(newState);
        return newState;
      }),
      addFocusedMinutes: (mins: number) => set(state => {
        const newState = { totalFocusedMinutes: state.totalFocusedMinutes + mins };
        save(newState);
        return newState;
      }),
      addBreakMinutes: (mins: number) => set(state => {
        const newState = { totalBreakMinutes: state.totalBreakMinutes + mins };
        save(newState);
        return newState;
      }),
      reset: () => set(state => {
        const resetState = {
          totalPomodoros: 0,
          totalFocusedMinutes: 0,
          totalBreakMinutes: 0,
          longestStreak: 0,
        };
        localStorageUtil.save(STORAGE_KEY, resetState);
        return resetState;
      }),
    };
  })
);
