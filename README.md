# Hexacalm

Hexacalm 是一個以六角 Tile 建造 3D 世界的沉浸式聲景網頁應用。使用者可從一個空格開始，逐步配置地面、森林、水域與建築，並在建造模式與純觀看的放鬆模式之間切換。

專案目前處於早期開發階段；產品完整目標與互動規則請見 [SPEC.md](./SPEC.md)。

## 目前可用功能

- 建立空白世界、隨機生成世界，或繼續上次儲存的世界
- 依分類挑選地塊，新增、取代、旋轉或移除；道路與河流放置時自動配合鄰格方向
- 復原與重做建造操作，最多保留 50 步；每個世界最多 100 個地塊
- 建造模式提供編輯工具，放鬆模式隱藏建造介面
- 透過滑鼠或 WASD 瀏覽世界，並可重設視角
- 加入貓、小雞、狗、豬或牛，沿相通道路自動行走；可更換、移除、開始、停止及調整速度
- 放鬆模式可切換世界、第三人稱與第一人稱視角；沒有寵物時會提示先加入寵物
- 所有地塊都有環境音對應，依世界組成或寵物位置混音；同時最多播放三種環境音源
- 寵物會偶爾發出叫聲，行走落地時播放腳步聲；兩者可獨立關閉
- 播放、暫停、靜音與主音量控制全部聲音；首次預設音量 50%，起播平順淡入
- 睡眠倒數提供 15／30／60 分鐘與自訂 1–180 分鐘；結束前漸弱，到期暫停聲音
- 自動／晝／夜氛圍切換，介面與場景同步過渡，夜晚顯示星空
- 自動儲存世界、模式、氛圍、寵物及音訊設定
- 手機提供底部選單與安全區支援；放鬆模式閒置時隱藏工具列，操作時恢復
- 首頁提供分享預覽；錯誤畫面提供重新整理與回首頁

## 尚未實作

以下功能與驗收事項尚待完成：

- 天氣（氛圍面板目前以「即將推出」佔位）、夜晚窗戶點光源，以及依時段切換鳥鳴／蟲鳴的音景（目前草地與山地音源固定使用）
- SEO：部署後驗收 LinkedIn 等平台預覽與方形分享圖片的裁切；目前描述依指定文案保留「隨場景/時間變化」，依時段切換環境音仍未實作，上線前需對齊。後續評估建置時預渲染首頁，維持純靜態部署；不加入 Twitter Card 與 sitemap。
- 手機版面、觸控、音訊與視角的手動驗收，以及 7A 手機設計稿補圖；條件見 [上線前需求與驗收](./docs/prelaunch-review.md)。

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

## GitHub Pages 部署

部署網址為 `https://yoyo8787.github.io/hexacalm/`。Vite base 設為 `/hexacalm/`，模型、預覽圖、首頁圖片與音訊使用 `import.meta.env.BASE_URL`；本機開發也使用此子路徑。

1. 在 GitHub 儲存庫的 **Settings → Pages → Build and deployment → Source** 選擇 **GitHub Actions**。
2. 自行將要發布的變更提交並同步到遠端 `main`，更新分支不會自動部署。準備上線時，在 **Actions → 部署 GitHub Pages → Run workflow** 選擇 `main` 手動觸發；流程只允許從 `main` 發布。
3. 流程使用 Node.js 24、`npm ci` 與 `npm run build`，將 `dist` 發布到 `github-pages` environment，不執行測試。
4. 部署成功後，開啟網站並確認首頁、隨機世界、Tile／寵物模型與預覽、環境音及角色音效正常；在瀏覽器 Network 確認資產沒有 404。

發布前可自行執行 `npm run build`，再執行 `npm run preview` 並開啟 `http://localhost:4173/hexacalm/` 預覽。頁面切換使用 React state，沒有額外的 URL 路由，因此不需要 SPA 404 fallback。

部署方式依循 [Vite 官方 GitHub Pages 指引](https://vite.dev/guide/static-deploy.html#github-pages)。

## 操作方式

1. 在首頁選擇「自行建立」。
2. 從下方 Tile Picker 選取 Tile，再點擊透明六角空格放置。
3. 持續選取同一 Tile 可連續放置；再次點擊選單中的 Tile 可取消選取。
4. 未選取 Tile 時，點擊既有 Tile 會從世界上方俯視逆時針旋轉 60°。
5. 開啟刪除模式後，可連續點擊 Tile 移除。
6. 使用左上工具列復原或重做操作，或切換至 Relax Mode 隱藏建造介面。
   世界視角可用左鍵拖曳旋轉、右鍵拖曳沿地面平移、滾輪縮放；W／S 沿觀看方向前進／後退，A／D 左右平移。「重設視角」回到初始位置並看向原點。
7. 放置道路後，從右上「寵物夥伴」選擇角色；角色沿相通道路自動行走，可調整速度、更換、移除或停止。停止時立即停止前進並原地落地，開始後從原處繼續；孤立道路會待機。

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
├── models/           # Tile 模型與共用材質
├── previews/         # Tile Picker 預覽圖
└── license/          # 第三方資產授權
```

## 文件導航

- [產品規格](./SPEC.md)：功能需求與互動規則
- [領域詞彙](./CONTEXT.md)：世界、地塊、道路與聲景用語
- [角色規格](./docs/character-spec.md)：寵物生命週期、道路移動、聲音與視角
- [上線前需求與驗收](./docs/prelaunch-review.md)：介面需求與手動驗收情境
- [角色資產與授權](./docs/character-assets.md)：角色素材來源

## 開發除錯輸出

使用 `npm run dev` 進入世界後，可在瀏覽器 console 查看目前環境音軌、道路群組與隨機生成結果。這些資訊只在開發模式顯示。

音軌清單包含載入中的音源，不保證當下已發聲；道路群組則可協助確認哪些道路互相連通。

## 資產授權

`public/models` 與 `public/previews` 使用 Kenney 的 Hexagon Kit，採 [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) 授權；原始授權內容位於 [public/license/License.txt](./public/license/License.txt)。

其中 `characters` 子目錄使用 Kenney Cube Pets 2.0 的五種模型、原始預覽與獨立共用貼圖，同為 CC0；原始授權位於 [CubePets-License.txt](./public/license/CubePets-License.txt)。完整來源索引見 [資產授權](./public/license/README.md)。
