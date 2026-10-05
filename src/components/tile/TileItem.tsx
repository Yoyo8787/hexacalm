import type { TileDefinition } from "../../types";

interface TileItemProps {
  disabled: boolean;
  selected: boolean;
  tile: TileDefinition;
  onSelect: (id: string) => void;
}

function TileItem({ disabled, selected, tile, onSelect }: TileItemProps) {
  return (
    <button
      aria-pressed={selected}
      className="group flex w-20 shrink-0 flex-col items-center gap-0.5 py-1.5 select-none disabled:cursor-not-allowed disabled:opacity-35"
      disabled={disabled}
      onClick={() => onSelect(tile.id)}
      title={tile.name}
      type="button"
    >
      <span className="relative grid h-15 w-17 place-items-center">
        {selected && <span className="bg-primary hex-clip absolute inset-0" />}
        <span
          className={`hex-clip absolute inset-0.5 transition-colors ${
            selected
              ? "bg-[#1d2a28]"
              : "bg-white/4 group-enabled:group-hover:bg-white/8"
          }`}
        />
        <img
          alt=""
          className="relative size-13.5 object-contain transition-transform group-enabled:group-hover:scale-105"
          draggable={false}
          src={tile.previewPath}
        />
      </span>
      <span
        className={`w-full truncate text-center text-xs ${
          selected ? "text-primary font-semibold" : "text-muted font-medium"
        }`}
      >
        {tile.name}
      </span>
    </button>
  );
}

export default TileItem;
