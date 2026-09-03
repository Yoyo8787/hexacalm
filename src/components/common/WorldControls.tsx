import { Pause, Play, Volume2, VolumeX } from "lucide-react";

interface WorldControlsProps {
  muted: boolean;
  playing: boolean;
  volume: number;
  onMutedChange: (muted: boolean) => void;
  onPlayingChange: (playing: boolean) => void;
  onVolumeChange: (volume: number) => void;
}

function WorldControls({
  muted,
  playing,
  volume,
  onMutedChange,
  onPlayingChange,
  onVolumeChange,
}: WorldControlsProps) {
  return (
    <div className="bg-surface/90 absolute top-4 right-4 z-10 flex items-center gap-2 rounded-lg border border-white/10 p-2 shadow-xl backdrop-blur">
      <button
        aria-label={playing ? "暫停" : "播放"}
        className="hover:bg-surface-hover grid size-9 place-items-center rounded-md transition-colors"
        onClick={() => onPlayingChange(!playing)}
        type="button"
      >
        {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
      </button>
      <button
        aria-label={muted ? "取消靜音" : "靜音"}
        className="hover:bg-surface-hover grid size-9 place-items-center rounded-md transition-colors"
        onClick={() => onMutedChange(!muted)}
        type="button"
      >
        {muted ? (
          <VolumeX className="size-4" />
        ) : (
          <Volume2 className="size-4" />
        )}
      </button>
      <input
        aria-label="主音量"
        className="accent-primary w-24"
        max="1"
        min="0"
        onChange={(event) => onVolumeChange(Number(event.target.value))}
        step="0.05"
        type="range"
        value={volume}
      />
    </div>
  );
}

export default WorldControls;
