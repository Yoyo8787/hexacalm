import { OrbitControls } from "@react-three/drei";

function CameraControls() {
  return (
    <OrbitControls
      enableDamping
      makeDefault
      maxDistance={32}
      maxPolarAngle={Math.PI / 2.15}
      minDistance={4}
      minPolarAngle={Math.PI / 7}
      target={[0, 0, 0]}
    />
  );
}

export default CameraControls;
