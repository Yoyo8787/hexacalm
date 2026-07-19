import { create } from "zustand";
import {
  HISTORY_LIMIT,
  WORLD_SCHEMA_VERSION,
  WORLD_TILE_LIMIT,
} from "../constants/world";
import { getTileDefinition } from "../constants/tileCatalog";
import type {
  HexCoordinate,
  PlacedTile,
  WorldData,
  WorldMode,
} from "../types";
import { coordinateKey } from "../utils/hex";

const HEX_ROTATION_COUNT = 6;
type TileMap = WorldData["tiles"];

interface WorldStore {
  world: WorldData;
  selectedTileId: string | null;
  removeMode: boolean;
  past: WorldData[];
  future: WorldData[];
  hydrated: boolean;
  createBlankWorld: () => void;
  hydrateWorld: (world: WorldData | null) => void;
  setMode: (mode: WorldMode) => void;
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
    tiles: {},
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

function appendHistory(history: WorldData[], world: WorldData): WorldData[] {
  return [...history.slice(-(HISTORY_LIMIT - 1)), cloneWorld(world)];
}

function rotateTile(tile: PlacedTile): PlacedTile {
  return {
    ...tile,
    rotation: (tile.rotation + 1) % HEX_ROTATION_COUNT,
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
      rotation: definition.defaultRotation,
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

export const useWorldStore = create<WorldStore>((set) => ({
  world: createEmptyWorld(),
  selectedTileId: null,
  removeMode: false,
  past: [],
  future: [],
  hydrated: false,

  createBlankWorld: () =>
    set({
      world: createEmptyWorld(),
      selectedTileId: null,
      removeMode: false,
      past: [],
      future: [],
      hydrated: true,
    }),

  hydrateWorld: (world) =>
    set({
      world: world ? cloneWorld(world) : createEmptyWorld(),
      selectedTileId: null,
      removeMode: false,
      past: [],
      future: [],
      hydrated: true,
    }),

  setMode: (mode) =>
    set((state) => ({
      world: { ...state.world, mode },
      selectedTileId: mode === "relax" ? null : state.selectedTileId,
      removeMode: mode === "relax" ? false : state.removeMode,
    })),

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
      if (state.world.mode !== "build") {
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
        world: { ...state.world, tiles: nextTiles },
        past: appendHistory(state.past, state.world),
        future: [],
      };
    }),

  undo: () =>
    set((state) => {
      const previousWorld = state.past.at(-1);
      if (!previousWorld) {
        return state;
      }

      return {
        world: cloneWorld(previousWorld),
        past: state.past.slice(0, -1),
        future: [cloneWorld(state.world), ...state.future].slice(
          0,
          HISTORY_LIMIT,
        ),
      };
    }),

  redo: () =>
    set((state) => {
      const nextWorld = state.future[0];
      if (!nextWorld) {
        return state;
      }

      return {
        world: cloneWorld(nextWorld),
        past: appendHistory(state.past, state.world),
        future: state.future.slice(1),
      };
    }),
}));
