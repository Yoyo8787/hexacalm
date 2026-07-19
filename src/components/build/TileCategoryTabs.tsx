import { TILE_CATALOG } from "../../constants/tileCatalog";
import type { TileCategoryId } from "../../types";
import { TILE_CATEGORY_LABELS } from "../tile/constants";

interface TileCategoryTabsProps {
  category: TileCategoryId;
  onCategoryChange: (category: TileCategoryId) => void;
}

function TileCategoryTabs({
  category,
  onCategoryChange,
}: TileCategoryTabsProps) {
  const categories = Object.entries(TILE_CATEGORY_LABELS) as [
    TileCategoryId,
    string,
  ][];

  return (
    <div className="flex gap-1 overflow-x-auto px-1 pb-2">
      {categories.map(([id, label]) => {
        const count = TILE_CATALOG.filter((tile) =>
          tile.categories.includes(id),
        ).length;

        return (
          <button
            className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-colors select-none ${
              category === id
                ? "bg-primary text-background"
                : "text-muted hover:bg-surface-hover hover:text-foreground"
            }`}
            key={id}
            onClick={() => onCategoryChange(id)}
            type="button"
          >
            {label} <span className="opacity-65">{count}</span>
          </button>
        );
      })}
    </div>
  );
}

export default TileCategoryTabs;
