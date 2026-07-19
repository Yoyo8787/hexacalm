import { useState } from "react";
import BuildToolbar from "../components/build/BuildToolbar";
import TilePicker from "../components/build/TilePicker";
import WorldStatus from "../components/build/WorldStatus";
import ErrorBoundary from "../components/common/ErrorBoundary";
import Header from "../components/common/Header";
import WorldControls from "../components/common/WorldControls";
import WorldCanvas from "../components/world/WorldCanvas";
import { useWorldStore } from "../stores";

interface WorldPageProps {
  onBack: () => void;
}

function WorldPage({ onBack }: WorldPageProps) {
  const [muted, setMuted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const mode = useWorldStore((state) => state.world.mode);
  const setMode = useWorldStore((state) => state.setMode);

  return (
    <main className="bg-background text-foreground h-svh overflow-hidden">
      <Header mode={mode} onBack={onBack} onModeChange={setMode} />
      <section className="relative h-[calc(100svh-4rem)]">
        <ErrorBoundary>
          <WorldCanvas />
        </ErrorBoundary>
        <WorldControls
          muted={muted}
          onMutedChange={setMuted}
          onPlayingChange={setPlaying}
          onVolumeChange={setVolume}
          playing={playing}
          volume={volume}
        />
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
