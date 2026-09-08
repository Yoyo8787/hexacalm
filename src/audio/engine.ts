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

const EMPTY_MIX: AudioMixSource[] = [];
const GESTURE_EVENTS = ["pointerdown", "keydown"] as const;

export type DebugLoop = Readonly<
  Pick<AudioMixSource, "source" | "targetVolume">
>;

export interface AmbientAudioEngine {
  setPlaying: (playing: boolean) => void;
  setMuted: (muted: boolean) => void;
  setMasterVolume: (volume: number) => void;
  setMix: (mix: AudioMixSource[]) => void;
  subscribeDebugLoops: (
    listener: (loops: readonly DebugLoop[]) => void,
  ) => () => void;
  dispose: () => void;
}

export function createAmbientAudioEngine(): AmbientAudioEngine {
  const activeLoops = new Map<AmbientSourceId, ActiveLoop>();
  const debugListeners = new Set<() => void>();
  const pendingDisposals = new Map<ReturnType<typeof setTimeout>, () => void>();
  const unavailableSources = new Set<AmbientSourceId>();
  let stopWaitingForGesture: (() => void) | null = null;
  let masterGain: Tone.Gain | null = null;
  let masterVolume = DEFAULT_MASTER_VOLUME;
  let mix = EMPTY_MIX;
  let muted = false;
  let playing = false;

  function subscribeDebugLoops(
    listener: (loops: readonly DebugLoop[]) => void,
  ): () => void {
    if (!import.meta.env.DEV) {
      return () => {};
    }

    const notify = () => {
      const loops = Array.from(activeLoops.entries())
        .map(([source, loop]) => ({ source, targetVolume: loop.targetVolume }))
      listener(loops);
    };

    debugListeners.add(notify);
    notify();
    return () => {
      debugListeners.delete(notify);
    };
  }

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

    if (import.meta.env.DEV) {
      debugListeners.forEach((notify) => notify());
    }
  }

  function cancelGestureWait(): void {
    stopWaitingForGesture?.();
    stopWaitingForGesture = null;
  }

  /**
   * Browsers only let an AudioContext run once the page has been interacted
   * with, so a restored playing state waits for the next pointer or key event
   * rather than being downgraded to paused.
   */
  function waitForGesture(): void {
    if (stopWaitingForGesture) {
      return;
    }

    const onGesture = () => {
      cancelGestureWait();
      void startPlayback();
    };

    GESTURE_EVENTS.forEach((event) =>
      window.addEventListener(event, onGesture, { once: true }),
    );

    stopWaitingForGesture = () =>
      GESTURE_EVENTS.forEach((event) =>
        window.removeEventListener(event, onGesture),
      );
  }

  async function startPlayback(): Promise<void> {
    await Tone.start();

    if (!playing) {
      return;
    }

    if (Tone.getContext().state !== "running") {
      waitForGesture();
      return;
    }

    ensureMasterGain();
    updateMasterGain();
    activeLoops.forEach((loop) => startLoop(loop));
    sync();
  }

  /**
   * Pausing only fades the master gain so that resuming stays smooth. The loops
   * are ambience, so their playback position carries no meaning and keeping the
   * players running avoids a restart seam on the next play.
   */
  function setPlaying(nextPlaying: boolean): void {
    if (playing === nextPlaying) {
      return;
    }

    playing = nextPlaying;

    if (!playing) {
      cancelGestureWait();
      updateMasterGain();
      return;
    }

    startPlayback().catch((error) => {
      console.error("Unable to start ambient audio.", error);
      waitForGesture();
    });
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
    debugListeners.clear();
    cancelGestureWait();
    pendingDisposals.forEach((disposePending, timer) => {
      clearTimeout(timer);
      disposePending();
    });
    pendingDisposals.clear();

    activeLoops.forEach((_, source) => removeLoop(source, 0));
    masterGain?.dispose();
    masterGain = null;
    mix = EMPTY_MIX;
    playing = false;
  }

  return {
    setPlaying,
    setMuted,
    setMasterVolume,
    setMix,
    subscribeDebugLoops,
    dispose,
  };
}

export const ambientAudioEngine = createAmbientAudioEngine();
