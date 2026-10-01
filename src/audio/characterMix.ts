import {
  AMBIENT_SOURCE_IDS,
  CHARACTER_LISTENER_RADIUS,
  CHARACTER_MIX_SAMPLE_SPACING,
} from "../constants/audio";
import { HEX_SIZE } from "../components/tile/constants";
import { getTileDefinition } from "../constants/tileCatalog";
import type {
  AmbientSourceId,
  CharacterPose,
  RoadPoint,
  WorldData,
} from "../types";
import { hexToWorld } from "../utils/hex";
import { distance } from "../utils/roads/paths";
import { createAudioMix } from "./mixer";

type Scores = Record<AmbientSourceId, number>;

export function createCharacterMixCache(tiles: WorldData["tiles"]) {
  const segments = new Map<string, Scores[]>();
  const preparedRoutes = new WeakSet<RoadPoint[]>();
  const sources = Object.values(tiles).flatMap((tile) => {
    const audio = getTileDefinition(tile.tileId)?.audio;
    const [x, , z] = hexToWorld(tile);
    return audio ? [{ ...audio, position: [x, z] as RoadPoint }] : [];
  });

  function score(position: RoadPoint): Scores {
    const scores = Object.fromEntries(
      AMBIENT_SOURCE_IDS.map((source) => [source, 0]),
    ) as Scores;
    sources.forEach((source) => {
      const t = Math.max(
        0,
        1 -
          distance(position, source.position) /
            (CHARACTER_LISTENER_RADIUS * HEX_SIZE),
      );
      scores[source.source] += source.weight * t * t * (3 - 2 * t);
    });
    return scores;
  }

  function getSegment(start: RoadPoint, end: RoadPoint) {
    if (start[0] > end[0] || (start[0] === end[0] && start[1] > end[1])) {
      [start, end] = [end, start];
    }
    const key = JSON.stringify([start, end]);
    const length = distance(start, end);
    let samples = segments.get(key);
    if (!samples) {
      const steps = Math.max(
        1,
        Math.ceil(length / CHARACTER_MIX_SAMPLE_SPACING),
      );
      samples = Array.from({ length: steps + 1 }, (_, index) => {
        const t = index / steps;
        return score([
          start[0] + (end[0] - start[0]) * t,
          start[1] + (end[1] - start[1]) * t,
        ]);
      });
      segments.set(key, samples);
    }
    return { start, length, samples };
  }

  return (pose: CharacterPose) => {
    const route = pose.route;
    if (route && !preparedRoutes.has(route.points)) {
      route.points.slice(1).forEach((point, index) => {
        getSegment(route.points[index], point);
      });
      preparedRoutes.add(route.points);
    }
    const { start, length, samples } = getSegment(
      route ? route.points[route.nextPoint - 1] : pose.position,
      route ? route.points[route.nextPoint] : pose.position,
    );
    const progress = length
      ? Math.min(1, distance(start, pose.position) / length)
      : 0;
    const index = progress * (samples.length - 1);
    const lower = Math.min(Math.floor(index), samples.length - 2);
    const t = index - lower;
    const scores = Object.fromEntries(
      AMBIENT_SOURCE_IDS.map((source) => [
        source,
        samples[lower][source] * (1 - t) + samples[lower + 1][source] * t,
      ]),
    ) as Scores;
    return createAudioMix(scores);
  };
}
