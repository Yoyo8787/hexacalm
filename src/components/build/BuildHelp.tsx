import { useId, useRef } from "react";
import {
  ArrowRight,
  Binoculars,
  CircleHelp,
  Earth,
  Leaf,
  Play,
  Rotate3D,
  ScanEye,
  Timer,
  Trash2,
  Undo2,
  Volume2,
  X,
} from "lucide-react";
import { getTileDefinition, TILE_CATALOG } from "../../constants/tileCatalog";
import { MAX_AMBIENT_LOOPS } from "../../constants/audio";
import { CHARACTER_CATALOG } from "../../constants/characterCatalog";
import { useDialogBackdropClose } from "../../hooks/useDialogBackdropClose";
import type { AmbientSourceId } from "../../types";

const SOUND_GUIDE: {
  tileId: string;
  sound: string;
  source: AmbientSourceId;
}[] = [
  {
    tileId: "grass",
    sound: "田野蟲鳴",
    source: "rural",
  },
  {
    tileId: "grass-forest",
    sound: "森林環境音",
    source: "forest",
  },
  {
    tileId: "stone-mountain",
    sound: "貓頭鷹鳴叫",
    source: "mountain",
  },
  {
    tileId: "sand-desert",
    sound: "沙漠風聲",
    source: "desert",
  },
  {
    tileId: "water",
    sound: "湖水波浪",
    source: "water",
  },
  {
    tileId: "river-straight",
    sound: "潺潺流水",
    source: "river",
  },
  {
    tileId: "building-port",
    sound: "海浪與遠處海鷗",
    source: "harbor",
  },
  {
    tileId: "building-village",
    sound: "村落環境音",
    source: "settlement",
  },
  {
    tileId: "building-mill",
    sound: "機械運轉聲",
    source: "mill",
  },
  { tileId: "building-mine", sound: "洞穴滴水", source: "mine" },
  {
    tileId: "building-smelter",
    sound: "火焰劈啪聲",
    source: "smelter",
  },
  {
    tileId: "building-wizard-tower",
    sound: "空靈氛圍音",
    source: "magic",
  },
];

function TilePreview({ id }: { id: string }) {
  const tile = getTileDefinition(id);
  return tile ? (
    <img
      alt=""
      loading="lazy"
      src={tile.previewPath}
      className="size-16 shrink-0 object-contain"
      draggable={false}
    />
  ) : null;
}

function BuildHelp({ onOpen }: { onOpen: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const backdropClose = useDialogBackdropClose();

  return (
    <>
      <button
        aria-haspopup="dialog"
        className="text-muted hover:text-foreground hover:bg-hover flex size-12 flex-col items-center justify-center gap-0.75 rounded-lg text-[10px] font-medium transition-colors"
        onClick={(event) => {
          const button = event.currentTarget;
          onOpen();
          requestAnimationFrame(() => {
            button.focus();
            dialog.current?.showModal();
            if (content.current) content.current.scrollTop = 0;
          });
        }}
        type="button"
      >
        <CircleHelp aria-hidden="true" className="size-4" />
        說明
      </button>
      <dialog
        ref={dialog}
        aria-labelledby={titleId}
        className="bg-surface text-foreground border-line fixed inset-0 m-auto max-h-[calc(100svh-2rem)] w-[min(720px,calc(100%-2rem))] overflow-hidden rounded-2xl border p-0 shadow-2xl backdrop:bg-black/60 open:flex open:flex-col"
        onKeyDown={(event) => event.stopPropagation()}
        {...backdropClose}
      >
        <div className="flex shrink-0 items-center justify-between gap-4 px-5 pt-5 pb-4 sm:px-8 sm:pt-8">
          <h2 id={titleId} className="text-xl font-semibold">
            操作說明
          </h2>
          <button
            autoFocus
            aria-label="關閉操作說明"
            className="text-muted hover:text-foreground hover:bg-hover grid size-11 shrink-0 place-items-center rounded-lg"
            onClick={() => dialog.current?.close()}
            type="button"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>

        <div
          ref={content}
          className="min-h-0 space-y-6 overflow-y-auto px-5 pb-5 text-sm leading-relaxed sm:px-8 sm:pb-8"
        >
          <section aria-labelledby={`${titleId}-build`}>
            <h3 id={`${titleId}-build`} className="font-semibold">
              01 建造與編輯
            </h3>
            <div
              aria-hidden="true"
              className="bg-background mt-3 flex flex-wrap items-center justify-center gap-3 rounded-xl p-3"
            >
              <TilePreview id="grass-forest" />
              <ArrowRight className="text-primary size-5" />
              <span className="hex-clip bg-primary/20 grid size-16 place-items-center text-xs">
                空格
              </span>
              <span className="bg-line mx-1 h-8 w-px" />
              <Rotate3D className="size-5" />
              <Trash2 className="size-5" />
              <Undo2 className="size-5" />
            </div>
            <p className="mt-3">
              從下方選地塊，再點<strong>中央亮起的空格</strong>開始建造。
              <br />
              選取後可以連續放置，再點一次選單中的同款地塊即可取消選取。
            </p>
            <p className="mt-2">
              選好地塊後，點選既有地塊：<strong>不同款會直接取代</strong>
              ，同款則會逆時針旋轉 60°。
              <br />
              也可按左側「旋轉」後點地塊；左側「刪除」可移除地塊。
              <br />
              若想調整剛才的建造操作，可用<strong>復原／重做</strong>
              撤回或恢復。
            </p>
          </section>

          <section aria-labelledby={`${titleId}-pet`}>
            <h3 id={`${titleId}-pet`} className="font-semibold">
              02 寵物夥伴
            </h3>
            <div
              aria-hidden="true"
              className="bg-background mt-3 flex flex-wrap items-center justify-center gap-2 rounded-xl p-3"
            >
              <TilePreview id="path-straight" />
              <ArrowRight className="text-primary size-5" />
              {CHARACTER_CATALOG.map((pet) => (
                <img
                  key={pet.id}
                  alt=""
                  loading="lazy"
                  src={pet.previewPath}
                  className="size-8 object-contain sm:size-12"
                />
              ))}
            </div>
            <p className="mt-3">
              先放道路，再從下方<strong>「加入寵物」</strong>選夥伴。
              <br />
              寵物會沿相通道路自己隨機行走，陪你一起看看這個世界。
            </p>
            <p className="mt-2">
              用行走按鈕控制開始與停止，滑桿調整速度；手機滑桿在寵物選單裡。
              <br />
              選單也能更換或移除寵物。
            </p>
          </section>

          <section aria-labelledby={`${titleId}-view`}>
            <h3 id={`${titleId}-view`} className="font-semibold">
              03 模式與視角
            </h3>
            <div
              aria-hidden="true"
              className="bg-background mt-3 grid grid-cols-3 gap-2 rounded-xl p-3 text-center text-xs"
            >
              <span className="flex flex-col items-center gap-2">
                <Earth className="size-6" />
                世界
              </span>
              <span className="flex flex-col items-center gap-2">
                <Binoculars className="size-6" />
                第三人稱
              </span>
              <span className="flex flex-col items-center gap-2">
                <ScanEye className="size-6" />
                第一人稱
              </span>
            </div>
            <p className="mt-3">
              上方切換<strong>「建造／放鬆」</strong>
              。放鬆模式下會收起建造工具，讓你安心欣賞風景、聆聽聲音。
              <br />
              加入寵物後，可在放鬆模式的下方切換世界、第三人稱與第一人稱視角。
            </p>
            <p className="mt-2 pointer-coarse:hidden">
              <strong>世界視角控制：</strong>
              左鍵拖曳旋轉、右鍵拖曳平移、滾輪縮放；WASD 移動視角，F 重設。
            </p>
            <p className="mt-2 hidden pointer-coarse:block">
              <strong>手機世界視角控制：</strong>
              單指拖曳旋轉，雙指拖曳平移、捏合縮放；點「回到預設視角」即可重設。
            </p>
            <p className="mt-2">
              寵物視角會自動跟隨，讓你隨著牠的腳步慢慢遊覽。
            </p>
          </section>

          <section aria-labelledby={`${titleId}-audio`}>
            <h3 id={`${titleId}-audio`} className="font-semibold">
              04 聲音控制
            </h3>
            <div
              aria-hidden="true"
              className="bg-background mt-3 flex items-center justify-center gap-6 rounded-xl p-4"
            >
              <Play className="size-6" />
              <Volume2 className="size-6" />
              <Timer className="size-6" />
              <Leaf className="size-6" />
            </div>
            <p className="mt-3">
              右上角可以控制<strong>播放、暫停、靜音與全部聲音的音量</strong>。
              <br />
              聲音設定可獨立關閉腳步聲和寵物叫聲，留下你想聽的聲音。
            </p>
            <p className="mt-2">
              <strong>睡眠倒數</strong>可選 15／30／60 分鐘，或自訂 1–180 分鐘。
              <br />
              最後一分鐘聲音會逐漸變輕，時間到後自動暫停。
            </p>
          </section>

          <section aria-labelledby={`${titleId}-sounds`}>
            <h3 id={`${titleId}-sounds`} className="font-semibold">
              05 地塊對應什麼聲音？
            </h3>
            <p className="text-muted mt-2">
              地塊就是你的<strong>聲景素材</strong>
              。挑選喜歡的地景，讓聲音隨著世界自然交織。
              <br />
              下表同一組地塊共用音效，同時最多會有
              <strong>{MAX_AMBIENT_LOOPS} 種環境音</strong>。
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {SOUND_GUIDE.map(({ tileId, sound, source }) => (
                <div
                  key={source}
                  className="bg-background flex items-center gap-3 rounded-xl p-2"
                >
                  <TilePreview id={tileId} />
                  <div>
                    <p className="text-primary font-medium">{sound}</p>
                    <p className="text-muted mt-0.5 text-xs">
                      {TILE_CATALOG.filter(
                        (tile) => tile.audio?.source === source,
                      )
                        .map((tile) => tile.name)
                        .join("・")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3">
              沒有寵物時，聆聽範圍涵蓋<strong>整張世界</strong>。
              <br />
              加入寵物後，則<strong>以寵物為中心聆聽</strong>
              ，附近的聲音更清楚，遠處的聲音逐漸淡去。
            </p>
          </section>
        </div>
      </dialog>
    </>
  );
}

export default BuildHelp;
