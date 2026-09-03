import type {
  TileAudioAttributes,
  TileCategoryId,
  TileDefinition,
} from "../types";

function defineTile(
  id: string,
  name: string,
  categories: TileCategoryId[],
  audio?: TileAudioAttributes,
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
    audio: audio ?? null,
  };
}

export const TILE_CATALOG: TileDefinition[] = [
  defineTile("grass", "草地", ["ground"], { source: "rural", weight: 0.15 }),
  defineTile("grass-hill", "草地丘陵", ["ground", "forest", "mountain"], {
    source: "forest",
    weight: 0.6,
  }),
  defineTile("grass-forest", "草地森林", ["ground", "forest"], {
    source: "forest",
    weight: 0.8,
  }),
  defineTile("dirt", "泥土地", ["ground"], { source: "rural", weight: 0.15 }),
  defineTile("dirt-lumber", "伐木地", ["ground", "forest"], {
    source: "forest",
    weight: 0.7,
  }),
  defineTile("sand", "沙地", ["ground"]),
  defineTile("sand-desert", "沙漠", ["ground"]),
  defineTile("sand-rocks", "沙地岩石", ["ground"]),
  defineTile("stone", "石地", ["ground"]),
  defineTile("stone-hill", "石地丘陵", ["ground", "mountain"]),
  defineTile("stone-mountain", "山脈", ["ground", "mountain"]),
  defineTile("stone-rocks", "岩地", ["ground"]),
  defineTile("water", "水域", ["water"], { source: "water", weight: 0.4 }),
  defineTile("water-island", "水中島", ["water"], {
    source: "water",
    weight: 0.3,
  }),
  defineTile("water-rocks", "水中岩石", ["water"], {
    source: "water",
    weight: 0.3,
  }),
  defineTile("river-start", "河流源頭", ["water"], {
    source: "river",
    weight: 0.8,
  }),
  defineTile("river-end", "河流末端", ["water"], {
    source: "river",
    weight: 0.8,
  }),
  defineTile("river-straight", "直線河流", ["water"], {
    source: "river",
    weight: 0.8,
  }),
  defineTile("river-corner", "河流轉角", ["water"], {
    source: "river",
    weight: 0.8,
  }),
  defineTile("river-crossing", "河流交會", ["water"], {
    source: "river",
    weight: 1,
  }),
  defineTile("river-intersectionA", "河流岔口 A", ["water"], {
    source: "river",
    weight: 1,
  }),
  defineTile("river-intersectionB", "河流岔口 B", ["water"], {
    source: "river",
    weight: 1,
  }),
  defineTile("river-intersectionC", "河流岔口 C", ["water"], {
    source: "river",
    weight: 1,
  }),
  defineTile("river-intersectionD", "河流岔口 D", ["water"], {
    source: "river",
    weight: 1,
  }),
  defineTile("river-intersectionE", "河流岔口 E", ["water"], {
    source: "river",
    weight: 1,
  }),
  defineTile("river-intersectionF", "河流岔口 F", ["water"], {
    source: "river",
    weight: 1,
  }),
  defineTile("river-intersectionG", "河流岔口 G", ["water"], {
    source: "river",
    weight: 1,
  }),
  defineTile("river-intersectionH", "河流岔口 H", ["water"], {
    source: "river",
    weight: 1,
  }),
  defineTile("bridge", "橋樑", ["water", "structure"], {
    source: "water",
    weight: 0.4,
  }),
  defineTile("building-archery", "弓箭場", ["structure"], {
    source: "settlement",
    weight: 0.6,
  }),
  defineTile("building-cabin", "小屋", ["structure"], {
    source: "settlement",
    weight: 0.5,
  }),
  defineTile("building-castle", "城堡", ["structure"], {
    source: "settlement",
    weight: 0.6,
  }),
  defineTile("building-dock", "碼頭", ["structure"], {
    source: "harbor",
    weight: 0.9,
  }),
  defineTile("building-farm", "農場", ["structure"], {
    source: "rural",
    weight: 0.8,
  }),
  defineTile("building-house", "房屋", ["structure"], {
    source: "settlement",
    weight: 0.5,
  }),
  defineTile("building-market", "市場", ["structure"], {
    source: "settlement",
    weight: 1,
  }),
  defineTile("building-mill", "磨坊", ["structure"]),
  defineTile("building-mine", "礦場", ["structure"]),
  defineTile("building-port", "港口", ["structure"], {
    source: "harbor",
    weight: 1,
  }),
  defineTile("building-sheep", "牧羊場", ["structure"], {
    source: "rural",
    weight: 0.8,
  }),
  defineTile("building-smelter", "熔煉場", ["structure"]),
  defineTile("building-tower", "塔樓", ["structure"], {
    source: "settlement",
    weight: 0.6,
  }),
  defineTile("building-village", "村莊", ["structure"], {
    source: "settlement",
    weight: 1,
  }),
  defineTile("building-wall", "城牆", ["structure"]),
  defineTile("building-walls", "城牆群", ["structure"]),
  defineTile("building-watermill", "水車", ["water", "structure"], {
    source: "river",
    weight: 1,
  }),
  defineTile("building-wizard-tower", "法師塔", ["structure"], {
    source: "magic",
    weight: 1,
  }),
];

const TILE_DEFINITIONS_BY_ID = new Map(
  TILE_CATALOG.map((tile) => [tile.id, tile]),
);

export function getTileDefinition(id: string): TileDefinition | undefined {
  return TILE_DEFINITIONS_BY_ID.get(id);
}
