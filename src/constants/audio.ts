import type { AmbientSourceId, AudioSettings } from "../types";

export interface AmbientSourceConfig {
  filePath: string;
  maxVolume: number;
  saturationScore: number;
  priority: number;
}

export const AUDIBLE_VOLUME_THRESHOLD = 0.05;
export const MAX_AMBIENT_LOOPS = 3;
export const SOURCE_REPLACEMENT_MARGIN = 0.15;
export const DEFAULT_MASTER_VOLUME = 0.5;
export const AUDIO_PERSIST_DELAY = 0.3;
export const CHARACTER_LISTENER_RADIUS = 3;
export const CHARACTER_MIX_SAMPLE_SPACING = 0.1;
export const CHARACTER_MIX_UPDATE_INTERVAL = 100;

export const DEFAULT_AUDIO_SETTINGS: AudioSettings = {
  footstepsEnabled: true,
  callsEnabled: true,
  volume: DEFAULT_MASTER_VOLUME,
  muted: false,
  playing: false,
};

export const CHARACTER_AUDIO = {
  footstepPath: `${import.meta.env.BASE_URL}audio/characters/footstep.mp3`,
  footstepGain: 0.15,
  callGain: 0.2,
  callIntervalMin: 20,
  callIntervalMax: 45,
} as const;

export const AUDIO_FADE = {
  playIn: 3,
  sleep: 60,
  loopIn: 0.5,
  loopOut: 0.7,
  volumeRamp: 0.2,
  master: 0.1,
} as const;

export const AMBIENT_SOURCE_CONFIG = {
  forest: {
    filePath: `${import.meta.env.BASE_URL}audio/forest.webm`,
    maxVolume: 0.65,
    saturationScore: 2,
    priority: 0.7,
  },
  river: {
    filePath: `${import.meta.env.BASE_URL}audio/river.webm`,
    maxVolume: 0.8,
    saturationScore: 1.5,
    priority: 1,
  },
  water: {
    filePath: `${import.meta.env.BASE_URL}audio/water.webm`,
    maxVolume: 0.45,
    saturationScore: 2.5,
    priority: 0.5,
  },
  settlement: {
    filePath: `${import.meta.env.BASE_URL}audio/settlement.webm`,
    maxVolume: 0.7,
    saturationScore: 2,
    priority: 1,
  },
  rural: {
    filePath: `${import.meta.env.BASE_URL}audio/rural.webm`,
    maxVolume: 0.5,
    saturationScore: 2.5,
    priority: 0.6,
  },
  harbor: {
    filePath: `${import.meta.env.BASE_URL}audio/harbor.webm`,
    maxVolume: 0.8,
    saturationScore: 1,
    priority: 1,
  },
  magic: {
    filePath: `${import.meta.env.BASE_URL}audio/magic.webm`,
    maxVolume: 0.2,
    saturationScore: 1,
    priority: 1,
  },
} as const satisfies Record<AmbientSourceId, AmbientSourceConfig>;

export const AMBIENT_SOURCE_IDS = Object.keys(
  AMBIENT_SOURCE_CONFIG,
) as AmbientSourceId[];
