import { useEffect } from "react";
import { useWorldStore } from "../stores";
import { loadWorld, saveWorld } from "../utils/storage";

export function useWorldPersistence(): void {
  useEffect(() => {
    const savedWorld = loadWorld();
    useWorldStore.getState().hydrateWorld(savedWorld);

    return useWorldStore.subscribe((state, previousState) => {
      if (!state.hydrated || state.world === previousState.world) {
        return;
      }
      saveWorld(state.world);
    });
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
