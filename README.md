# Hexacalm

Hexacalm 是一個以六角 Tile 建造 3D 世界的沉浸式聲景網頁應用。使用者可從一個空格開始，逐步配置地面、森林、水域與建築，並在建造模式與純觀看的放鬆模式之間切換。

專案目前處於早期開發階段；產品完整目標與互動規則請見 [SPEC.md](./SPEC.md)。

## 目前可用功能

- 從 Landing Page 建立空白世界，或繼續瀏覽器中已儲存的世界
- 從首頁隨機生成世界：五組連通道路骨架搭配隨機周圍地景，預設進入 Relax，不自動加入角色
- 在六角網格中新增、取代、旋轉與移除 Tile
- 新增或取代道路與河流時，自動選擇雙向接通數最多的旋轉；保留所選款式與鄰格，仍可手動旋轉
- 依已放置 Tile 動態顯示相鄰可建造位置
- 以分類篩選 Tile，並載入 GLB 模型與預覽圖
- 放置 14 款草地道路 Tile，支援完整底座與道路的組合預覽及旋轉
- 提供依六方向出口與旋轉判斷相鄰道路是否連通的查詢函式
- Undo / Redo 建造操作，歷史上限為 50 步
- 在 Build / Relax Mode 間切換
- 使用 Orbit、Zoom 與 Pan 瀏覽 3D 世界
- 世界視角支援 WASD 地面平移與「重設視角」，Build／Relax 均可使用
- Relax 可切換世界、第三人稱與第一人稱視角，平滑切換並以獨立的角度平滑跟隨角色轉向；第三人稱高度穩定，第一人稱跟隨小跳並隱藏自身模型
- 沒有寵物時操作第一／第三人稱按鈕，Dock 上方顯示「需要先加入寵物」；通知可堆疊，新通知進場將舊通知向上推，每則 3 秒後淡出，尊重減少動態效果設定；全部退場後恢復重設視角按鈕
- Build 固定使用 Builder 視角；切回時恢復原觀看位置，移除角色自動回到 Builder，視角不寫入存檔
- 加入、更換與移除貓、小雞、狗、豬、牛，Build／Relax 均保留角色控制
- 角色在最大有效道路群組隨機出生，平手時先隨機選組；孤立道路也可加入
- 道路修改及 Undo／Redo 後保留有效角色位置，失效時重新安置，無道路時移除且不自動復活
- 保存角色種類與行走啟用狀態；重入世界重新出生，角色操作不加入建造歷史
- 五種角色共用內建待機／行走動畫，沿道路小跳、平順轉向及停止落地；孤立道路待機，補通後依行走啟用狀態繼續
- 依模型路面規劃格內路徑，支援旋轉出口、彎道、岔路隨機選路與死路折返
- 以 0.5×–2× 滑桿調整移動與步頻，預設 1×；背景暫停移動，返回時不補跑距離
- 無角色時依整張世界的 Tile 種類與數量混合環境音；有角色時依位置混合局部環境音，朝向與相機不影響計算，並限制同時播放的音源數
- 控制全部聲音的播放、暫停、靜音與主音量；首次預設音量 50%，起播 3 秒淡入，存檔音量沿用
- 上方睡眠倒數 Modal 提供 15／30／60 分鐘與自訂 1–180 整數分鐘（預設 30），支援重新開始與取消；最後 60 秒聲音指數漸弱至 0，再暫停，畫面亮度不變；倒數期間嘗試保持螢幕喚醒，相關狀態只輸出至 console
- 五種寵物叫聲以隨機 20–45 秒間隔播放，共用腳步聲在行走落地時觸發
- 右上齒輪提供「腳步聲」「寵物叫聲」獨立開關，預設皆開啟並保存，Build／Relax 與無角色時均可調整
- Header「氛圍」可切換自動／晝／夜時段（自動以裝置時間 06:00–18:00 為晝），介面色彩與場景天空、霧、光線平滑轉場，夜晚顯示星空
- 手機氛圍、聲音與寵物選單共用底部面板與焦點管理；開關與寵物選單列提供至少 44px 觸控高度；Build／Relax 在小於 md 時均將速度收進寵物選單，行走按鈕保留在 Dock，Dock 與面板處理底部安全區
- Relax 閒置 8 秒後 Header 與 Dock 以 1.2 秒淡出，操作時恢復；選單、睡眠設定或通知顯示期間不淡出；放鬆圖示使用葉子，進入世界時模式標籤顯示 3 秒
- 瀏覽器網址列隨晝夜切換色彩，錯誤畫面提供重新整理與回首頁，WebGL 2 不可用或繪圖中斷時提供專屬說明
- 將世界版本、模式、時段模式、Tile 資料、精簡角色資料與音訊設定自動儲存至 LocalStorage
- 世界上限為 100 個 Tile
- 首頁靜態 HTML 提供繁中語言、標題、描述、canonical、Open Graph 分享資訊與 WebApplication JSON-LD；預計正式網址為 `https://yoyo8787.github.io/hexacalm/`
- 首頁主視覺與分享預覽共用 `public/images/hexacalm-world.png`；桌機左右排列並使用最小視窗高度，矮螢幕可捲動到按鈕與頁尾；有存檔時只有繼續按鈕使用 primary；手機以浮島背景搭配日夜主題漸層遮罩，圖片緩慢上下浮動並尊重減少動態效果設定
- GitHub Pages 首次發布與線上驗收已由使用者完成（2026-10-07 確認）

## 尚未實作

以下功能與部署事項尚待完成：

- 天氣（氛圍面板目前以「即將推出」佔位）、夜晚窗戶點光源，以及依時段切換鳥鳴／蟲鳴的音景（尚無音訊素材）
- SEO：部署後驗收 LinkedIn 等平台預覽與方形分享圖片的裁切；目前描述依指定文案保留「隨場景/時間變化」，依時段切換環境音仍未實作，上線前需對齊。後續評估建置時預渲染首頁，維持純靜態部署；不加入 Twitter Card 與 sitemap。
- 上線前調整的手動驗收與 7A 設計稿補圖：逐項決定及完成狀態見 [上線前審查修改決定](./docs/prelaunch-review.md)。程式已實作，尚未執行測試或實機驗收；7A 設計稿目前不在專案內，F01 的補圖待提供檔案；F15 與 F19 暫不修改。
- Tile 音檔補全：盤點並補齊缺少的環境音素材與 Tile 音訊對應，同步補上素材來源及授權記錄。

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
├── models/           # GLB Tile 模型與共用材質
├── previews/         # Tile Picker 預覽圖
└── license/          # 第三方資產授權
```

主要資料流為：頁面與建造元件觸發 Zustand action，store 更新唯一的 `WorldData`，3D 場景依狀態重新渲染，再由 persistence hook 寫入 `hexacalm.world`。

六角格採 axial coordinate（`q`, `r`）；旋轉以 `0` 至 `5` 表示六個 60° 方向。Tile 定義集中於 `src/constants/tileCatalog.ts`，模型與預覽路徑由 Tile ID 推導。

道路 Tile 使用原始 `path-*` 模型，透過 `baseModelPath` 共用 `grass.glb` 底座，並以 `modelOffsetY: 0.2` 將道路放在草地頂面；不包含兩款廣場。底座與道路共用同一筆 Tile 狀態、建造操作及音訊設定，不增加存檔欄位。

道路連接 API 位於 `src/utils/roads/index.ts`：`rotateRoadConnections` 回傳旋轉後的六方向出口，`getConnectedRoadNeighbors(world.tiles, coordinate)` 回傳 `{ direction, tile }` 陣列。方向順序沿用 `HEX_DIRECTIONS`：`(1,0)`、`(1,-1)`、`(0,-1)`、`(-1,0)`、`(-1,1)`、`(0,1)`；旋轉後出口為 `(direction + rotation) % 6`。相鄰兩格必須都可通行且相對出口同時開啟，才會連通。

連接查詢依傳入的最新世界資料計算，不另存道路圖；建造操作及 Undo／Redo 後重新呼叫即可取得最新結果。角色出生與重新安置使用道路群組，移動只通過旋轉後雙向出口相通的道路，既有橋樑、河流及建築仍不可通行。

格內路徑使用 `src/constants/roadCenterlines.ts` 為現有 14 款道路定義固定中心線、分支與匯合點；角色由目前分支經匯合點前往已選出口，同一分支則直接沿線行走。出生與死路折返使用引導點，道路修改後保留有效位置並接回最近可直連的中心線；無法直連時才以路面三角形搜尋接回路段。`src/constants/roadSurfaces.ts` 保留原始 GLB 路面資料，所有最終線段均檢查路面覆蓋，圓滑越界時保留原引導線。角色朝向使用目前路徑前方 0.1 世界單位的前視點，路徑不足時看向終點；岔路、彎路與重新接回的行走效果待使用者驗收。`src/utils/roads/paths.ts` 處理模型座標、旋轉與路面有效性，`src/utils/character/movement.ts` 依路徑長度推進，1× 為每秒 0.25 世界單位，直路約四秒一格；位移與步頻的 1× 基準皆調整為原本的 0.5×。岔路優先排除來路，沒有其他方向時先走到格內折返點再返回；無相通出口則待機。

所有建造操作及 Undo／Redo 都重新檢查目前腳底位置：仍在有效路面就保留位置並重算路線，失效才依最大群組重新安置。角色的 `position`、`route`、`enteredFrom`、`moving`、方向及速度只存在 `characterPose`；每幀只更新暫態狀態，不改動 `world`，因此不會寫入 LocalStorage 或建造歷史。背景時停止推進，返回跳過首幀時間差，不補跑背景距離。

角色目錄位於 `src/constants/characterCatalog.ts`，模型與預覽放在 `/models/characters` 與 `/previews/characters`。資產比例、朝向、動畫清單與來源見 [角色資產記錄](./docs/character-assets.md)。

`CharacterAnimation` 共用控制位於 `src/utils/character/animation.ts`，保留內建肢體動畫並統一落地曲線。`AnimatedCharacter` 接受行走、目標朝向、速度及 `onLand` 回呼，供道路移動與腳步聲階段串接；動畫使用各自的模型複本與 mixer，停止時凍結行走姿勢並在約 0.18 秒內混合回待機。背景分頁暫停動作，返回時不補播落地；動畫過程不更新世界存檔或建造歷史。

世界存檔版本為 5，`timeMode` 保存 `"auto" | "day" | "night"`；`audio` 保存主音量、靜音、播放與 `footstepsEnabled`／`callsEnabled`；升版會依既有政策清除版本 4 的舊世界。`character` 只包含 `{ id, walkingEnabled }` 或 `null`。位置、方向與速度保留在 `useWorldStore.characterPose`，不進 LocalStorage；載入及從首頁繼續世界時重新選出生道路，速度回到 1×。舊版本或無效角色資料會清除存檔，開發期間不做格式相容。建造歷史只記錄 Tile，Undo／Redo 不改變角色種類、行走意圖或模式，也不復活已移除的角色。

Character Listener 使用 `src/audio/characterMix.ts` 的記憶體 Map 快取。新路線沿每條線段以最多 0.1 世界單位間距預算各音源分數，反向共用線段；每 100 毫秒按位置插值，再沿用既有音量飽和與音源排序。有效半徑為三格寬，距離權重採平滑衰減；Tile 變更（含 Undo／Redo）清除快取，更換角色、速度及模式切換不清除。停止時保留局部混音，移除角色平順回到 World Mix；快取不進存檔或歷史。距離衰減與切換聽感尚待人工驗收。角色鏡頭的跟隨、轉向、第一人稱小跳與切換效果交由使用者驗收。

## 開發除錯輸出

開發模式點擊首頁「隨機生成」後，console 的 `[隨機生成]` 會輸出道路骨架名稱與 ID、整組旋轉（0–5）、總格數、道路格數、森林／湖泊中心、建築數量、道路群組與完整世界資料；每次生成輸出一次，正式版不啟用。五組骨架位於 `src/constants/roadLayouts.ts`，生成邏輯位於 `src/utils/randomWorld.ts`。五組骨架為五角形環道（23 格）、蜿蜒直線（17 格）、十字岔路（17 格）、不規則圓形環道（26 格）與四方格（21 格），四方格圍出二乘二、共四個區塊。每張世界在道路外增加 20–35 格地景，總格數不超過系統上限，包含固定連通道路、成片森林、可選小湖與最多三格路旁建築；實際布局與觀賞效果待人工驗收。

睡眠倒數與螢幕喚醒鎖定不寫入存檔，返回首頁、重新整理或關閉網頁後不恢復。關閉設定 Modal、切換模式、手動暫停或靜音不影響倒數；取消倒數不改變播放狀態，取消或重新開始時解除原淡出，主音量不被覆寫。最後 60 秒透過獨立增益安排指數淡出，環境音、叫聲與腳步聲一起漸弱，畫面亮度不變。上方入口剩餘分鐘向上取整，Modal 以置中大字顯示分秒倒數；選自訂才顯示輸入欄位，無效時使用 danger token 顯示錯誤。螢幕喚醒在支援的安全連線與可見頁面中請求，失敗不影響計時；背景返回時先檢查到期，再嘗試重新取得鎖定並校正淡出。瀏覽器凍結期間無法保證準時暫停，恢復執行後立即處理到期。取得、釋放與失敗資訊以 `console.log` 記錄，不顯示於產品介面。實際倒數、聽感與電腦／手機喚醒行為尚待人工驗收。

執行 `npm run dev` 並進入世界頁面後，瀏覽器 console 會自動輸出以下資料，首次顯示目前清單，之後僅在內容改變時更新；離開世界頁面會取消訂閱，正式版不啟用。

開發模式重複啟動監聽時，相同清單不會重複輸出。音軌訂閱時先提供目前清單，之後只在 engine 的 `sync()` 完成音軌增刪與調整後通知，不另外監聽音軌啟動。離開頁面時清除監聽，再次進入則重新顯示目前清單。

- **音軌**：直接列出 engine 的 `activeLoops`，包含載入中的項目，每筆只有 `source` 與 `targetVolume`；代表引擎目前保留的音軌，不保證當下已發聲。`targetVolume` 是該 loop 的目標音量，不包含主音量、靜音或淡入淡出效果。暫停時不重新配置音軌，恢復播放後才同步；靜音不影響清單。移出 `activeLoops` 的音軌不再列出，即使仍在淡出。清單無音軌時輸出空清單。
- **道路群組**：透過 `getRoadGroups(world.tiles)` 依旋轉後的雙向道路出口計算連通群組，包含獨立單格道路。輸出各組格數與成員座標，成員依 `q`、`r` 排序，群組依首個成員排序。建造及 Undo／Redo 後只有群組成員改變才輸出；無道路時輸出空清單。群組編號僅代表當次顯示順序。

## 資產授權

`public/models` 與 `public/previews` 使用 Kenney 的 Hexagon Kit，採 [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) 授權；原始授權內容位於 [public/license/License.txt](./public/license/License.txt)。

其中 `characters` 子目錄使用 Kenney Cube Pets 2.0 的五種模型、原始預覽與獨立共用貼圖，同為 CC0；原始授權位於 [CubePets-License.txt](./public/license/CubePets-License.txt)。完整來源索引見 [資產授權](./public/license/README.md)。
