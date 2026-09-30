import { useEffect, useId, useRef, useState } from "react";
import { Pause, Play, Settings, Volume2, VolumeX } from "lucide-react";

interface WorldControlsProps {
  footstepsEnabled: boolean;
  callsEnabled: boolean;
  onFootstepsEnabledChange: (enabled: boolean) => void;
  onCallsEnabledChange: (enabled: boolean) => void;
  muted: boolean;
  playing: boolean;
  volume: number;
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
  onMutedChange,
  onPlayingChange,
  onVolumeChange,
}: WorldControlsProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsId = useId();
  const settingsContainer = useRef<HTMLDivElement>(null);
  const settingsButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!settingsOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !settingsContainer.current?.contains(event.target)
      ) {
        setSettingsOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSettingsOpen(false);
        settingsButton.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [settingsOpen]);

  return (
    <div className="bg-surface/90 absolute top-4 right-4 z-20 flex items-center gap-2 rounded-lg border border-white/10 p-2 shadow-xl backdrop-blur">
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
      <div ref={settingsContainer} className="relative">
        <button
          ref={settingsButton}
          aria-label="進階音訊設定"
          aria-expanded={settingsOpen}
          aria-controls={settingsId}
          className="hover:bg-surface-hover grid size-9 place-items-center rounded-md transition-colors"
          onClick={() => setSettingsOpen(!settingsOpen)}
          type="button"
        >
          <Settings className="size-4" />
        </button>
        {settingsOpen && (
          <section
            id={settingsId}
            aria-label="進階音訊設定"
            className="bg-surface absolute top-full right-0 mt-3 w-56 rounded-lg border border-white/10 p-3 shadow-xl"
          >
            <h2 className="mb-3 text-sm font-semibold">進階音訊設定</h2>
            <label className="flex cursor-pointer items-center justify-between gap-4 text-sm">
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
            <label className="mt-3 flex cursor-pointer items-center justify-between gap-4 text-sm">
              寵物叫聲
              <input
                className="accent-primary size-4"
                type="checkbox"
                role="switch"
                checked={callsEnabled}
                onChange={(event) => onCallsEnabledChange(event.target.checked)}
              />
            </label>
          </section>
        )}
      </div>
    </div>
  );
}

export default WorldControls;
