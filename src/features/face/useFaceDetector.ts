import { useEffect, useRef } from 'react';
import { FilesetResolver, FaceDetector } from '@mediapipe/tasks-vision';
import { useWebcamStore } from '../webcam/webcamStore';
import { useFaceStore } from './faceStore';

export function useFaceDetector(videoRef: React.RefObject<HTMLVideoElement | null>) {
  const { running } = useWebcamStore();
  const { faceDetectionEnabled, setFacePresent } = useFaceStore();
  const detectorRef = useRef<FaceDetector | null>(null);

  useEffect(() => {
    let animationFrameId: number | null = null;
    let isActive = true;

    const init = async () => {
      try {
        const fileset = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        );
        const detector = await FaceDetector.createFromOptions(fileset, {
          baseOptions: {
            modelAssetPath: `/models/blaze_face_short_range.tflite`,
            delegate: 'GPU'
          },
          runningMode: 'VIDEO',
        });
        if (isActive) {
          detectorRef.current = detector;
          process();
        } else {
          detector.close();
        }
      } catch (e) {
        console.error('Error init FaceDetector', e);
      }
    };

    const process = () => {
      if (!isActive) return;
      if (detectorRef.current && videoRef.current && videoRef.current.readyState >= 2) {
        const results = detectorRef.current.detectForVideo(videoRef.current, performance.now());
        if (results.detections && results.detections.length > 0) {
          setFacePresent(true);
        } else {
          setFacePresent(false);
        }
      }
      animationFrameId = requestAnimationFrame(process);
    };

    if (running && faceDetectionEnabled) {
      init();
    } else {
      setFacePresent(false);
    }

    return () => {
      isActive = false;
      if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
      if (detectorRef.current) {
        detectorRef.current.close();
        detectorRef.current = null;
      }
    };
  }, [running, faceDetectionEnabled, videoRef, setFacePresent]);
}
