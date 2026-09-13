# Current Project State

## Completed Features

- **Webcam**
  - Implementation Status: ✅ Complete
  - Main Files: `src/features/webcam/WebcamPanel.tsx`, `src/features/webcam/useHandLandmarker.ts`, `src/features/webcam/webcamStore.ts`

- **MediaPipe Hand Tracking**
  - Implementation Status: ✅ Complete
  - Main Files: `src/features/webcam/useHandLandmarker.ts`

- **Gesture Recognition**
  - Implementation Status: ✅ Complete
  - Main Files: `src/features/gesture/gestureRecognizer.ts`, `src/features/gesture/gestureStore.ts`, `src/features/gesture/gestureTypes.ts`

- **Avatar Integration**
  - Implementation Status: ✅ Complete
  - Main Files: `src/features/avatar/avatarStore.ts`, `src/features/avatar/avatarComponent.tsx`, `src/features/pomodoro/pomodoroAvatarBridge.tsx`

- **Idle Manager**
  - Implementation Status: ✅ Complete
  - Main Files: `src/features/idle/idleStore.ts`, `src/features/idle/idleManager.ts`

- **Developer Mode**
  - Implementation Status: ✅ Complete
  - Main Files: `src/features/dev/DeveloperModePanel.tsx`

- **Pomodoro**
  - Implementation Status: ✅ Complete (timer, phase label, start/pause/resume/reset)
  - Main Files: `src/features/pomodoro/PomodoroPanel.tsx`, `src/features/pomodoro/pomodoroStore.ts`

- **Statistics**
  - Implementation Status: ✅ Complete
  - Main Files: `src/features/stats/statsStore.ts`, `src/features/stats/StatsPanel.tsx`

- **Achievements**
  - Implementation Status: ✅ Complete (basic store, UI)
  - Main Files: `src/features/achievement/achievementStore.ts`, `src/features/achievement/AchievementPanel.tsx`

- **LocalStorage Persistence**
  - Implementation Status: ✅ Complete (used by pomodoro, stats, achievement stores)
  - Main Files: `src/lib/localStorage.ts`

## Architecture

**Webcam Pipeline**
```
WebcamPanel
  → useHandLandmarker (MediaPipe Hand Landmarker)
    → provides hand landmarks
      → Gesture Recognition (`recognizeGesture`)
        → updates Gesture Store
          → Avatar Store reacts via `pomodoroAvatarBridge` / other bridges
```

**Pomodoro Flow**
```
PomodoroPanel (uses usePomodoroStore)
  → Pomodoro Store (state machine)
    → on phase changes updates Stats Store
    → updates Achievements Store
    → triggers Avatar reactions via `pomodoroAvatarBridge`
```

## Important Files
- `src/App.tsx` – Root component mounting all panels (Webcam, Pomodoro, Stats, Achievements, Developer Mode).
- `src/features/webcam/WebcamPanel.tsx` – UI for camera control and status display.
- `src/features/webcam/useHandLandmarker.ts` – Handles MediaPipe model loading, video stream, landmark detection, and syncs camera state via `webcamStore`.
- `src/features/webcam/webcamStore.ts` – Shared Zustand store for camera `running` flag.
- `src/features/gesture/gestureRecognizer.ts` – Maps hand landmarks to gesture names.
- `src/features/gesture/gestureStore.ts` – Stores current gesture.
- `src/features/avatar/avatarStore.ts` – Central store for avatar target (animation or expression).
- `src/features/avatar/avatarComponent.tsx` – Renders the avatar based on store state.
- `src/features/pomodoro/pomodoroStore.ts` – Pomodoro timer logic, persisted via localStorage.
- `src/features/pomodoro/PomodoroPanel.tsx` – UI with phase label, controls, stats hooks, and avatar reaction effects.
- `src/features/pomodoro/pomodoroAvatarBridge.tsx` – Bridges pomodoro phases to avatar animations.
- `src/features/stats/statsStore.ts` – Tracks pomodoro count, focused/break minutes, streaks.
- `src/features/stats/StatsPanel.tsx` – UI for displaying statistics.
- `src/features/achievement/achievementStore.ts` – Stores achievement progress, with defensive defaults.
- `src/features/achievement/AchievementPanel.tsx` – UI for showing achievements.
- `src/lib/localStorage.ts` – Helper for saving/loading JSON state.
- `src/features/dev/DeveloperModePanel.tsx` – Debug panel showing camera, gesture, avatar state and Pomodoro debug toggle.

## Known Bugs
- None critical after recent fixes; all panels render without console errors.
- Tailwind `@tailwind` directives generate warnings in the production build (non‑blocking).
- Avatar reactions for **Pomodoro Completed** rely on the bridge; ensure the bridge remains mounted.

## Stable Components
These should not be altered unless fixing a bug:
- Webcam (`WebcamPanel`, `useHandLandmarker`, `webcamStore`)
- MediaPipe integration (`useHandLandmarker`)
- Gesture Recognition (`gestureRecognizer`, `gestureStore`)
- Avatar Integration (`avatarStore`, `avatarComponent`, `pomodoroAvatarBridge`)
- Idle Manager (`idleStore`, `idleManager`)

## Next Development Phase (Phase 3)
1. **Face Detection** – Add MediaPipe Face Mesh and expose detection status.
2. **Companion Mode** – Picture‑in‑Picture view that shows the avatar alongside the webcam feed.

## Future Phase
1. Docker containerization for reproducible builds.
2. Deploy to GitHub Pages.
3. CI/CD with GitHub Actions (build, test, deploy).
4. Polish README with setup, architecture diagram, and usage instructions.

## How to Resume Development
1. Clone the repository and run `npm install`.
2. `npm run dev` – start the Vite dev server.
3. Verify the UI shows Webcam, Pomodoro, Stats, Achievements, and Developer Mode panels.
4. For new features, create a new feature folder under `src/features/` following existing naming conventions.
5. Add Zustand stores for state, update `App.tsx` to mount new components, and write unit tests under `src/__tests__/`.
6. Run `npm run build` to ensure production build passes.
7. Commit changes with clear PR titles referencing the feature or bug.

---
*Generated on 2026‑09‑14 by Antigravity.*
