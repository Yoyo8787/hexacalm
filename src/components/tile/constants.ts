import type { TileCategoryId } from "../../types";

// Kenney's Hexagon Kit base Tile is 1 unit wide and 2 / sqrt(3) units tall.
export const HEX_SIZE = 1;
export const HEX_RADIUS = HEX_SIZE / Math.sqrt(3);
export const HEX_ROTATION_STEP = Math.PI / 3;

export const TILE_CATEGORY_LABELS: Record<TileCategoryId, string> = {
  rural: "田園",
  forest: "森林",
  mountain: "山地",
  desert: "沙漠",
  water: "水景",
  settlement: "聚落",
  special: "特殊",
  road: "道路",
};
