import { useHoverAction } from "../../hooks";
import { useWorldStore } from "../../stores";
import { coordinateKey, hexToWorld } from "../../utils/hex";
import { HEX_RADIUS } from "../tile/constants";

function HoverHighlight() {
  const action = useHoverAction();
  const coordinate = useWorldStore((state) => state.hoveredCoordinate);
  const occupied = useWorldStore(
    (state) =>
      !!state.hoveredCoordinate &&
      !!state.world.tiles[coordinateKey(state.hoveredCoordinate)],
  );

  if (!coordinate || occupied || (action !== "place" && action !== "full")) {
    return null;
  }

  const [x, , z] = hexToWorld(coordinate);

  return (
    <mesh position={[x, 0.06, z]} raycast={() => null} renderOrder={1}>
      <cylinderGeometry args={[HEX_RADIUS, HEX_RADIUS, 0.01, 6]} />
      <meshBasicMaterial
        color={action === "place" ? "#81c7d4" : "#ffffff"}
        depthTest={false}
        depthWrite={false}
        opacity={action === "place" ? 0.28 : 0.14}
        transparent
      />
    </mesh>
  );
}

export default HoverHighlight;
