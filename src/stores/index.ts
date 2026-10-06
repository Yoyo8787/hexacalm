import { create } from "zustand";
import {
  HISTORY_LIMIT,
  WORLD_SCHEMA_VERSION,
  WORLD_TILE_LIMIT,
} from "../constants/world";
import { getTileDefinition } from "../constants/tileCatalog";
import { getCharacterDefinition } from "../constants/characterCatalog";
import type {
  CameraMode,
  CharacterId,
  CharacterPose,
  HexCoordinate,
  HexRotation,
  PlacedTile,
  TimeMode,
  WorldData,
  WorldMode,
} from "../types";
import { coordinateKey } from "../utils/hex";
import { getPlacementRotation } from "../utils/placement";
import { generateRandomWorld } from "../utils/randomWorld";
import { resolveCharacterPose } from "../utils/character";
import { moveCharacter } from "../utils/character/movement";
import {
  CHARACTER_MIN_SPEED,
  CHARACTER_MAX_SPEED,
} from "../constants/character";

const HEX_ROTATION_COUNT = 6;
type TileMap = WorldData["tiles"];

interface WorldStore {
  world: WorldData;
  cameraMode: CameraMode;
  resetCameraCounter: number;
  cameraDeviated: boolean;
  cameraResetting: boolean;
  hoveredCoordinate: HexCoordinate | null;
  characterPose: CharacterPose | null;
  selectedTileId: string | null;
  removeMode: boolean;
  past: TileMap[];
  future: TileMap[];
  hydrated: boolean;
  createBlankWorld: () => void;
  createRandomWorld: () => void;
  hydrateWorld: (world: WorldData | null) => void;
  selectCharacter: (id: CharacterId) => void;
  removeCharacter: () => void;
  setCharacterWalking: (enabled: boolean) => void;
  setCharacterSpeed: (speed: number) => void;
  advanceCharacter: (delta: number) => void;
  setMode: (mode: WorldMode) => void;
  setTimeMode: (timeMode: TimeMode) => void;
  setCameraMode: (mode: CameraMode) => void;
  resetCamera: () => void;
  setCameraStatus: (status: {
    deviated?: boolean;
    resetting?: boolean;
  }) => void;
  setHoveredCoordinate: (coordinate: HexCoordinate, hovered: boolean) => void;
  selectTile: (tileId: string | null) => void;
  toggleRemoveMode: () => void;
  applyTileAction: (coordinate: HexCoordinate) => void;
  undo: () => void;
  redo: () => void;
}

export function createEmptyWorld(): WorldData {
  return {
    version: WORLD_SCHEMA_VERSION,
    mode: "build",
    timeMode: "auto",
    tiles: {},
    character: null,
  };
}

function cloneWorld(world: WorldData): WorldData {
  return {
    ...world,
    tiles: Object.fromEntries(
      Object.entries(world.tiles).map(([key, tile]) => [key, { ...tile }]),
    ),
  };
}

function appendHistory(history: TileMap[], tiles: TileMap): TileMap[] {
  return [...history.slice(-(HISTORY_LIMIT - 1)), tiles];
}

function rotateTile(tile: PlacedTile): PlacedTile {
  return {
    ...tile,
    rotation: ((tile.rotation + 1) % HEX_ROTATION_COUNT) as HexRotation,
  };
}

function removeTile(tiles: TileMap, key: string): TileMap | null {
  if (!tiles[key]) {
    return null;
  }

  const nextTiles = { ...tiles };
  delete nextTiles[key];
  return nextTiles;
}

function rotateTileAt(tiles: TileMap, key: string): TileMap | null {
  const tile = tiles[key];

  if (!tile) {
    return null;
  }

  return { ...tiles, [key]: rotateTile(tile) };
}

function placeSelectedTile(
  tiles: TileMap,
  coordinate: HexCoordinate,
  selectedTileId: string,
): TileMap | null {
  const definition = getTileDefinition(selectedTileId);

  if (!definition) {
    console.warn(`Unknown Tile definition: ${selectedTileId}`);
    return null;
  }

  const key = coordinateKey(coordinate);
  const existingTile = tiles[key];

  if (existingTile?.tileId === definition.id) {
    return rotateTileAt(tiles, key);
  }

  if (!existingTile && Object.keys(tiles).length >= WORLD_TILE_LIMIT) {
    return null;
  }

  return {
    ...tiles,
    [key]: {
      ...coordinate,
      tileId: definition.id,
      rotation: getPlacementRotation(tiles, coordinate, definition),
    },
  };
}

interface BuildActionInput {
  coordinate: HexCoordinate;
  removeMode: boolean;
  selectedTileId: string | null;
  tiles: TileMap;
}

function getNextTiles({
  coordinate,
  removeMode,
  selectedTileId,
  tiles,
}: BuildActionInput): TileMap | null {
  const key = coordinateKey(coordinate);

  if (removeMode) {
    return removeTile(tiles, key);
  }

  if (selectedTileId) {
    return placeSelectedTile(tiles, coordinate, selectedTileId);
  }

  return rotateTileAt(tiles, key);
}

function updateCharacterState(
  world: WorldData,
  pose: CharacterPose | null,
  replan = false,
): {
  world: WorldData;
  characterPose: CharacterPose | null;
  cameraMode?: CameraMode;
} {
  if (!world.character) {
    return { world, characterPose: null, cameraMode: "builder" };
  }

  const nextPose = resolveCharacterPose(world.tiles, pose, replan);

  if (!nextPose) {
    return {
      world: { ...world, character: null },
      characterPose: null,
      cameraMode: "builder",
    };
  }

  return { world, characterPose: nextPose };
}

export const useWorldStore = create<WorldStore>((set, get) => ({
  world: createEmptyWorld(),
  cameraMode: "builder",
  resetCameraCounter: 0,
  cameraDeviated: false,
  cameraResetting: false,
  hoveredCoordinate: null,
  characterPose: null,
  selectedTileId: null,
  removeMode: false,
  past: [],
  future: [],
  hydrated: false,

  createBlankWorld: () =>
    set((state) => ({
      // The time mode is an ambience preference, so a new world keeps it.
      world: { ...createEmptyWorld(), timeMode: state.world.timeMode },
      cameraMode: "builder",
      cameraDeviated: false,
      cameraResetting: false,
      hoveredCoordinate: null,
      characterPose: null,
      selectedTileId: null,
      removeMode: false,
      past: [],
      future: [],
      hydrated: true,
    })),

  createRandomWorld: () => {
    const state = get();
    state.hydrateWorld(generateRandomWorld(state.world.timeMode));
  },

  hydrateWorld: (world) =>
    set({
      ...updateCharacterState(
        world ? cloneWorld(world) : createEmptyWorld(),
        null,
      ),
      cameraMode: "builder",
      cameraDeviated: false,
      cameraResetting: false,
      hoveredCoordinate: null,
      selectedTileId: null,
      removeMode: false,
      past: [],
      future: [],
      hydrated: true,
    }),

  selectCharacter: (id) =>
    set((state) => {
      if (!getCharacterDefinition(id) || state.world.character?.id === id) {
        return state;
      }
      return updateCharacterState(
        {
          ...state.world,
          character: {
            id,
            walkingEnabled: state.world.character?.walkingEnabled ?? true,
          },
        },
        state.characterPose,
      );
    }),

  removeCharacter: () =>
    set((state) =>
      state.world.character
        ? {
            world: { ...state.world, character: null },
            characterPose: null,
            cameraMode: "builder",
          }
        : state,
    ),

  setCharacterWalking: (enabled) =>
    set((state) => {
      const character = state.world.character;
      if (!character || character.walkingEnabled === enabled) return state;
      return {
        characterPose:
          !enabled && state.characterPose
            ? { ...state.characterPose, moving: false }
            : state.characterPose,
        world: {
          ...state.world,
          character: { ...character, walkingEnabled: enabled },
        },
      };
    }),

  setCharacterSpeed: (speed) =>
    set((state) =>
      state.characterPose && Number.isFinite(speed)
        ? {
            characterPose: {
              ...state.characterPose,
              speed: Math.min(
                CHARACTER_MAX_SPEED,
                Math.max(CHARACTER_MIN_SPEED, speed),
              ),
            },
          }
        : state,
    ),

  advanceCharacter: (delta) =>
    set((state) => {
      if (
        !state.world.character?.walkingEnabled ||
        !state.characterPose ||
        delta <= 0
      )
        return state;
      const pose = moveCharacter(
        state.world.tiles,
        state.characterPose,
        Math.min(delta, 0.05),
      );
      return pose === state.characterPose ? state : { characterPose: pose };
    }),

  setMode: (mode) =>
    set((state) => ({
      world: { ...state.world, mode },
      cameraMode: mode === "build" ? "builder" : state.cameraMode,
      selectedTileId: mode === "relax" ? null : state.selectedTileId,
      removeMode: mode === "relax" ? false : state.removeMode,
    })),

  setTimeMode: (timeMode) =>
    set((state) =>
      state.world.timeMode === timeMode
        ? state
        : { world: { ...state.world, timeMode } },
    ),

  setCameraMode: (cameraMode) =>
    set((state) =>
      state.world.mode === "relax" &&
      (cameraMode === "builder" ||
        (state.world.character && state.characterPose))
        ? { cameraMode }
        : state,
    ),

  resetCamera: () =>
    set((state) =>
      state.cameraMode === "builder"
        ? { resetCameraCounter: state.resetCameraCounter + 1 }
        : state,
    ),

  setCameraStatus: ({ deviated, resetting }) =>
    set((state) =>
      (deviated ?? state.cameraDeviated) === state.cameraDeviated &&
      (resetting ?? state.cameraResetting) === state.cameraResetting
        ? state
        : {
            cameraDeviated: deviated ?? state.cameraDeviated,
            cameraResetting: resetting ?? state.cameraResetting,
          },
    ),

  setHoveredCoordinate: (coordinate, hovered) =>
    set((state) => {
      const current = state.hoveredCoordinate;
      const isCurrent =
        !!current && coordinateKey(current) === coordinateKey(coordinate);
      if (hovered) return isCurrent ? state : { hoveredCoordinate: coordinate };
      return isCurrent ? { hoveredCoordinate: null } : state;
    }),

  selectTile: (tileId) =>
    set((state) => ({
      removeMode: false,
      selectedTileId: tileId && state.selectedTileId === tileId ? null : tileId,
    })),

  toggleRemoveMode: () =>
    set((state) => ({
      selectedTileId: null,
      removeMode: !state.removeMode,
    })),

  applyTileAction: (coordinate) =>
    set((state) => {
      if (state.world.mode !== "build" || state.cameraMode !== "builder") {
        return state;
      }

      const nextTiles = getNextTiles({
        coordinate,
        removeMode: state.removeMode,
        selectedTileId: state.selectedTileId,
        tiles: state.world.tiles,
      });

      if (!nextTiles) {
        return state;
      }

      return {
        ...updateCharacterState(
          { ...state.world, tiles: nextTiles },
          state.characterPose,
          true,
        ),
        past: appendHistory(state.past, state.world.tiles),
        future: [],
      };
    }),

  undo: () =>
    set((state) => {
      if (state.world.mode !== "build" || state.cameraMode !== "builder")
        return state;
      const previousTiles = state.past.at(-1);
      if (!previousTiles) {
        return state;
      }

      return {
        ...updateCharacterState(
          { ...state.world, tiles: previousTiles },
          state.characterPose,
          true,
        ),
        past: state.past.slice(0, -1),
        future: [state.world.tiles, ...state.future].slice(0, HISTORY_LIMIT),
      };
    }),

  redo: () =>
    set((state) => {
      if (state.world.mode !== "build" || state.cameraMode !== "builder")
        return state;
      const nextTiles = state.future[0];
      if (!nextTiles) {
        return state;
      }

      return {
        ...updateCharacterState(
          { ...state.world, tiles: nextTiles },
          state.characterPose,
          true,
        ),
        past: appendHistory(state.past, state.world.tiles),
        future: state.future.slice(1),
      };
    }),
}));

export { useAudioStore } from "./audio";
