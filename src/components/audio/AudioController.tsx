import { useEffect } from "react";
import { ambientAudioEngine } from "../../audio/engine";
import { buildWorldMix } from "../../audio/mixer";
import { useAudioStore, useWorldStore } from "../../stores";
import WorldControls from "../common/WorldControls";

function AudioController() {
  const tiles = useWorldStore((state) => state.world.tiles);
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
    ambientAudioEngine.setMix(buildWorldMix(hydrated ? tiles : {}));
  }, [hydrated, tiles]);

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
