import * as Tone from "tone";
import {
  AMBIENT_SOURCE_CONFIG,
  AUDIO_FADE,
  DEFAULT_MASTER_VOLUME,
} from "../constants/audio";
import type { AmbientSourceId, AudioMixSource } from "../types";
import { loadAmbientBuffer } from "./buffers";
import { isEquivalentMix } from "./mixer";
import { planLoopChanges } from "./loopPlan";
import type { PlayingSource } from "./loopPlan";

interface ActiveLoop {
  gain: Tone.Gain;
  player: Tone.Player;
  priorityScore: number;
  targetVolume: number;
  started: boolean;
}

type PlayingListener = (playing: boolean) => void;

const EMPTY_MIX: AudioMixSource[] = [];

export interface AmbientAudioEngine {
  play: () => Promise<void>;
  pause: () => void;
  isPlaying: () => boolean;
  subscribe: (listener: PlayingListener) => () => void;
  setMuted: (muted: boolean) => void;
  setMasterVolume: (volume: number) => void;
  setMix: (mix: AudioMixSource[]) => void;
  dispose: () => void;
}

export function createAmbientAudioEngine(): AmbientAudioEngine {
  const activeLoops = new Map<AmbientSourceId, ActiveLoop>();
  const pendingDisposals = new Map<ReturnType<typeof setTimeout>, () => void>();
  const listeners = new Set<PlayingListener>();
  const unavailableSources = new Set<AmbientSourceId>();
  let masterGain: Tone.Gain | null = null;
  let masterVolume = DEFAULT_MASTER_VOLUME;
  let mix = EMPTY_MIX;
  let muted = false;
  let playing = false;

  function ensureMasterGain(): void {
    if (!masterGain) {
      masterGain = new Tone.Gain(0).toDestination();
    }
  }

  function updateMasterGain(): void {
    if (masterGain) {
      masterGain.gain.rampTo(
        playing && !muted ? masterVolume : 0,
        AUDIO_FADE.master,
      );
    }
  }

  function setPlaying(nextPlaying: boolean): void {
    if (playing === nextPlaying) {
      return;
    }

    playing = nextPlaying;
    listeners.forEach((listener) => listener(playing));
  }

  function disposeLoop(loop: ActiveLoop): void {
    loop.player.stop();
    loop.player.dispose();
    loop.gain.dispose();
  }

  function removeLoop(source: AmbientSourceId, fadeDuration: number): void {
    const loop = activeLoops.get(source);
    if (!loop) {
      return;
    }

    activeLoops.delete(source);

    if (fadeDuration === 0) {
      disposeLoop(loop);
      return;
    }

    loop.gain.gain.rampTo(0, fadeDuration);

    const timer = setTimeout(() => {
      pendingDisposals.delete(timer);
      disposeLoop(loop);
    }, fadeDuration * 1000);

    pendingDisposals.set(timer, () => disposeLoop(loop));
  }

  function startLoop(loop: ActiveLoop): void {
    if (loop.started || !loop.player.loaded) {
      return;
    }

    loop.started = true;
    loop.player.start();
    loop.gain.gain.rampTo(loop.targetVolume, AUDIO_FADE.loopIn);
  }

  function createLoop(candidate: AudioMixSource): void {
    if (!masterGain) {
      return;
    }

    const url = AMBIENT_SOURCE_CONFIG[candidate.source].filePath;
    const gain = new Tone.Gain(0).connect(masterGain);
    const player = new Tone.Player({
      loop: true,
      fadeIn: AUDIO_FADE.loopIn,
      fadeOut: AUDIO_FADE.loopOut,
    }).connect(gain);

    activeLoops.set(candidate.source, {
      gain,
      player,
      priorityScore: candidate.priorityScore,
      targetVolume: candidate.targetVolume,
      started: false,
    });

    loadAmbientBuffer(url)
      .then((buffer) => {
        const activeLoop = activeLoops.get(candidate.source);
        if (!activeLoop || activeLoop.player !== player) {
          return;
        }

        player.buffer = buffer;

        if (playing) {
          startLoop(activeLoop);
        }
      })
      .catch((error) => {
        const activeLoop = activeLoops.get(candidate.source);
        if (activeLoop?.player === player) {
          activeLoops.delete(candidate.source);
          disposeLoop(activeLoop);
        }

        console.error(`Unable to load ${url}.`, error);

        // A missing file never becomes available, so retire the source and let
        // sync promote the next candidate instead of leaving that layer silent.
        unavailableSources.add(candidate.source);
        sync();
      });
  }

  function updateLoop(candidate: AudioMixSource): void {
    const loop = activeLoops.get(candidate.source);
    if (!loop) {
      return;
    }

    loop.priorityScore = candidate.priorityScore;
    loop.targetVolume = candidate.targetVolume;

    if (loop.started) {
      loop.gain.gain.rampTo(candidate.targetVolume, AUDIO_FADE.volumeRamp);
    }
  }

  function playingSources(): PlayingSource[] {
    return Array.from(activeLoops.entries()).map(([source, loop]) => ({
      source,
      priorityScore: loop.priorityScore,
    }));
  }

  function sync(): void {
    if (!playing || !masterGain) {
      return;
    }

    const available = mix.filter(
      (candidate) => !unavailableSources.has(candidate.source),
    );
    const { add, remove, update } = planLoopChanges(playingSources(), available);

    remove.forEach((source) => removeLoop(source, AUDIO_FADE.loopOut));
    update.forEach(updateLoop);
    add.forEach(createLoop);
  }

  async function play(): Promise<void> {
    await Tone.start();
    ensureMasterGain();
    setPlaying(true);
    updateMasterGain();
    activeLoops.forEach((loop) => startLoop(loop));
    sync();
  }

  /**
   * Pausing only fades the master gain so that resuming stays smooth. The loops
   * are ambience, so their playback position carries no meaning and keeping the
   * players running avoids a restart seam on the next play.
   */
  function pause(): void {
    setPlaying(false);
    updateMasterGain();
  }

  function isPlaying(): boolean {
    return playing;
  }

  function subscribe(listener: PlayingListener): () => void {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  }

  function setMuted(nextMuted: boolean): void {
    muted = nextMuted;
    updateMasterGain();
  }

  function setMasterVolume(volume: number): void {
    masterVolume = volume;
    updateMasterGain();
  }

  function setMix(nextMix: AudioMixSource[]): void {
    if (isEquivalentMix(mix, nextMix)) {
      return;
    }

    mix = nextMix;
    sync();
  }

  function dispose(): void {
    pendingDisposals.forEach((disposePending, timer) => {
      clearTimeout(timer);
      disposePending();
    });
    pendingDisposals.clear();

    activeLoops.forEach((_, source) => removeLoop(source, 0));
    masterGain?.dispose();
    masterGain = null;
    mix = EMPTY_MIX;
    setPlaying(false);
  }

  return {
    play,
    pause,
    isPlaying,
    subscribe,
    setMuted,
    setMasterVolume,
    setMix,
    dispose,
  };
}

export const ambientAudioEngine = createAmbientAudioEngine();
