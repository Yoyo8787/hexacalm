# Hexacalm

Hexacalm 是一個以六角 Tile 建造 3D 世界的沉浸式聲景網頁應用。使用者可從一個空格開始，逐步配置地面、森林、水域與建築，並在建造模式與純觀看的放鬆模式之間切換。

專案目前處於早期開發階段；產品完整目標與互動規則請見 [SPEC.md](./SPEC.md)。

## 目前可用功能

- 從 Landing Page 建立空白世界，或繼續瀏覽器中已儲存的世界
- 在六角網格中新增、取代、旋轉與移除 Tile
- 依已放置 Tile 動態顯示相鄰可建造位置
- 以分類篩選 Tile，並載入 GLB 模型與預覽圖
- 放置 14 款草地道路 Tile，支援完整底座與道路的組合預覽及旋轉
- 提供依六方向出口與旋轉判斷相鄰道路是否連通的查詢函式
- Undo / Redo 建造操作，歷史上限為 50 步
- 在 Build / Relax Mode 間切換
- 使用 Orbit、Zoom 與 Pan 瀏覽 3D 世界
- 依整張世界的 Tile 種類與數量自動混合環境音，並限制同時播放的音源數
- 控制環境音的播放、暫停、靜音與主音量
- 將世界版本、模式、Tile 資料與音訊設定自動儲存至 LocalStorage
- 世界上限為 100 個 Tile

## 尚未實作

以下功能已列入產品規格，但目前尚未完成：

- 隨機世界生成（Landing Page 按鈕目前停用）
- Character Listener 與依角色位置、方向變化的局部環境音
- 角色選擇、自動道路移動與速度控制
- Third-person / First-person 相機
- Sleep Timer
- 角色使用道路連接查詢、格內行走曲線與道路修改後的角色路徑重算
- 自動化測試案例與測試指令

## 技術棧

- React 19、TypeScript、Vite
- Three.js、React Three Fiber、Drei
- Zustand
- Tailwind CSS v4
- Tone.js
- Vitest、Playwright（已安裝，測試設定待建立）

## 開始開發

### 環境需求

- Node.js `^20.19.0` 或 `>=22.12.0`
- npm

### 安裝與啟動

```bash
npm install
npm run dev
```

Vite 啟動後會在終端顯示本機網址。

### 常用指令

```bash
npm run dev          # 啟動開發伺服器
npm run build        # TypeScript 建置並產生正式版
npm run lint         # 執行 ESLint
npm run format       # 使用 Prettier 格式化專案檔案
npm run format:check # 檢查格式
npm run preview      # 預覽正式版建置結果
```

## 操作方式

1. 在首頁選擇「自行建立」。
2. 從下方 Tile Picker 選取 Tile，再點擊透明六角空格放置。
3. 持續選取同一 Tile 可連續放置；再次點擊選單中的 Tile 可取消選取。
4. 未選取 Tile 時，點擊既有 Tile 會從世界上方俯視逆時針旋轉 60°。
5. 開啟刪除模式後，可連續點擊 Tile 移除。
6. 使用左上工具列復原或重做操作，或切換至 Relax Mode 隱藏建造介面。

目前若用已選取的同一種 Tile 點擊同種既有 Tile，該 Tile 會旋轉；選取不同 Tile 則會直接取代。

## 專案結構

```text
src/
├── audio/            # World mix 計算與 Tone.js 播放引擎
├── components/       # 建造工具、通用 UI、Tile 與 3D 世界元件
├── constants/        # Tile catalog 與世界限制
├── hooks/            # 建造操作與 LocalStorage 持久化 hooks
├── pages/            # Landing Page 與 World Page
├── stores/           # Zustand 世界狀態、建造命令與歷史紀錄
├── types/            # 世界、座標與 Tile 型別
└── utils/            # 六角座標、道路連接查詢及儲存資料驗證
public/
├── audio/            # 環境音檔與來源記錄
├── models/           # GLB Tile 模型與共用材質
├── previews/         # Tile Picker 預覽圖
└── license/          # 第三方資產授權
```

主要資料流為：頁面與建造元件觸發 Zustand action，store 更新唯一的 `WorldData`，3D 場景依狀態重新渲染，再由 persistence hook 寫入 `hexacalm.world`。

六角格採 axial coordinate（`q`, `r`）；旋轉以 `0` 至 `5` 表示六個 60° 方向。Tile 定義集中於 `src/constants/tileCatalog.ts`，模型與預覽路徑由 Tile ID 推導。

道路 Tile 使用原始 `path-*` 模型，透過 `baseModelPath` 共用 `grass.glb` 底座，並以 `modelOffsetY: 0.2` 將道路放在草地頂面；不包含兩款廣場。底座與道路共用同一筆 Tile 狀態、建造操作及音訊設定，不增加存檔欄位。

道路連接 API 位於 `src/utils/roads/index.ts`：`rotateRoadConnections` 回傳旋轉後的六方向出口，`getConnectedRoadNeighbors(world.tiles, coordinate)` 回傳 `{ direction, tile }` 陣列。方向順序沿用 `HEX_DIRECTIONS`：`(1,0)`、`(1,-1)`、`(0,-1)`、`(-1,0)`、`(-1,1)`、`(0,1)`；旋轉後出口為 `(direction + rotation) % 6`。相鄰兩格必須都可通行且相對出口同時開啟，才會連通。

連接查詢依傳入的最新世界資料計算，不另存道路圖；建造操作及 Undo／Redo 後重新呼叫即可取得最新結果。目前尚未接入角色或執行移動路徑規劃，既有橋樑、河流及建築仍不可通行。

## 資產授權

`public/models` 與 `public/previews` 使用 Kenney 的 Hexagon Kit，採 [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) 授權；原始授權內容位於 [public/license/License.txt](./public/license/License.txt)。
