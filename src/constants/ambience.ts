import type { TimeOfDay } from "../types";

// Auto mode treats [DAY_START_HOUR, NIGHT_START_HOUR) in device time as day.
export const DAY_START_HOUR = 6;
export const NIGHT_START_HOUR = 18;
export const TIME_CHECK_INTERVAL = 60_000;

// Transition lengths in seconds; reduced motion shortens both.
export const SCENE_TIME_TRANSITION = 5;
export const UI_TIME_TRANSITION = 0.8;
export const REDUCED_TIME_TRANSITION = 0.3;

export interface SceneAtmosphere {
  fog: string;
  fogNear: number;
  fogFar: number;
  keyLight: string;
  keyIntensity: number;
  ambientLight: string;
  ambientIntensity: number;
}

export const SCENE_ATMOSPHERE: Record<TimeOfDay, SceneAtmosphere> = {
  day: {
    fog: "#e6ebe4",
    fogNear: 20,
    fogFar: 46,
    keyLight: "#fff1dc",
    keyIntensity: 3.2,
    ambientLight: "#dfe8e6",
    ambientIntensity: 2.4,
  },
  night: {
    fog: "#1f2d3a",
    fogNear: 18,
    fogFar: 44,
    keyLight: "#b8c9ee",
    keyIntensity: 1.8,
    ambientLight: "#7f93b5",
    ambientIntensity: 1.4,
  },
};
