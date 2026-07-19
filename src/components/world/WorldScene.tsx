import { useMemo } from "react";
import { useBuildActions } from "../../hooks";
import { useWorldStore } from "../../stores";
import { getAvailableCoordinates } from "../../utils/hex";
import EmptyTile from "../tile/EmptyTile";
import TileModel from "../tile/TileModel";
import CameraControls from "./CameraControls";

function WorldScene() {
  const world = useWorldStore((state) => state.world);
  const { applyTileAction } = useBuildActions();
  const tiles = Object.values(world.tiles);
  const availableCoordinates = useMemo(
    () => getAvailableCoordinates(world.tiles),
    [world.tiles],
  );

  return (
    <>
      <color args={["#101312"]} attach="background" />
      <fog args={["#101312", 18, 42]} attach="fog" />
      <ambientLight color="#91a8a2" intensity={2} />
      <directionalLight color="#ffe5bd" intensity={3.5} position={[8, 20, 7]} />

      {tiles.map((tile) => (
        <TileModel
          key={`${tile.q},${tile.r}`}
          onActivate={applyTileAction}
          tile={tile}
        />
      ))}

      {world.mode === "build" &&
        availableCoordinates.map((coordinate) => (
          <EmptyTile
            coordinate={coordinate}
            key={`${coordinate.q},${coordinate.r}`}
            onActivate={applyTileAction}
          />
        ))}

      <CameraControls />
    </>
  );
}

export default WorldScene;
