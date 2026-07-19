import { WORLD_TILE_LIMIT } from "../../constants/world";
import { getTileDefinition } from "../../constants/tileCatalog";
import { useWorldStore } from "../../stores";

function WorldStatus() {
  const tileCount = useWorldStore(
    (state) => Object.keys(state.world.tiles).length,
  );
  const selectedTileId = useWorldStore((state) => state.selectedTileId);
  const removeMode = useWorldStore((state) => state.removeMode);
  const selectedTile = selectedTileId
    ? getTileDefinition(selectedTileId)
    : undefined;

  const instruction = removeMode
    ? "點擊 Tile 以移除"
    : selectedTile
      ? `已選擇：${selectedTile.name}`
      : "點擊既有 Tile 可旋轉 60°";

  return (
    <div className="bg-surface/80 text-muted absolute top-[calc(50%-2rem)] left-4 z-10 rounded-md border border-white/10 px-3 py-2 text-xs backdrop-blur">
      <p className="text-foreground font-medium">{instruction}</p>
      <p className="mt-1">
        {tileCount} / {WORLD_TILE_LIMIT} Tiles
      </p>
    </div>
  );
}

export default WorldStatus;
