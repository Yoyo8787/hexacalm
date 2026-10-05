import { useEffect, useMemo, useRef } from "react";
import { ChevronUp, Footprints, Plus } from "lucide-react";
import {
  CHARACTER_CATALOG,
  getCharacterDefinition,
} from "../../constants/characterCatalog";
import {
  CHARACTER_MIN_SPEED,
  CHARACTER_MAX_SPEED,
} from "../../constants/character";
import { useWorldStore } from "../../stores";
import { isValidCharacterRoad } from "../../utils/character";

interface CharacterControlsProps {
  // "stacked" sits beside the Tile Picker; "inline" fits the Relax Dock row.
  layout: "stacked" | "inline";
  menuOpen: boolean;
  onMenuOpenChange: (open: boolean) => void;
}

function CharacterControls({
  layout,
  menuOpen,
  onMenuOpenChange,
}: CharacterControlsProps) {
  const character = useWorldStore((state) => state.world.character);
  const tiles = useWorldStore((state) => state.world.tiles);
  const selectCharacter = useWorldStore((state) => state.selectCharacter);
  const removeCharacter = useWorldStore((state) => state.removeCharacter);
  const setWalking = useWorldStore((state) => state.setCharacterWalking);
  const speed = useWorldStore((state) => state.characterPose?.speed ?? 1);
  const setSpeed = useWorldStore((state) => state.setCharacterSpeed);
  const container = useRef<HTMLDivElement>(null);
  const hasRoad = useMemo(
    () =>
      Object.values(tiles).some((tile) => isValidCharacterRoad(tiles, tile)),
    [tiles],
  );
  const definition = character
    ? getCharacterDefinition(character.id)
    : undefined;

  useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !container.current?.contains(event.target)
      ) {
        onMenuOpenChange(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [menuOpen, onMenuOpenChange]);

  const picker = (
    <div ref={container} className="relative">
      <button
        aria-expanded={menuOpen}
        aria-label={character ? "更換寵物" : "加入寵物"}
        className={`flex h-10 items-center gap-2 rounded-lg pl-1 text-sm font-medium transition-colors hover:bg-white/7 ${
          layout === "inline" || menuOpen ? "bg-white/7" : ""
        } ${layout === "stacked" ? "pr-1 md:w-full md:pr-2" : "pr-2"}`}
        onClick={() => onMenuOpenChange(!menuOpen)}
        type="button"
      >
        {character && definition ? (
          <>
            <img
              alt=""
              className="size-8 object-contain"
              src={definition.previewPath}
            />
            <span className="hidden flex-col text-left leading-tight whitespace-nowrap md:flex">
              {definition.name}
              <span className="text-muted text-[11px] font-normal">
                {character.walkingEnabled ? "行走中" : "休息中"}
              </span>
            </span>
          </>
        ) : (
          <>
            <span className="grid size-8 place-items-center">
              <Plus className="size-4" />
            </span>
            <span className="hidden whitespace-nowrap md:inline">加入寵物</span>
          </>
        )}
        <ChevronUp
          className={`text-muted ml-auto size-3.5 ${
            layout === "stacked" ? "hidden md:block" : ""
          }`}
        />
      </button>
      {menuOpen && (
        <section
          aria-label={character ? "更換寵物" : "加入寵物"}
          className="popover absolute bottom-full left-0 z-20 mb-2 w-52 rounded-xl p-2"
        >
          <h2 className="text-muted px-2 pt-1 pb-2 text-xs font-semibold">
            {character ? "更換寵物" : "加入寵物"}
          </h2>
          {CHARACTER_CATALOG.map((option) => (
            <button
              key={option.id}
              aria-pressed={character?.id === option.id}
              className={`flex w-full items-center gap-2 rounded-lg px-2 py-1 text-sm transition-colors enabled:hover:bg-white/7 disabled:cursor-not-allowed disabled:opacity-40 ${
                character?.id === option.id
                  ? "bg-primary/16 text-primary font-semibold"
                  : ""
              }`}
              disabled={!hasRoad}
              onClick={() => {
                selectCharacter(option.id);
                onMenuOpenChange(false);
              }}
              type="button"
            >
              <img
                alt=""
                className="size-7 object-contain"
                src={option.previewPath}
              />
              {option.name}
            </button>
          ))}
          {!hasRoad && (
            <p className="text-muted px-2 pt-2 text-xs">
              先放置一格道路，就能加入寵物。
            </p>
          )}
          {character && (
            <button
              className="text-danger hover:bg-danger/10 mt-2 w-full rounded-lg border-t border-white/8 px-2 py-2 text-left text-sm transition-colors"
              onClick={() => {
                removeCharacter();
                onMenuOpenChange(false);
              }}
              type="button"
            >
              移除角色
            </button>
          )}
        </section>
      )}
    </div>
  );

  const walkToggle = character && (
    <button
      aria-label={character.walkingEnabled ? "停止行走" : "開始行走"}
      aria-pressed={character.walkingEnabled}
      className={`grid size-10 place-items-center rounded-lg transition-colors ${
        character.walkingEnabled
          ? "bg-primary/16 text-primary"
          : "text-muted hover:text-foreground hover:bg-white/7"
      }`}
      onClick={() => setWalking(!character.walkingEnabled)}
      type="button"
    >
      <Footprints className="size-4" />
    </button>
  );

  const speedControl = character && (
    <label
      className={`text-muted flex items-center gap-2 text-xs tabular-nums ${
        layout === "stacked" ? "h-8 px-0.5 md:h-10 md:px-1.5" : "h-10 px-1.5"
      }`}
    >
      {speed.toFixed(1)}×
      <input
        aria-label="角色行走速度"
        // Stacked below md, the slider fills the row under the two icons.
        className={`accent-primary ${
          layout === "stacked"
            ? "w-0 min-w-0 flex-1 md:w-18 md:flex-none"
            : "w-18"
        }`}
        type="range"
        min={CHARACTER_MIN_SPEED}
        max={CHARACTER_MAX_SPEED}
        step="0.1"
        value={speed}
        onChange={(event) => setSpeed(Number(event.target.value))}
      />
    </label>
  );

  if (layout === "stacked") {
    return (
      // Below md the picker and walk toggle share a row above the slider.
      <section
        aria-label="寵物夥伴"
        className={`shrink-0 gap-2 p-2 md:w-44 md:p-3 ${
          character
            ? "grid grid-cols-[auto_auto] content-center items-center gap-x-2 md:grid-cols-[auto_1fr] md:content-between md:gap-x-0.5"
            : "flex flex-col"
        }`}
      >
        <h2 className="text-muted col-span-2 hidden text-xs font-semibold tracking-[0.06em] md:block">
          寵物夥伴
        </h2>
        {character ? (
          <>
            <div className="md:col-span-2">{picker}</div>
            {walkToggle}
            <div className="col-span-2 md:col-span-1">{speedControl}</div>
          </>
        ) : (
          <div className="flex flex-1 flex-col justify-center">{picker}</div>
        )}
      </section>
    );
  }

  return (
    <section aria-label="寵物夥伴" className="flex items-center gap-0.5">
      {picker}
      {walkToggle}
      {speedControl}
    </section>
  );
}

export default CharacterControls;
