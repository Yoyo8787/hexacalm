import { WORLD_SCHEMA_VERSION, WORLD_STORAGE_KEY } from "../../constants/world";
import { getCharacterDefinition } from "../../constants/characterCatalog";
import type {
  AudioSettings,
  PlacedTile,
  SavedCharacter,
  WorldData,
} from "../../types";

type SerializedState = WorldData & { audio: AudioSettings };

export interface StoredState {
  world: WorldData;
  audio: AudioSettings;
}

function isPlacedTile(value: unknown): value is PlacedTile {
  if (!value || typeof value !== "object") {
    return false;
  }

  const tile = value as Partial<PlacedTile>;
  return (
    typeof tile.q === "number" &&
    typeof tile.r === "number" &&
    typeof tile.tileId === "string" &&
    typeof tile.rotation === "number" &&
    Number.isInteger(tile.rotation) &&
    tile.rotation >= 0 &&
    tile.rotation < 6
  );
}

function isAudioSettings(value: unknown): value is AudioSettings {
  if (!value || typeof value !== "object") {
    return false;
  }

  const audio = value as Partial<AudioSettings>;
  return (
    typeof audio.volume === "number" &&
    audio.volume >= 0 &&
    audio.volume <= 1 &&
    typeof audio.muted === "boolean" &&
    typeof audio.playing === "boolean" &&
    typeof audio.footstepsEnabled === "boolean" &&
    typeof audio.callsEnabled === "boolean"
  );
}

function isSavedCharacter(value: unknown): value is SavedCharacter | null {
  if (value === null) return true;
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const character = value as Partial<SavedCharacter>;
  return (
    Object.keys(character).length === 2 &&
    typeof character.id === "string" &&
    !!getCharacterDefinition(character.id) &&
    typeof character.walkingEnabled === "boolean"
  );
}

function isSerializedState(value: unknown): value is SerializedState {
  if (!value || typeof value !== "object") {
    return false;
  }

  const stored = value as Partial<SerializedState>;
  return (
    stored.version === WORLD_SCHEMA_VERSION &&
    (stored.mode === "build" || stored.mode === "relax") &&
    (stored.timeMode === "auto" ||
      stored.timeMode === "day" ||
      stored.timeMode === "night") &&
    !!stored.tiles &&
    typeof stored.tiles === "object" &&
    Object.values(stored.tiles).every(isPlacedTile) &&
    isSavedCharacter(stored.character) &&
    isAudioSettings(stored.audio)
  );
}

export function loadWorld(): StoredState | null {
  try {
    const serializedWorld = localStorage.getItem(WORLD_STORAGE_KEY);
    if (!serializedWorld) {
      return null;
    }

    const parsedWorld: unknown = JSON.parse(serializedWorld);
    if (!isSerializedState(parsedWorld)) {
      throw new Error("Saved world has an unsupported format.");
    }

    const { audio, ...world } = parsedWorld;
    return { world, audio };
  } catch (error) {
    console.error("Unable to restore the saved world.", error);
    localStorage.removeItem(WORLD_STORAGE_KEY);
    return null;
  }
}

export function saveWorld({ world, audio }: StoredState): void {
  try {
    const serializedWorld = JSON.stringify({
      ...world,
      character: world.character
        ? {
            id: world.character.id,
            walkingEnabled: world.character.walkingEnabled,
          }
        : null,
      audio,
    });
    localStorage.setItem(WORLD_STORAGE_KEY, serializedWorld);
  } catch (error) {
    console.error("Unable to save the world.", error);
  }
}
