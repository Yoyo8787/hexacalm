import type { TileCategoryId } from "../../types";

// Kenney's Hexagon Kit base Tile is 1 unit wide and 2 / sqrt(3) units tall.
export const HEX_SIZE = 1;
export const HEX_RADIUS = HEX_SIZE / Math.sqrt(3);
export const HEX_ROTATION_STEP = Math.PI / 3;

export const TILE_CATEGORY_LABELS: Record<TileCategoryId, string> = {
  ground: "地面",
  forest: "森林",
  mountain: "山脈",
  water: "水域",
  road: "道路",
  structure: "建築",
};
