import { useEffect, useRef, useState } from "react";
import WorldError from "../common/WorldError";
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

function supportsWebGL(): boolean {
  try {
    const context = document.createElement("canvas").getContext("webgl2");
    context?.getExtension("WEBGL_lose_context")?.loseContext();
    return context !== null;
  } catch {
    return false;
  }
}

function WorldCanvas({ onBack }: { onBack: () => void }) {
  const action = useHoverAction();
  const [supported] = useState(supportsWebGL);
  const [contextLost, setContextLost] = useState(false);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  // Right drag pans the camera; only a right click cancels the Tile selection.
  const rightPress = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const element = canvas;
    if (!element) return;
    const onContextLost = (event: Event) => {
      event.preventDefault();
      setContextLost(true);
    };
    element.addEventListener("webglcontextlost", onContextLost);
    return () => element.removeEventListener("webglcontextlost", onContextLost);
  }, [canvas]);

  if (!supported || contextLost) {
    return (
      <WorldError
        onBack={onBack}
        title={contextLost ? "3D 畫面已中斷" : "無法顯示 3D 世界"}
        description={
          contextLost
            ? "圖形處理已中斷，請重新整理，或返回首頁。"
            : "此瀏覽器無法使用 WebGL 2，請換用支援的瀏覽器，或確認硬體加速已開啟。"
        }
      />
    );
  }

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
      onCreated={({ gl }) => {
        setCanvas(gl.domElement);
      }}
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
