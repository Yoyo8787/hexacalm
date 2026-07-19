import { useMemo, useState } from "react";
import { TILE_CATALOG } from "../../constants/tileCatalog";
import { useTileSelection } from "../../hooks";
import type { TileCategoryId } from "../../types";
import TileItem from "../tile/TileItem";
import TileCategoryTabs from "./TileCategoryTabs";

function TilePicker() {
  const [category, setCategory] = useState<TileCategoryId>("ground");
  const { selectedTileId, selectTile } = useTileSelection();
  const tiles = useMemo(
    () => TILE_CATALOG.filter((tile) => tile.categories.includes(category)),
    [category],
  );

  return (
    <aside className="bg-surface/95 absolute right-3 bottom-3 left-3 z-10 rounded-xl border border-white/10 p-3 shadow-2xl backdrop-blur md:right-auto md:left-1/2 md:w-[min(760px,calc(100%-2rem))] md:-translate-x-1/2">
      <TileCategoryTabs category={category} onCategoryChange={setCategory} />
      {tiles.length > 0 ? (
        <div className="flex gap-2 overflow-x-auto px-1 pb-1">
          {tiles.map((tile) => (
            <TileItem
              key={tile.id}
              onSelect={selectTile}
              selected={selectedTileId === tile.id}
              tile={tile}
            />
          ))}
        </div>
      ) : (
        <div className="text-muted grid h-20 place-items-center text-sm">
          Road 資產尚未匯入
        </div>
      )}
    </aside>
  );
}

export default TilePicker;
