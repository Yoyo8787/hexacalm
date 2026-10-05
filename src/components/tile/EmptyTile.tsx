import type { ThreeEvent } from "@react-three/fiber";
import { useWorldStore } from "../../stores";
import type { HexCoordinate } from "../../types";
import { hexToWorld } from "../../utils/hex";
import { HEX_RADIUS } from "./constants";

interface EmptyTileProps {
  coordinate: HexCoordinate;
  onActivate: (coordinate: HexCoordinate) => void;
}

function EmptyTile({ coordinate, onActivate }: EmptyTileProps) {
  const setHoveredCoordinate = useWorldStore(
    (state) => state.setHoveredCoordinate,
  );
  const position = hexToWorld(coordinate);

  function handleClick(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation();
    onActivate(coordinate);
  }

  return (
    <mesh
      onClick={handleClick}
      onPointerOut={() => setHoveredCoordinate(coordinate, false)}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHoveredCoordinate(coordinate, true);
      }}
      position={[position[0], 0.05, position[2]]}
    >
      <cylinderGeometry args={[HEX_RADIUS, HEX_RADIUS, 0.1, 6]} />
      <meshBasicMaterial depthWrite={false} opacity={0} transparent />
    </mesh>
  );
}

export default EmptyTile;
