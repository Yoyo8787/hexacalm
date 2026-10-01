import AudioController from "../components/audio/AudioController";
import CharacterControls from "../components/character/CharacterControls";
import BuildToolbar from "../components/build/BuildToolbar";
import TilePicker from "../components/build/TilePicker";
import WorldStatus from "../components/build/WorldStatus";
import ErrorBoundary from "../components/common/ErrorBoundary";
import Header from "../components/common/Header";
import CameraViewControls from "../components/world/CameraViewControls";
import WorldCanvas from "../components/world/WorldCanvas";
import { useWorldDebug } from "../hooks/useWorldDebug";
import { useWorldStore } from "../stores";

interface WorldPageProps {
  onBack: () => void;
}

function WorldPage({ onBack }: WorldPageProps) {
  const mode = useWorldStore((state) => state.world.mode);
  const setMode = useWorldStore((state) => state.setMode);

  useWorldDebug();

  return (
    <main className="bg-background text-foreground h-svh overflow-hidden">
      <Header mode={mode} onBack={onBack} onModeChange={setMode} />
      <section className="relative h-[calc(100svh-4rem)]">
        <ErrorBoundary>
          <WorldCanvas />
        </ErrorBoundary>
        <AudioController />
        <CharacterControls />
        <CameraViewControls />
        {mode === "build" && (
          <>
            <BuildToolbar />
            <WorldStatus />
            <TilePicker />
          </>
        )}
      </section>
    </main>
  );
}

export default WorldPage;
