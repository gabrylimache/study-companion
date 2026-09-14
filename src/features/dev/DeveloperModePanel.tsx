// src/features/dev/DeveloperModePanel.tsx
import React from 'react';
import { useIdleStore } from '../idle/idleStore';
import { useHandLandmarker } from '../webcam/useHandLandmarker';
import { useGestureStore } from '../../features/gesture/gestureStore';
import { useAvatarStore } from '../../features/avatar/avatarStore';
import { usePomodoroStore } from '../../features/pomodoro/pomodoroStore';
import { useFaceStore } from '../face/faceStore';
import { useCompanionStore } from '../companion/companionStore';

const DeveloperModePanel: React.FC = () => {
  const { running } = useHandLandmarker();
  const { active, currentIdle } = useIdleStore();
  const { currentGesture } = useGestureStore();
  const { target } = useAvatarStore();
  const debugMode = usePomodoroStore(state => state.debugMode);
  const toggleDebug = usePomodoroStore(state => state.toggleDebug);

  const { facePresent, faceDetectionEnabled, cooldownActive, toggleFaceDetection } = useFaceStore();

  return (
    <details className="bg-gray-800 rounded-lg glass p-4">
  <summary className="cursor-pointer font-medium text-gray-300 hover:text-white">Developer Mode</summary>
  <ul className="list-disc list-inside text-sm space-y-1">
    <li>Camera: {running ? 'On' : 'Off'}</li>
    <li>Detected Gesture: {currentGesture ?? 'None'}</li>
    <li>Avatar Animation: {target.kind === 'animation' ? target.key : 'Expression: ' + target.key}</li>
    <li>Face Detection: {faceDetectionEnabled ? 'On' : 'Off'}</li>
    <li>Face Present: {facePresent ? 'Yes' : 'No'}</li>
    <li>Face Cooldown Active: {cooldownActive ? 'Yes' : 'No'}</li>
    <li>Companion Mode: {useCompanionStore(state => state.enabled) ? 'ON' : 'OFF'}</li>
  </ul>
  {import.meta.env.DEV && (
    <div className="mt-4 flex flex-col space-y-4">
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium">Pomodoro Debug Mode</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={debugMode}
            onChange={toggleDebug}
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 transition-colors"></div>
          <span className="ml-2 text-sm text-gray-200">
            {debugMode ? 'ON' : 'OFF'}
          </span>
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium">Face Detection Mode</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={faceDetectionEnabled}
            onChange={toggleFaceDetection}
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 transition-colors"></div>
          <span className="ml-2 text-sm text-gray-200">
            {faceDetectionEnabled ? 'ON' : 'OFF'}
          </span>
        </label>
      </div>
    </div>
  )}
</details>
  );
};

export default DeveloperModePanel;
