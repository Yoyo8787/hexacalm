import { useState } from "react";
import { useWorldPersistence } from "./hooks";
import LandingPage from "./pages/LandingPage";
import WorldPage from "./pages/WorldPage";
import { useWorldStore } from "./stores";

type AppPage = "landing" | "world";

function App() {
  const [page, setPage] = useState<AppPage>("landing");
  const createBlankWorld = useWorldStore((state) => state.createBlankWorld);
  const hydrated = useWorldStore((state) => state.hydrated);
  const hasSavedWorld = useWorldStore(
    (state) => Object.keys(state.world.tiles).length > 0,
  );

  useWorldPersistence();

  if (page === "world") {
    return <WorldPage onBack={() => setPage("landing")} />;
  }

  return (
    <LandingPage
      canContinue={hydrated && hasSavedWorld}
      onBuildWorld={() => {
        createBlankWorld();
        setPage("world");
      }}
      onContinue={() => setPage("world")}
    />
  );
}

export default App;
