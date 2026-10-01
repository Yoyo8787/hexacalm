import {
  CHARACTER_BASE_SPEED,
  CHARACTER_HEADING_LOOKAHEAD,
} from "../../constants/character";
import type {
  CharacterPose,
  CharacterRoute,
  RoadPoint,
  WorldData,
} from "../../types";
import {
  coordinateKey,
  getOppositeDirection,
  HEX_DIRECTIONS,
  hexToWorld,
} from "../hex";
import { getConnectedRoadNeighbors } from "../roads";
import { distance, findRoadPath, getRoadSpawnPosition } from "../roads/paths";

function planRoute(
  tiles: WorldData["tiles"],
  pose: CharacterPose,
): CharacterRoute | null {
  const neighbors = getConnectedRoadNeighbors(tiles, pose.coordinate);
  if (!neighbors.length) return null;
  const forward = neighbors.filter(
    ({ direction }) => direction !== pose.enteredFrom,
  );
  const choices = forward.length ? forward : neighbors;
  const { direction } = choices[Math.floor(Math.random() * choices.length)];
  const tile = tiles[coordinateKey(pose.coordinate)];
  const [x, , z] = hexToWorld(tile);
  const [dx, , dz] = hexToWorld(HEX_DIRECTIONS[direction]);
  const exit: RoadPoint = [x + dx / 2, z + dz / 2];
  let points: RoadPoint[];
  if (direction === pose.enteredFrom) {
    const turnaround = getRoadSpawnPosition(tile);
    points = [
      ...findRoadPath(tile, pose.position, turnaround),
      ...findRoadPath(tile, turnaround, exit).slice(1),
    ];
  } else points = findRoadPath(tile, pose.position, exit);
  return points.length > 1 ? { points, nextPoint: 1, exit: direction } : null;
}

function getRouteHeading(
  position: RoadPoint,
  route: CharacterRoute,
  fallback: number,
): number {
  let remaining = CHARACTER_HEADING_LOOKAHEAD;
  let point = position;
  for (let index = route.nextPoint; index < route.points.length; index += 1) {
    const target = route.points[index];
    const length = distance(point, target);
    if (length > remaining) {
      const t = remaining / length;
      point = [
        point[0] + (target[0] - point[0]) * t,
        point[1] + (target[1] - point[1]) * t,
      ];
      break;
    }
    remaining -= length;
    point = target;
  }
  const dx = point[0] - position[0];
  const dz = point[1] - position[1];
  return Math.hypot(dx, dz) > 0.000001 ? Math.atan2(dx, dz) : fallback;
}

export function moveCharacter(
  tiles: WorldData["tiles"],
  pose: CharacterPose,
  delta: number,
): CharacterPose {
  let remaining = delta * CHARACTER_BASE_SPEED * pose.speed;
  let next = { ...pose, moving: false };
  while (remaining > 0) {
    const route = next.route ?? planRoute(tiles, next);
    if (!route) break;
    const target = route.points[route.nextPoint];
    const length = distance(next.position, target);
    const travel = Math.min(remaining, length);
    if (length > 0.000001) {
      const t = travel / length;
      const dx = target[0] - next.position[0];
      const dz = target[1] - next.position[1];
      next = {
        ...next,
        moving: true,
        position: [next.position[0] + dx * t, next.position[1] + dz * t],
        heading: Math.atan2(dx, dz),
      };
      remaining -= travel;
    }
    if (travel < length) {
      next.route = route;
      break;
    }
    const nextPoint = route.nextPoint + 1;
    if (nextPoint < route.points.length) {
      next.route = { ...route, nextPoint };
      continue;
    }
    const offset = HEX_DIRECTIONS[route.exit];
    next = {
      ...next,
      coordinate: {
        q: next.coordinate.q + offset.q,
        r: next.coordinate.r + offset.r,
      },
      enteredFrom: getOppositeDirection(route.exit),
      route: null,
    };
  }
  if (next.moving && next.route) {
    next.heading = getRouteHeading(next.position, next.route, next.heading);
  }
  return !next.moving && !pose.moving && next.route === pose.route
    ? pose
    : next;
}
