import type { AmbientSourceId } from "../types";

export interface AmbientSourceConfig {
  filePath: string;
  maxVolume: number;
  saturationScore: number;
  priority: number;
}

export const AUDIBLE_VOLUME_THRESHOLD = 0.05;
export const MAX_AMBIENT_LOOPS = 3;
export const SOURCE_REPLACEMENT_MARGIN = 0.15;
export const DEFAULT_MASTER_VOLUME = 0.7;

export const AUDIO_FADE = {
  loopIn: 0.5,
  loopOut: 0.7,
  volumeRamp: 0.2,
  master: 0.1,
} as const;

export const AMBIENT_SOURCE_CONFIG = {
  forest: {
    filePath: "/audio/forest.webm",
    maxVolume: 0.65,
    saturationScore: 2,
    priority: 0.7,
  },
  river: {
    filePath: "/audio/river.webm",
    maxVolume: 0.8,
    saturationScore: 1.5,
    priority: 1,
  },
  water: {
    filePath: "/audio/water.webm",
    maxVolume: 0.45,
    saturationScore: 2.5,
    priority: 0.5,
  },
  settlement: {
    filePath: "/audio/settlement.webm",
    maxVolume: 0.7,
    saturationScore: 2,
    priority: 1,
  },
  rural: {
    filePath: "/audio/rural.webm",
    maxVolume: 0.5,
    saturationScore: 2.5,
    priority: 0.6,
  },
  harbor: {
    filePath: "/audio/harbor.webm",
    maxVolume: 0.8,
    saturationScore: 1,
    priority: 1,
  },
  magic: {
    filePath: "/audio/magic.webm",
    maxVolume: 0.2,
    saturationScore: 1,
    priority: 1,
  },
} as const satisfies Record<AmbientSourceId, AmbientSourceConfig>;

export const AMBIENT_SOURCE_IDS = Object.keys(
  AMBIENT_SOURCE_CONFIG,
) as AmbientSourceId[];
