import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import type { Group } from "three";
import {
  CHARACTER_MODEL_SCALE,
  CHARACTER_ROAD_SURFACE_HEIGHT,
  getCharacterDefinition,
} from "../../constants/characterCatalog";
import { getTileDefinition } from "../../constants/tileCatalog";
import { useWorldStore } from "../../stores";
import { coordinateKey } from "../../utils/hex";
import { CharacterAnimation } from "../../utils/character/animation";

interface CharacterMotionProps {
  path: string;
  walking: boolean;
  heading: number;
  speed: number;
  onLand?: () => void;
}

export function AnimatedCharacter({
  path,
  walking,
  heading,
  speed,
  onLand,
}: CharacterMotionProps) {
  const { scene, animations } = useGLTF(path);
  const model = useMemo(() => scene.clone(true), [scene]);
  const controller = useRef<CharacterAnimation | null>(null);
  const group = useRef<Group>(null);
  const [initialHeading] = useState(heading);
  const skipFrame = useRef(true);
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    const animation = new CharacterAnimation(model, animations);
    controller.current = animation;
    invalidate();
    return () => {
      controller.current = null;
      animation.dispose();
    };
  }, [model, animations, invalidate]);

  useEffect(() => {
    const resume = () => {
      skipFrame.current = true;
      if (!document.hidden) invalidate();
    };
    document.addEventListener("visibilitychange", resume);
    return () => document.removeEventListener("visibilitychange", resume);
  }, [invalidate]);

  useFrame((state, delta) => {
    if (document.hidden) return;
    const elapsed = skipFrame.current ? 0 : Math.min(delta, 0.05);
    skipFrame.current = false;
    controller.current?.update(elapsed, walking, speed, onLand);
    if (group.current) {
      const difference = heading - group.current.rotation.y;
      group.current.rotation.y +=
        Math.atan2(Math.sin(difference), Math.cos(difference)) *
        (1 - Math.exp(-10 * elapsed));
    }
    state.invalidate();
  });

  return (
    <group ref={group} rotation={[0, initialHeading, 0]}>
      <primitive object={model} scale={CHARACTER_MODEL_SCALE} dispose={null} />
    </group>
  );
}

function CharacterModel({ onLand }: { onLand?: () => void }) {
  const character = useWorldStore((state) => state.world.character);
  const pose = useWorldStore((state) => state.characterPose);
  const tiles = useWorldStore((state) => state.world.tiles);
  const skipFrame = useRef(true);
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    const resume = () => {
      skipFrame.current = true;
      if (!document.hidden) invalidate();
    };
    document.addEventListener("visibilitychange", resume);
    return () => document.removeEventListener("visibilitychange", resume);
  }, [invalidate]);
  useFrame((_, delta) => {
    if (document.hidden) return;
    if (skipFrame.current) {
      skipFrame.current = false;
      return;
    }
    useWorldStore.getState().advanceCharacter(delta);
  }, -1);
  if (!character || !pose) return null;

  const definition = getCharacterDefinition(character.id);
  const tile = tiles[coordinateKey(pose.coordinate)];
  const road = tile && getTileDefinition(tile.tileId);
  if (!definition || road?.kind !== "road") return null;
  const [x, z] = pose.position;

  return (
    <group position={[x, road.modelOffsetY + CHARACTER_ROAD_SURFACE_HEIGHT, z]}>
      <Suspense fallback={null}>
        <AnimatedCharacter
          path={definition.modelPath}
          walking={character.walkingEnabled && pose.moving}
          heading={pose.heading}
          speed={pose.speed}
          onLand={() => {
            const current = useWorldStore.getState();
            if (
              !document.hidden &&
              !skipFrame.current &&
              current.world.character?.id === character.id &&
              current.world.character.walkingEnabled &&
              current.characterPose?.moving
            )
              onLand?.();
          }}
        />
      </Suspense>
    </group>
  );
}

export default CharacterModel;
