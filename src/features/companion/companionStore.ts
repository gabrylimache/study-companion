// src/features/companion/companionStore.ts
import create from 'zustand';
import { devtools } from 'zustand/middleware';

interface CompanionState {
  enabled: boolean;
  setEnabled: (v: boolean) => void;
}

export const useCompanionStore = create<CompanionState>()(
  devtools(set => ({
    enabled: false,
    setEnabled: (v: boolean) => set({ enabled: v }),
  }))
);
