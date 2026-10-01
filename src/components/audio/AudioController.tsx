import { useEffect } from "react";
import { ambientAudioEngine } from "../../audio/engine";
import { buildWorldMix } from "../../audio/mixer";
import { createCharacterMixCache } from "../../audio/characterMix";
import { CHARACTER_MIX_UPDATE_INTERVAL } from "../../constants/audio";
import { useAudioStore, useWorldStore } from "../../stores";
import WorldControls from "../common/WorldControls";

function AudioController() {
  const hydrated = useWorldStore((state) => state.hydrated);
  const characterId = useWorldStore(
    (state) => state.world.character?.id ?? null,
  );
  const footstepsEnabled = useAudioStore((state) => state.footstepsEnabled);
  const callsEnabled = useAudioStore((state) => state.callsEnabled);
  const setFootstepsEnabled = useAudioStore(
    (state) => state.setFootstepsEnabled,
  );
  const setCallsEnabled = useAudioStore((state) => state.setCallsEnabled);
  const muted = useAudioStore((state) => state.muted);
  const playing = useAudioStore((state) => state.playing);
  const volume = useAudioStore((state) => state.volume);
  const setMuted = useAudioStore((state) => state.setMuted);
  const setPlaying = useAudioStore((state) => state.setPlaying);
  const setVolume = useAudioStore((state) => state.setVolume);

  useEffect(() => {
    let tiles = useWorldStore.getState().world.tiles;
    let characterMix = createCharacterMixCache(tiles);
    let worldMix = buildWorldMix(tiles);
    const update = () => {
      const state = useWorldStore.getState();
      if (tiles !== state.world.tiles) {
        tiles = state.world.tiles;
        characterMix = createCharacterMixCache(tiles);
        worldMix = buildWorldMix(tiles);
      }
      ambientAudioEngine.setMix(
        !state.hydrated
          ? []
          : state.world.character && state.characterPose
            ? characterMix(state.characterPose)
            : worldMix,
      );
    };
    update();
    const unsubscribe = useWorldStore.subscribe((state, previous) => {
      if (
        state.world.tiles !== previous.world.tiles ||
        state.world.character !== previous.world.character ||
        state.hydrated !== previous.hydrated
      )
        update();
    });
    const timer = setInterval(update, CHARACTER_MIX_UPDATE_INTERVAL);
    return () => {
      unsubscribe();
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    ambientAudioEngine.setCharacter(hydrated ? characterId : null);
  }, [hydrated, characterId]);

  useEffect(() => {
    ambientAudioEngine.setCharacterSoundSettings({
      footstepsEnabled,
      callsEnabled,
    });
  }, [footstepsEnabled, callsEnabled]);

  useEffect(() => {
    ambientAudioEngine.setPlaying(playing);
  }, [playing]);

  useEffect(() => {
    ambientAudioEngine.setMuted(muted);
  }, [muted]);

  useEffect(() => {
    ambientAudioEngine.setMasterVolume(volume);
  }, [volume]);

  useEffect(
    () => () => {
      ambientAudioEngine.dispose();
    },
    [],
  );

  return (
    <WorldControls
      footstepsEnabled={footstepsEnabled}
      callsEnabled={callsEnabled}
      onFootstepsEnabledChange={setFootstepsEnabled}
      onCallsEnabledChange={setCallsEnabled}
      muted={muted}
      onMutedChange={setMuted}
      onPlayingChange={setPlaying}
      onVolumeChange={setVolume}
      playing={playing}
      volume={volume}
    />
  );
}

export default AudioController;
