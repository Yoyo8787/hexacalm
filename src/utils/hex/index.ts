import { HEX_SIZE } from "../../components/tile/constants";
import type { HexCoordinate, PlacedTile } from "../../types";

const HEX_DIRECTIONS: HexCoordinate[] = [
  { q: 1, r: 0 },
  { q: 1, r: -1 },
  { q: 0, r: -1 },
  { q: -1, r: 0 },
  { q: -1, r: 1 },
  { q: 0, r: 1 },
];

export function coordinateKey({ q, r }: HexCoordinate): string {
  return `${q},${r}`;
}

export function getHexNeighbors({ q, r }: HexCoordinate): HexCoordinate[] {
  return HEX_DIRECTIONS.map((direction) => ({
    q: q + direction.q,
    r: r + direction.r,
  }));
}

export function getAvailableCoordinates(
  tiles: Record<string, PlacedTile>,
): HexCoordinate[] {
  const placedTiles = Object.values(tiles);

  if (placedTiles.length === 0) {
    return [{ q: 0, r: 0 }];
  }

  const available = new Map<string, HexCoordinate>();

  placedTiles.forEach((tile) => {
    getHexNeighbors(tile).forEach((coordinate) => {
      const key = coordinateKey(coordinate);
      if (!tiles[key]) {
        available.set(key, coordinate);
      }
    });
  });

  return Array.from(available.values());
}

export function hexToWorld({ q, r }: HexCoordinate): [number, number, number] {
  const x = HEX_SIZE * (q + r / 2);
  const z = HEX_SIZE * (Math.sqrt(3) / 2) * r;
  return [x, 0, z];
}
