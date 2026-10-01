import { useWorldStore } from "../../stores";
import type { CameraMode } from "../../types";

const VIEWS: { id: CameraMode; label: string }[] = [
  { id: "builder", label: "世界視角" },
  { id: "third-person", label: "第三人稱" },
  { id: "first-person", label: "第一人稱" },
];

function CameraViewControls() {
  const mode = useWorldStore((state) => state.world.mode);
  const cameraMode = useWorldStore((state) => state.cameraMode);
  const hasCharacter = useWorldStore((state) => !!state.world.character);
  const setCameraMode = useWorldStore((state) => state.setCameraMode);
  if (mode !== "relax") return null;

  return (
    <section
      aria-label="視角控制"
      className="bg-surface/90 absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-1 rounded-lg border border-white/10 p-2 shadow-xl backdrop-blur"
    >
      {VIEWS.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          aria-pressed={cameraMode === id}
          disabled={id !== "builder" && !hasCharacter}
          onClick={() => setCameraMode(id)}
          className={`hover:bg-surface-hover rounded-md border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40 ${cameraMode === id ? "border-primary bg-primary/10" : "border-transparent"}`}
        >
          {label}
        </button>
      ))}
    </section>
  );
}

export default CameraViewControls;
