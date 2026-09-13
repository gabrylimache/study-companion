// src/features/pomodoro/pomodoroStore.ts
import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { localStorageUtil } from '../../lib/localStorage';

export type PomodoroPhase = 'idle' | 'work' | 'shortBreak' | 'longBreak';

export interface PomodoroState {
  phase: PomodoroPhase;
  workDuration: number; // seconds
  shortBreakDuration: number; // seconds
  longBreakDuration: number; // seconds
  remaining: number; // seconds
  cyclesCompleted: number;
  isPaused: boolean;
  debugMode: boolean;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  setDurations: (work: number, shortBreak: number, longBreak: number) => void;
  toggleDebug: () => void;
}

const STORAGE_KEY = 'pomodoroState';

export const usePomodoroStore = create<PomodoroState>()(
  devtools(set => {
    // Load persisted state or defaults
    const persisted = localStorageUtil.load<PomodoroState>(STORAGE_KEY, null as any);
    const defaults = {
      phase: 'idle' as PomodoroPhase,
      workDuration: 25 * 60,
      shortBreakDuration: 5 * 60,
      longBreakDuration: 15 * 60,
      remaining: 0,
      cyclesCompleted: 0,
      isPaused: false,
      debugMode: false,
    };
    const initial = persisted ? { ...defaults, ...persisted } : defaults;

    let intervalId: ReturnType<typeof setInterval> | null = null;

    const tick = () => {
      set(state => {
        if (state.remaining <= 1) {
          // Phase transition
          let nextPhase: PomodoroPhase = 'idle';
          let nextRemaining = 0;
          let cycles = state.cyclesCompleted;
          if (state.phase === 'work') {
            cycles += 1;
            if (cycles % 4 === 0) {
              nextPhase = 'longBreak';
              nextRemaining = state.longBreakDuration;
            } else {
              nextPhase = 'shortBreak';
              nextRemaining = state.shortBreakDuration;
            }
          } else if (state.phase === 'shortBreak' || state.phase === 'longBreak') {
            nextPhase = 'work';
            nextRemaining = state.workDuration;
          }
          const newState = {
            phase: nextPhase,
            remaining: nextRemaining,
            cyclesCompleted: cycles,
            isPaused: false,
          };
          localStorageUtil.save(STORAGE_KEY, { ...state, ...newState });
          return { ...state, ...newState };
        }
        const newRemaining = state.remaining - 1;
        const newState = { remaining: newRemaining };
        localStorageUtil.save(STORAGE_KEY, { ...state, ...newState });
        return { ...state, ...newState };
      });
    };

    return {
      ...initial,
      start: () => {
        set(state => {
          const phase = state.phase === 'idle' ? 'work' : state.phase;
          const remaining = state.remaining > 0 ? state.remaining : state.workDuration;
          if (!intervalId) intervalId = setInterval(tick, 1000);
          const newState = { phase, remaining, isPaused: false };
          localStorageUtil.save(STORAGE_KEY, { ...state, ...newState });
          return { ...state, ...newState };
        });
      },
      pause: () => {
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
        set(state => ({ ...state, isPaused: true }));
      },
      resume: () => {
        set(state => {
          if (!intervalId) intervalId = setInterval(tick, 1000);
          const newState = { isPaused: false };
          localStorageUtil.save(STORAGE_KEY, { ...state, ...newState });
          return { ...state, ...newState };
        });
      },
      reset: () => {
        if (intervalId) clearInterval(intervalId);
        intervalId = null;
        const resetState = {
          phase: 'idle',
          remaining: 0,
          cyclesCompleted: 0,
          isPaused: false,
        } as Partial<PomodoroState>;
        set(state => ({ ...state, ...resetState }));
        localStorageUtil.save(STORAGE_KEY, { ...initial, ...resetState });
      },
      setDurations: (work, shortBreak, longBreak) => {
        set(state => {
          const newState = {
            ...state,
            workDuration: work,
            shortBreakDuration: shortBreak,
            longBreakDuration: longBreak,
          };
          localStorageUtil.save(STORAGE_KEY, newState);
          return newState;
        });
      },
      toggleDebug: () => {
        set(state => {
          const newDebug = !state.debugMode;
          const devDurations = { workDuration: 10, shortBreakDuration: 5, longBreakDuration: 10 };
          const prodDurations = { workDuration: 25 * 60, shortBreakDuration: 5 * 60, longBreakDuration: 15 * 60 };
          const durations = newDebug ? devDurations : prodDurations;
          const newState = {
            debugMode: newDebug,
            ...durations,
          };
          localStorageUtil.save(STORAGE_KEY, { ...state, ...newState });
          return { ...state, ...newState };
        });
      },
    };
  })
);
