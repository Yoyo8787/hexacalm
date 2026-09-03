import {
  AMBIENT_SOURCE_IDS,
  AMBIENT_SOURCE_CONFIG,
  AUDIBLE_VOLUME_THRESHOLD,
} from "../constants/audio";
import { getTileDefinition } from "../constants/tileCatalog";
import type { AmbientSourceId, AudioMixSource, PlacedTile } from "../types";

type TileMap = Record<string, PlacedTile>;

function emptyScores(): Record<AmbientSourceId, number> {
  return Object.fromEntries(
    AMBIENT_SOURCE_IDS.map((source) => [source, 0]),
  ) as Record<AmbientSourceId, number>;
}

export function getAmbientTargetVolume(
  score: number,
  maxVolume: number,
  saturationScore: number,
): number {
  if (score <= 0) {
    return 0;
  }

  return maxVolume * (1 - Math.exp((-Math.log(20) * score) / saturationScore));
}

/**
 * Scores each source from the whole world, so scattered and connected tiles of
 * the same kind weigh the same. SPEC 8.4 and 16.4 also allow adjacency and
 * group size to change the mix; those rules wait for the Audio Rule Spec.
 */
function scoreTiles(tiles: TileMap): Record<AmbientSourceId, number> {
  const scores = emptyScores();

  Object.values(tiles).forEach((tile) => {
    const audio = getTileDefinition(tile.tileId)?.audio;
    if (!audio) {
      return;
    }

    scores[audio.source] += audio.weight;
  });

  return scores;
}

export function createAudioMix(
  scores: Record<AmbientSourceId, number>,
): AudioMixSource[] {
  return AMBIENT_SOURCE_IDS.map((source) => {
    const config = AMBIENT_SOURCE_CONFIG[source];
    const targetVolume = getAmbientTargetVolume(
      scores[source],
      config.maxVolume,
      config.saturationScore,
    );

    return {
      source,
      targetVolume,
      priorityScore: targetVolume * config.priority,
    };
  })
    .filter((source) => source.targetVolume >= AUDIBLE_VOLUME_THRESHOLD)
    .sort((first, second) => second.priorityScore - first.priorityScore);
}

export function buildWorldMix(tiles: TileMap): AudioMixSource[] {
  return createAudioMix(scoreTiles(tiles));
}

export function isEquivalentMix(
  first: AudioMixSource[],
  second: AudioMixSource[],
): boolean {
  if (first.length !== second.length) {
    return false;
  }

  return first.every((candidate, index) => {
    const other = second[index];

    return (
      candidate.source === other.source &&
      candidate.targetVolume === other.targetVolume &&
      candidate.priorityScore === other.priorityScore
    );
  });
}
