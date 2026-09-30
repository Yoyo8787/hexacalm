# 角色資產記錄

來源：[Kenney Cube Pets](https://kenney.nl/assets/cube-pets)。2026-09-09 下載的官方壓縮檔名稱為 `kenney_cube-pets_1.0.zip`，內附授權標示 **Cube Pets 2.0**；以包內版本為準。

保留原始 GLB、PNG 預覽與 `Textures/colormap.png`，未修改模型內容，未匯入猴子及其他動物。授權為 CC0，原文保留於 [CubePets-License.txt](../public/license/CubePets-License.txt)。本批沒有新增音效。

| 角色 ID | 名稱 | 模型 | 預覽 |
| --- | --- | --- | --- |
| cat | 貓 | `/models/characters/animal-cat.glb` | `/previews/characters/animal-cat.png` |
| chicken | 小雞 | `/models/characters/animal-chick.glb` | `/previews/characters/animal-chick.png` |
| dog | 狗 | `/models/characters/animal-dog.glb` | `/previews/characters/animal-dog.png` |
| pig | 豬 | `/models/characters/animal-pig.glb` | `/previews/characters/animal-pig.png` |
| cow | 牛 | `/models/characters/animal-cow.glb` | `/previews/characters/animal-cow.png` |

## 比例與座標

- 五種模型皆採 Y 向上、臉部朝 +Z；原始腳底約為 Y=0，無需軸向修正。
- 原始身體寬度約 1.25，統一以 `CHARACTER_MODEL_SCALE = 0.2` 顯示，身體寬約 0.25，保留耳朵、翅膀、尾巴等個別比例。
- 六角 Tile 寬度為 1；草地頂面為 Y=0.2，道路厚度為 0.025。角色群組放在 `modelOffsetY + CHARACTER_ROAD_SURFACE_HEIGHT`，避免腳底埋入道路。
- `characterPose.heading` 使用繞 Y 軸的弧度，0 表示朝 +Z；新出生預設為 0。
- 五種 GLB 均引用相對路徑 `Textures/colormap.png`；使用角色自己的貼圖，與 Hexagon Kit 貼圖分開。

## 內建動畫

已讀取五種 GLB 的動畫資料，皆包含：`static`、`idle`、`walk`、`run`、`eat`、`dance`、`gesture-positive`、`gesture-negative`。

階段 3 使用原始 `idle` 與 `walk` 的肢體動作。五種 `walk` 都是 0.5 秒循環，root 在每個循環有兩次約 0.1 模型單位的起伏，但中途最低點不精確歸零；因此在渲染時計算共用小跳高度，保留其餘原動畫軌道，不修改 GLB。顯示後跳高約 0.02 世界單位，步頻隨速度倍率調整。

停止時凍結 `walk` 時間，以約 0.18 秒混合到 `idle`，同時讓跳高平順降至零。每半個行走循環及停止落地時提供一次 `onLand` 回呼；恢復行走不補發停止或背景期間的落地事件。目標朝向使用最短角度平滑追隨。

已在獨立動態預覽中查看五種角色的行走、轉向與停止待機，以及落地回呼。階段 4 已接上實際道路移動，動畫依當下是否正在位移切換；速度倍率同步影響位移與步頻，停止與無路可走時原地落地並待機。

## 道路路面資料

`src/constants/roadSurfaces.ts` 為既有 14 款 Hexagon Kit `path-*.glb` 頂面三角形的衍生座標資料，同樣採 CC0。只擷取三個頂點皆位於 Y=0.025 的三角形，X/Z 保留六位小數；對應的原始授權仍為 `public/license/License.txt`。若替換道路模型，需同步重新擷取這份資料。

路徑在模型本地座標中沿相鄰三角形的共用邊前進，圓滑轉角仍限制在路面；再依 Tile 旋轉與 axial 座標轉成世界位置。出生與死路折返點使用最靠近 Tile 中心的路面三角形重心，避免將彎道角色放在無路的 Tile 中心。

資產檢查包含原始材質參照、節點座標、模型尺寸與動畫清單，並在世界場景逐一預覽五種角色的靜態外觀、朝向、比例及腳底高度。生命週期自動化測試與型別檢查未執行。
