import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  DAY_START_HOUR,
  NIGHT_START_HOUR,
  REDUCED_TIME_TRANSITION,
  TIME_CHECK_INTERVAL,
  UI_TIME_TRANSITION,
} from "../constants/ambience";
import { useWorldStore } from "../stores";
import type { TimeOfDay } from "../types";

function getDeviceTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  return hour >= DAY_START_HOUR && hour < NIGHT_START_HOUR ? "day" : "night";
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useTimeOfDay(): TimeOfDay {
  const timeMode = useWorldStore((state) => state.world.timeMode);
  const [deviceTime, setDeviceTime] = useState(getDeviceTimeOfDay);

  useEffect(() => {
    // Keep ticking in every mode so switching back to auto is never stale.
    const timer = setInterval(
      () => setDeviceTime(getDeviceTimeOfDay()),
      TIME_CHECK_INTERVAL,
    );
    return () => clearInterval(timer);
  }, []);

  return timeMode === "auto" ? deviceTime : timeMode;
}

// Mirrors the time of day onto <html data-time> so the color tokens follow it.
export function useTimeTheme(): void {
  const timeOfDay = useTimeOfDay();
  const hydrated = useWorldStore((state) => state.hydrated);
  const applied = useRef<TimeOfDay | null>(null);

  useLayoutEffect(() => {
    const root = document.documentElement;
    // Restoring a save is not a switch, so only fade after hydration.
    const animate = applied.current !== null && applied.current !== timeOfDay;
    applied.current = hydrated ? timeOfDay : null;
    root.dataset.time = timeOfDay;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", timeOfDay === "night" ? "#121c2a" : "#e6ebe4");
    if (!animate) return;

    root.classList.add("time-transition");
    const duration = prefersReducedMotion()
      ? REDUCED_TIME_TRANSITION
      : UI_TIME_TRANSITION;
    const timer = setTimeout(
      () => root.classList.remove("time-transition"),
      duration * 1000,
    );
    return () => {
      clearTimeout(timer);
      root.classList.remove("time-transition");
    };
  }, [timeOfDay, hydrated]);
}
