import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { useAvatarStore } from '../avatar/avatarStore';
import { useIdleStore } from '../idle/idleStore';
import { GestureName } from './gestureTypes';

type GestureState = {
  currentGesture: GestureName | null;
  lastTrigger: number; // timestamp in ms
  setGesture: (gesture: Exclude<GestureName, null>) => void;
  clearGesture: () => void;
};

export const useGestureStore = create<GestureState>()(
  devtools(set => ({
    currentGesture: null,
    lastTrigger: 0,
    setGesture: (gesture) => {
      const now = Date.now();
      const cooldown = 2000; // 2 seconds
      set(state => {
        if (now - state.lastTrigger < cooldown) {
          // still in cooldown, ignore
          return {};
        }
        // Stop idle manager while gesture active
        useIdleStore.getState().stop();
        // Update avatar animation
        useAvatarStore.getState().setTarget({ kind: 'animation', key: gesture });
        // Schedule automatic clear after 3 seconds
        if ((globalThis as any).__gestureTimeout) {
          clearTimeout((globalThis as any).__gestureTimeout);
        }
        (globalThis as any).__gestureTimeout = setTimeout(() => {
          useGestureStore.getState().clearGesture();
        }, 3000);
        return { currentGesture: gesture, lastTrigger: now };
      });
    },
    clearGesture: () => {
      set(state => {
        // Cancel pending timeout
        if ((globalThis as any).__gestureTimeout) {
          clearTimeout((globalThis as any).__gestureTimeout);
          (globalThis as any).__gestureTimeout = null;
        }
        // Resume idle manager
        useIdleStore.getState().start();
        return { currentGesture: null };
      });
    }
  }))
);
