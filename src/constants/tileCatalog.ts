import type {
  ConnectionTileDefinition,
  HexDirection,
  RoadTileDefinition,
  StandardTileDefinition,
  TileAudioAttributes,
  TileCategoryId,
  TileDefinition,
  TileDefinitionBase,
} from "../types";

function defineTileBase(
  id: string,
  name: string,
  categories: TileCategoryId[],
  audio?: TileAudioAttributes,
): TileDefinitionBase {
  return {
    id,
    name,
    categories,
    modelPath: `${import.meta.env.BASE_URL}models/${id}.glb`,
    previewPath: `${import.meta.env.BASE_URL}previews/${id}.png`,
    defaultRotation: 0,
    audio: audio ?? null,
  };
}

function defineTile(
  id: string,
  name: string,
  categories: TileCategoryId[],
  audio?: TileAudioAttributes,
): StandardTileDefinition {
  return {
    ...defineTileBase(id, name, categories, audio),
    kind: "standard",
    traversable: false,
  };
}

function defineRiverTile(
  id: string,
  name: string,
  exits: readonly HexDirection[],
  weight: number,
): ConnectionTileDefinition {
  return {
    ...defineTile(id, name, ["water"], { source: "river", weight }),
    connectionKey: "river",
    connections: [
      exits.includes(0),
      exits.includes(1),
      exits.includes(2),
      exits.includes(3),
      exits.includes(4),
      exits.includes(5),
    ],
  };
}

function defineRoadTile(
  id: string,
  name: string,
  exits: readonly HexDirection[],
): RoadTileDefinition {
  return {
    ...defineTileBase(id, name, ["road"], {
      source: "rural",
      weight: 0.15,
    }),
    kind: "road",
    baseModelPath: `${import.meta.env.BASE_URL}models/grass.glb`,
    modelOffsetY: 0.2,
    traversable: true,
    roadConnections: [
      exits.includes(0),
      exits.includes(1),
      exits.includes(2),
      exits.includes(3),
      exits.includes(4),
      exits.includes(5),
    ],
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
  defineTile("sand", "沙地", ["ground"], { source: "desert", weight: 0.4 }),
  defineTile("sand-desert", "沙漠", ["ground"], {
    source: "desert",
    weight: 0.4,
  }),
  defineTile("sand-rocks", "沙地岩石", ["ground"], {
    source: "desert",
    weight: 0.4,
  }),
  defineTile("stone", "石地", ["ground"], { source: "mountain", weight: 0.4 }),
  defineTile("stone-hill", "石地丘陵", ["ground", "mountain"], {
    source: "mountain",
    weight: 0.4,
  }),
  defineTile("stone-mountain", "山脈", ["ground", "mountain"], {
    source: "mountain",
    weight: 0.4,
  }),
  defineTile("stone-rocks", "岩地", ["ground"], {
    source: "mountain",
    weight: 0.4,
  }),
  defineTile("water", "水域", ["water"], { source: "water", weight: 0.4 }),
  defineTile("water-island", "水中島", ["water"], {
    source: "water",
    weight: 0.3,
  }),
  defineTile("water-rocks", "水中岩石", ["water"], {
    source: "water",
    weight: 0.3,
  }),
  defineRiverTile("river-start", "河流源頭", [3], 0.8),
  defineRiverTile("river-end", "河流末端", [3], 0.8),
  defineRiverTile("river-straight", "直線河流", [0, 3], 0.8),
  defineRiverTile("river-corner", "河流轉角", [1, 3], 0.8),
  defineRiverTile("river-crossing", "河流交會", [0, 1, 2, 3, 4, 5], 1),
  defineRiverTile("river-intersectionA", "河流岔口 A", [1, 2, 3], 1),
  defineRiverTile("river-intersectionB", "河流岔口 B", [0, 1, 3], 1),
  defineRiverTile("river-intersectionC", "河流岔口 C", [0, 3, 5], 1),
  defineRiverTile("river-intersectionD", "河流岔口 D", [0, 1, 3, 5], 1),
  defineRiverTile("river-intersectionE", "河流岔口 E", [0, 2, 3, 5], 1),
  defineRiverTile("river-intersectionF", "河流岔口 F", [1, 3, 5], 1),
  defineRiverTile("river-intersectionG", "河流岔口 G", [0, 1, 2, 3, 5], 1),
  defineRiverTile("river-intersectionH", "河流岔口 H", [0, 1, 2, 3], 1),
  defineRoadTile("path-straight", "草地直路", [0, 3]),
  defineRoadTile("path-corner", "草地彎路", [1, 3]),
  defineRoadTile("path-corner-sharp", "草地急彎", [2, 3]),
  defineRoadTile("path-start", "草地道路起點", [3]),
  defineRoadTile("path-end", "草地道路終點", [3]),
  defineRoadTile("path-crossing", "草地六向路口", [0, 1, 2, 3, 4, 5]),
  defineRoadTile("path-intersectionA", "草地岔路 A", [1, 2, 3]),
  defineRoadTile("path-intersectionB", "草地岔路 B", [0, 1, 3]),
  defineRoadTile("path-intersectionC", "草地岔路 C", [0, 3, 5]),
  defineRoadTile("path-intersectionD", "草地岔路 D", [0, 1, 3, 5]),
  defineRoadTile("path-intersectionE", "草地岔路 E", [0, 2, 3, 5]),
  defineRoadTile("path-intersectionF", "草地岔路 F", [1, 3, 5]),
  defineRoadTile("path-intersectionG", "草地岔路 G", [0, 1, 2, 3, 5]),
  defineRoadTile("path-intersectionH", "草地岔路 H", [0, 1, 2, 3]),
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
  defineTile("building-mill", "磨坊", ["structure"], {
    source: "mill",
    weight: 0.6,
  }),
  defineTile("building-mine", "礦場", ["structure"], {
    source: "mine",
    weight: 0.6,
  }),
  defineTile("building-port", "港口", ["structure"], {
    source: "harbor",
    weight: 1,
  }),
  defineTile("building-sheep", "牧羊場", ["structure"], {
    source: "rural",
    weight: 0.8,
  }),
  defineTile("building-smelter", "熔煉場", ["structure"], {
    source: "smelter",
    weight: 0.6,
  }),
  defineTile("building-tower", "塔樓", ["structure"], {
    source: "settlement",
    weight: 0.6,
  }),
  defineTile("building-village", "村莊", ["structure"], {
    source: "settlement",
    weight: 1,
  }),
  defineTile("building-wall", "城牆", ["structure"], {
    source: "settlement",
    weight: 0.5,
  }),
  defineTile("building-walls", "城牆群", ["structure"], {
    source: "settlement",
    weight: 0.5,
  }),
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
