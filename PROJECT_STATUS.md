# Current Project State

## Completed Features

### Webcam
- Status: ✅ Complete
- Shared webcam stream used by both Hand Tracking and Face Detection
- Main Files:
  - src/features/webcam/WebcamPanel.tsx
  - src/features/webcam/useHandLandmarker.ts
  - src/features/webcam/webcamStore.ts

### MediaPipe Hand Tracking
- Status: ✅ Complete
- Main Files:
  - src/features/webcam/useHandLandmarker.ts

### Gesture Recognition
- Status: ✅ Complete
- Gesture Mapping:
  - Peace Sign → happy
  - Middle Finger → angry
  - Index Finger → listening
  - Open Hand → smoking
- Main Files:
  - src/features/gesture/gestureRecognizer.ts
  - src/features/gesture/gestureStore.ts
  - src/features/gesture/gestureTypes.ts

### Face Detection
- Status: ✅ Complete
- Uses MediaPipe Face Detector with local model.
- Shared webcam source with Hand Tracking.
- Avatar Reactions:
  - Face detected → happy
  - Face missing > 5 seconds → scared
  - Face returns → happy
- Main Files:
  - src/features/face/useFaceDetector.ts
  - src/features/face/faceStore.ts
  - src/features/face/FaceAvatarBridge.tsx
  - public/models/blaze_face_short_range.tflite

### Avatar Integration
- Status: ✅ Complete
- Main Files:
  - src/features/avatar/avatarStore.ts
  - src/features/avatar/avatarComponent.tsx
  - src/features/pomodoro/pomodoroAvatarBridge.tsx
  - src/features/face/FaceAvatarBridge.tsx

### Idle Manager
- Status: ✅ Complete
- Idle Animations:
  - idle
  - sleeping
  - drowsy
- Main Files:
  - src/features/idle/idleStore.ts
  - src/features/idle/idleManager.ts

### Developer Mode
- Status: ✅ Complete
- Displays:
  - Camera Status
  - Face Detection Status
  - Face Present
  - Face Cooldown
  - Current Gesture
  - Current Avatar Animation
  - Pomodoro Debug Mode
- Main Files:
  - src/features/dev/DeveloperModePanel.tsx

### Pomodoro
- Status: ✅ Complete
- Features:
  - Start
  - Pause
  - Resume
  - Reset
  - Focus
  - Short Break
  - Long Break
  - Debug Mode
- Avatar Reactions:
  - Focus → listening
  - Break → happy
  - Completion → proud
- Main Files:
  - src/features/pomodoro/PomodoroPanel.tsx
  - src/features/pomodoro/pomodoroStore.ts
  - src/features/pomodoro/pomodoroAvatarBridge.tsx

### Statistics
- Status: ✅ Complete
- Main Files:
  - src/features/stats/statsStore.ts
  - src/features/stats/StatsPanel.tsx

### Achievements
- Status: ✅ Complete
- Main Files:
  - src/features/achievement/achievementStore.ts
  - src/features/achievement/AchievementPanel.tsx

### LocalStorage Persistence
- Status: ✅ Complete
- Main Files:
  - src/lib/localStorage.ts

---

## Architecture

### Webcam Pipeline

Webcam
→ Shared Camera Stream
→ Hand Tracking (MediaPipe)
→ Gesture Recognition
→ Gesture Store
→ Avatar Store

Webcam
→ Shared Camera Stream
→ Face Detection (MediaPipe)
→ Face Store
→ Face Avatar Bridge
→ Avatar Store

### Pomodoro Pipeline

Pomodoro Panel
→ Pomodoro Store
→ Statistics Store
→ Achievement Store
→ Pomodoro Avatar Bridge
→ Avatar Store

---

## Avatar Priority System

Priority order:

Gesture
>
Face Detection
>
Pomodoro Events
>
Idle Manager

Examples:

Middle Finger
→ angry

even if

Face detected
→ happy

Gesture animations always win.

---

## Important Models

### Hand Tracking
public/models/hand_landmarker.task

### Face Detection
public/models/blaze_face_short_range.tflite

---

## Stable Components

Do NOT modify unless fixing a bug:

- Webcam
- Shared Camera Stream
- Hand Tracking
- Face Detection
- Gesture Recognition
- Avatar Integration
- Idle Manager
- Pomodoro Core Logic

---

## Known Bugs

None critical.

Minor:
- Tailwind build warnings remain non-blocking.
- Face detection quality depends on lighting conditions.
- Gesture detection quality depends on camera angle.

---

## Current UI

Left Column:
- Avatar
- Pomodoro

Right Column:
- Webcam
- Statistics
- Achievements
- Developer Mode

---

## Current Development Status

✅ Phase 1 Complete
✅ Phase 2 Complete
✅ Phase 3 Complete
✅ GitHub Pages Complete
✅ GitHub Actions Complete

⚪ Docker (optional future improvement)