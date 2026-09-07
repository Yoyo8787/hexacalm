export type WorldMode = "build" | "relax";

export type AmbientSourceId =
  "forest" | "river" | "water" | "settlement" | "rural" | "harbor" | "magic";

export type TileCategoryId =
  "ground" | "forest" | "mountain" | "water" | "road" | "structure";

export interface HexCoordinate {
  q: number;
  r: number;
}

export type HexDirection = 0 | 1 | 2 | 3 | 4 | 5;

export type HexRotation = 0 | 1 | 2 | 3 | 4 | 5;

export type RoadConnections = readonly [
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
];

export interface TileDefinitionBase {
  id: string;
  name: string;
  modelPath: string;
  previewPath: string;
  categories: TileCategoryId[];
  defaultRotation: HexRotation;
  audio: TileAudioAttributes | null;
}

export interface StandardTileDefinition extends TileDefinitionBase {
  kind: "standard";
  traversable: false;
}

export interface RoadTileDefinition extends TileDefinitionBase {
  kind: "road";
  traversable: boolean;
  baseModelPath: string;
  modelOffsetY: number;
  roadConnections: RoadConnections;
}

export type TileDefinition = StandardTileDefinition | RoadTileDefinition;

export interface TileAudioAttributes {
  source: AmbientSourceId;
  weight: number;
}

export interface PlacedTile extends HexCoordinate {
  tileId: string;
  rotation: HexRotation;
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
