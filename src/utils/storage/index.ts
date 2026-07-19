import { WORLD_SCHEMA_VERSION, WORLD_STORAGE_KEY } from "../../constants/world";
import type { PlacedTile, WorldData } from "../../types";

function isPlacedTile(value: unknown): value is PlacedTile {
  if (!value || typeof value !== "object") {
    return false;
  }

  const tile = value as Partial<PlacedTile>;
  return (
    typeof tile.q === "number" &&
    typeof tile.r === "number" &&
    typeof tile.tileId === "string" &&
    typeof tile.rotation === "number"
  );
}

function isWorldData(value: unknown): value is WorldData {
  if (!value || typeof value !== "object") {
    return false;
  }

  const world = value as Partial<WorldData>;
  return (
    world.version === WORLD_SCHEMA_VERSION &&
    (world.mode === "build" || world.mode === "relax") &&
    !!world.tiles &&
    typeof world.tiles === "object" &&
    Object.values(world.tiles).every(isPlacedTile)
  );
}

export function loadWorld(): WorldData | null {
  try {
    const serializedWorld = localStorage.getItem(WORLD_STORAGE_KEY);
    if (!serializedWorld) {
      return null;
    }

    const parsedWorld: unknown = JSON.parse(serializedWorld);
    if (!isWorldData(parsedWorld)) {
      throw new Error("Saved world has an unsupported format.");
    }

    return parsedWorld;
  } catch (error) {
    console.error("Unable to restore the saved world.", error);
    localStorage.removeItem(WORLD_STORAGE_KEY);
    return null;
  }
}

export function saveWorld(world: WorldData): void {
  try {
    localStorage.setItem(WORLD_STORAGE_KEY, JSON.stringify(world));
  } catch (error) {
    console.error("Unable to save the world.", error);
  }
}
