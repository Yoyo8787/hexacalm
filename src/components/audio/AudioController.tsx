import { useEffect, useSyncExternalStore } from "react";
import { ambientAudioEngine } from "../../audio/engine";
import { buildWorldMix } from "../../audio/mixer";
import { useAudioStore, useWorldStore } from "../../stores";
import WorldControls from "../common/WorldControls";

function AudioController() {
  const tiles = useWorldStore((state) => state.world.tiles);
  const hydrated = useWorldStore((state) => state.hydrated);
  const muted = useAudioStore((state) => state.muted);
  const volume = useAudioStore((state) => state.volume);
  const setMuted = useAudioStore((state) => state.setMuted);
  const setVolume = useAudioStore((state) => state.setVolume);
  const playing = useSyncExternalStore(
    ambientAudioEngine.subscribe,
    ambientAudioEngine.isPlaying,
  );

  useEffect(() => {
    ambientAudioEngine.setMix(buildWorldMix(hydrated ? tiles : {}));
  }, [hydrated, tiles]);

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

  async function handlePlayingChange(nextPlaying: boolean): Promise<void> {
    if (!nextPlaying) {
      ambientAudioEngine.pause();
      return;
    }

    try {
      await ambientAudioEngine.play();
    } catch (error) {
      console.error("Unable to start ambient audio.", error);
    }
  }

  return (
    <WorldControls
      muted={muted}
      onMutedChange={setMuted}
      onPlayingChange={handlePlayingChange}
      onVolumeChange={setVolume}
      playing={playing}
      volume={volume}
    />
  );
}

export default AudioController;
