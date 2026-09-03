export type WorldMode = "build" | "relax";

export type AmbientSourceId =
  "forest" | "river" | "water" | "settlement" | "rural" | "harbor" | "magic";

export type TileCategoryId =
  "ground" | "forest" | "mountain" | "water" | "road" | "structure";

export interface HexCoordinate {
  q: number;
  r: number;
}

export interface TileDefinition {
  id: string;
  name: string;
  modelPath: string;
  previewPath: string;
  categories: TileCategoryId[];
  defaultRotation: number;
  roadConnections: boolean[];
  traversable: boolean;
  audio: TileAudioAttributes | null;
}

export interface TileAudioAttributes {
  source: AmbientSourceId;
  weight: number;
}

export interface PlacedTile extends HexCoordinate {
  tileId: string;
  rotation: number;
}

export interface WorldData {
  version: number;
  mode: WorldMode;
  tiles: Record<string, PlacedTile>;
}

export interface AudioSettings {
  volume: number;
  muted: boolean;
  playing: boolean;
}

export interface AudioMixSource {
  source: AmbientSourceId;
  targetVolume: number;
  priorityScore: number;
}
