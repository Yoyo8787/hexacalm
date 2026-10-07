import { LocateFixed } from "lucide-react";
import { useWorldStore } from "../../stores";

interface ResetViewPillProps {
  hidden: boolean;
}

// Appears only while the World view rests away from its default position.
function ResetViewPill({ hidden }: ResetViewPillProps) {
  const cameraMode = useWorldStore((state) => state.cameraMode);
  const deviated = useWorldStore((state) => state.cameraDeviated);
  const resetting = useWorldStore((state) => state.cameraResetting);
  const resetCamera = useWorldStore((state) => state.resetCamera);
  const visible = !hidden && cameraMode === "builder" && deviated;
  // Keep the resetting label while the pill fades out after the transition.
  const settling = resetting || !deviated;

  return (
    <button
      aria-hidden={!visible}
      className={`panel flex h-9 items-center gap-2 rounded-full pr-2 pl-3 text-[13px] font-medium whitespace-nowrap transition-opacity duration-200 ${
        !visible
          ? "pointer-events-none opacity-0"
          : settling
            ? "pointer-events-auto opacity-55"
            : "pointer-events-auto opacity-100"
      }`}
      disabled={settling}
      onClick={resetCamera}
      tabIndex={visible ? 0 : -1}
      type="button"
    >
      <LocateFixed className="size-3.5" />
      {settling ? (
        "回正中…"
      ) : (
        <>
          回到預設視角
          <kbd className="bg-foreground/10 grid h-5 min-w-5 place-items-center rounded-[5px] px-1.25 font-mono text-[11px] font-semibold">
            F
          </kbd>
        </>
      )}
    </button>
  );
}

export default ResetViewPill;
