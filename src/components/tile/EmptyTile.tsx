import { useState } from "react";
import type { ThreeEvent } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import type { HexCoordinate } from "../../types";
import { hexToWorld } from "../../utils/hex";
import { HEX_RADIUS } from "./constants";

interface EmptyTileProps {
  coordinate: HexCoordinate;
  onActivate: (coordinate: HexCoordinate) => void;
}

function EmptyTile({ coordinate, onActivate }: EmptyTileProps) {
  const [hovered, setHovered] = useState(false);
  const position = hexToWorld(coordinate);

  function handleClick(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation();
    onActivate(coordinate);
  }

  return (
    <mesh
      onClick={handleClick}
      onPointerOut={() => setHovered(false)}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
      }}
      position={[position[0], 0.05, position[2]]}
    >
      <cylinderGeometry args={[HEX_RADIUS, HEX_RADIUS, 0.1, 6]} />
      <meshBasicMaterial depthWrite={false} opacity={0} transparent />

      {hovered && <Edges color="#b9f4ff" threshold={15} />}
    </mesh>
  );
}

export default EmptyTile;
