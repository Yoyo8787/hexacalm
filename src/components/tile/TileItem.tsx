import type { TileDefinition } from "../../types";

interface TileItemProps {
  selected: boolean;
  tile: TileDefinition;
  onSelect: (id: string) => void;
}

function TileItem({ selected, tile, onSelect }: TileItemProps) {
  return (
    <button
      aria-pressed={selected}
      className={`group relative flex w-20 shrink-0 flex-col items-center gap-1.5 rounded-lg border p-2 transition-colors select-none ${
        selected
          ? "border-primary bg-primary/10"
          : "bg-background/50 hover:border-primary/40 border-white/10"
      }`}
      onClick={() => onSelect(tile.id)}
      title={tile.name}
      type="button"
    >
      <img
        alt=""
        className="size-14 object-contain transition-transform group-hover:scale-105"
        draggable={false}
        src={tile.previewPath}
      />
      <span className="w-full truncate text-center text-[11px]">
        {tile.name}
      </span>
    </button>
  );
}

export default TileItem;
