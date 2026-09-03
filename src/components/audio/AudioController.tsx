import { useEffect } from "react";
import { ambientAudioEngine } from "../../audio/engine";
import { buildWorldMix } from "../../audio/mixer";
import { useAudioStore, useWorldStore } from "../../stores";
import WorldControls from "../common/WorldControls";

function AudioController() {
  const tiles = useWorldStore((state) => state.world.tiles);
  const hydrated = useWorldStore((state) => state.hydrated);
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
