import { useId, useRef, useState } from "react";
import { Timer, X } from "lucide-react";
import { useSleepTimer } from "../../hooks/useSleepTimer";

const PRESETS = [15, 30, 60] as const;

interface SleepTimerProps {
  onOpenChange: (open: boolean) => void;
}

function SleepTimer({ onOpenChange }: SleepTimerProps) {
  const { remainingMinutes, remainingSeconds, start, cancel } = useSleepTimer();
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const inputId = useId();
  const errorId = useId();
  const [minutes, setMinutes] = useState("30");
  const [custom, setCustom] = useState(false);
  const value = Number(minutes);
  const valid =
    /^\d+$/.test(minutes) &&
    Number.isInteger(value) &&
    value >= 1 &&
    value <= 180;
  const running = remainingMinutes !== null;

  return (
    <>
      <button
        aria-label={
          running ? `睡眠倒數，剩餘 ${remainingMinutes} 分鐘` : "睡眠倒數"
        }
        aria-haspopup="dialog"
        className="panel hover:bg-hover flex h-11 items-center gap-2 rounded-xl px-3 transition-colors"
        onClick={() => {
          setMinutes(String(remainingMinutes ?? 30));
          setCustom(
            remainingMinutes !== null &&
              !PRESETS.some((preset) => preset === remainingMinutes),
          );
          dialog.current?.showModal();
          onOpenChange(true);
        }}
        type="button"
      >
        <Timer aria-hidden="true" className="size-4" />
        {running && (
          <span className="text-[13px] tabular-nums">
            {remainingMinutes} 分鐘
          </span>
        )}
      </button>
      {/* The black backdrop and shadow-2xl dim the scene in both day and
          night themes, so they stay fixed instead of using color tokens. */}
      <dialog
        ref={dialog}
        aria-labelledby={titleId}
        className="bg-surface text-foreground border-line fixed inset-0 m-auto max-h-[calc(100svh-2rem)] w-[min(440px,calc(100%-2rem))] overflow-auto rounded-2xl border p-6 shadow-2xl backdrop:bg-black/60"
        onKeyDown={(event) => event.stopPropagation()}
        onClose={() => onOpenChange(false)}
        onClick={(event) => {
          if (event.target !== event.currentTarget) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < bounds.left ||
            event.clientX > bounds.right ||
            event.clientY < bounds.top ||
            event.clientY > bounds.bottom
          )
            dialog.current?.close();
        }}
      >
        <div className="flex items-center justify-between gap-4">
          <h2 id={titleId} className="text-xl font-semibold">
            睡眠倒數
          </h2>
          <button
            aria-label="關閉睡眠倒數設定"
            className="text-muted hover:text-foreground hover:bg-hover grid size-9 place-items-center rounded-lg"
            onClick={() => dialog.current?.close()}
            type="button"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>
        <p className="text-muted mt-2 text-sm">
          最後一分鐘聲音會漸弱，時間到後自動暫停。
        </p>
        {remainingSeconds !== null && (
          <div className="mt-6 text-center">
            <p className="text-muted text-sm">剩餘時間</p>
            <p
              className="text-primary mt-2 text-5xl font-semibold tabular-nums"
              aria-label={`剩餘 ${Math.floor(remainingSeconds / 60)} 分 ${remainingSeconds % 60} 秒`}
            >
              {String(Math.floor(remainingSeconds / 60)).padStart(2, "0")}:
              {String(remainingSeconds % 60).padStart(2, "0")}
            </p>
          </div>
        )}
        <form
          className="mt-6"
          onSubmit={(event) => {
            event.preventDefault();
            if (!valid) return;
            start(value);
            dialog.current?.close();
          }}
        >
          <div
            role="group"
            aria-label="倒數時間"
            className="mb-4 grid grid-cols-4 gap-2"
          >
            {PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                aria-pressed={!custom && value === preset}
                className={`min-h-11 rounded-lg border px-2 text-sm ${!custom && value === preset ? "border-primary bg-primary/16 text-primary" : "border-line hover:bg-hover"}`}
                onClick={() => {
                  setCustom(false);
                  setMinutes(String(preset));
                }}
              >
                {preset} 分鐘
              </button>
            ))}
            <button
              type="button"
              aria-pressed={custom}
              className={`min-h-11 rounded-lg border px-2 text-sm ${custom ? "border-primary bg-primary/16 text-primary" : "border-line hover:bg-hover"}`}
              onClick={() => setCustom(true)}
            >
              自訂
            </button>
          </div>
          {custom && (
            <>
              <label htmlFor={inputId} className="text-sm font-medium">
                倒數分鐘
              </label>
              <input
                id={inputId}
                aria-invalid={!valid}
                aria-describedby={valid ? undefined : errorId}
                className="bg-background focus:border-primary border-line mt-2 w-full rounded-lg border px-4 py-3 outline-none"
                type="number"
                inputMode="numeric"
                min="1"
                max="180"
                step="1"
                required
                value={minutes}
                onChange={(event) => setMinutes(event.target.value)}
              />
              {!valid && (
                <p
                  id={errorId}
                  role="alert"
                  className="text-danger mt-2 text-sm"
                >
                  請輸入 1–180 的整數分鐘。
                </p>
              )}
            </>
          )}
          <div className="mt-6 flex gap-3">
            {running && (
              <button
                className="border-line hover:bg-hover flex-1 rounded-lg border px-4 py-3 text-sm"
                type="button"
                onClick={() => {
                  cancel();
                  dialog.current?.close();
                }}
              >
                取消倒數
              </button>
            )}
            <button
              className="bg-primary text-on-primary flex-1 rounded-lg px-4 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!valid}
              type="submit"
            >
              {running ? "重新開始" : "開始倒數"}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}

export default SleepTimer;
