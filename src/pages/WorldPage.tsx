import { useEffect, useRef, useState } from "react";
import AudioController from "../components/audio/AudioController";
import SleepTimer from "../components/audio/SleepTimer";
import CharacterControls from "../components/character/CharacterControls";
import BuildToolbar from "../components/build/BuildToolbar";
import CursorHint from "../components/build/CursorHint";
import TilePicker from "../components/build/TilePicker";
import AmbienceControl from "../components/common/AmbienceControl";
import DockFeedback from "../components/common/DockFeedback";
import ErrorBoundary from "../components/common/ErrorBoundary";
import Header from "../components/common/Header";
import CameraViewControls from "../components/world/CameraViewControls";
import ResetViewPill from "../components/world/ResetViewPill";
import WorldCanvas from "../components/world/WorldCanvas";
import { useWorldDebug } from "../hooks/useWorldDebug";
import { useDockNotice } from "../hooks/useDockNotice";
import { useWorldStore } from "../stores";

// Matches the Dock's bottom-4 offset and the gap above it.
const DOCK_BOTTOM = 16;
const DOCK_PILL_GAP = 12;

type WorldMenu = "ambience" | "audio" | "pet";

interface WorldPageProps {
  onBack: () => void;
}

function isTextInput(target: EventTarget | null) {
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    (target instanceof HTMLElement && target.isContentEditable)
  );
}

function WorldPage({ onBack }: WorldPageProps) {
  const mode = useWorldStore((state) => state.world.mode);
  const setMode = useWorldStore((state) => state.setMode);
  const [openMenu, setOpenMenu] = useState<WorldMenu | null>(null);
  const [dockHeight, setDockHeight] = useState(0);
  const dock = useRef<HTMLDivElement>(null);
  const { notices, showNotice } = useDockNotice();

  useWorldDebug();

  useEffect(() => {
    const element = dock.current;
    if (!element) return;
    const observer = new ResizeObserver(() =>
      setDockHeight(element.offsetHeight),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        // Peel back one layer per press: menu, Tile selection, Remove Mode.
        if (openMenu) {
          setOpenMenu(null);
          return;
        }
        const { selectedTileId, removeMode, selectTile, toggleRemoveMode } =
          useWorldStore.getState();
        if (selectedTileId) selectTile(null);
        else if (removeMode) toggleRemoveMode();
        return;
      }
      if (
        event.code === "KeyF" &&
        !event.repeat &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey &&
        !isTextInput(event.target)
      ) {
        useWorldStore.getState().resetCamera();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openMenu]);

  return (
    <main className="bg-background text-foreground relative h-svh overflow-hidden">
      <Header mode={mode} onBack={onBack} onModeChange={setMode}>
        <div className="flex items-center gap-2">
          <AmbienceControl
            menuOpen={openMenu === "ambience"}
            onMenuOpenChange={(open) => setOpenMenu(open ? "ambience" : null)}
          />
          <SleepTimer />
          <AudioController
            menuOpen={openMenu === "audio"}
            onMenuOpenChange={(open) => setOpenMenu(open ? "audio" : null)}
          />
        </div>
      </Header>
      <section className="relative h-svh">
        <ErrorBoundary>
          <WorldCanvas />
        </ErrorBoundary>
        <div
          ref={dock}
          className={`panel absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 rounded-2xl ${
            mode === "build"
              ? "w-[min(1080px,calc(100%-2rem))] items-stretch"
              : "w-max items-center gap-1.5 p-1.5"
          }`}
        >
          <CharacterControls
            layout={mode === "build" ? "stacked" : "inline"}
            menuOpen={openMenu === "pet"}
            onMenuOpenChange={(open) => setOpenMenu(open ? "pet" : null)}
          />
          <span
            className={`bg-line w-px shrink-0 ${
              mode === "build" ? "my-3" : "mx-1 h-7"
            }`}
          />
          {mode === "build" ? (
            <TilePicker />
          ) : (
            <CameraViewControls onNotice={showNotice} />
          )}
        </div>
        <DockFeedback
          bottom={DOCK_BOTTOM + dockHeight + DOCK_PILL_GAP}
          hidden={openMenu !== null}
          notices={notices}
        >
          <ResetViewPill hidden={openMenu !== null} />
        </DockFeedback>
        {mode === "build" && (
          <>
            <BuildToolbar />
            <CursorHint />
          </>
        )}
      </section>
    </main>
  );
}

export default WorldPage;
