# 角色資產記錄

來源：[Kenney Cube Pets](https://kenney.nl/assets/cube-pets)。2026-09-09 下載的官方壓縮檔名稱為 `kenney_cube-pets_1.0.zip`，內附授權標示 **Cube Pets 2.0**；以包內版本為準。

保留原始 GLB、PNG 預覽與 `Textures/colormap.png`，未修改模型內容，未匯入猴子及其他動物。授權為 CC0，原文保留於 [CubePets-License.txt](../public/license/CubePets-License.txt)。角色音效另取自 Pixabay，與模型授權分開。

## 音效資產

2026-09-30 加入五種角色叫聲及共用腳步聲，位於 `/audio/characters/{cat,chicken,dog,pig,cow,footstep}.mp3`。保留原始 MP3，未裁切或修改資產音量；腳步聲選用 joentnt 的 Walk On Grass 1，其餘沿用最初選案。完整名稱、作者、來源連結、AI 生成標記與 Pixabay 授權記錄見 [音訊來源記錄](../public/audio/ATTRIBUTION.md)。

`src/audio/characterAudio.ts` 使用 Tone.Player 播放非循環音效，重用既有載入快取。叫聲播放結束後等待隨機 20–45 秒；腳步每次有效落地從頭觸發，停止前一次避免疊加。執行時增益集中在 `src/constants/audio.ts`：叫聲初始為 0.2，腳步初始為 0.12，再接到共用主音量節點。兩種音效可在進階設定分別關閉，選項保存於世界存檔。初始增益尚未經本次人工試聽調整，不宣稱音量平衡或重複觸發的聽感已驗收。

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

`src/constants/roadCenterlines.ts` 依既有路面形狀人工規劃 14 款固定道路的本地 X/Z 中心線、分支與匯合點；彎路包含額外轉彎引導點，出生與死路折返使用各道路的引導中心。路徑依 Tile 旋轉與 axial 座標轉成世界位置，原始路面三角形保留作為有效性判斷，以及道路修改後無法直連中心線時的接回路段搜尋。圓滑後逐段檢查路面覆蓋，越界時保留原引導線。引導線座標已做路面幾何比對，實際行走與轉彎效果仍待使用者驗收。

資產檢查包含原始材質參照、節點座標、模型尺寸與動畫清單，並在世界場景逐一預覽五種角色的靜態外觀、朝向、比例及腳底高度。生命週期自動化測試與型別檢查未執行。
