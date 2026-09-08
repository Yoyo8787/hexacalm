import { getTileDefinition } from "../../constants/tileCatalog";
import type {
  HexCoordinate,
  HexDirection,
  HexRotation,
  PlacedTile,
  RoadConnections,
  WorldData,
} from "../../types";
import { coordinateKey, getOppositeDirection, HEX_DIRECTIONS } from "../hex";

export interface ConnectedRoadNeighbor {
  direction: HexDirection;
  tile: PlacedTile;
}

export function rotateRoadConnections(
  connections: RoadConnections,
  rotation: HexRotation,
): RoadConnections {
  return [
    connections[(0 - rotation + 6) % 6],
    connections[(1 - rotation + 6) % 6],
    connections[(2 - rotation + 6) % 6],
    connections[(3 - rotation + 6) % 6],
    connections[(4 - rotation + 6) % 6],
    connections[(5 - rotation + 6) % 6],
  ];
}

function getRoadState(
  tiles: WorldData["tiles"],
  coordinate: HexCoordinate,
): { tile: PlacedTile; exits: RoadConnections } | undefined {
  const tile = tiles[coordinateKey(coordinate)];
  const definition = tile && getTileDefinition(tile.tileId);

  if (definition?.kind !== "road" || !definition.traversable) {
    return undefined;
  }

  return {
    tile,
    exits: rotateRoadConnections(definition.roadConnections, tile.rotation),
  };
}

export function getConnectedRoadNeighbors(
  tiles: WorldData["tiles"],
  coordinate: HexCoordinate,
): ConnectedRoadNeighbor[] {
  const road = getRoadState(tiles, coordinate);
  if (!road) {
    return [];
  }

  const neighbors: ConnectedRoadNeighbor[] = [];

  HEX_DIRECTIONS.forEach((offset, index) => {
    const direction = index as HexDirection;
    if (!road.exits[direction]) {
      return;
    }

    const neighbor = getRoadState(tiles, {
      q: coordinate.q + offset.q,
      r: coordinate.r + offset.r,
    });
    if (neighbor?.exits[getOppositeDirection(direction)]) {
      neighbors.push({ direction, tile: neighbor.tile });
    }
  });

  return neighbors;
}

export function getRoadGroups(tiles: WorldData["tiles"]): HexCoordinate[][] {
  const compareCoordinates = (first: HexCoordinate, second: HexCoordinate) =>
    first.q - second.q || first.r - second.r;
  const roads = Object.values(tiles)
    .filter((tile) => getRoadState(tiles, tile))
    .sort(compareCoordinates);
  const visited = new Set<string>();
  const groups: HexCoordinate[][] = [];

  for (const road of roads) {
    const key = coordinateKey(road);
    if (visited.has(key)) {
      continue;
    }

    const group: HexCoordinate[] = [{ q: road.q, r: road.r }];
    visited.add(key);

    for (let index = 0; index < group.length; index += 1) {
      for (const { tile } of getConnectedRoadNeighbors(tiles, group[index])) {
        const neighborKey = coordinateKey(tile);
        if (!visited.has(neighborKey)) {
          visited.add(neighborKey);
          group.push({ q: tile.q, r: tile.r });
        }
      }
    }

    groups.push(group.sort(compareCoordinates));
  }

  return groups;
}
