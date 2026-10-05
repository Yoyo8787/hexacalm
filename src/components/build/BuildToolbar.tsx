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
  const rotating = !selectedTileId && !removeMode;

  return (
    <div className="panel absolute top-1/2 left-4 z-10 flex -translate-y-1/2 flex-col gap-0.5 rounded-xl p-1">
      <button
        aria-label="旋轉模式"
        aria-pressed={rotating}
        className={`flex size-12 flex-col items-center justify-center gap-0.75 rounded-lg text-[10px] font-medium transition-colors ${
          rotating
            ? "bg-primary text-background"
            : "text-muted hover:text-foreground hover:bg-white/7"
        }`}
        onClick={() => selectTile(null)}
        type="button"
      >
        <Rotate3D className="size-4" />
        旋轉
      </button>
      <button
        aria-label="刪除模式"
        aria-pressed={removeMode}
        className={`flex size-12 flex-col items-center justify-center gap-0.75 rounded-lg text-[10px] font-medium transition-colors ${
          removeMode
            ? "bg-danger text-background"
            : "text-muted hover:text-foreground hover:bg-white/7"
        }`}
        onClick={toggleRemoveMode}
        type="button"
      >
        <Trash2 className="size-4" />
        刪除
      </button>
      <span className="mx-2 my-0.75 h-px bg-white/8" />
      <button
        aria-label="復原"
        className="disabled:text-muted grid h-10 w-12 place-items-center rounded-lg transition-colors enabled:hover:bg-white/7 disabled:cursor-not-allowed disabled:opacity-40"
        disabled={!canUndo}
        onClick={undo}
        type="button"
      >
        <Undo2 className="size-4" />
      </button>
      <button
        aria-label="重做"
        className="disabled:text-muted grid h-10 w-12 place-items-center rounded-lg transition-colors enabled:hover:bg-white/7 disabled:cursor-not-allowed disabled:opacity-40"
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
