import React, { useEffect } from 'react';
import { useHandLandmarker } from '../../features/webcam/useHandLandmarker';
import { recognizeGesture } from '../../features/gesture/gestureRecognizer';
import { useGestureStore } from '../../features/gesture/gestureStore';
import { GestureName } from '../../features/gesture/gestureTypes';
import { useFaceDetector } from '../face/useFaceDetector';

const WebcamPanel: React.FC = () => {
  const { videoRef, landmarks, running, setRunning, fps } = useHandLandmarker();
  useFaceDetector(videoRef);
  const { setGesture, currentGesture } = useGestureStore();

  // When new landmarks are available, recognize and set gesture
  useEffect(() => {
    if (landmarks) {
      const gesture = recognizeGesture(landmarks);
      if (gesture) {
        setGesture(gesture);
      }
    }
  }, [landmarks, setGesture]);

  const toggleCamera = () => {
    console.log('Button click: toggleCamera');
    setRunning(!running);
  };

  return (
    <section className="p-4 bg-gray-800 rounded-lg glass">
      <h2 className="text-lg font-semibold mb-2">Webcam Panel</h2>
      <div className="flex items-center space-x-4 mb-2">
        <button
          onClick={toggleCamera}
          className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-500"
        >
          {running ? 'Disable Camera' : 'Enable Camera'}
        </button>
        <span className="text-sm">Status: {running ? '🟢 On' : '🔴 Off'}</span>
        <span className="text-sm">FPS: {fps}</span>
      </div>
      <div className="relative w-64 h-48 bg-black rounded overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        {currentGesture && (
          <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-2 py-1 rounded">
            Detected: {currentGesture}
          </div>
        )}
      </div>
    </section>
  );
};

export default WebcamPanel;
