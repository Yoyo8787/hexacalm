import { useEffect, useRef, type RefObject } from "react";
import { useThree } from "@react-three/fiber";
import type { Vector3 } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useWorldStore } from "../../../stores";
import { BUILDER_CAMERA_POSITION } from "../../../constants/world";

type ResetView = Record<
  | "transitionPosition"
  | "transitionTarget"
  | "builderPosition"
  | "builderTarget",
  Vector3
>;

// Starts a transition back to the initial Builder view on each reset request.
export function useCameraReset({
  controls,
  view,
  transitioning,
  transitionElapsed,
}: {
  controls: RefObject<OrbitControlsImpl | null>;
  view: ResetView;
  transitioning: RefObject<boolean>;
  transitionElapsed: RefObject<number>;
}) {
  const cameraMode = useWorldStore((state) => state.cameraMode);
  const resetCameraCounter = useWorldStore((state) => state.resetCameraCounter);
  const camera = useThree((state) => state.camera);
  const invalidate = useThree((state) => state.invalidate);
  const previousResetCounter = useRef(resetCameraCounter);

  useEffect(() => {
    if (previousResetCounter.current === resetCameraCounter) return;
    previousResetCounter.current = resetCameraCounter;
    if (cameraMode !== "builder" || !controls.current) return;
    const orbit = controls.current;
    view.transitionPosition.copy(camera.position);
    view.transitionTarget.copy(orbit.target);
    orbit.enableDamping = false;
    orbit.update();
    orbit.enableDamping = true;
    view.builderPosition.set(...BUILDER_CAMERA_POSITION);
    view.builderTarget.set(0, 0, 0);
    transitionElapsed.current = 0;
    transitioning.current = true;
    orbit.enabled = false;
    useWorldStore.getState().setCameraStatus({ resetting: true });
    invalidate();
  }, [
    resetCameraCounter,
    cameraMode,
    camera,
    invalidate,
    controls,
    view,
    transitioning,
    transitionElapsed,
  ]);
}
