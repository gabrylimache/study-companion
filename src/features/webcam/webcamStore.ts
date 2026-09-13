// src/features/webcam/webcamStore.ts
import create from 'zustand';
import { devtools } from 'zustand/middleware';

interface WebcamState {
  running: boolean;
  setRunning: (r: boolean) => void;
}

export const useWebcamStore = create<WebcamState>()(
  devtools(set => ({
    running: false,
    setRunning: (r: boolean) => set({ running: r })
  }))
);
