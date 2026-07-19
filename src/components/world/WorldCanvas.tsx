import { Canvas } from "@react-three/fiber";
import WorldScene from "./WorldScene";

function WorldCanvas() {
  return (
    <Canvas
      camera={{ fov: 42, near: 0.1, far: 100, position: [8, 10, 10] }}
      dpr={[1, 1.75]}
      gl={{ antialias: true }}
      frameloop="demand"
    >
      <WorldScene />
    </Canvas>
  );
}

export default WorldCanvas;
