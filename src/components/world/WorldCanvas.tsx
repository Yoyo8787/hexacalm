import { Canvas } from "@react-three/fiber";
import { BUILDER_CAMERA_POSITION } from "../../constants/world";
import WorldScene from "./WorldScene";

function WorldCanvas() {
  return (
    <Canvas
      camera={{
        fov: 42,
        near: 0.1,
        far: 100,
        position: BUILDER_CAMERA_POSITION,
      }}
      dpr={[1, 1.75]}
      gl={{ antialias: true }}
      frameloop="demand"
    >
      <WorldScene />
    </Canvas>
  );
}

export default WorldCanvas;
