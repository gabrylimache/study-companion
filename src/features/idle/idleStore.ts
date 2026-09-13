import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { useAvatarStore } from '../avatar/avatarStore';

type IdleState = {
  active: boolean;
  currentIdle: 'idle' | 'sleeping' | 'drowsy';
  start: () => void;
  stop: () => void;
};

const IDLE_ANIMS: Array<IdleState['currentIdle']> = ['idle', 'sleeping', 'drowsy'];

export const useIdleStore = create<IdleState>()(
  devtools(set => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    const schedule = () => {
      const duration = 15000 + Math.random() * 30000; // 15‑45 s
      timer = setTimeout(() => {
        const next = IDLE_ANIMS[Math.floor(Math.random() * IDLE_ANIMS.length)];
        useAvatarStore.getState().setTarget({ kind: 'animation', key: next });
        set({ currentIdle: next });
        schedule();
      }, duration);
    };
    return {
      active: false,
      currentIdle: 'idle',
      start: () => {
        if (!timer) {
          set({ active: true });
          schedule();
        }
      },
      stop: () => {
        if (timer) clearTimeout(timer);
        timer = null;
        set({ active: false });
      },
    };
  })
);
