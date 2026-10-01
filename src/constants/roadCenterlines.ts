import type { HexDirection, RoadCenterline, RoadPoint } from "../types";

const PORTS: readonly RoadPoint[] = [
  [0.5, 0],
  [0.25, -Math.sqrt(3) / 4],
  [-0.25, -Math.sqrt(3) / 4],
  [-0.5, 0],
  [-0.25, Math.sqrt(3) / 4],
  [0.25, Math.sqrt(3) / 4],
];

function junction(
  center: RoadPoint,
  exits: readonly HexDirection[],
): RoadCenterline {
  return {
    center,
    branches: exits.map((direction): RoadPoint[] => {
      const port = PORTS[direction];
      return [center, [port[0] * 0.75, port[1] * 0.75], port];
    }),
  };
}

// 固定模型的本地 X/Z 引導線；每條分支由匯合點延伸至六角邊出口。
export const ROAD_CENTERLINES: Record<string, RoadCenterline> = {
  "path-straight": junction([0, -0.056], [0, 3]),
  "path-corner": {
    center: [-0.07, -0.09],
    branches: [
      [
        [-0.07, -0.09],
        [0.014, -0.13625],
        [0.1875, -Math.sqrt(3) * 0.1875],
        PORTS[1],
      ],
      [[-0.07, -0.09], [-0.125, -0.056], [-0.375, 0], PORTS[3]],
    ],
  },
  "path-corner-sharp": {
    center: [0, 0],
    branches: [
      [
        [0, 0],
        [-0.004235, -0.125641],
        [-0.1875, -Math.sqrt(3) * 0.1875],
        PORTS[2],
      ],
      [[0, 0], [-0.125, 0], [-0.375, 0], PORTS[3]],
    ],
  },
  "path-start": junction([0, -0.056], [3]),
  "path-end": junction([-0.06, -0.056], [3]),
  "path-crossing": junction([0, 0], [0, 1, 2, 3, 4, 5]),
  "path-intersectionA": junction([-0.04, -0.11], [1, 2, 3]),
  "path-intersectionB": junction([0, 0], [0, 1, 3]),
  "path-intersectionC": junction([0, 0], [0, 3, 5]),
  "path-intersectionD": junction([0, 0], [0, 1, 3, 5]),
  "path-intersectionE": junction([0, 0], [0, 2, 3, 5]),
  "path-intersectionF": junction([-0.04, 0], [1, 3, 5]),
  "path-intersectionG": junction([0, 0], [0, 1, 2, 3, 5]),
  "path-intersectionH": junction([0, -0.056], [0, 1, 2, 3]),
};
