import { getTileDefinition } from "../../constants/tileCatalog";
import type { CharacterPose, HexCoordinate, WorldData } from "../../types";
import { coordinateKey } from "../hex";
import { getRoadGroups } from "../roads";
import { getRoadSpawnPosition, isOnRoadSurface } from "../roads/paths";

export function isValidCharacterRoad(
  tiles: WorldData["tiles"],
  coordinate: HexCoordinate,
): boolean {
  const tile = tiles[coordinateKey(coordinate)];
  const definition = tile && getTileDefinition(tile.tileId);
  return definition?.kind === "road" && definition.traversable;
}

export function chooseCharacterSpawn(
  tiles: WorldData["tiles"],
): HexCoordinate | null {
  const groups = getRoadGroups(tiles);
  if (groups.length === 0) return null;

  const largestSize = Math.max(...groups.map((group) => group.length));
  const largestGroups = groups.filter((group) => group.length === largestSize);
  const group = largestGroups[Math.floor(Math.random() * largestGroups.length)];
  return { ...group[Math.floor(Math.random() * group.length)] };
}

export function resolveCharacterPose(
  tiles: WorldData["tiles"],
  pose: CharacterPose | null,
  replan = false,
): CharacterPose | null {
  if (
    pose &&
    isValidCharacterRoad(tiles, pose.coordinate) &&
    isOnRoadSurface(tiles[coordinateKey(pose.coordinate)], pose.position)
  ) {
    return replan ? { ...pose, route: null, moving: false } : pose;
  }

  const coordinate = chooseCharacterSpawn(tiles);
  if (!coordinate) return null;

  return {
    coordinate,
    position: getRoadSpawnPosition(tiles[coordinateKey(coordinate)]),
    heading: pose?.heading ?? 0,
    speed: pose?.speed ?? 1,
    moving: false,
    enteredFrom: null,
    route: null,
  };
}
