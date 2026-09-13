// src/features/pomodoro/pomodoroAvatarBridge.tsx
import { useEffect } from 'react';
import { usePomodoroStore } from './pomodoroStore';
import { useAvatarStore } from '../avatar/avatarStore';
import { useIdleStore } from '../idle/idleStore';

export default function PomodoroAvatarBridge() {
  const { phase } = usePomodoroStore();
  const setTarget = useAvatarStore(state => state.setTarget);
  const idle = useIdleStore();

  useEffect(() => {
    let animation: string | null = null;
    switch (phase) {
      case 'work':
        animation = 'listening';
        idle.stop();
        break;
      case 'shortBreak':
      case 'longBreak':
        animation = 'happy';
        idle.start();
        break;
      case 'idle':
        animation = 'idle';
        idle.start();
        break;
      default:
        break;
    }
    if (animation) {
      setTarget({ kind: 'animation', key: animation as any });
    }
  }, [phase, setTarget, idle]);

  return null; // no UI
}
