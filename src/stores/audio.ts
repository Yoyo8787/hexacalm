import { create } from "zustand";
import { DEFAULT_AUDIO_SETTINGS } from "../constants/audio";
import type { AudioSettings } from "../types";

interface AudioStore extends AudioSettings {
  hydrateAudio: (settings: AudioSettings) => void;
  setMuted: (muted: boolean) => void;
  setPlaying: (playing: boolean) => void;
  setVolume: (volume: number) => void;
}

export const useAudioStore = create<AudioStore>((set) => ({
  ...DEFAULT_AUDIO_SETTINGS,
  hydrateAudio: (settings) => set(settings),
  setMuted: (muted) => set({ muted }),
  setPlaying: (playing) => set({ playing }),
  setVolume: (volume) => set({ volume }),
}));
