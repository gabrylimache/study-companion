# Next Development Phase

Current Status:

✅ Phase 1 Complete
✅ Phase 2 Complete
✅ Phase 3 Complete

---

# Phase 4

## Companion Mode (Picture-in-Picture)

Goal:

Keep the mascot visible while the user works in other tabs or applications.

Requirements:

- Add "Enable Companion Mode" button.
- Use Picture-in-Picture API when available.
- Show:
  - Avatar
  - Current Pomodoro Phase
  - Remaining Time
- Continue running:
  - Webcam
  - Gesture Detection
  - Face Detection
  - Pomodoro
- Graceful fallback when PiP is unavailable.
- Developer Mode should display:
  - Companion Mode ON/OFF

---

## Docker Support

Requirements:

- Dockerfile
- docker-compose.yml

Commands should work:

docker build
docker run
docker compose up

---

## GitHub Pages

Requirements:

- Static deployment
- Vite base path configured
- Deployment documentation in README

---

## GitHub Actions

Requirements:

- Build workflow
- Deploy workflow
- Optional lint workflow

---

## README Finalization

Sections:

- Overview
- Motivation
- Features
- Architecture
- Gesture Recognition
- Face Detection
- Avatar System
- Pomodoro
- Statistics
- Achievements
- Installation
- Docker
- Deployment
- Credits

Credits must include:

https://github.com/smontlouis/bible-strong-avatar-lab

---

## Important Notes

The following systems are considered stable and should not be redesigned:

- Webcam
- Shared Camera Stream
- Hand Tracking
- Face Detection
- Gesture Recognition
- Avatar Integration
- Idle Manager
- Pomodoro

Future work should extend the project rather than replace existing architecture.