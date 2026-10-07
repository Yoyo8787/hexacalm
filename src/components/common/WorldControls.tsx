import { useId, useRef } from "react";
import ResponsiveMenu from "./ResponsiveMenu";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";

interface WorldControlsProps {
  footstepsEnabled: boolean;
  callsEnabled: boolean;
  onFootstepsEnabledChange: (enabled: boolean) => void;
  onCallsEnabledChange: (enabled: boolean) => void;
  muted: boolean;
  playing: boolean;
  volume: number;
  menuOpen: boolean;
  onMenuOpenChange: (open: boolean) => void;
  onMutedChange: (muted: boolean) => void;
  onPlayingChange: (playing: boolean) => void;
  onVolumeChange: (volume: number) => void;
}

function WorldControls({
  footstepsEnabled,
  callsEnabled,
  onFootstepsEnabledChange,
  onCallsEnabledChange,
  muted,
  playing,
  volume,
  menuOpen,
  onMenuOpenChange,
  onMutedChange,
  onPlayingChange,
  onVolumeChange,
}: WorldControlsProps) {
  const menuId = useId();
  const trigger = useRef<HTMLButtonElement>(null);

  const VolumeIcon = muted ? VolumeX : Volume2;

  return (
    <div className="panel relative flex items-center gap-0.5 rounded-xl p-1">
      <button
        aria-label={playing ? "暫停" : "播放"}
        className="hover:bg-hover grid size-9 place-items-center rounded-lg transition-colors"
        onClick={() => onPlayingChange(!playing)}
        type="button"
      >
        {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
      </button>
      <button
        aria-label="聲音設定"
        ref={trigger}
        aria-expanded={menuOpen}
        aria-controls={menuId}
        className={`hover:bg-hover flex h-9 items-center gap-2 rounded-lg px-2.5 transition-colors ${
          menuOpen ? "bg-hover" : ""
        }`}
        onClick={() => onMenuOpenChange(!menuOpen)}
        type="button"
      >
        <VolumeIcon className="size-4" />
        <span className="text-[13px] tabular-nums">
          {Math.round(volume * 100)}%
        </span>
      </button>
      <ResponsiveMenu
        open={menuOpen}
        id={menuId}
        label="聲音設定"
        trigger={trigger}
        onClose={() => onMenuOpenChange(false)}
        desktopClassName="absolute top-full right-0 mt-2 w-64 rounded-xl p-3"
      >
        <div className="flex items-center gap-2 py-5 md:py-2">
          <button
            aria-label={muted ? "取消靜音" : "靜音"}
            aria-pressed={muted}
            className="text-muted hover:text-foreground hover:bg-hover grid size-11 shrink-0 place-items-center rounded-lg transition-colors sm:size-8"
            onClick={() => onMutedChange(!muted)}
            type="button"
          >
            <VolumeIcon className="size-4" />
          </button>
          <input
            aria-label="主音量"
            className="accent-primary min-w-0 flex-1"
            max="1"
            min="0"
            onChange={(event) => onVolumeChange(Number(event.target.value))}
            step="0.05"
            type="range"
            value={volume}
          />
        </div>
        <div className="border-line mt-3 border-t pt-3">
          <h2 className="text-muted mb-2 text-xs font-semibold">寵物聲音</h2>
          <label className="flex min-h-11 cursor-pointer items-center justify-between gap-4 text-sm sm:min-h-0">
            叫聲
            <input
              className="peer sr-only"
              type="checkbox"
              role="switch"
              checked={callsEnabled}
              onChange={(event) => onCallsEnabledChange(event.target.checked)}
            />
            <span
              aria-hidden="true"
              className="bg-line peer-checked:bg-primary peer-focus-visible:ring-primary after:bg-surface relative h-6 w-10 shrink-0 rounded-full peer-focus-visible:ring-2 after:absolute after:top-0.5 after:left-0.5 after:size-5 after:rounded-full after:transition-transform peer-checked:after:translate-x-4"
            />
          </label>
          <label className="mt-2 flex min-h-11 cursor-pointer items-center justify-between gap-4 text-sm sm:min-h-0">
            腳步聲
            <input
              className="peer sr-only"
              type="checkbox"
              role="switch"
              checked={footstepsEnabled}
              onChange={(event) =>
                onFootstepsEnabledChange(event.target.checked)
              }
            />
            <span
              aria-hidden="true"
              className="bg-line peer-checked:bg-primary peer-focus-visible:ring-primary after:bg-surface relative h-6 w-10 shrink-0 rounded-full peer-focus-visible:ring-2 after:absolute after:top-0.5 after:left-0.5 after:size-5 after:rounded-full after:transition-transform peer-checked:after:translate-x-4"
            />
          </label>
        </div>
      </ResponsiveMenu>
    </div>
  );
}

export default WorldControls;
