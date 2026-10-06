import { getTileDefinition } from "../constants/tileCatalog";
import type {
  HexCoordinate,
  HexDirection,
  HexRotation,
  TileDefinition,
  WorldData,
} from "../types";
import { coordinateKey, getOppositeDirection, HEX_DIRECTIONS } from "./hex";
import { rotateRoadConnections } from "./roads";

export function getPlacementRotation(
  tiles: WorldData["tiles"],
  coordinate: HexCoordinate,
  definition: TileDefinition,
): HexRotation {
  if (definition.kind !== "road" && !("connectionKey" in definition))
    return definition.defaultRotation;

  const connections =
    definition.kind === "road"
      ? definition.roadConnections
      : definition.connections;

  const incoming = HEX_DIRECTIONS.map((offset, index) => {
    const neighbor =
      tiles[
        coordinateKey({
          q: coordinate.q + offset.q,
          r: coordinate.r + offset.r,
        })
      ];
    const neighborDefinition = neighbor && getTileDefinition(neighbor.tileId);
    if (!neighborDefinition || neighborDefinition.kind !== definition.kind)
      return false;

    const neighborConnections =
      neighborDefinition.kind === "road"
        ? neighborDefinition.roadConnections
        : "connectionKey" in neighborDefinition &&
            "connectionKey" in definition &&
            neighborDefinition.connectionKey === definition.connectionKey
          ? neighborDefinition.connections
          : undefined;
    return !!(
      neighborConnections &&
      rotateRoadConnections(neighborConnections, neighbor.rotation)[
        getOppositeDirection(index as HexDirection)
      ]
    );
  });

  let bestRotation = definition.defaultRotation;
  let bestScore = 0;
  for (let step = 0; step < 6; step += 1) {
    const rotation = ((definition.defaultRotation + step) % 6) as HexRotation;
    const exits = rotateRoadConnections(connections, rotation);
    const score = incoming.filter(
      (connected, index) => connected && exits[index],
    ).length;
    if (score > bestScore) {
      bestScore = score;
      bestRotation = rotation;
    }
  }
  return bestRotation;
}
