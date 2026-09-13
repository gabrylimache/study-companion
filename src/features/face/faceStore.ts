import { create } from 'zustand';

interface FaceState {
  facePresent: boolean;
  faceDetectionEnabled: boolean;
  cooldownActive: boolean;
  setFacePresent: (present: boolean) => void;
  toggleFaceDetection: () => void;
  setCooldownActive: (active: boolean) => void;
}

export const useFaceStore = create<FaceState>((set) => ({
  facePresent: false,
  faceDetectionEnabled: true,
  cooldownActive: false,
  setFacePresent: (present) => set({ facePresent: present }),
  toggleFaceDetection: () => set((state) => ({ faceDetectionEnabled: !state.faceDetectionEnabled })),
  setCooldownActive: (active) => set({ cooldownActive: active }),
}));
