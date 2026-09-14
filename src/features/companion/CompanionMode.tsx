// src/features/companion/CompanionMode.tsx
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useCompanionStore } from './companionStore';
import { usePomodoroStore } from '../pomodoro/pomodoroStore';
import AvatarWrapper from '../avatar/AvatarWrapper';

/**
 * CompanionMode renders the avatar and current pomodoro status.
 * It tries to open a Picture-in-Picture window using a canvas stream.
 * If PiP is unsupported or fails, a small floating overlay is shown as a fallback.
 */
const CompanionMode: React.FC = () => {
  const { enabled } = useCompanionStore();
  const { phase, remaining } = usePomodoroStore(state => ({
    phase: state.phase,
    remaining: state.remaining,
  }));

  // hidden video element that will receive the canvas stream
  const videoRef = useRef<HTMLVideoElement>(null);
  // canvas that composites avatar + pomodoro info
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // a hidden container to render the Avatar component (so we can grab its canvas)
  const avatarContainerRef = useRef<HTMLDivElement>(null);
  const [fallback, setFallback] = useState(false);
  const animationRef = useRef<number>(0);

  // -------------------------------------------------------------------------
  // Logging helper
  // -------------------------------------------------------------------------
  const log = (msg: string) => {
    console.log(`[CompanionMode] ${msg}`);
  };

  // -------------------------------------------------------------------------
  // Prepare dummy stream for browsers that need a video element before PiP
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (videoRef.current && videoRef.current.srcObject == null) {
      // initially set an empty stream; it will be replaced once the canvas is ready
      videoRef.current.srcObject = new MediaStream();
    }
  }, []);

  // -------------------------------------------------------------------------
  // Start Picture-in-Picture
  // -------------------------------------------------------------------------
  const startPiP = async () => {
    if (!videoRef.current) return;
    if (!document.pictureInPictureEnabled) {
      log('PiP not supported by browser');
      setFallback(true);
      return;
    }
    log('PiP supported');

    // Ensure the canvas stream is attached to the video element
    if (canvasRef.current) {
      const stream = (canvasRef.current as HTMLCanvasElement).captureStream(30);
      videoRef.current.srcObject = stream;
    }

    try {
      await videoRef.current.requestPictureInPicture();
      log('PiP activated');
    } catch (e) {
      log('PiP activation failed, using fallback');
      setFallback(true);
    }
  };

  // -------------------------------------------------------------------------
  // React to the CompanionMode flag
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (enabled) {
      startPiP();
    } else {
      if (document.pictureInPictureElement) {
        document.exitPictureInPicture().catch(() => {});
        log('PiP closed');
      }
      setFallback(false);
    }
  }, [enabled]);

  // -------------------------------------------------------------------------
  // Canvas composition: draw avatar + pomodoro info each frame
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (!enabled || fallback) return;
    const avatarDiv = avatarContainerRef.current;
    const canvas = canvasRef.current;
    if (!avatarDiv || !canvas) return;
    const avatarCanvas = avatarDiv.querySelector('canvas') as HTMLCanvasElement | null;
    if (!avatarCanvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    // Match canvas size to the avatar canvas
    canvas.width = avatarCanvas.width;
    canvas.height = avatarCanvas.height;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // draw avatar
      ctx.drawImage(avatarCanvas, 0, 0);
      // overlay pomodoro info
      const barHeight = 40;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(0, canvas.height - barHeight, canvas.width, barHeight);
      ctx.fillStyle = '#fff';
      ctx.font = '20px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`Phase: ${phase}`, canvas.width / 2, canvas.height - barHeight + 24);
      const mins = Math.floor(remaining / 60);
      const secs = ('0' + (remaining % 60)).slice(-2);
      ctx.fillText(`Time: ${mins}:${secs}`, canvas.width / 2, canvas.height - 4);
      animationRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [enabled, fallback, phase, remaining]);

  if (!enabled) return null;

  return (
    <>
      {/* Hidden video element that is the PiP target */}
      <video ref={videoRef} style={{ display: 'none' }} />

      {/* Hidden container used solely to render AvatarWrapper so we can capture its canvas */}
      <div
        ref={avatarContainerRef}
        style={{
          position: 'absolute',
          left: '-9999px',
          top: '-9999px',
          visibility: 'hidden',
        }}
      >
        <AvatarWrapper />
      </div>

      {/* Composite canvas – not shown in the UI, only used for the PiP stream */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Fallback overlay when PiP cannot be used */}
      {fallback && createPortal(
        <div className="fixed bottom-4 right-4 bg-gray-800 rounded-lg p-3 glass shadow-lg z-50 w-48"
             style={{ position: 'fixed', bottom: '1rem', right: '1rem', zIndex: 9999 }}>
          <AvatarWrapper />
          <div className="text-sm text-center mt-2">
            <div>Phase: {phase}</div>
            <div>Time: {Math.floor(remaining / 60)}:{('0' + (remaining % 60)).slice(-2)}</div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default CompanionMode;
