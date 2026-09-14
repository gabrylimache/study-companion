import { useEffect, useState, useRef } from 'react';
import { FilesetResolver, HandLandmarker, HandLandmarkerResult } from '@mediapipe/tasks-vision';
import { useWebcamStore } from './webcamStore';

/**
 * Hook that loads the MediaPipe Hand Landmarker model and provides
 * real‑time hand landmarks from a webcam video stream.
 *
 * Returns:
 *   - videoRef: Ref to attach to a <video> element.
 *   - landmarks: Latest HandLandmarkerResult or null.
 *   - running: Boolean indicating whether the camera is active.
 *   - fps: Approximate frames‑per‑second processed.
 */
export function useHandLandmarker() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [landmarks, setLandmarks] = useState<HandLandmarkerResult | null>(null);
  const { running, setRunning } = useWebcamStore();
  const [fps, setFps] = useState(0);

  useEffect(() => {
    let landmarker: HandLandmarker | null = null;
    let stream: MediaStream | null = null;
    let animationFrameId: number | null = null;
    let lastTime = performance.now();
    let frameCount = 0;

    const init = async () => {
      console.log('Camera initialization start');
      try {
        console.log('Requesting camera permission');
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        console.log('Camera permission granted');
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          console.log('Stream attached to video element');
        }
        const fileset = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        );
        console.log('MediaPipe fileset resolved');
        landmarker = await HandLandmarker.createFromOptions(fileset, {
          baseOptions: {
            modelAssetPath: `${import.meta.env.BASE_URL}models/hand_landmarker.task`
          },
          runningMode: 'VIDEO',
          numHands: 1
        });
        console.log('HandLandmarker created');
        console.log('MediaPipe HandLandmarker started');
      } catch (e) {
        console.error('Error during camera/MediaPipe init', e);
      }
    };

    const process = () => {
      if (!landmarker || !videoRef.current) return;
      const results = landmarker.detectForVideo(videoRef.current, performance.now());
      setLandmarks(results);
      console.log('Landmark detected');
      // FPS calculation
      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = now;
      }
      animationFrameId = requestAnimationFrame(process);
    };

    if (running) {
      init().then(() => {
        process();
      });
    } else {
      // Cleanup when turning off camera
      if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
      if (landmarker) {
        (landmarker as any).close();
        landmarker = null;
      }
      if (stream) {
        (stream as MediaStream).getTracks().forEach((t: MediaStreamTrack) => t.stop());
        stream = null;
        console.log('Camera stream stopped');
      }
    }

    return () => {
      if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
      if (landmarker) (landmarker as any).close();
      if (stream) {
        (stream as MediaStream).getTracks().forEach((t: MediaStreamTrack) => t.stop());
        console.log('Camera stream stopped (on unmount)');
      }
    };
  }, [running]);

  return { videoRef, landmarks, running, setRunning, fps };
}
