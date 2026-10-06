import { ROAD_LAYOUTS } from "../constants/roadLayouts";
import { WORLD_SCHEMA_VERSION, WORLD_TILE_LIMIT } from "../constants/world";
import type { HexCoordinate, HexRotation, TimeMode, WorldData } from "../types";
import { coordinateKey, getAvailableCoordinates, getHexNeighbors } from "./hex";
import { getRoadGroups } from "./roads";

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function distance(a: HexCoordinate, b: HexCoordinate): number {
  const q = a.q - b.q;
  const r = a.r - b.r;
  return Math.max(Math.abs(q), Math.abs(r), Math.abs(q + r));
}

function rotateCoordinate(
  coordinate: HexCoordinate,
  rotation: HexRotation,
): HexCoordinate {
  let { q, r } = coordinate;
  for (let step = 0; step < rotation; step += 1) {
    [q, r] = [q + r, -q];
  }
  return { q, r };
}

export function generateRandomWorld(timeMode: TimeMode): WorldData {
  const layout = pick(ROAD_LAYOUTS);
  const rotation = Math.floor(Math.random() * 6) as HexRotation;
  const tiles: WorldData["tiles"] = {};
  for (const tile of layout.tiles) {
    const coordinate = rotateCoordinate(tile, rotation);
    tiles[coordinateKey(coordinate)] = {
      ...coordinate,
      tileId: tile.tileId,
      rotation: ((tile.rotation + rotation) % 6) as HexRotation,
    };
  }

  const roads = Object.values(tiles);
  const targetCount = Math.min(
    WORLD_TILE_LIMIT,
    roads.length + 20 + Math.floor(Math.random() * 16),
  );
  while (Object.keys(tiles).length < targetCount) {
    const available = getAvailableCoordinates(tiles);
    const nearby = available.filter((coordinate) =>
      roads.some((road) => distance(coordinate, road) <= 2),
    );
    const candidates = nearby.length > 0 ? nearby : available;
    const compact = candidates.filter(
      (coordinate) =>
        getHexNeighbors(coordinate).filter(
          (neighbor) => tiles[coordinateKey(neighbor)],
        ).length >= 2,
    );
    const coordinate = pick(compact.length > 0 ? compact : candidates);
    tiles[coordinateKey(coordinate)] = {
      ...coordinate,
      tileId: "grass",
      rotation: 0,
    };
  }

  const scenery = Object.values(tiles).filter(
    (tile) => tile.tileId === "grass",
  );
  const forestCenter = pick(scenery);
  const lakeCandidates = scenery.filter(
    (tile) => distance(tile, forestCenter) > 2,
  );
  const lakeCenter =
    lakeCandidates.length > 0 && Math.random() < 0.6
      ? pick(lakeCandidates)
      : null;
  let buildingCount = 0;
  for (const tile of scenery) {
    const besideRoad = getHexNeighbors(tile).some((neighbor) =>
      tiles[coordinateKey(neighbor)]?.tileId.startsWith("path-"),
    );
    let tileId: string;
    if (lakeCenter && distance(tile, lakeCenter) <= 1) {
      tileId = pick(["water", "water", "water-island", "water-rocks"]);
    } else if (besideRoad && buildingCount < 3 && Math.random() < 0.12) {
      tileId = pick([
        "building-cabin",
        "building-house",
        "building-farm",
        "building-sheep",
      ]);
      buildingCount += 1;
    } else if (distance(tile, forestCenter) <= 2) {
      tileId = pick(["grass-forest", "grass-forest", "grass-hill", "grass"]);
    } else {
      tileId = pick(["grass", "grass", "grass", "grass-hill"]);
    }
    tiles[coordinateKey(tile)] = {
      ...tile,
      tileId,
      rotation: Math.floor(Math.random() * 6) as HexRotation,
    };
  }

  const world: WorldData = {
    version: WORLD_SCHEMA_VERSION,
    mode: "relax",
    timeMode,
    tiles,
    character: null,
  };
  if (import.meta.env.DEV) {
    console.log("[隨機生成]", {
      道路骨架: layout.name,
      骨架ID: layout.id,
      旋轉: rotation,
      總格數: Object.keys(tiles).length,
      道路格數: roads.length,
      森林中心: { q: forestCenter.q, r: forestCenter.r },
      湖泊中心: lakeCenter ? { q: lakeCenter.q, r: lakeCenter.r } : null,
      建築數量: buildingCount,
      道路群組: getRoadGroups(tiles),
      世界資料: world,
    });
  }
  return world;
}
