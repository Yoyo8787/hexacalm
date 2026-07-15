# 3D 白噪音六角世界生成器

## Product Specification v0.1

---

# 1. 專案概述

本專案是一個以放鬆、環境白噪音與 3D 視覺體驗為核心的網頁應用。

使用者可以透過簡單的六角 Tile 建造系統，建立自己的 3D 世界。每一個 Tile 都是一個完整的 3D 場景單元，並帶有對應的聲音與道路資訊。

使用者不需要調整複雜的聲音參數，也不需要學習專業 3D 編輯操作。聲音播放、混合、距離變化與不同 Tile 組合所產生的環境效果，皆由系統自動處理。

除建造世界外，使用者也可以在世界中加入一個角色。角色會沿著由道路 Tile 組成的路線自動移動，並可切換第三人稱或第一人稱視角觀看。

本產品的核心目的不是製作專業世界編輯器，而是提供一個具有創造性、觀賞性與放鬆效果的互動式白噪音網站。

---

# 2. 產品目標

## 2.1 核心目標

產品需提供以下核心價值：

1. 使用者可快速建立一個具有視覺氛圍的六角 3D 世界。
2. 建造操作必須簡單，不需要理解專業 3D 編輯概念。
3. 世界中的聲音由 Tile 與其組合自動產生。
4. 使用者即使不進行建造，也可以將網站作為白噪音與放鬆工具。
5. 角色可在道路上自動移動，增加世界的生命感與觀看體驗。
6. 系統需具備足夠的前端架構深度，以展示複雜狀態、3D 場景、音訊與模擬邏輯的整合能力。

---

# 3. 非目標

本專案目前不以以下能力為目標：

- 專業 3D 場景編輯
- 自由物件移動、縮放與 Transform Gizmo
- 使用者自行配置空間音源
- 個別音訊混音與細部參數調整
- 專業 Soundscape Editor
- 多世界管理
- 雲端同步
- 多人協作
- 自訂 3D 模型上傳
- 自訂音效上傳
- Biome 編輯
- 天氣系統
- 日夜循環
- 季節系統
- NPC 或 AI 行為
- 手動控制角色
- 自由探索或 WASD 移動
- 完整手機專用介面
- 分享與公開作品頁
- Import / Export
- 專業錯誤恢復流程

---

# 4. 使用者流程

## 4.1 初次進入流程

```text
Landing Page
├── Random Generate
│   └── 隨機生成世界
│       └── 進入 Relax Mode
│
└── Build Your Own
    └── 建立空白世界
        └── 進入 Build Mode
```

---

## 4.2 返回使用者流程

網站需透過 LocalStorage 儲存目前唯一世界。

使用者重新開啟網站時，系統可提供恢復上次世界的能力。

預期流程：

```text
Landing Page
├── Continue
│   └── 載入上次世界
│
├── Random Generate
│   └── 建立新的隨機世界
│
└── Build Your Own
    └── 建立新的空白世界
```

若尚未存在已儲存世界，則不顯示 Continue。

建立新世界時，可直接覆蓋目前世界。是否加入簡單確認提示，可於實作階段決定。

---

# 5. Landing Page

Landing Page 是產品介紹與個人作品曝光入口。

## 5.1 必要內容

Landing Page 至少需包含：

- 專案名稱
- 簡短產品介紹
- Random Generate 按鈕
- Build Your Own 按鈕
- 若已有世界，顯示 Continue 按鈕
- 個人或專案識別資訊

## 5.2 暫不決定內容

以下內容保留彈性：

- 使用圖片、影片或即時 3D 作為主視覺
- 技術棧介紹
- GitHub 連結位置
- 開發故事
- About 區塊
- 展示動畫
- Landing Page 版面風格

## 5.3 聲音行為

Landing Page 不播放環境音。

聲音只在進入世界頁面後啟用。

---

# 6. 世界生命週期

## 6.1 世界數量

系統只管理一個世界。

不提供：

- 世界列表
- 多存檔
- 世界名稱
- 世界複製
- 世界分類
- 世界搜尋

## 6.2 儲存方式

使用 LocalStorage 儲存：

- 世界 Tile 資料
- Tile 旋轉狀態
- 角色資料
- 角色位置
- 角色移動狀態
- 角色速度
- 目前模式
- 相機模式
- 音量
- 靜音狀態
- Sleep Timer 必要狀態
- 資料版本

## 6.3 自動儲存

以下操作後應自動更新儲存資料：

- Add
- Replace
- Rotate
- Remove
- Undo
- Redo
- 加入角色
- 更換角色
- 移除角色
- 調整角色速度
- 切換模式
- 修改音量
- 修改靜音狀態

不要求每一幀持續寫入角色的即時位置，可採節流、定期寫入或在重要狀態改變時寫入。

---

# 7. 六角世界模型

## 7.1 世界結構

世界由六角格子組成。

每個六角座標最多只能存在一個 Tile。

```text
World
└── Hex Cell
    └── Tile
```

不存在額外 Prop、自由物件或多層物件配置。

## 7.2 初始空白世界

自行構建世界時：

- 世界初始沒有已放置 Tile。
- 場景中央顯示一個可放置空格。
- 使用者可在該空格放置第一個 Tile。

## 7.3 動態擴張

當一個 Tile 被放置後，其周圍相鄰六角座標會顯示為可放置空格。

規則：

```text
已存在 Tile
→ 找出六個相鄰座標
→ 尚未放置 Tile 的座標顯示為空格
```

當 Tile 被移除後，系統重新計算需要顯示的空格。

空格只是一種可互動位置，不屬於實際世界資料。

## 7.4 世界上限

世界需設定最大 Tile 數量。

實際數值由實作與效能測試決定。

達到上限後：

- 不可繼續 Add
- 仍可 Replace
- 仍可 Rotate
- 仍可 Remove
- 仍可 Undo / Redo

---

# 8. Tile 系統

## 8.1 Tile 定義

每個 Tile 是一個完整的 3D 場景單元。

Tile 可包含以下資料：

- 唯一識別 ID
- 顯示名稱
- 3D 模型
- 預覽圖或選單圖示
- 一個或多個分類
- 目前旋轉方向
- 音訊屬性
- 道路連接資訊
- 是否可供角色通行

概念資料如下：

```text
Tile
├── id
├── name
├── model
├── categories[]
├── rotation
├── audioAttributes
├── roadConnections
└── traversable
```

## 8.2 Tile 分類

初始分類固定為：

- Ground
- Forest
- Water
- Road
- Structure

Tile 可以同時屬於多個分類。

例如：

```text
Forest Road Tile
categories:
- Forest
- Road
```

複合 Tile 不需要建立獨立的 Composite 分類。

## 8.3 Tile 旋轉

所有 Tile 都可以旋轉。

旋轉規則：

- 每次旋轉 60 度
- 共六個方向
- 不判斷模型是否對稱
- 不跳過視覺上相同的方向
- 旋轉會影響道路連接方向
- 旋轉操作可 Undo / Redo

## 8.4 Tile 音訊屬性

Tile 可帶有音訊相關屬性。

音訊規則可依單一 Tile 或多個相鄰 Tile 組合產生。

例如：

- 單一 Water Tile 產生基礎水聲
- 多個相連 Water Tile 可產生更大範圍水域效果
- 多個 Forest Tile 可增加森林環境音權重
- Structure Tile 可提供局部特殊聲音

詳細音訊組合規則不在本文件定義，後續以 Tile Catalog Spec 或 Audio Rule Spec 補充。

## 8.5 道路資訊

道路 Tile 需記錄六個方向上的連接資訊。

Tile 旋轉後，道路出口方向需一併旋轉。

角色是否能從一格移動至相鄰格，取決於：

1. 目前 Tile 朝向相鄰格具有道路出口。
2. 相鄰 Tile 朝向目前格具有對應道路出口。
3. 相鄰 Tile 被標記為可通行。

---

# 9. Build Mode

Build Mode 是世界建造模式。

## 9.1 Build Mode 顯示內容

Build Mode 顯示：

- Tile Picker
- Tile 分類
- Remove Mode 控制
- Undo
- Redo
- Build / Relax Mode 切換
- 音量控制
- Play / Pause
- Mute
- Sleep Timer
- 角色基本控制
- 視角切換
- 可放置空格

## 9.2 角色與 Build Mode

Build Mode 不影響角色狀態。

進入或離開 Build Mode 時：

- 不自動開始角色
- 不自動停止角色
- 不改變角色速度
- 不重設角色位置
- 不隱藏角色
- 不改變 Listener 模式
- 不中斷音訊

角色可以在使用者建造世界時持續移動。

---

# 10. Builder 操作

## 10.1 操作狀態

Builder 主要包含：

- Tile 已選取狀態
- 無 Tile 選取狀態
- Remove Mode

Remove Mode 優先於其他操作。

---

## 10.2 Tile 選取

使用者從畫面下方的 Tile Picker 選取 Tile。

規則：

- 選取 Tile 後保持選取。
- 放置後不自動取消。
- 支援連續放置。
- 再次點擊目前已選 Tile 可取消選取。
- 可透過其他取消操作回到無選取狀態。
- 不顯示 Ghost Preview。
- 不需要放置前確認。
- 不需要 Replace 確認。

---

## 10.3 Add

條件：

- 目前已選擇一個 Tile。
- 點擊的位置為空格。
- 尚未達到最大 Tile 數量。

結果：

- 在指定六角座標新增目前選擇的 Tile。
- Tile 使用預設旋轉方向。
- 重新計算周圍可放置空格。
- 寫入 Undo History。
- 自動儲存世界。

---

## 10.4 Replace

條件：

- 目前已選擇一個 Tile。
- 點擊的位置已有 Tile。

結果：

- 使用目前選擇的 Tile 取代原有 Tile。
- 新 Tile 使用預設旋轉方向。
- 不需要確認。
- 寫入 Undo History。
- 道路資料重新計算。
- 音訊狀態重新計算。
- 若影響角色路徑，角色重新規劃。
- 自動儲存世界。

---

## 10.5 Rotate

條件：

- 目前沒有選擇 Tile。
- Remove Mode 未開啟。
- 點擊的位置已有 Tile。

結果：

- Tile 順時針旋轉 60 度。
- 道路連接方向同步更新。
- 寫入 Undo History。
- 若影響角色路徑，角色重新規劃。
- 自動儲存世界。

---

## 10.6 Remove

條件：

- Remove Mode 已開啟。
- 點擊的位置已有 Tile。

結果：

- 移除 Tile。
- 重新計算可放置空格。
- 重新計算道路。
- 重新計算聲音。
- 寫入 Undo History。
- 自動儲存世界。

Remove Mode 支援連續刪除。

桌面版以點擊為主要操作。

手機版未來可加入長按刪除，以降低誤觸風險。

---

## 10.7 Undo / Redo

Undo / Redo 支援：

- Add
- Replace
- Rotate
- Remove

Undo 或 Redo 後需同步更新：

- 世界資料
- 可放置空格
- 道路資訊
- 角色路徑
- 音訊狀態
- LocalStorage

---

# 11. Relax Mode

Relax Mode 是純觀看與聆聽模式。

## 11.1 Relax Mode 顯示內容

Relax Mode 隱藏：

- Tile Picker
- Tile 分類
- Remove Mode
- Undo
- Redo
- 可放置空格
- 所有建造相關介面

Relax Mode 保留：

- Build / Relax Mode 切換
- Builder View
- Third-person View
- First-person View
- 角色選擇
- 角色開始與停止
- 角色速度
- 音量
- Play / Pause
- Mute
- Sleep Timer

## 11.2 模式切換

Build Mode 與 Relax Mode 切換時：

- 不播放模式切換動畫
- 不停止音訊
- 不改變角色狀態
- 不改變角色位置
- 不改變角色速度
- 不重設世界
- 不自動切換 Listener

進入 Relax Mode 時，需取消目前 Tile 選取並關閉 Remove Mode。

---

# 12. 相機系統

系統提供三種視角：

- Builder View
- Third-person View
- First-person View

視角切換需提供平滑動畫。

---

## 12.1 Builder View

Builder View 可在 Build Mode 與 Relax Mode 使用。

主要用途：

- 查看完整世界
- 建造世界
- 觀察角色
- 調整觀看角度

Builder View 支援：

- Orbit
- Zoom
- Pan
- Reset Camera

詳細操作手感由實作階段調整。

---

## 12.2 Third-person View

使用條件：

- 世界中必須存在角色。

行為：

- 相機跟隨角色。
- 相機位置固定於角色後方或斜後方。
- 相機方向跟隨角色移動方向。
- 使用者不能手動旋轉相機。
- 使用者不能調整跟隨距離。
- 角色停止時仍可使用。
- 不處理相機障礙避讓。
- 不處理場景碰撞。

---

## 12.3 First-person View

使用條件：

- 世界中必須存在角色。

行為：

- 相機位於角色位置或接近角色視線高度。
- 相機方向跟隨角色方向。
- 使用者不能自由觀看。
- 使用者不能控制角色。
- 角色停止時仍可使用。
- 不使用 Pointer Lock。
- 不處理碰撞。
- 不處理相機避讓。

---

## 12.4 無角色狀態

若沒有角色：

- Builder View 可用。
- Third-person View 不可用。
- First-person View 不可用。

介面可將不可用視角設為 Disabled。

---

# 13. 角色系統

## 13.1 角色數量

每個世界最多只能存在一個角色。

## 13.2 加入角色

使用者可從角色選單選擇一個角色。

加入條件：

- 世界中至少存在一個有效道路 Tile。

加入結果：

- 系統隨機選擇一個有效道路 Tile。
- 角色生成於該 Tile 上。
- 角色預設可為停止或行走狀態，具體預設值由實作決定。
- Listener 切換為 Character 模式。

若世界沒有有效道路：

- 不可加入角色。
- 開發初期可使用 `console.warn`。
- 產品化提示後續再補。

## 13.3 更換角色

更換角色時：

- 保留目前位置。
- 保留目前方向。
- 保留目前行走或停止狀態。
- 保留目前速度。
- 切換角色模型。
- 切換對應角色音效。

## 13.4 移除角色

若支援移除角色：

- 角色從世界中消失。
- Third-person View 與 First-person View 停用。
- 相機切回 Builder View。
- Listener 切換為 World 模式。

---

# 14. 角色移動

## 14.1 自動移動

角色只能沿道路 Tile 自動移動。

使用者不能：

- 使用鍵盤控制
- 使用滑鼠控制
- 使用虛擬搖桿
- 指定目的地
- 點擊地面移動
- 自由探索

## 14.2 開始與停止

支援：

- Start
- Stop

Stop 行為：

- 按下後立即停止。
- 不需要走到下一個 Tile 中心。
- 保留目前位置與方向。

Start 行為：

- 從目前位置繼續移動。
- 若目前路徑失效，重新選擇有效方向。

## 14.3 速度控制

使用者可調整角色移動速度。

速度需有合理最小值與最大值。

速度只影響角色移動，不直接改變世界音訊速度。

---

# 15. 道路與路徑行為

角色移動時依據道路 Tile 的連接資訊判斷下一個方向。

## 15.1 一般道路

若只有一個可前進方向，角色沿該方向移動。

## 15.2 岔路

若存在多個可前進方向：

- 系統隨機選擇其中一條。
- 優先排除角色剛離開的方向。
- 若排除後沒有其他方向，允許折返。

## 15.3 死路

若前方沒有其他可通行方向：

- 角色沿原路折返。

## 15.4 道路被修改

當 Add、Replace、Rotate、Remove 改變道路時：

- 系統重新檢查角色目前位置與可行方向。
- 重新建立可行路徑。
- 若角色所在位置仍有效，角色從目前位置繼續。
- 若角色所在 Tile 已被刪除，角色重新生成於隨機有效道路 Tile。
- 若世界中已無有效道路，移除角色或停用角色。

## 15.5 刪除角色所在 Tile

若刪除角色所在 Tile：

1. 尋找其他有效道路 Tile。
2. 若存在，角色隨機重新生成。
3. 若不存在，角色被移除。
4. Listener 回到 World 模式。
5. 視角回到 Builder View。

---

# 16. 音訊系統

## 16.1 使用者控制

使用者只可控制：

- Play
- Pause
- Mute
- Master Volume
- Sleep Timer

使用者不可控制：

- 單一 Tile 音量
- 單一音源開關
- 距離衰減
- 音訊範圍
- Panning
- Filter
- Reverb
- DSP
- 個別音訊分類
- Mixer

## 16.2 World Listener 模式

當世界中沒有角色時：

```text
Listener Mode = World
```

系統根據整張世界計算環境混音。

世界混音可考慮：

- Tile 類型數量
- Tile 組合
- 相鄰關係
- 相同音效最大播放數量
- 全域聲音權重

具體混音演算法後續定義。

## 16.3 Character Listener 模式

當世界中存在角色時：

```text
Listener Mode = Character
```

系統以角色位置作為聲音中心。

角色移動時：

- 更新與 Tile 的相對距離
- 更新聲音權重
- 更新左右方向
- 更新局部環境音
- 保持整體聲音連續

角色停止時，聲音仍持續播放。

## 16.4 Tile 聲音組合

Tile 的聲音不一定只取決於單一 Tile。

系統可根據：

- 同類 Tile 數量
- 同類 Tile 是否相鄰
- Tile 群組大小
- Tile 與角色距離
- Tile 所屬分類

決定播放內容與權重。

詳細規則另立 Audio Rule Spec。

---

# 17. Sleep Timer

Sleep Timer 是目前唯一的放鬆輔助工具。

## 17.1 功能

使用者可以：

- 設定倒數時間
- 查看剩餘時間
- 啟動 Timer
- 取消 Timer

## 17.2 結束行為

Timer 結束後：

- 停止音訊播放。
- 保留目前世界。
- 保留角色位置。
- 不離開目前頁面。
- 不重設模式。

是否在結束前進行音量淡出，可於後續實作決定。

## 17.3 未來擴充

保留未來加入以下功能的可能：

- Fade-out
- Pomodoro
- Focus Timer
- Presets
- 自訂倒數時間

目前不實作。

---

# 18. 隨機生成

## 18.1 使用流程

使用者在 Landing Page 點擊 Random Generate 後：

1. 建立一個新的隨機世界。
2. 覆蓋目前唯一世界。
3. 儲存至 LocalStorage。
4. 進入世界頁面。
5. 預設進入 Relax Mode。
6. 不自動加入角色。

## 18.2 隨機規則

目前採完全隨機。

不提供：

- Biome
- Theme
- Seed
- 世界大小選擇
- Tile 分類比例
- 道路比例
- 角色選擇
- 生成參數

## 18.3 基本限制

生成結果需符合：

- Tile 數量不超過系統上限。
- 不重複占用相同座標。
- Tile 使用有效六角座標。
- 世界至少包含一個 Tile。
- 世界可以正常渲染。
- 世界可以正常產生音訊。
- 生成後可切換至 Build Mode 修改。

不保證：

- 一定有道路
- 一定能加入角色
- 一定形成特定形狀
- 一定包含所有分類

---

# 19. 錯誤與開發期處理

目前不規劃完整使用者錯誤介面。

開發期使用：

- `console.error`
- `console.warn`
- 開發環境 Assertion
- 必要 fallback
- React Error Boundary 基本保護

適用情境：

- Tile Definition 不存在
- 3D 模型載入失敗
- 音訊載入失敗
- LocalStorage 資料無法解析
- 世界資料版本不符
- 角色無有效道路
- 相機模式缺少角色
- 道路資訊不一致
- 隨機生成失敗

若 LocalStorage 資料損壞：

- 記錄錯誤。
- 清除損壞資料。
- 回到 Landing Page 或建立空白世界。

完整 Toast、Modal 與使用者恢復流程後續再補。

---

# 20. 手機支援

目前採 Desktop-first。

第一階段不針對手機特別設計：

- 不設計手機專用 Layout
- 不設計 Portrait 專用介面
- 不設計 Landscape 專用介面
- 不處理完整手勢規則
- 不特別調整 Tile Picker
- 不實作行動裝置畫質分級
- 不保證大型世界在手機上的完整效能

第一階段最低要求：

- 網站可在手機瀏覽器開啟。
- 主要畫面不完全破版。
- 基本按鈕可以操作。
- 後續逐步改善觸控與響應式體驗。

Remove Mode 的長按刪除屬於未來手機優化內容。

---

# 21. 技術選型

## 21.1 核心前端

- React 19
- TypeScript
- Vite

## 21.2 3D

- Three.js
- `@react-three/fiber`
- `@react-three/drei`

## 21.3 狀態管理

- Zustand

## 21.4 樣式

- Tailwind CSS v4

## 21.5 音訊

- Tone.js
- Web Audio API

## 21.6 測試

- Vitest
- Playwright

---

# 22. 未來可能加入的技術

以下技術不屬於目前必要功能，但保留擴充可能。

## Web Workers

可能用於：

- 隨機世界生成
- 大型世界道路計算
- Tile 組合分析
- 世界驗證

## Rust + WebAssembly

可能用於：

- Procedural Generation
- 大量六角資料運算
- Simulation
- Audio DSP

## AudioWorklet

可能用於：

- 自訂白噪音生成
- 即時 DSP
- 自訂濾波
- 更精細的 Audio Processing

## 大型場景優化

可能包含：

- InstancedMesh
- Chunk Rendering
- LOD
- Frustum Culling
- Tile 批次渲染
- 資產共用
- 音訊 Voice Limiting

是否採用需依實際效能瓶頸決定。

---

# 23. 延後功能

以下功能暫不納入目前規格：

- Tile 搜尋
- Favorites
- Recent Tiles
- 世界命名
- 多世界存檔
- Import / Export
- 分享連結
- 公開作品頁
- 使用者音訊上傳
- 自訂 Tile
- 自訂角色
- 多角色
- 手動角色控制
- 天氣
- 日夜循環
- 季節
- Biome
- Theme
- Demo World
- Seed
- 生成參數
- 專業 Mixer
- Individual Audio Controls
- Pomodoro
- 雲端儲存
- 使用者帳號
- 多人協作

---

# 24. 後續規格文件

本文件定義產品總體功能。

後續可拆分以下子規格：

## Tile Catalog Spec

定義：

- 每個 Tile 的名稱
- 分類
- 模型
- 道路出口
- 音訊屬性
- 是否可通行
- 預設旋轉
- 顯示圖示

## Audio Rule Spec

定義：

- Tile 音訊 Profile
- Tile 組合規則
- World Mix
- Character Listener Mix
- 音訊上限
- Fade 與切換規則

## Character Spec

定義：

- 角色列表
- 模型
- 角色聲音
- 移動速度範圍
- Animation
- 出生位置與方向

## Random Generation Spec

定義：

- Tile 數量範圍
- 座標生成
- 隨機分布
- 世界形狀
- 生成有效性
- 後續 Seed 支援

## UI Interaction Spec

定義：

- Landing Page Layout
- Tile Picker
- Build Toolbar
- Relax Controls
- Camera Controls
- Sleep Timer UI
- Desktop 與未來 Mobile 行為
