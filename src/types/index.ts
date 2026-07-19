export type WorldMode = "build" | "relax";

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
