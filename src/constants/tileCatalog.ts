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
  defineTile("grass", "草地", ["rural"], { source: "rural", weight: 0.15 }),
  defineTile("grass-hill", "丘陵+森林", ["forest"], {
    source: "forest",
    weight: 0.6,
  }),
  defineTile("grass-forest", "森林", ["forest"], {
    source: "forest",
    weight: 0.8,
  }),
  defineTile("dirt", "土地", ["rural"], { source: "rural", weight: 0.15 }),
  defineTile("dirt-lumber", "林場", ["forest"], {
    source: "forest",
    weight: 0.7,
  }),
  defineTile("sand", "沙地", ["desert"], { source: "desert", weight: 0.4 }),
  defineTile("sand-desert", "沙漠", ["desert"], {
    source: "desert",
    weight: 0.4,
  }),
  defineTile("sand-rocks", "沙岩地", ["desert"], {
    source: "desert",
    weight: 0.4,
  }),
  defineTile("stone", "石地", ["mountain"], {
    source: "mountain",
    weight: 0.4,
  }),
  defineTile("stone-hill", "丘陵", ["mountain"], {
    source: "mountain",
    weight: 0.4,
  }),
  defineTile("stone-mountain", "山脈", ["mountain"], {
    source: "mountain",
    weight: 0.4,
  }),
  defineTile("stone-rocks", "岩地", ["mountain"], {
    source: "mountain",
    weight: 0.4,
  }),
  defineTile("water", "水域", ["water"], { source: "water", weight: 0.4 }),
  defineTile("water-island", "湖中島", ["water"], {
    source: "water",
    weight: 0.3,
  }),
  defineTile("water-rocks", "暗礁", ["water"], {
    source: "water",
    weight: 0.3,
  }),
  defineRiverTile("river-start", "河流源頭", [3], 0.8),
  defineRiverTile("river-end", "河流末端", [3], 0.8),
  defineRiverTile("river-straight", "直線河流", [0, 3], 0.8),
  defineRiverTile("river-corner", "彎曲河流", [1, 3], 0.8),
  defineRiverTile("river-crossing", "河流交會", [0, 1, 2, 3, 4, 5], 1),
  defineRiverTile("river-intersectionA", "河流岔口 A", [1, 2, 3], 1),
  defineRiverTile("river-intersectionB", "河流岔口 B", [0, 1, 3], 1),
  defineRiverTile("river-intersectionC", "河流岔口 C", [0, 3, 5], 1),
  defineRiverTile("river-intersectionD", "河流岔口 D", [0, 1, 3, 5], 1),
  defineRiverTile("river-intersectionE", "河流岔口 E", [0, 2, 3, 5], 1),
  defineRiverTile("river-intersectionF", "河流岔口 F", [1, 3, 5], 1),
  defineRiverTile("river-intersectionG", "河流岔口 G", [0, 1, 2, 3, 5], 1),
  defineRiverTile("river-intersectionH", "河流岔口 H", [0, 1, 2, 3], 1),
  defineRoadTile("path-straight", "直路", [0, 3]),
  defineRoadTile("path-corner", "彎路", [1, 3]),
  defineRoadTile("path-corner-sharp", "急彎", [2, 3]),
  defineRoadTile("path-start", "道路起點", [3]),
  defineRoadTile("path-end", "道路終點", [3]),
  defineRoadTile("path-crossing", "六向路口", [0, 1, 2, 3, 4, 5]),
  defineRoadTile("path-intersectionA", "岔路 A", [1, 2, 3]),
  defineRoadTile("path-intersectionB", "岔路 B", [0, 1, 3]),
  defineRoadTile("path-intersectionC", "岔路 C", [0, 3, 5]),
  defineRoadTile("path-intersectionD", "岔路 D", [0, 1, 3, 5]),
  defineRoadTile("path-intersectionE", "岔路 E", [0, 2, 3, 5]),
  defineRoadTile("path-intersectionF", "岔路 F", [1, 3, 5]),
  defineRoadTile("path-intersectionG", "岔路 G", [0, 1, 2, 3, 5]),
  defineRoadTile("path-intersectionH", "岔路 H", [0, 1, 2, 3]),
  defineTile("bridge", "橋樑", ["water"], {
    source: "water",
    weight: 0.4,
  }),
  defineTile("building-archery", "弓箭場", ["settlement"], {
    source: "settlement",
    weight: 0.6,
  }),
  defineTile("building-cabin", "山上小屋", ["settlement"], {
    source: "settlement",
    weight: 0.5,
  }),
  defineTile("building-castle", "城堡", ["settlement"], {
    source: "settlement",
    weight: 0.6,
  }),
  defineTile("building-dock", "碼頭", ["water"], {
    source: "harbor",
    weight: 0.9,
  }),
  defineTile("building-farm", "農場", ["rural"], {
    source: "rural",
    weight: 0.8,
  }),
  defineTile("building-house", "房屋", ["settlement"], {
    source: "settlement",
    weight: 0.5,
  }),
  defineTile("building-market", "市集", ["settlement"], {
    source: "settlement",
    weight: 1,
  }),
  defineTile("building-mill", "磨坊", ["special"], {
    source: "mill",
    weight: 0.6,
  }),
  defineTile("building-mine", "礦洞", ["special"], {
    source: "mine",
    weight: 0.6,
  }),
  defineTile("building-port", "港口", ["water"], {
    source: "harbor",
    weight: 1,
  }),
  defineTile("building-sheep", "羊", ["rural"], {
    source: "rural",
    weight: 0.8,
  }),
  defineTile("building-smelter", "鐵匠鋪", ["special"], {
    source: "smelter",
    weight: 0.6,
  }),
  defineTile("building-tower", "塔樓", ["special"], {
    source: "magic",
    weight: 0.8,
  }),
  defineTile("building-village", "村莊", ["settlement"], {
    source: "settlement",
    weight: 1,
  }),
  defineTile("building-wall", "城牆", ["settlement"], {
    source: "settlement",
    weight: 0.5,
  }),
  defineTile("building-walls", "堡壘", ["settlement"], {
    source: "settlement",
    weight: 0.5,
  }),
  defineTile("building-watermill", "水車", ["water"], {
    source: "river",
    weight: 1,
  }),
  defineTile("building-wizard-tower", "法師塔", ["special"], {
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
