import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import { TILE_CATALOG } from "../../constants/tileCatalog";
import {
  WORLD_TILE_LIMIT,
  WORLD_TILE_WARNING_RATIO,
} from "../../constants/world";
import { useTileSelection } from "../../hooks";
import { useWorldStore } from "../../stores";
import type { TileCategoryId } from "../../types";
import TileItem from "../tile/TileItem";
import TileCategoryTabs from "./TileCategoryTabs";

const CAPACITY_STYLES = {
  normal: { bar: "bg-primary", text: "text-foreground" },
  warning: { bar: "bg-warning", text: "text-warning" },
  full: { bar: "bg-danger", text: "text-danger" },
};

function TilePicker() {
  const [category, setCategory] = useState<TileCategoryId>("ground");
  const [canScroll, setCanScroll] = useState(false);
  const list = useRef<HTMLDivElement>(null);
  const { selectedTileId, selectTile } = useTileSelection();
  const removeMode = useWorldStore((state) => state.removeMode);
  const tileCount = useWorldStore(
    (state) => Object.keys(state.world.tiles).length,
  );
  const tiles = useMemo(
    () => TILE_CATALOG.filter((tile) => tile.categories.includes(category)),
    [category],
  );
  const full = tileCount >= WORLD_TILE_LIMIT;
  const capacity =
    CAPACITY_STYLES[
      full
        ? "full"
        : tileCount >= WORLD_TILE_LIMIT * WORLD_TILE_WARNING_RATIO
          ? "warning"
          : "normal"
    ];

  useEffect(() => {
    const element = list.current;
    if (!element) return;
    element.scrollLeft = 0;
    const update = () =>
      setCanScroll(
        element.scrollLeft + element.clientWidth < element.scrollWidth - 1,
      );
    // Vertical wheels scroll the row horizontally.
    const onWheel = (event: WheelEvent) => {
      if (
        Math.abs(event.deltaY) <= Math.abs(event.deltaX) ||
        element.scrollWidth <= element.clientWidth
      ) {
        return;
      }
      event.preventDefault();
      element.scrollLeft += event.deltaY;
    };
    // ResizeObserver also reports once on observe, covering the first render.
    const observer = new ResizeObserver(update);
    observer.observe(element);
    element.addEventListener("scroll", update);
    element.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      observer.disconnect();
      element.removeEventListener("scroll", update);
      element.removeEventListener("wheel", onWheel);
    };
  }, [tiles]);

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1.5 px-3.5 pt-3 pb-2">
      {/* Positioned against the Dock, so it spans the Dock's top edge. */}
      <span className="bg-line absolute inset-x-4 -top-px h-0.75 overflow-hidden rounded-xs">
        <span
          className={`absolute inset-y-0 left-0 transition-[width] ${capacity.bar}`}
          style={{
            width: `${Math.min(tileCount / WORLD_TILE_LIMIT, 1) * 100}%`,
          }}
        />
      </span>
      <div className="flex items-center justify-between gap-3">
        <TileCategoryTabs category={category} onCategoryChange={setCategory} />
        <span className="text-muted shrink-0 text-xs tabular-nums">
          <b className={`text-[13px] font-semibold ${capacity.text}`}>
            {tileCount}
          </b>{" "}
          / {WORLD_TILE_LIMIT} 格
        </span>
      </div>
      {tiles.length > 0 ? (
        <div className="relative">
          <div
            ref={list}
            className="flex [scrollbar-width:none] gap-1 overflow-x-auto"
          >
            {tiles.map((tile) => (
              <TileItem
                disabled={removeMode || full}
                key={tile.id}
                onSelect={selectTile}
                selected={selectedTileId === tile.id}
                tile={tile}
              />
            ))}
          </div>
          {canScroll && (
            <div className="to-surface/95 pointer-events-none absolute inset-y-0 right-0 flex w-18 items-center justify-end bg-linear-to-r from-transparent to-60%">
              <button
                aria-label="捲動 Tile 列表"
                className="bg-foreground/10 hover:bg-foreground/16 pointer-events-auto grid size-7 place-items-center rounded-full transition-colors"
                onClick={() =>
                  list.current?.scrollBy({
                    left: list.current.clientWidth,
                    behavior: "smooth",
                  })
                }
                type="button"
              >
                <ChevronRight className="size-3.5" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-muted grid h-22 place-items-center text-sm">
          Road 資產尚未匯入
        </div>
      )}
    </div>
  );
}

export default TilePicker;
