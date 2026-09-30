import * as Tone from "tone";
import { CHARACTER_AUDIO, DEFAULT_AUDIO_SETTINGS } from "../constants/audio";
import { getCharacterDefinition } from "../constants/characterCatalog";
import type { AudioSettings, CharacterId } from "../types";
import { loadAmbientBuffer } from "./buffers";

export type CharacterSoundSettings = Pick<
  AudioSettings,
  "footstepsEnabled" | "callsEnabled"
>;

export function createCharacterAudio(output: Tone.Gain) {
  const context = Tone.getContext();
  const callGain = new Tone.Gain(CHARACTER_AUDIO.callGain).connect(output);
  const footstepGain = new Tone.Gain(CHARACTER_AUDIO.footstepGain).connect(
    output,
  );
  let character: CharacterId | null = null;
  let settings: CharacterSoundSettings = DEFAULT_AUDIO_SETTINGS;
  let active = false;
  let disposed = false;
  let generation = 0;
  let call: Tone.Player | null = null;
  let footstep: Tone.Player | null = null;
  let timer: ReturnType<typeof setTimeout> | null = null;

  function audible(): boolean {
    return (
      !disposed && active && context.state === "running" && character !== null
    );
  }

  function cancelCall(): void {
    if (timer !== null) clearTimeout(timer);
    timer = null;
    if (call) {
      call.onstop = () => {};
      call.stop();
      call.dispose();
      call = null;
    }
  }

  function scheduleCall(): void {
    if (
      !audible() ||
      !settings.callsEnabled ||
      !call?.loaded ||
      call.state === "started" ||
      timer !== null
    )
      return;
    const delay =
      CHARACTER_AUDIO.callIntervalMin +
      Math.random() *
        (CHARACTER_AUDIO.callIntervalMax - CHARACTER_AUDIO.callIntervalMin);
    timer = setTimeout(() => {
      timer = null;
      if (audible() && settings.callsEnabled && call?.loaded) call.start();
    }, delay * 1000);
  }

  function loadPlayers(): void {
    const currentGeneration = ++generation;
    cancelCall();
    footstep?.stop();
    footstep?.dispose();
    footstep = null;
    if (!character || disposed) return;
    const definition = getCharacterDefinition(character);
    if (!definition) return;

    const nextCall = new Tone.Player().connect(callGain);
    const nextFootstep = new Tone.Player().connect(footstepGain);
    call = nextCall;
    footstep = nextFootstep;
    nextCall.onstop = () => {
      queueMicrotask(() => {
        if (call === nextCall) scheduleCall();
      });
    };
    for (const [player, path] of [
      [nextCall, definition.callAudioPath],
      [nextFootstep, CHARACTER_AUDIO.footstepPath],
    ] as const) {
      void loadAmbientBuffer(path)
        .then((buffer) => {
          if (disposed || generation !== currentGeneration) {
            buffer.dispose();
            return;
          }
          player.buffer = buffer;
          if (player === call) scheduleCall();
        })
        .catch((error) => {
          if (disposed || generation !== currentGeneration) return;
          console.error(`無法載入角色音效 ${path}。`, error);
          if (player === call) {
            call = null;
          } else {
            footstep = null;
          }
          player.dispose();
        });
    }
  }

  function stopCall(): void {
    if (timer !== null) clearTimeout(timer);
    timer = null;
    call?.stop();
  }

  function syncPlayback(): void {
    if (!audible()) {
      stopCall();
      footstep?.stop();
      return;
    }
    scheduleCall();
  }

  function onVisibilityChange(): void {
    if (document.hidden) footstep?.stop();
  }

  context.on("statechange", syncPlayback);
  document.addEventListener("visibilitychange", onVisibilityChange);

  return {
    setCharacter(id: CharacterId | null): void {
      if (character === id) return;
      character = id;
      loadPlayers();
    },
    setActive(nextActive: boolean): void {
      if (active === nextActive) return;
      active = nextActive;
      syncPlayback();
    },
    setSettings(nextSettings: CharacterSoundSettings): void {
      const callsChanged = settings.callsEnabled !== nextSettings.callsEnabled;
      settings = nextSettings;
      if (!settings.footstepsEnabled) footstep?.stop();
      if (callsChanged) {
        stopCall();
        scheduleCall();
      }
    },
    playFootstep(): void {
      if (
        !audible() ||
        !settings.footstepsEnabled ||
        document.hidden ||
        !footstep?.loaded
      )
        return;
      const now = Tone.now();
      footstep.stop(now);
      footstep.start(now);
    },
    dispose(): void {
      disposed = true;
      generation++;
      context.off("statechange", syncPlayback);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      cancelCall();
      footstep?.stop();
      footstep?.dispose();
      callGain.dispose();
      footstepGain.dispose();
    },
  };
}
