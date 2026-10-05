import { useMemo, useRef } from "react";
import { ambientAudioEngine } from "../../audio/engine";
import CharacterModel from "../character/CharacterModel";
import { useBuildActions } from "../../hooks";
import { useWorldStore } from "../../stores";
import { getAvailableCoordinates } from "../../utils/hex";
import EmptyTile from "../tile/EmptyTile";
import TileModel from "../tile/TileModel";
import CameraControls from "./CameraControls";
import HoverHighlight from "./HoverHighlight";
import SceneAtmosphere from "./SceneAtmosphere";
import type { CharacterViewMotion } from "../../types";

function WorldScene() {
  const world = useWorldStore((state) => state.world);
  const cameraMode = useWorldStore((state) => state.cameraMode);
  const characterMotion = useRef<CharacterViewMotion | null>(null);
  const { applyTileAction } = useBuildActions();
  const tiles = Object.values(world.tiles);
  const availableCoordinates = useMemo(
    () => getAvailableCoordinates(world.tiles),
    [world.tiles],
  );

  return (
    <>
      <SceneAtmosphere />

      {tiles.map((tile) => (
        <TileModel
          key={`${tile.q},${tile.r}`}
          onActivate={applyTileAction}
          tile={tile}
        />
      ))}

      {world.mode === "build" &&
        cameraMode === "builder" &&
        availableCoordinates.map((coordinate) => (
          <EmptyTile
            coordinate={coordinate}
            key={`${coordinate.q},${coordinate.r}`}
            onActivate={applyTileAction}
          />
        ))}

      <HoverHighlight />

      <CharacterModel
        onLand={ambientAudioEngine.playFootstep}
        onMotion={(motion) => {
          characterMotion.current = motion;
        }}
      />
      <CameraControls characterMotion={characterMotion} />
    </>
  );
}

export default WorldScene;
