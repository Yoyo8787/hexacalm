import { useEffect, useMemo, useRef, type RefObject } from "react";
import { OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useWorldStore } from "../../../stores";
import type { CharacterViewMotion } from "../../../types";
import { TRANSITION_SECONDS } from "./constants";
import { useCameraReset } from "./useCameraReset";
import { useFollowView } from "./useFollowView";
import { useKeyboardMove } from "./useKeyboardMove";

function CameraControls({
  characterMotion,
}: {
  characterMotion: RefObject<CharacterViewMotion | null>;
}) {
  const cameraMode = useWorldStore((state) => state.cameraMode);
  const camera = useThree((state) => state.camera);
  const invalidate = useThree((state) => state.invalidate);
  const controls = useRef<OrbitControlsImpl>(null);
  const keyboardMove = useKeyboardMove();
  const followView = useFollowView(characterMotion);
  const previousMode = useRef(cameraMode);
  const transitioning = useRef(false);
  const transitionElapsed = useRef(0);
  const view = useMemo(
    () => ({
      transitionPosition: camera.position.clone(),
      transitionTarget: new Vector3(),
      builderPosition: camera.position.clone(),
      builderTarget: new Vector3(),
      target: new Vector3(),
      destination: new Vector3(),
      destinationTarget: new Vector3(),
    }),
    [camera],
  );

  useCameraReset({ controls, view, transitioning, transitionElapsed });

  useEffect(() => {
    if (previousMode.current === cameraMode) return;
    if (previousMode.current === "builder" && !transitioning.current) {
      view.builderPosition.copy(camera.position);
      view.builderTarget.copy(controls.current?.target ?? view.target);
      view.target.copy(view.builderTarget);
    }
    view.transitionPosition.copy(camera.position);
    view.transitionTarget.copy(view.target);
    transitionElapsed.current = 0;
    previousMode.current = cameraMode;
    transitioning.current = true;
    if (controls.current) controls.current.enabled = false;
    invalidate();
  }, [cameraMode, camera, invalidate, view]);

  useEffect(() => {
    const resume = () => {
      if (!document.hidden) invalidate();
    };
    document.addEventListener("visibilitychange", resume);
    return () => document.removeEventListener("visibilitychange", resume);
  }, [invalidate]);

  useFrame((state, delta) => {
    if (document.hidden) return;
    if (cameraMode === "builder" && !transitioning.current) {
      if (
        controls.current &&
        keyboardMove.step(Math.min(delta, 0.05), camera, controls.current)
      ) {
        state.invalidate();
      }
      return;
    }
    keyboardMove.stop();
    if (cameraMode === "builder") {
      followView.reset();
      view.destination.copy(view.builderPosition);
      view.destinationTarget.copy(view.builderTarget);
    } else if (
      !followView.update(
        cameraMode,
        delta,
        view.destination,
        view.destinationTarget,
      )
    ) {
      return;
    }
    if (transitioning.current) {
      transitionElapsed.current += Math.min(delta, 0.05);
      const progress = Math.min(
        transitionElapsed.current / TRANSITION_SECONDS,
        1,
      );
      const blend = progress * progress * (3 - 2 * progress);
      camera.position.lerpVectors(
        view.transitionPosition,
        view.destination,
        blend,
      );
      view.target.lerpVectors(
        view.transitionTarget,
        view.destinationTarget,
        blend,
      );
      if (progress === 1) {
        transitioning.current = false;
        camera.position.copy(view.destination);
        view.target.copy(view.destinationTarget);
      }
    } else {
      camera.position.copy(view.destination);
      view.target.copy(view.destinationTarget);
    }
    camera.lookAt(view.target);
    if (
      cameraMode === "builder" &&
      !transitioning.current &&
      controls.current
    ) {
      controls.current.target.copy(view.builderTarget);
      controls.current.enabled = true;
      controls.current.update();
    }
    state.invalidate();
  });

  return (
    <OrbitControls
      ref={controls}
      enabled={cameraMode === "builder"}
      enableDamping
      screenSpacePanning={false}
      makeDefault
      maxDistance={32}
      maxPolarAngle={Math.PI / 2.15}
      minDistance={4}
      minPolarAngle={Math.PI / 7}
    />
  );
}

export default CameraControls;
