import { create } from "zustand";
import { DEFAULT_MASTER_VOLUME } from "../constants/audio";

interface AudioStore {
  muted: boolean;
  volume: number;
  setMuted: (muted: boolean) => void;
  setVolume: (volume: number) => void;
}

export const useAudioStore = create<AudioStore>((set) => ({
  muted: false,
  volume: DEFAULT_MASTER_VOLUME,
  setMuted: (muted) => set({ muted }),
  setVolume: (volume) => set({ volume }),
}));
