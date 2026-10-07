import { useEffect, useState } from "react";

export function useIdleHud(enabled: boolean): boolean {
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const wake = () => {
      setIdle(false);
      clearTimeout(timer);
      if (enabled) timer = setTimeout(() => setIdle(true), 8000);
    };
    wake();
    const events = [
      "pointermove",
      "pointerdown",
      "keydown",
      "wheel",
      "focusin",
    ] as const;
    events.forEach((event) =>
      window.addEventListener(event, wake, { passive: true }),
    );
    return () => {
      clearTimeout(timer);
      events.forEach((event) => window.removeEventListener(event, wake));
    };
  }, [enabled]);

  return enabled && idle;
}
