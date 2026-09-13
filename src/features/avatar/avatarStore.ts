import create from 'zustand';
import { devtools } from 'zustand/middleware';

type Target = { kind: 'animation' | 'expression'; key: string };

type AvatarState = {
  target: Target;
  setTarget: (t: Target) => void;
};

export const useAvatarStore = create<AvatarState>()(
  devtools(set => ({
    target: { kind: 'animation', key: 'idle' },
    setTarget: (t) => set({ target: t })
  }))
);
