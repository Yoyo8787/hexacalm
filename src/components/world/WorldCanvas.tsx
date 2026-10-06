import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import {
  BUILDER_CAMERA_POSITION,
  POINTER_DRAG_THRESHOLD,
} from "../../constants/world";
import { useWorldStore } from "../../stores";
import { useHoverAction } from "../../hooks";
import WorldScene from "./WorldScene";

const ACTION_CURSORS = {
  rotate: "cursor-pointer",
  place: "cursor-crosshair",
  remove: "cursor-pointer",
  full: "cursor-not-allowed",
};

function WorldCanvas() {
  const action = useHoverAction();
  // Right drag pans the camera; only a right click cancels the Tile selection.
  const rightPress = useRef<{ x: number; y: number } | null>(null);

  return (
    <Canvas
      className={action ? ACTION_CURSORS[action] : "cursor-auto"}
      camera={{
        fov: 42,
        near: 0.1,
        far: 100,
        position: BUILDER_CAMERA_POSITION,
      }}
      dpr={[1, 1.75]}
      gl={{ antialias: true }}
      frameloop="demand"
      onContextMenu={(event) => event.preventDefault()}
      onPointerDown={(event) => {
        if (event.button === 2) {
          rightPress.current = { x: event.clientX, y: event.clientY };
        }
      }}
      onPointerUp={(event) => {
        const press = rightPress.current;
        if (event.button !== 2 || !press) return;
        rightPress.current = null;
        if (
          Math.hypot(event.clientX - press.x, event.clientY - press.y) >=
          POINTER_DRAG_THRESHOLD
        ) {
          return;
        }
        const { world, selectedTileId, selectTile } = useWorldStore.getState();
        if (world.mode === "build" && selectedTileId) selectTile(null);
      }}
    >
      <WorldScene />
    </Canvas>
  );
}

export default WorldCanvas;
