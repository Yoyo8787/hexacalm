import { Earth, PersonStanding, ScanEye, type LucideIcon } from "lucide-react";
import { useWorldStore } from "../../stores";
import type { CameraMode } from "../../types";

const VIEWS = [
  { id: "builder", label: "世界", Icon: Earth },
  { id: "third-person", label: "第三人稱", Icon: PersonStanding },
  { id: "first-person", label: "第一人稱", Icon: ScanEye },
] as const satisfies readonly {
  id: CameraMode;
  label: string;
  Icon: LucideIcon;
}[];

function CameraViewControls() {
  const cameraMode = useWorldStore((state) => state.cameraMode);
  const hasCharacter = useWorldStore((state) => !!state.world.character);
  const setCameraMode = useWorldStore((state) => state.setCameraMode);

  return (
    <div role="group" aria-label="視角控制" className="flex gap-0.5">
      {VIEWS.map(({ id, label, Icon }) => {
        const disabled = id !== "builder" && !hasCharacter;

        return (
          // Disabled buttons do not show a title, so the wrapper carries it.
          <span key={id} title={disabled ? "需要先加入寵物" : undefined}>
            <button
              type="button"
              aria-label={label}
              aria-pressed={cameraMode === id}
              disabled={disabled}
              onClick={() => setCameraMode(id)}
              className={`flex h-10 items-center gap-1.5 rounded-lg px-3 text-[13px] font-medium whitespace-nowrap transition-colors disabled:cursor-not-allowed disabled:opacity-40 md:px-3.5 ${
                cameraMode === id
                  ? "bg-primary text-background"
                  : "text-muted enabled:hover:text-foreground enabled:hover:bg-white/7"
              }`}
            >
              <Icon className="size-4" />
              <span className="hidden md:inline">{label}</span>
            </button>
          </span>
        );
      })}
    </div>
  );
}

export default CameraViewControls;
