import { useMemo, useRef, type RefObject } from "react";
import type { Vector3 } from "three";
import { useWorldStore } from "../../../stores";
import { getTileDefinition } from "../../../constants/tileCatalog";
import { CHARACTER_ROAD_SURFACE_HEIGHT } from "../../../constants/characterCatalog";
import { coordinateKey } from "../../../utils/hex";
import type { CameraMode, CharacterViewMotion } from "../../../types";
import {
  CAMERA_TURN_RESPONSE,
  EYE_HEIGHT,
  FOLLOW_DISTANCE,
  FOLLOW_HEIGHT,
} from "./constants";

export function useFollowView(
  characterMotion: RefObject<CharacterViewMotion | null>,
) {
  const followHeading = useRef<number | null>(null);

  return useMemo(
    () => ({
      // Writes the character view into destination/destinationTarget;
      // returns false when the character is not standing on a road.
      update(
        cameraMode: Exclude<CameraMode, "builder">,
        delta: number,
        destination: Vector3,
        destinationTarget: Vector3,
      ) {
        const { world, characterPose: pose } = useWorldStore.getState();
        if (!pose || !world.character) return false;
        const tile = world.tiles[coordinateKey(pose.coordinate)];
        const road = tile && getTileDefinition(tile.tileId);
        if (road?.kind !== "road") return false;
        const motion = characterMotion.current;
        const heading = motion?.heading ?? pose.heading;
        if (followHeading.current === null) followHeading.current = heading;
        const difference = heading - followHeading.current;
        followHeading.current +=
          Math.atan2(Math.sin(difference), Math.cos(difference)) *
          (1 - Math.exp(-CAMERA_TURN_RESPONSE * Math.min(delta, 0.05)));
        const forwardX = Math.sin(followHeading.current);
        const forwardZ = Math.cos(followHeading.current);
        const [x, z] = pose.position;
        const ground = road.modelOffsetY + CHARACTER_ROAD_SURFACE_HEIGHT;
        if (cameraMode === "first-person") {
          const height = ground + EYE_HEIGHT + (motion?.hopHeight ?? 0);
          destination.set(x, height, z);
          destinationTarget.set(x + forwardX, height, z + forwardZ);
        } else {
          destination.set(
            x - forwardX * FOLLOW_DISTANCE,
            ground + FOLLOW_HEIGHT,
            z - forwardZ * FOLLOW_DISTANCE,
          );
          destinationTarget.set(x, ground + EYE_HEIGHT, z);
        }
        return true;
      },
      reset() {
        followHeading.current = null;
      },
    }),
    [characterMotion],
  );
}
