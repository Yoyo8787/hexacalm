import { useEffect, useMemo, useRef } from "react";
import { Vector3, type Camera } from "three";
import { useWorldStore } from "../../../stores";
import { BUILDER_CAMERA_POSITION } from "../../../constants/world";
import {
  DEFAULT_VIEW_ANGLE_TOLERANCE,
  DEFAULT_VIEW_POSITION_TOLERANCE,
  DEFAULT_VIEW_SETTLE_SECONDS,
} from "./constants";

// Publishes whether the resting Builder view has left the default view.
export function useDefaultViewStatus() {
  const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const view = useMemo(
    () => ({
      lastPosition: new Vector3(NaN, NaN, NaN),
      lastTarget: new Vector3(NaN, NaN, NaN),
      direction: new Vector3(),
      defaultPosition: new Vector3(...BUILDER_CAMERA_POSITION),
      defaultDirection: new Vector3(...BUILDER_CAMERA_POSITION)
        .negate()
        .normalize(),
    }),
    [],
  );

  useEffect(
    () => () => {
      if (settleTimer.current) clearTimeout(settleTimer.current);
    },
    [],
  );

  return useMemo(
    () => ({
      update(camera: Camera, target: Vector3) {
        if (
          camera.position.equals(view.lastPosition) &&
          target.equals(view.lastTarget)
        ) {
          return;
        }
        view.lastPosition.copy(camera.position);
        view.lastTarget.copy(target);
        if (settleTimer.current) clearTimeout(settleTimer.current);
        settleTimer.current = null;

        const { setCameraStatus } = useWorldStore.getState();
        const deviated =
          camera.position.distanceTo(view.defaultPosition) >
            DEFAULT_VIEW_POSITION_TOLERANCE ||
          view.direction
            .subVectors(target, camera.position)
            .normalize()
            .angleTo(view.defaultDirection) > DEFAULT_VIEW_ANGLE_TOLERANCE;

        if (!deviated) {
          setCameraStatus({ deviated: false });
          return;
        }
        settleTimer.current = setTimeout(() => {
          settleTimer.current = null;
          setCameraStatus({ deviated: true });
        }, DEFAULT_VIEW_SETTLE_SECONDS * 1000);
      },
    }),
    [view],
  );
}
