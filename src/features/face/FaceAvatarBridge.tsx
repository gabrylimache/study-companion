import { useEffect, useRef } from 'react';
import { useFaceStore } from './faceStore';
import { useAvatarStore } from '../avatar/avatarStore';
import { useIdleStore } from '../idle/idleStore';
import { usePomodoroStore } from '../pomodoro/pomodoroStore';

export default function FaceAvatarBridge() {
  const { facePresent, faceDetectionEnabled, setCooldownActive } = useFaceStore();
  const setTarget = useAvatarStore((state) => state.setTarget);
  const idleStore = useIdleStore();
  const { phase } = usePomodoroStore();
  const missingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cooldownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Track the previous known state to avoid repeated triggers
  const lastKnownState = useRef<'present' | 'missing' | null>(null);

  useEffect(() => {
    if (!faceDetectionEnabled) {
      if (missingTimerRef.current) clearTimeout(missingTimerRef.current);
      return;
    }

    if (facePresent) {
      // Face has returned
      if (missingTimerRef.current) {
        console.log('Face has returned');
        clearTimeout(missingTimerRef.current);
        missingTimerRef.current = null;
      }

      if (lastKnownState.current === 'missing') {
        console.log('Face has returned for the first time');
        // Trigger happy and cooldown
        setCooldownActive(true);
        setTarget({ kind: 'animation', key: 'happy' });

        // Restore idle if we are not in work phase
        if (phase !== 'work') {
          idleStore.start();
        }

        if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
        cooldownTimerRef.current = setTimeout(() => {
          setCooldownActive(false);
        }, 5000);
      }
      lastKnownState.current = 'present';
    } else {
      // Face is missing
      if (lastKnownState.current !== 'missing' && !missingTimerRef.current) {
        console.log('Face is missing');
        missingTimerRef.current = setTimeout(() => {
          console.log('Face is missing for the first time');
          setCooldownActive(true);
          setTarget({ kind: 'animation', key: 'scared' });
          idleStore.stop(); // Stop idle animations while scared
          lastKnownState.current = 'missing';
          missingTimerRef.current = null;

          if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
          cooldownTimerRef.current = setTimeout(() => {
            console.log('Cooldown finished');
            setCooldownActive(false);
          }, 5000);
        }, 5000);
      }
    }
  }, [facePresent, faceDetectionEnabled, setTarget, idleStore, phase]);

  return null;
}
