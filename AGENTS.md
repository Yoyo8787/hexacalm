# AGENTS.md

本文件提供在 Hexacalm repository 工作的 coding agent 使用。

## 開始工作

1. 先讀取與任務相關的程式碼及 `git status`，保留使用者既有變更。
2. 產品行為變更時讀完整的 [SPEC.md](./SPEC.md)；它描述最終產品目標，不代表所有功能都已實作。
3. 以 [README.md](./README.md) 的「目前可用功能」與「尚未實作」判斷現況，再以程式碼確認細節。
4. 在修改前寫出假設與可驗證的完成條件。規格與現況衝突時，向使用者指出差異，不要默默選擇其一。

## 專案不變量

- `useWorldStore` 是世界與建造狀態的唯一來源；不要在元件建立第二份世界狀態。
- 世界目前只有一份，資料格式由 `WorldData` 與 `WORLD_SCHEMA_VERSION` 管理。改變持久化格式時同步更新型別、驗證、版本與相容策略。
- 六角格使用 axial coordinate（`q`, `r`），key 統一透過 `coordinateKey` 產生。
- Tile 旋轉是 `0..5` 的離散值，每一步代表順時針 60°。
- 新 Tile 必須在 `TILE_CATALOG` 有唯一 ID，並提供相符的 `/public/models/<id>.glb` 與 `/public/previews/<id>.png`；若缺少資產，明確保留 fallback 或回報缺口。
- `WORLD_TILE_LIMIT` 與 `HISTORY_LIMIT` 是集中管理的限制，不要在 UI 或 store 重複硬編碼。
- Relax Mode 必須取消 Tile 選取與 Remove Mode，且不應顯示任何建造介面。
- Build action 的優先順序是 Remove Mode、已選 Tile 的放置/取代、無選取時旋轉。每次成功操作都必須更新 Undo history 並清空 Redo future。
- LocalStorage 內容必須先驗證再 hydrate；無效或版本不符的資料應清除並安全回到空白狀態。
- 目前音訊控制只有 `WorldPage` 的本地 UI 狀態；除非任務要求串接音訊，不要將它描述成可播放聲景。
- `public/license/License.txt` 是 Kenney 資產授權來源；修改或新增第三方資產時保留並補充正確授權資訊。

## 修改原則

- 使用 React function component、TypeScript strict typing、Zustand action 與現有 Tailwind token；延續鄰近程式碼風格。
- 只修改完成需求所需的行；不要順手重構、重新排版或清除無關程式碼。
- 新增功能前先找現有 seam：catalog 資料放 `constants`，共享型別放 `types`，純六角/儲存邏輯放 `utils`，狀態轉換放 `stores`，畫面組裝放 `pages`。
- UI 文字以繁體中文撰寫；識別字、型別與程式註解沿用現有英文風格。
- 不要為尚未要求的 SPEC 章節預先加入抽象層、設定或 dependency。
- 不執行 `git push`。除非使用者明確要求，不 stage、不 commit，也不執行測試。
- 修改程式碼後，若專案既有 Prettier 可用，只格式化本次修改的檔案；不要為格式化安裝 dependency。

## 完成檢查

1. 逐項對照需求與 SPEC，確認每個改動都可追溯至本次任務。
2. 檢查 diff，確認沒有覆蓋使用者變更或改動無關檔案。
3. 檢查 catalog ID、資產路徑、座標 key、旋轉值、歷史與持久化不變量。
4. 回報實際完成內容、未執行的檢查，以及仍屬規格但尚未實作的相關功能。
