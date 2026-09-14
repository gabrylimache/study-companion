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
import { useCompanionStore } from './features/companion/companionStore';
import CompanionMode from './features/companion/CompanionMode';

export default function App() {
  const { target } = useAvatarStore();
  const idle = useIdleStore();
  const { enabled, setEnabled } = useCompanionStore();
  useEffect(() => {
    idle.start();
    return () => idle.stop();
  }, []);
  return (
    <div className="flex flex-col min-h-screen bg-[#1F242B] text-[#E8EAF0] font-sans">
      <header className="p-4 text-center text-2xl font-bold text-[#E8EAF0]">Pollock - Study Companion</header>
      <main className="flex-1 p-4 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column – Avatar (large) and Pomodoro */}
        <section className="flex flex-col gap-4">
          <section className="bg-[#2A313A] rounded-lg glass shadow-md p-4 flex items-center justify-center min-h-[400px] border-2 border-[#3A434E]">
            <AvatarWrapper />
          </section>
          <section className="bg-white rounded-lg glass shadow-md p-4">
            <PomodoroPanel />
          </section>
        </section>
        {/* Right column – Webcam, Stats, Achievements, Developer Mode */}
        <section className="flex flex-col gap-4">
          <section className="bg-[#2A313A] rounded-lg glass shadow-md p-4">
            <WebcamPanel />
          </section>
          <section className="bg-[#2A313A] rounded-lg glass shadow-md p-4">
            <StatsPanel />
          </section>
          <section className="bg-[#2A313A] rounded-lg glass shadow-md p-4 max-h-[400px] overflow-y-auto">
            <AchievementPanel />
          </section>
          <section className="bg-[#2A313A] rounded-lg glass shadow-md p-4">
            <DeveloperModePanel />
            <button
              onClick={() => setEnabled(!enabled)}
              className="mt-2 px-4 py-2 bg-[#7FA88F] hover:bg-[#6F977F] rounded text-white"
            >
              {enabled ? 'Disable' : 'Enable'} Companion Mode
            </button>
          </section>
        </section>
      </main>
      <FaceAvatarBridge />
      <CompanionMode />
      <footer className="p-2 text-center text-sm opacity-70">With love for Pallino and its owner</footer>
    </div>
  );
}
