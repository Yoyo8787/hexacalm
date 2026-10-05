import { useEffect, useRef, useState } from "react";
import { getTileDefinition } from "../../constants/tileCatalog";
import { POINTER_DRAG_THRESHOLD } from "../../constants/world";
import { useHoverAction } from "../../hooks";
import { useWorldStore } from "../../stores";

const OFFSET_X = 16;
const OFFSET_Y = 12;

// Explains what a click does on the hovered cell, next to the pointer.
function CursorHint() {
  const action = useHoverAction();
  const selectedTileId = useWorldStore((state) => state.selectedTileId);
  const [dragging, setDragging] = useState(false);
  const hint = useRef<HTMLDivElement>(null);
  const selectedTile = selectedTileId
    ? getTileDefinition(selectedTileId)
    : undefined;

  useEffect(() => {
    let press: { x: number; y: number } | null = null;
    const onPointerMove = (event: PointerEvent) => {
      const element = hint.current;
      if (element) {
        const { offsetWidth: width, offsetHeight: height } = element;
        // Flip to the other side of the pointer near the viewport edges.
        const left =
          event.clientX + OFFSET_X + width > window.innerWidth
            ? event.clientX - OFFSET_X - width
            : event.clientX + OFFSET_X;
        const top =
          event.clientY + OFFSET_Y + height > window.innerHeight
            ? event.clientY - OFFSET_Y - height
            : event.clientY + OFFSET_Y;
        element.style.transform = `translate(${left}px, ${top}px)`;
      }
      if (
        press &&
        Math.hypot(event.clientX - press.x, event.clientY - press.y) >=
          POINTER_DRAG_THRESHOLD
      ) {
        setDragging(true);
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      press = { x: event.clientX, y: event.clientY };
    };
    const onPointerUp = () => {
      press = null;
      setDragging(false);
    };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, []);

  const visible = !!action && !dragging;

  return (
    <div
      ref={hint}
      aria-hidden="true"
      className={`panel pointer-events-none fixed top-0 left-0 z-30 flex h-10 items-center gap-2 rounded-[10px] px-2.5 text-[13px] font-medium whitespace-nowrap transition-opacity duration-120 ${
        visible ? "opacity-100" : "opacity-0"
      } ${action === "place" ? "pl-1.5" : ""} ${
        action === "remove" ? "text-danger" : ""
      }`}
    >
      {action === "rotate" && (
        <>
          旋轉 60°<span className="text-muted text-xs font-normal">點擊</span>
        </>
      )}
      {action === "place" && selectedTile && (
        <>
          <img
            alt=""
            className="size-7 object-contain"
            src={selectedTile.previewPath}
          />
          放置{selectedTile.name}
          <span className="text-muted text-xs font-normal">右鍵取消</span>
        </>
      )}
      {action === "remove" && (
        <>
          移除<span className="text-xs font-normal opacity-80">點擊</span>
        </>
      )}
      {action === "full" && (
        <>
          已達上限
          <span className="text-muted text-xs font-normal">刪除後才能再放</span>
        </>
      )}
    </div>
  );
}

export default CursorHint;
