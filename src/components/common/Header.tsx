import { ArrowLeft, Box, Eye, Hammer } from "lucide-react";
import type { WorldMode } from "../../types";

interface HeaderProps {
  mode: WorldMode;
  onBack: () => void;
  onModeChange: (mode: WorldMode) => void;
}

function Header({ mode, onBack, onModeChange }: HeaderProps) {
  return (
    <header className="border-secondary/60 bg-background/95 relative z-20 flex h-16 items-center justify-between border-b px-4 backdrop-blur md:px-6">
      <div className="flex items-center gap-3">
        <button
          aria-label="返回首頁"
          className="text-muted hover:bg-surface hover:text-foreground grid size-9 place-items-center rounded-md transition-colors"
          onClick={onBack}
          type="button"
        >
          <ArrowLeft className="size-5" />
        </button>
        <span className="border-primary/40 bg-primary/10 text-primary grid size-8 place-items-center rounded-md border">
          <Box aria-hidden="true" className="size-4" />
        </span>
        <span className="hidden text-sm font-semibold tracking-[0.18em] sm:inline">
          HEXACALM
        </span>
      </div>

      <div className="bg-surface flex rounded-lg border border-white/10 p-1">
        <button
          className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            mode === "build"
              ? "bg-primary text-background"
              : "text-muted hover:text-foreground"
          }`}
          onClick={() => onModeChange("build")}
          type="button"
        >
          <Hammer className="size-4" />
          建造
        </button>
        <button
          className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            mode === "relax"
              ? "bg-primary text-background"
              : "text-muted hover:text-foreground"
          }`}
          onClick={() => onModeChange("relax")}
          type="button"
        >
          <Eye className="size-4" />
          放鬆
        </button>
      </div>
    </header>
  );
}

export default Header;
