import {
  MAX_AMBIENT_LOOPS,
  SOURCE_REPLACEMENT_MARGIN,
} from "../constants/audio";
import type { AmbientSourceId, AudioMixSource } from "../types";

export interface PlayingSource {
  source: AmbientSourceId;
  priorityScore: number;
}

export interface LoopPlan {
  add: AudioMixSource[];
  remove: AmbientSourceId[];
  update: AudioMixSource[];
}

function weakestSource(
  priorityScores: Map<AmbientSourceId, number>,
): PlayingSource | null {
  let weakest: PlayingSource | null = null;

  for (const [source, priorityScore] of priorityScores) {
    if (!weakest || priorityScore < weakest.priorityScore) {
      weakest = { source, priorityScore };
    }
  }

  return weakest;
}

export function planLoopChanges(
  playing: PlayingSource[],
  mix: AudioMixSource[],
): LoopPlan {
  const bySource = new Map(
    mix.map((candidate) => [candidate.source, candidate]),
  );
  const add: AudioMixSource[] = [];
  const remove: AmbientSourceId[] = [];
  const update: AudioMixSource[] = [];
  const priorityScores = new Map<AmbientSourceId, number>();

  playing.forEach(({ source }) => {
    const candidate = bySource.get(source);

    if (!candidate) {
      remove.push(source);
      return;
    }

    update.push(candidate);
    priorityScores.set(source, candidate.priorityScore);
  });

  mix.forEach((candidate) => {
    if (priorityScores.has(candidate.source)) {
      return;
    }

    if (priorityScores.size < MAX_AMBIENT_LOOPS) {
      add.push(candidate);
      priorityScores.set(candidate.source, candidate.priorityScore);
      return;
    }

    const weakest = weakestSource(priorityScores);

    if (
      !weakest ||
      candidate.priorityScore <
        weakest.priorityScore + SOURCE_REPLACEMENT_MARGIN
    ) {
      return;
    }

    remove.push(weakest.source);
    priorityScores.delete(weakest.source);
    add.push(candidate);
    priorityScores.set(candidate.source, candidate.priorityScore);
  });

  return { add, remove, update };
}
