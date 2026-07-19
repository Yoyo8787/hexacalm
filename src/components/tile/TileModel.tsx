import { Suspense, useEffect, useRef, useState } from "react";
import { Clone, useAnimations } from "@react-three/drei";
import { useFrame, useLoader, type ThreeEvent } from "@react-three/fiber";
import { LoadingManager, type AnimationClip, type Group } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { getTileDefinition } from "../../constants/tileCatalog";
import type { HexCoordinate, PlacedTile } from "../../types";
import { hexToWorld } from "../../utils/hex";
import { HEX_RADIUS, HEX_ROTATION_STEP } from "./constants";
import { useWorldStore } from "../../stores";

interface TileModelProps {
  tile: PlacedTile;
  onActivate: (coordinate: HexCoordinate) => void;
}

class TileGLTFLoader extends GLTFLoader {
  constructor() {
    const loadingManager = new LoadingManager();
    loadingManager.setURLModifier((url) =>
      url.toLowerCase().endsWith("/textures/colormap.png")
        ? "models/textures/colormap.png"
        : url,
    );
    super(loadingManager);
  }
}

interface AnimatedModelProps {
  animations: AnimationClip[];
  scene: Group;
}

function AnimatedModel({ animations, scene }: AnimatedModelProps) {
  const group = useRef<Group>(null);
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    const playingActions = Object.values(actions);

    playingActions.forEach((action) => action?.reset().play());

    return () => {
      playingActions.forEach((action) => action?.stop());
    };
  }, [actions]);

  // Canvas uses frameloop="demand". Active GLB animations request their own
  // subsequent frames, while static models remain idle.
  useFrame((state) => {
    state.invalidate();
  });

  return (
    <group ref={group}>
      <Clone object={scene} />
    </group>
  );
}

function LoadedModel({ path }: { path: string }) {
  const { animations, scene } = useLoader(TileGLTFLoader, path);

  if (animations.length > 0) {
    return <AnimatedModel animations={animations} scene={scene} />;
  }

  return <Clone object={scene} />;
}

function ModelFallback() {
  return (
    <mesh>
      <cylinderGeometry args={[HEX_RADIUS, HEX_RADIUS, 0.1, 6]} />
      <meshStandardMaterial color="#31443f" />
    </mesh>
  );
}

function TileModel({ tile, onActivate }: TileModelProps) {
  const definition = getTileDefinition(tile.tileId);
  const [hovered, setHovered] = useState(false);
  const mode = useWorldStore((state) => state.world.mode);
  const position = hexToWorld(tile);

  function handleClick(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation();
    onActivate(tile);
  }

  return (
    <group
      onClick={handleClick}
      position={[
        position[0],
        hovered && mode === "build" ? 0.05 : 0,
        position[2],
      ]}
      rotation={[0, tile.rotation * HEX_ROTATION_STEP, 0]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
      }}
    >
      <Suspense fallback={<ModelFallback />}>
        {definition ? (
          <LoadedModel path={definition.modelPath} />
        ) : (
          <ModelFallback />
        )}
      </Suspense>
    </group>
  );
}

export default TileModel;
