import { ROAD_SURFACES } from "../../constants/roadSurfaces";
import type { PlacedTile, RoadPoint, RoadTriangle } from "../../types";
import { hexToWorld } from "../hex";

export const distance = (a: RoadPoint, b: RoadPoint): number =>
  Math.hypot(a[0] - b[0], a[1] - b[1]);
const interpolate = (a: RoadPoint, b: RoadPoint, t: number): RoadPoint => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
];
const centroid = (t: RoadTriangle): RoadPoint => [
  (t[0][0] + t[1][0] + t[2][0]) / 3,
  (t[0][1] + t[1][1] + t[2][1]) / 3,
];

function contains(triangle: RoadTriangle, point: RoadPoint): boolean {
  const signs = triangle.map((a, index) => {
    const b = triangle[(index + 1) % 3];
    return (
      (b[0] - a[0]) * (point[1] - a[1]) - (b[1] - a[1]) * (point[0] - a[0])
    );
  });
  return (
    signs.every((n) => n >= -0.000001) || signs.every((n) => n <= 0.000001)
  );
}

export function toRoadLocal(tile: PlacedTile, point: RoadPoint): RoadPoint {
  const [x, , z] = hexToWorld(tile);
  const angle = (tile.rotation * Math.PI) / 3;
  return [
    (point[0] - x) * Math.cos(angle) - (point[1] - z) * Math.sin(angle),
    (point[0] - x) * Math.sin(angle) + (point[1] - z) * Math.cos(angle),
  ];
}

export function toRoadWorld(tile: PlacedTile, point: RoadPoint): RoadPoint {
  const [x, , z] = hexToWorld(tile);
  const angle = (tile.rotation * Math.PI) / 3;
  return [
    x + point[0] * Math.cos(angle) + point[1] * Math.sin(angle),
    z - point[0] * Math.sin(angle) + point[1] * Math.cos(angle),
  ];
}

export function isOnRoadSurface(
  tile: PlacedTile,
  position: RoadPoint,
): boolean {
  const point = toRoadLocal(tile, position);
  return (ROAD_SURFACES[tile.tileId] ?? []).some((triangle) =>
    contains(triangle, point),
  );
}

export function getRoadSpawnPosition(tile: PlacedTile): RoadPoint {
  const centers = ROAD_SURFACES[tile.tileId].map(centroid);
  centers.sort((a, b) => distance(a, [0, 0]) - distance(b, [0, 0]));
  return toRoadWorld(tile, centers[0]);
}

function sharedPortal(a: RoadTriangle, b: RoadTriangle): RoadPoint | null {
  const shared = a.filter((point) =>
    b.some((other) => distance(point, other) < 0.00001),
  );
  return shared.length === 2 ? interpolate(shared[0], shared[1], 0.5) : null;
}

function segmentOnSurface(
  start: RoadPoint,
  end: RoadPoint,
  triangles: readonly RoadTriangle[],
): boolean {
  const intervals: [number, number][] = [];
  for (const triangle of triangles) {
    const [a, b, c] = triangle;
    const winding = Math.sign(
      (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]),
    );
    if (!winding) continue;
    let lower = 0;
    let upper = 1;
    for (let i = 0; i < 3; i += 1) {
      const p = triangle[i];
      const q = triangle[(i + 1) % 3];
      const side = (point: RoadPoint) =>
        winding *
        ((q[0] - p[0]) * (point[1] - p[1]) - (q[1] - p[1]) * (point[0] - p[0]));
      const from = side(start) + 0.0000001;
      const change = side(end) - side(start);
      if (Math.abs(change) < 1e-12) {
        if (from < 0) upper = -1;
      } else if (change > 0) lower = Math.max(lower, -from / change);
      else upper = Math.min(upper, -from / change);
    }
    if (lower <= upper) intervals.push([lower, upper]);
  }
  intervals.sort((a, b) => a[0] - b[0]);
  let covered = 0;
  for (const [start, end] of intervals) {
    if (start > covered + 0.000001) return false;
    covered = Math.max(covered, end);
    if (covered >= 1) return true;
  }
  return false;
}

function roundCorners(
  points: RoadPoint[],
  triangles: readonly RoadTriangle[],
): RoadPoint[] {
  const rounded: RoadPoint[] = [points[0]];
  for (let i = 1; i < points.length - 1; i += 1) {
    const corner = points[i];
    const start = interpolate(corner, points[i - 1], 0.35);
    const end = interpolate(corner, points[i + 1], 0.35);
    const arc = Array.from({ length: 9 }, (_, step) => {
      const t = step / 8;
      return interpolate(
        interpolate(start, corner, t),
        interpolate(corner, end, t),
        t,
      );
    });
    if (
      arc
        .slice(1)
        .every((point, index) => segmentOnSurface(arc[index], point, triangles))
    )
      rounded.push(...arc);
    else rounded.push(corner);
  }
  rounded.push(points.at(-1)!);
  return rounded;
}

export function findRoadPath(
  tile: PlacedTile,
  startWorld: RoadPoint,
  endWorld: RoadPoint,
): RoadPoint[] {
  const triangles = ROAD_SURFACES[tile.tileId];
  const start = toRoadLocal(tile, startWorld);
  const end = toRoadLocal(tile, endWorld);
  const from = triangles.findIndex((triangle) => contains(triangle, start));
  const to = triangles.findIndex((triangle) => contains(triangle, end));
  if (from < 0 || to < 0) return [];
  const costs = triangles.map(() => Infinity);
  const previous = new Map<number, { index: number; portal: RoadPoint }>();
  const visited = new Set<number>();
  costs[from] = 0;
  while (!visited.has(to)) {
    let current = -1;
    for (let i = 0; i < triangles.length; i += 1) {
      if (
        !visited.has(i) &&
        Number.isFinite(costs[i]) &&
        (current < 0 || costs[i] < costs[current])
      )
        current = i;
    }
    if (current < 0) return [];
    visited.add(current);
    triangles.forEach((triangle, index) => {
      if (visited.has(index)) return;
      const portal = sharedPortal(triangles[current], triangle);
      if (!portal) return;
      const cost =
        costs[current] +
        distance(centroid(triangles[current]), centroid(triangle));
      if (cost < costs[index]) {
        costs[index] = cost;
        previous.set(index, { index: current, portal });
      }
    });
  }
  const points: RoadPoint[] = [end];
  for (let current = to; current !== from;) {
    const step = previous.get(current)!;
    points.push(step.portal);
    current = step.index;
  }
  points.push(start);
  return roundCorners(points.reverse(), triangles).map((point) =>
    toRoadWorld(tile, point),
  );
}
