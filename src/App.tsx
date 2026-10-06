import { lazy, Suspense, useState } from "react";
import { useWorldPersistence } from "./hooks";
import { useTimeTheme } from "./hooks/useTimeOfDay";
import LandingPage from "./pages/LandingPage";
import { useWorldStore } from "./stores";

const WorldPage = lazy(() => import("./pages/WorldPage"));

type AppPage = "landing" | "world";

function App() {
  const [page, setPage] = useState<AppPage>("landing");
  const createBlankWorld = useWorldStore((state) => state.createBlankWorld);
  const createRandomWorld = useWorldStore((state) => state.createRandomWorld);
  const hydrated = useWorldStore((state) => state.hydrated);
  const hasSavedWorld = useWorldStore(
    (state) => Object.keys(state.world.tiles).length > 0,
  );

  useWorldPersistence();
  useTimeTheme();

  if (page === "world") {
    return (
      <Suspense
        fallback={
          <main
            aria-busy="true"
            className="bg-background text-foreground grid h-svh place-items-center"
          >
            正在載入世界…
          </main>
        }
      >
        <WorldPage onBack={() => setPage("landing")} />
      </Suspense>
    );
  }

  return (
    <LandingPage
      canContinue={hydrated && hasSavedWorld}
      onRandomWorld={() => {
        createRandomWorld();
        setPage("world");
      }}
      onBuildWorld={() => {
        createBlankWorld();
        setPage("world");
      }}
      onContinue={() => {
        const { world, hydrateWorld } = useWorldStore.getState();
        hydrateWorld(world);
        setPage("world");
      }}
    />
  );
}

export default App;
