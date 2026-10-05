import { useEffect, useId, useRef } from "react";
import { CloudFog, CloudRain, Moon, Sun, SunMoon } from "lucide-react";
import { useTimeOfDay } from "../../hooks/useTimeOfDay";
import { useWorldStore } from "../../stores";
import type { TimeMode } from "../../types";

interface AmbienceControlProps {
  menuOpen: boolean;
  onMenuOpenChange: (open: boolean) => void;
}

const TIME_MODES = [
  { id: "auto", label: "自動", Icon: SunMoon },
  { id: "day", label: "晝", Icon: Sun },
  { id: "night", label: "夜", Icon: Moon },
] as const satisfies readonly {
  id: TimeMode;
  label: string;
  Icon: typeof Sun;
}[];

const WEATHER = [
  { label: "晴", Icon: Sun },
  { label: "雨", Icon: CloudRain },
  { label: "霧", Icon: CloudFog },
] as const;

function AmbienceControl({ menuOpen, onMenuOpenChange }: AmbienceControlProps) {
  const timeMode = useWorldStore((state) => state.world.timeMode);
  const setTimeMode = useWorldStore((state) => state.setTimeMode);
  const timeOfDay = useTimeOfDay();
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

  const night = timeOfDay === "night";
  const TimeIcon = night ? Moon : Sun;

  return (
    <div ref={container} className="relative">
      <div
        className={`panel flex rounded-xl p-1 ${menuOpen ? "ring-primary ring-2" : ""}`}
      >
        <button
          aria-label={`氛圍：${night ? "夜" : "晝"}`}
          aria-expanded={menuOpen}
          aria-controls={menuId}
          className={`hover:bg-hover grid size-9 place-items-center rounded-lg transition-colors ${
            night ? "text-accent" : "text-primary"
          } ${menuOpen ? "bg-hover" : ""}`}
          onClick={() => onMenuOpenChange(!menuOpen)}
          type="button"
        >
          <TimeIcon className="size-4" />
        </button>
      </div>
      {menuOpen && (
        <>
          {/* Phones show the panel as a bottom sheet over a scrim. Black
              dims the scene in both day and night, so it skips the tokens. */}
          <div
            aria-hidden="true"
            className="fixed inset-0 bg-black/30 sm:hidden"
            onClick={() => onMenuOpenChange(false)}
          />
          <section
            id={menuId}
            aria-label="氛圍"
            className="popover fixed inset-x-0 bottom-0 flex flex-col gap-4 rounded-t-[20px] px-5 pt-2.5 pb-7 sm:absolute sm:inset-x-auto sm:top-full sm:right-0 sm:bottom-auto sm:mt-2 sm:w-59 sm:gap-3 sm:rounded-xl sm:p-3"
          >
            <span className="bg-line h-1 w-9 self-center rounded-xs sm:hidden" />
            <div className="flex items-baseline justify-between">
              <h2 className="text-[17px] font-semibold sm:text-[13px]">氛圍</h2>
              <span className="text-muted text-xs sm:text-[11px]">時段</span>
            </div>
            <div
              aria-label="時段"
              className="bg-hover grid grid-cols-3 gap-0.75 rounded-xl p-1 sm:gap-0.5 sm:rounded-[10px] sm:p-0.75"
              role="radiogroup"
            >
              {TIME_MODES.map(({ id, label, Icon }) => (
                // The checked shadow is a fixed neutral lift from the design;
                // it reads the same on both surfaces, so it skips the tokens.
                <label
                  className="text-muted hover:text-foreground has-checked:bg-surface has-checked:text-foreground has-focus-visible:ring-primary flex h-11 cursor-pointer items-center justify-center gap-1.5 rounded-[9px] text-sm font-medium transition-colors has-checked:shadow-[0_1px_3px_rgb(0_0_0/0.12)] has-focus-visible:ring-2 sm:h-7.5 sm:gap-1.25 sm:rounded-[7px] sm:text-xs"
                  key={id}
                >
                  <input
                    checked={timeMode === id}
                    className="sr-only"
                    name={menuId}
                    onChange={() => setTimeMode(id)}
                    type="radio"
                  />
                  <Icon aria-hidden="true" className="size-3.75 sm:size-3.25" />
                  {label}
                </label>
              ))}
            </div>
            <div className="border-line flex flex-col gap-2.5 border-t pt-3.5 sm:gap-2 sm:pt-2.5">
              <div className="flex items-baseline justify-between">
                <span className="text-muted text-xs sm:text-[11px]">天氣</span>
                <span className="bg-accent/18 text-accent-text rounded-[5px] px-1.75 py-0.5 text-[11px] font-semibold sm:px-1.5 sm:text-[10px]">
                  即將推出
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 opacity-45 sm:flex sm:gap-1.5">
                {WEATHER.map(({ label, Icon }) => (
                  <button
                    className="border-line flex h-11 cursor-not-allowed items-center justify-center gap-1.5 rounded-[10px] border text-sm sm:h-7 sm:gap-1.25 sm:rounded-[7px] sm:px-2.5 sm:text-xs"
                    disabled
                    key={label}
                    type="button"
                  >
                    <Icon aria-hidden="true" className="size-3.5 sm:size-3" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default AmbienceControl;
