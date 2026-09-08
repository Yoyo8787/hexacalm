import { useEffect, useRef } from "react";
import { ambientAudioEngine } from "../audio/engine";
import { useWorldStore } from "../stores";
import type { WorldData } from "../types";
import { coordinateKey } from "../utils/hex";
import { getRoadGroups } from "../utils/roads";

export function useWorldDebug(): void {
  const previousLoops = useRef<string | undefined>(undefined);
  const previousGroups = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!import.meta.env.DEV) {
      return;
    }

    const unsubscribeLoops = ambientAudioEngine.subscribeDebugLoops((loops) => {
      const serialized = JSON.stringify(loops);
      if (serialized === previousLoops.current) {
        return;
      }

      previousLoops.current = serialized;
      console.log("[音軌] 引擎目前保留的 loops", loops);
      if (loops.length > 0) {
        console.table(loops);
      }
    });

    const logRoadGroups = (tiles: WorldData["tiles"]) => {
      const groups = getRoadGroups(tiles);
      const serialized = JSON.stringify(groups);
      if (serialized === previousGroups.current) {
        return;
      }

      previousGroups.current = serialized;
      console.log(`[道路群組] 共 ${groups.length} 組`, groups);
      if (groups.length > 0) {
        console.table(
          groups.map((group, index) => ({
            群組: index + 1,
            格數: group.length,
            座標: group.map(coordinateKey).join(" / "),
          })),
        );
      }
    };

    logRoadGroups(useWorldStore.getState().world.tiles);
    const unsubscribeWorld = useWorldStore.subscribe((state, previousState) => {
      if (state.world.tiles !== previousState.world.tiles) {
        logRoadGroups(state.world.tiles);
      }
    });

    return () => {
      unsubscribeLoops();
      unsubscribeWorld();
    };
  }, []);
}
