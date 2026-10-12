import { useHoverAction } from "../../hooks";
import { useWorldStore } from "../../stores";
import { coordinateKey, hexToWorld } from "../../utils/hex";
import { HEX_RADIUS } from "../tile/constants";

function HoverHighlight() {
  const action = useHoverAction();
  const showStartHighlight = useWorldStore(
    (state) =>
      state.world.mode === "build" &&
      state.cameraMode === "builder" &&
      Object.keys(state.world.tiles).length === 0,
  );
  const hoveredCoordinate = useWorldStore((state) => state.hoveredCoordinate);
  const coordinate = showStartHighlight ? { q: 0, r: 0 } : hoveredCoordinate;
  const occupied = useWorldStore(
    (state) =>
      !!state.hoveredCoordinate &&
      !!state.world.tiles[coordinateKey(state.hoveredCoordinate)],
  );

  if (
    !coordinate ||
    (!showStartHighlight &&
      (occupied || (action !== "place" && action !== "full")))
  ) {
    return null;
  }

  const highlighted = showStartHighlight || action === "place";

  const [x, , z] = hexToWorld(coordinate);

  return (
    <mesh position={[x, 0.06, z]} raycast={() => null} renderOrder={1}>
      <cylinderGeometry args={[HEX_RADIUS, HEX_RADIUS, 0.01, 6]} />
      <meshBasicMaterial
        color={highlighted ? "#81c7d4" : "#ffffff"}
        depthTest={false}
        depthWrite={false}
        opacity={highlighted ? 0.28 : 0.14}
        transparent
      />
    </mesh>
  );
}

export default HoverHighlight;
