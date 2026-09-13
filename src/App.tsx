import React, { useEffect } from 'react';
import FaceAvatarBridge from './features/face/FaceAvatarBridge';
import AvatarWrapper from './features/avatar/AvatarWrapper';
import WebcamPanel from './features/webcam/WebcamPanel';
import PomodoroPanel from './features/pomodoro/PomodoroPanel';
import DeveloperModePanel from './features/dev/DeveloperModePanel';
import { useIdleStore } from './features/idle/idleStore';
import { useAvatarStore } from './features/avatar/avatarStore';
import StatsPanel from './features/stats/StatsPanel';
import AchievementPanel from './features/achievement/AchievementPanel';

export default function App() {
  const { target } = useAvatarStore();
  const idle = useIdleStore();
  useEffect(() => {
    idle.start();
    return () => idle.stop();
  }, []);
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <header className="p-4 text-center text-2xl font-bold">Study Companion</header>
      <main className="flex-1 flex flex-col md:flex-row gap-4 p-4">
        <FaceAvatarBridge />
        <section className="flex-1 flex flex-col items-center bg-gray-800 rounded-lg p-4 glass">
          <AvatarWrapper />
        </section>
        <section className="flex-1 flex flex-col gap-4">
          <PomodoroPanel />
          <DeveloperModePanel />
        </section>
        <section className="flex-1 flex flex-col gap-4">
          <WebcamPanel />
          <StatsPanel />
          <AchievementPanel />
        </section>
      </main>
      <footer className="p-2 text-center text-sm opacity-70">© Pollock Study Companion</footer>
    </div>
  );
}
