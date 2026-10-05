export const FOLLOW_DISTANCE = 3.0;
export const FOLLOW_HEIGHT = 2;
export const EYE_HEIGHT = 0.18;
export const TRANSITION_SECONDS = 0.65;
export const CAMERA_TURN_RESPONSE = 4;
// The Builder view counts as moved once it is this far from the default view.
export const DEFAULT_VIEW_POSITION_TOLERANCE = 0.5;
export const DEFAULT_VIEW_ANGLE_TOLERANCE = (5 * Math.PI) / 180;
// Wait for the camera to rest before reporting that it left the default view.
export const DEFAULT_VIEW_SETTLE_SECONDS = 0.4;

// [right, forward] input for each key, relative to the current view.
export const MOVE_KEYS: Record<string, readonly [number, number]> = {
  KeyW: [0, 1],
  KeyS: [0, -1],
  KeyA: [-1, 0],
  KeyD: [1, 0],
};
// Ground speed per unit of camera distance, so zoomed-out views move faster.
export const MOVE_SPEED_PER_DISTANCE = 0.5;
export const MOVE_RESPONSE = 10;
