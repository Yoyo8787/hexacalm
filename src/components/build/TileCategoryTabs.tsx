import {
  House,
  Mountain,
  Route,
  Sprout,
  Trees,
  Waves,
  type LucideIcon,
} from "lucide-react";
import type { TileCategoryId } from "../../types";
import { TILE_CATEGORY_LABELS } from "../tile/constants";

const CATEGORY_ICONS: Record<TileCategoryId, LucideIcon> = {
  ground: Sprout,
  forest: Trees,
  mountain: Mountain,
  water: Waves,
  road: Route,
  structure: House,
};

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
    <div className="flex min-w-0 gap-0.5 overflow-x-auto">
      {categories.map(([id, label]) => {
        const Icon = CATEGORY_ICONS[id];

        return (
          <button
            aria-pressed={category === id}
            className={`flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-2.5 text-[13px] font-medium transition-colors select-none ${
              category === id
                ? "bg-primary/16 text-primary"
                : "text-muted hover:text-foreground hover:bg-white/7"
            }`}
            key={id}
            onClick={() => onCategoryChange(id)}
            type="button"
          >
            <Icon className="size-3.5" />
            {label}
          </button>
        );
      })}
    </div>
  );
}

export default TileCategoryTabs;
