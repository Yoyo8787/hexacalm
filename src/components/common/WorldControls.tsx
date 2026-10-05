import { useEffect, useId, useRef } from "react";
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
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !container.current?.contains(event.target)
      ) {
        onMenuOpenChange(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [menuOpen, onMenuOpenChange]);

  const VolumeIcon = muted ? VolumeX : Volume2;

  return (
    <div
      ref={container}
      className="panel relative flex items-center gap-0.5 rounded-xl p-1"
    >
      <button
        aria-label={playing ? "暫停" : "播放"}
        className="grid size-9 place-items-center rounded-lg transition-colors hover:bg-white/7"
        onClick={() => onPlayingChange(!playing)}
        type="button"
      >
        {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
      </button>
      <button
        aria-label="聲音設定"
        aria-expanded={menuOpen}
        aria-controls={menuId}
        className={`flex h-9 items-center gap-2 rounded-lg px-2.5 transition-colors hover:bg-white/7 ${
          menuOpen ? "bg-white/7" : ""
        }`}
        onClick={() => onMenuOpenChange(!menuOpen)}
        type="button"
      >
        <VolumeIcon className="size-4" />
        <span className="text-[13px] tabular-nums">
          {Math.round(volume * 100)}%
        </span>
      </button>
      {menuOpen && (
        <section
          id={menuId}
          aria-label="聲音設定"
          className="popover absolute top-full right-0 mt-2 w-64 rounded-xl p-3"
        >
          <div className="flex items-center gap-2">
            <button
              aria-label={muted ? "取消靜音" : "靜音"}
              aria-pressed={muted}
              className="text-muted hover:text-foreground grid size-8 shrink-0 place-items-center rounded-lg transition-colors hover:bg-white/7"
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
          <div className="mt-3 border-t border-white/8 pt-3">
            <h2 className="text-muted mb-2 text-xs font-semibold">寵物聲音</h2>
            <label className="flex cursor-pointer items-center justify-between gap-4 text-sm">
              叫聲
              <input
                className="accent-primary size-4"
                type="checkbox"
                role="switch"
                checked={callsEnabled}
                onChange={(event) => onCallsEnabledChange(event.target.checked)}
              />
            </label>
            <label className="mt-2 flex cursor-pointer items-center justify-between gap-4 text-sm">
              腳步聲
              <input
                className="accent-primary size-4"
                type="checkbox"
                role="switch"
                checked={footstepsEnabled}
                onChange={(event) =>
                  onFootstepsEnabledChange(event.target.checked)
                }
              />
            </label>
          </div>
        </section>
      )}
    </div>
  );
}

export default WorldControls;
