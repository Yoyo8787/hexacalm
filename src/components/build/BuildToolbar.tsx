import { Rotate3D, Redo2, Trash2, Undo2 } from "lucide-react";
import { useBuildActions } from "../../hooks";
import { useWorldStore } from "../../stores";

function BuildToolbar() {
  const { undo, redo, toggleRemoveMode } = useBuildActions();
  const removeMode = useWorldStore((state) => state.removeMode);
  const selectedTileId = useWorldStore((state) => state.selectedTileId);
  const selectTile = useWorldStore((state) => state.selectTile);
  const canUndo = useWorldStore((state) => state.past.length > 0);
  const canRedo = useWorldStore((state) => state.future.length > 0);

  return (
    <div className="bg-surface/90 absolute top-4 left-4 z-10 flex gap-1 rounded-lg border border-white/10 p-2 shadow-xl backdrop-blur">
      <button
        aria-label="旋轉模式"
        className={`grid size-9 place-items-center rounded-md transition-colors ${
          selectedTileId || removeMode
            ? "text-primary hover:bg-surface-hover"
            : "bg-primary text-background"
        }`}
        onClick={() => selectTile(null)}
        type="button"
      >
        <Rotate3D className="size-4" />
      </button>
      <button
        aria-label="刪除模式"
        aria-pressed={removeMode}
        className={`grid size-9 place-items-center rounded-md transition-colors ${
          removeMode
            ? "bg-red-400 text-slate-950"
            : "text-muted hover:bg-surface-hover hover:text-foreground"
        }`}
        onClick={toggleRemoveMode}
        type="button"
      >
        <Trash2 className="size-4" />
      </button>
      <span className="mx-1 w-px bg-white/10" />
      <button
        aria-label="復原"
        className="text-muted hover:bg-surface-hover hover:text-foreground grid size-9 place-items-center rounded-md transition-colors disabled:cursor-not-allowed disabled:opacity-35"
        disabled={!canUndo}
        onClick={undo}
        type="button"
      >
        <Undo2 className="size-4" />
      </button>
      <button
        aria-label="重做"
        className="text-muted hover:bg-surface-hover hover:text-foreground grid size-9 place-items-center rounded-md transition-colors disabled:cursor-not-allowed disabled:opacity-35"
        disabled={!canRedo}
        onClick={redo}
        type="button"
      >
        <Redo2 className="size-4" />
      </button>
    </div>
  );
}

export default BuildToolbar;
