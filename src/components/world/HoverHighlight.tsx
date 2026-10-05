import { useHoverAction, type HoverAction } from "../../hooks";
import { useWorldStore } from "../../stores";
import { coordinateKey, hexToWorld } from "../../utils/hex";
import { HEX_RADIUS } from "../tile/constants";

const HIGHLIGHT_STYLES: Record<
  HoverAction,
  { color: string; opacity: number }
> = {
  rotate: { color: "#ffffff", opacity: 0.14 },
  place: { color: "#81c7d4", opacity: 0.28 },
  remove: { color: "#f87171", opacity: 0.3 },
  full: { color: "#ffffff", opacity: 0.14 },
};

// Tints the hovered cell with the color of the action a click would apply.
function HoverHighlight() {
  const action = useHoverAction();
  const coordinate = useWorldStore((state) => state.hoveredCoordinate);
  const occupied = useWorldStore(
    (state) =>
      !!state.hoveredCoordinate &&
      !!state.world.tiles[coordinateKey(state.hoveredCoordinate)],
  );

  if (!action || !coordinate) return null;

  const [x, , z] = hexToWorld(coordinate);
  const { color, opacity } = HIGHLIGHT_STYLES[action];

  return (
    <mesh
      position={[x, occupied ? 0.26 : 0.06, z]}
      raycast={() => null}
      renderOrder={1}
    >
      <cylinderGeometry args={[HEX_RADIUS, HEX_RADIUS, 0.01, 6]} />
      <meshBasicMaterial
        color={color}
        depthTest={false}
        depthWrite={false}
        opacity={opacity}
        transparent
      />
    </mesh>
  );
}

export default HoverHighlight;
