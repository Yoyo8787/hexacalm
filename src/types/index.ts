export type WorldMode = "build" | "relax";

export type CameraMode = "builder" | "third-person" | "first-person";

export interface CharacterViewMotion {
  heading: number;
  hopHeight: number;
}

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
  character: SavedCharacter | null;
}

export type CharacterId = "cat" | "chicken" | "dog" | "pig" | "cow";

export interface SavedCharacter {
  id: CharacterId;
  walkingEnabled: boolean;
}

export interface CharacterPose {
  coordinate: HexCoordinate;
  position: RoadPoint;
  heading: number;
  speed: number;
  moving: boolean;
  enteredFrom: HexDirection | null;
  route: CharacterRoute | null;
}

export type RoadPoint = readonly [number, number];
export type RoadTriangle = readonly [RoadPoint, RoadPoint, RoadPoint];

export interface RoadCenterline {
  center: RoadPoint;
  branches: readonly (readonly RoadPoint[])[];
}

export interface CharacterRoute {
  points: RoadPoint[];
  nextPoint: number;
  exit: HexDirection;
}

export interface AudioSettings {
  footstepsEnabled: boolean;
  callsEnabled: boolean;
  volume: number;
  muted: boolean;
  playing: boolean;
}

export interface AudioMixSource {
  source: AmbientSourceId;
  targetVolume: number;
  priorityScore: number;
}
