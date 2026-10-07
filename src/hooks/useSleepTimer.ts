import { useEffect, useState } from "react";
import { useAudioStore } from "../stores";
import { ambientAudioEngine } from "../audio/engine";

export function useSleepTimer() {
  const [deadline, setDeadline] = useState<number | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);

  useEffect(() => {
    ambientAudioEngine.setSleepDeadline(deadline);
    if (deadline === null) return;
    let disposed = false;
    let finished = false;
    let requesting = false;
    let lock: WakeLockSentinel | null = null;

    const release = async (held: WakeLockSentinel) => {
      try {
        await held.release();
      } catch (error) {
        console.log("[睡眠倒數] 螢幕喚醒釋放失敗", error);
      }
    };
    const update = () => {
      if (finished) return;
      const remaining = deadline - Date.now();
      if (remaining <= 0) {
        finished = true;
        ambientAudioEngine.setPlaying(false);
        useAudioStore.getState().setPlaying(false);
        setDeadline(null);
        setRemainingSeconds(null);
        if (lock) void release(lock);
      } else {
        setRemainingSeconds(Math.ceil(remaining / 1000));
      }
    };
    const acquire = async () => {
      if (
        disposed ||
        finished ||
        requesting ||
        lock ||
        document.visibilityState !== "visible"
      )
        return;
      if (!("wakeLock" in navigator)) {
        console.log("[睡眠倒數] 瀏覽器不支援螢幕喚醒");
        return;
      }
      requesting = true;
      try {
        const held = await navigator.wakeLock.request("screen");
        held.addEventListener("release", () => {
          if (lock === held) lock = null;
          console.log("[睡眠倒數] 螢幕喚醒已釋放");
        });
        if (disposed || finished || Date.now() >= deadline) {
          await release(held);
          return;
        }
        lock = held;
        console.log("[睡眠倒數] 螢幕喚醒已啟用");
      } catch (error) {
        console.log("[睡眠倒數] 無法啟用螢幕喚醒", error);
      } finally {
        requesting = false;
      }
    };
    const onVisibilityChange = () => {
      update();
      if (!finished && document.visibilityState === "visible") {
        ambientAudioEngine.setSleepDeadline(deadline);
      }
      if (document.visibilityState === "visible") void acquire();
    };
    update();
    void acquire();
    const interval = setInterval(update, 1000);
    const timeout = setTimeout(update, Math.max(0, deadline - Date.now()));
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      disposed = true;
      ambientAudioEngine.setSleepDeadline(null);
      clearInterval(interval);
      clearTimeout(timeout);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (lock) void release(lock);
    };
  }, [deadline]);

  return {
    remainingSeconds,
    remainingMinutes:
      remainingSeconds === null ? null : Math.ceil(remainingSeconds / 60),
    start: (minutes: number) => {
      setRemainingSeconds(minutes * 60);
      setDeadline(Date.now() + minutes * 60_000);
    },
    cancel: () => {
      setDeadline(null);
      setRemainingSeconds(null);
    },
  };
}
