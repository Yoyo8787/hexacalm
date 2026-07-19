import type { TileCategoryId, TileDefinition } from "../types";

function defineTile(
  id: string,
  name: string,
  categories: TileCategoryId[],
): TileDefinition {
  return {
    id,
    name,
    categories,
    modelPath: `/models/${id}.glb`,
    previewPath: `/previews/${id}.png`,
    defaultRotation: 0,
    roadConnections: [false, false, false, false, false, false],
    traversable: false,
  };
}

export const TILE_CATALOG: TileDefinition[] = [
  defineTile("grass", "草地", ["ground"]),
  defineTile("grass-hill", "草地丘陵", ["ground", "forest", "mountain"]),
  defineTile("grass-forest", "草地森林", ["ground", "forest"]),
  defineTile("dirt", "泥土地", ["ground"]),
  defineTile("dirt-lumber", "伐木地", ["ground", "forest"]),
  defineTile("sand", "沙地", ["ground"]),
  defineTile("sand-desert", "沙漠", ["ground"]),
  defineTile("sand-rocks", "沙地岩石", ["ground"]),
  defineTile("stone", "石地", ["ground"]),
  defineTile("stone-hill", "石地丘陵", ["ground", "mountain"]),
  defineTile("stone-mountain", "山脈", ["ground", "mountain"]),
  defineTile("stone-rocks", "岩地", ["ground"]),
  defineTile("water", "水域", ["water"]),
  defineTile("water-island", "水中島", ["water"]),
  defineTile("water-rocks", "水中岩石", ["water"]),
  defineTile("river-start", "河流源頭", ["water"]),
  defineTile("river-end", "河流末端", ["water"]),
  defineTile("river-straight", "直線河流", ["water"]),
  defineTile("river-corner", "河流轉角", ["water"]),
  defineTile("river-crossing", "河流交會", ["water"]),
  defineTile("river-intersectionA", "河流岔口 A", ["water"]),
  defineTile("river-intersectionB", "河流岔口 B", ["water"]),
  defineTile("river-intersectionC", "河流岔口 C", ["water"]),
  defineTile("river-intersectionD", "河流岔口 D", ["water"]),
  defineTile("river-intersectionE", "河流岔口 E", ["water"]),
  defineTile("river-intersectionF", "河流岔口 F", ["water"]),
  defineTile("river-intersectionG", "河流岔口 G", ["water"]),
  defineTile("river-intersectionH", "河流岔口 H", ["water"]),
  defineTile("bridge", "橋樑", ["water", "structure"]),
  defineTile("building-archery", "弓箭場", ["structure"]),
  defineTile("building-cabin", "小屋", ["structure"]),
  defineTile("building-castle", "城堡", ["structure"]),
  defineTile("building-dock", "碼頭", ["structure"]),
  defineTile("building-farm", "農場", ["structure"]),
  defineTile("building-house", "房屋", ["structure"]),
  defineTile("building-market", "市場", ["structure"]),
  defineTile("building-mill", "磨坊", ["structure"]),
  defineTile("building-mine", "礦場", ["structure"]),
  defineTile("building-port", "港口", ["structure"]),
  defineTile("building-sheep", "牧羊場", ["structure"]),
  defineTile("building-smelter", "熔煉場", ["structure"]),
  defineTile("building-tower", "塔樓", ["structure"]),
  defineTile("building-village", "村莊", ["structure"]),
  defineTile("building-wall", "城牆", ["structure"]),
  defineTile("building-walls", "城牆群", ["structure"]),
  defineTile("building-watermill", "水車", ["water", "structure"]),
  defineTile("building-wizard-tower", "法師塔", ["structure"]),
];

export function getTileDefinition(id: string): TileDefinition | undefined {
  return TILE_CATALOG.find((tile) => tile.id === id);
}
