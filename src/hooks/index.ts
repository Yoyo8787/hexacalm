import { useEffect } from "react";
import {
  AUDIO_PERSIST_DELAY,
  DEFAULT_AUDIO_SETTINGS,
} from "../constants/audio";
import { WORLD_TILE_LIMIT } from "../constants/world";
import { useAudioStore, useWorldStore } from "../stores";
import { coordinateKey } from "../utils/hex";
import { loadWorld, saveWorld } from "../utils/storage";

export function useWorldPersistence(): void {
  useEffect(() => {
    const storedState = loadWorld();
    useWorldStore.getState().hydrateWorld(storedState?.world ?? null);
    useAudioStore
      .getState()
      .hydrateAudio(storedState?.audio ?? DEFAULT_AUDIO_SETTINGS);

    const persist = () => {
      const { hydrated, world } = useWorldStore.getState();
      if (!hydrated) {
        return;
      }

      const { volume, muted, playing, footstepsEnabled, callsEnabled } =
        useAudioStore.getState();
      saveWorld({
        world,
        audio: { volume, muted, playing, footstepsEnabled, callsEnabled },
      });
    };

    let audioTimer: ReturnType<typeof setTimeout> | null = null;

    const persistAudio = () => {
      if (audioTimer) {
        clearTimeout(audioTimer);
      }

      audioTimer = setTimeout(() => {
        audioTimer = null;
        persist();
      }, AUDIO_PERSIST_DELAY * 1000);
    };

    const unsubscribeWorld = useWorldStore.subscribe((state, previousState) => {
      if (state.world === previousState.world) {
        return;
      }
      persist();
    });
    const unsubscribeAudio = useAudioStore.subscribe(persistAudio);

    return () => {
      unsubscribeWorld();
      unsubscribeAudio();

      if (audioTimer) {
        clearTimeout(audioTimer);
        persist();
      }
    };
  }, []);
}

export function useBuildActions() {
  const applyTileAction = useWorldStore((state) => state.applyTileAction);
  const undo = useWorldStore((state) => state.undo);
  const redo = useWorldStore((state) => state.redo);
  const toggleRemoveMode = useWorldStore((state) => state.toggleRemoveMode);

  return { applyTileAction, undo, redo, toggleRemoveMode };
}

export function useTileSelection() {
  const selectedTileId = useWorldStore((state) => state.selectedTileId);
  const selectTile = useWorldStore((state) => state.selectTile);

  return { selectedTileId, selectTile };
}

export type HoverAction = "rotate" | "place" | "remove" | "full";

// Mirrors the build action priority for the hovered cell; null when a click
// there would do nothing.
export function useHoverAction(): HoverAction | null {
  return useWorldStore((state) => {
    const coordinate = state.hoveredCoordinate;
    if (
      !coordinate ||
      state.world.mode !== "build" ||
      state.cameraMode !== "builder"
    ) {
      return null;
    }

    const tile = state.world.tiles[coordinateKey(coordinate)];

    if (state.removeMode) {
      return tile ? "remove" : null;
    }

    if (state.selectedTileId) {
      if (tile?.tileId === state.selectedTileId) return "rotate";
      if (!tile && Object.keys(state.world.tiles).length >= WORLD_TILE_LIMIT) {
        return "full";
      }
      return "place";
    }

    return tile ? "rotate" : null;
  });
}
