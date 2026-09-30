import { useMemo } from "react";
import { CHARACTER_CATALOG } from "../../constants/characterCatalog";
import {
  CHARACTER_MIN_SPEED,
  CHARACTER_MAX_SPEED,
} from "../../constants/character";
import { useWorldStore } from "../../stores";
import { isValidCharacterRoad } from "../../utils/character";

function CharacterControls() {
  const character = useWorldStore((state) => state.world.character);
  const tiles = useWorldStore((state) => state.world.tiles);
  const selectCharacter = useWorldStore((state) => state.selectCharacter);
  const removeCharacter = useWorldStore((state) => state.removeCharacter);
  const setWalking = useWorldStore((state) => state.setCharacterWalking);
  const speed = useWorldStore((state) => state.characterPose?.speed ?? 1);
  const setSpeed = useWorldStore((state) => state.setCharacterSpeed);
  const hasRoad = useMemo(
    () =>
      Object.values(tiles).some((tile) => isValidCharacterRoad(tiles, tile)),
    [tiles],
  );

  return (
    <section
      aria-label="角色控制"
      className="bg-surface/90 absolute top-20 right-4 z-10 w-64 rounded-lg border border-white/10 p-3 shadow-xl backdrop-blur"
    >
      <h2 className="mb-2 text-sm font-semibold">寵物夥伴</h2>
      <div className="flex gap-1">
        {CHARACTER_CATALOG.map((definition) => (
          <button
            key={definition.id}
            aria-label={`${character ? "更換為" : "加入"}${definition.name}`}
            aria-pressed={character?.id === definition.id}
            className={`hover:bg-surface-hover flex flex-1 flex-col items-center rounded-md border p-1 text-xs disabled:cursor-not-allowed disabled:opacity-40 ${character?.id === definition.id ? "border-primary bg-primary/10" : "border-transparent"}`}
            disabled={!hasRoad}
            onClick={() => selectCharacter(definition.id)}
            type="button"
          >
            <img
              alt=""
              className="size-9 object-contain"
              src={definition.previewPath}
            />
            {definition.name}
          </button>
        ))}
      </div>
      {!hasRoad && (
        <p className="text-muted mt-2 text-xs">
          先放置一格道路，就能加入寵物。
        </p>
      )}
      {character && (
        <label className="mt-3 flex items-center gap-2 text-xs">
          <span>速度 {speed.toFixed(1)}×</span>
          <input
            aria-label="角色行走速度"
            className="accent-primary min-w-0 flex-1"
            type="range"
            min={CHARACTER_MIN_SPEED}
            max={CHARACTER_MAX_SPEED}
            step="0.1"
            value={speed}
            onChange={(event) => setSpeed(Number(event.target.value))}
          />
        </label>
      )}
      {character && (
        <div className="mt-3 flex gap-2">
          <button
            className="hover:bg-surface-hover flex-1 rounded-md border border-white/10 px-2 py-1.5 text-xs"
            onClick={() => setWalking(!character.walkingEnabled)}
            type="button"
          >
            {character.walkingEnabled ? "停止行走" : "開始行走"}
          </button>
          <button
            className="hover:bg-surface-hover rounded-md border border-white/10 px-2 py-1.5 text-xs"
            onClick={removeCharacter}
            type="button"
          >
            移除角色
          </button>
        </div>
      )}
    </section>
  );
}

export default CharacterControls;
