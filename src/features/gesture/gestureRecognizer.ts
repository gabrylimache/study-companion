import { HandLandmarkerResult } from '@mediapipe/tasks-vision';
import { GestureName } from './gestureTypes';

/**
 * Simple geometric heuristic to determine which fingers are extended.
 * Returns a boolean array [thumb, index, middle, ring, pinky] where true means extended.
 */
function getFingerStates(result: HandLandmarkerResult): boolean[] {
  if (!result || result.handednesses.length === 0) return [false, false, false, false, false];
  const hand = result.landmarks[0]; // assume single hand
  // Landmark indices per MediaPipe docs
  const TIP = [4, 8, 12, 16, 20];
  const PIP = [2, 6, 10, 14, 18]; // lower joint for each finger
  const states: boolean[] = [];
  for (let i = 0; i < 5; i++) {
    const tip = hand[TIP[i]];
    const pip = hand[PIP[i]];
    // Finger is extended if tip.y is significantly lower (higher on screen) than pip.y
    const extended = tip.y < pip.y - 0.02; // threshold
    states.push(extended);
  }
  return states;
}

/**
 * Detect a gesture based on finger states.
 * Returns a GestureName matching the PRD mapping.
 */
export function recognizeGesture(result: HandLandmarkerResult | null): GestureName {
  if (!result) return null;
  const [thumb, index, middle, ring, pinky] = getFingerStates(result);
  // Peace sign: index && middle && !ring && !pinky
  if (index && middle && !ring && !pinky) return 'happy';
  // Middle finger only
  if (!index && middle && !ring && !pinky) return 'angry';
  // Index finger up only
  if (index && !middle && !ring && !pinky) return 'listening';
  // Smoking gesture: index && middle (horizontal) – we approximate same as peace sign but require thumb also extended
  // OK sign detection: thumb and index tips close together
  // Open Hand (all five fingers extended) -> smoking gesture
  if (thumb && index && middle && ring && pinky) return 'smoking';
  // (no further fallback; other gestures handled above)
  return null;
}
