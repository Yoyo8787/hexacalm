import { useEffect, useMemo, useRef, type RefObject } from "react";
import { OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useWorldStore } from "../../stores";
import { getTileDefinition } from "../../constants/tileCatalog";
import { CHARACTER_ROAD_SURFACE_HEIGHT } from "../../constants/characterCatalog";
import { coordinateKey } from "../../utils/hex";
import type { CharacterViewMotion } from "../../types";

const FOLLOW_DISTANCE = 1.8;
const FOLLOW_HEIGHT = 1;
const EYE_HEIGHT = 0.18;
const TRANSITION_SECONDS = 0.65;
const CAMERA_TURN_RESPONSE = 4;

function CameraControls({
  characterMotion,
}: {
  characterMotion: RefObject<CharacterViewMotion | null>;
}) {
  const cameraMode = useWorldStore((state) => state.cameraMode);
  const camera = useThree((state) => state.camera);
  const invalidate = useThree((state) => state.invalidate);
  const controls = useRef<OrbitControlsImpl>(null);
  const previousMode = useRef(cameraMode);
  const transitioning = useRef(false);
  const transitionElapsed = useRef(0);
  const followHeading = useRef<number | null>(null);
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
    if (cameraMode === "builder" && !transitioning.current) return;
    if (cameraMode === "builder") {
      followHeading.current = null;
      view.destination.copy(view.builderPosition);
      view.destinationTarget.copy(view.builderTarget);
    } else {
      const { world, characterPose: pose } = useWorldStore.getState();
      if (!pose || !world.character) return;
      const tile = world.tiles[coordinateKey(pose.coordinate)];
      const road = tile && getTileDefinition(tile.tileId);
      if (road?.kind !== "road") return;
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
        view.destination.set(x, height, z);
        view.destinationTarget.set(x + forwardX, height, z + forwardZ);
      } else {
        view.destination.set(
          x - forwardX * FOLLOW_DISTANCE,
          ground + FOLLOW_HEIGHT,
          z - forwardZ * FOLLOW_DISTANCE,
        );
        view.destinationTarget.set(x, ground + EYE_HEIGHT, z);
      }
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
      makeDefault
      maxDistance={32}
      maxPolarAngle={Math.PI / 2.15}
      minDistance={4}
      minPolarAngle={Math.PI / 7}
    />
  );
}

export default CameraControls;
