import type { ReactNode } from "react";
import { ArrowLeft, Box, Eye, Hammer } from "lucide-react";
import type { WorldMode } from "../../types";

interface HeaderProps {
  children: ReactNode;
  mode: WorldMode;
  onBack: () => void;
  onModeChange: (mode: WorldMode) => void;
}

const MODES = [
  { id: "build", label: "建造", Icon: Hammer },
  { id: "relax", label: "放鬆", Icon: Eye },
] as const;

function Header({ children, mode, onBack, onModeChange }: HeaderProps) {
  return (
    <header className="pointer-events-none absolute inset-x-4 top-4 z-20 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
      <div className="panel pointer-events-auto flex items-center gap-2 justify-self-start rounded-xl p-1 sm:pr-3.5">
        <button
          aria-label="返回首頁"
          className="text-muted hover:text-foreground grid size-9 place-items-center rounded-lg transition-colors hover:bg-white/7"
          onClick={onBack}
          type="button"
        >
          <ArrowLeft className="size-4.5" />
        </button>
        <span className="bg-primary/16 text-primary grid size-7 place-items-center rounded-[7px]">
          <Box aria-hidden="true" className="size-3.75" />
        </span>
        <span className="hidden text-[13px] font-semibold tracking-[0.18em] sm:inline">
          HEXACALM
        </span>
      </div>

      <div className="panel pointer-events-auto flex gap-0.5 rounded-xl p-1">
        {MODES.map(({ id, label, Icon }) => (
          <button
            aria-label={label}
            aria-pressed={mode === id}
            className={`flex h-9 items-center gap-2 rounded-lg px-2.5 text-sm font-medium transition-colors sm:px-3.5 ${
              mode === id
                ? "bg-primary text-background"
                : "text-muted hover:text-foreground hover:bg-white/7"
            }`}
            key={id}
            onClick={() => onModeChange(id)}
            type="button"
          >
            <Icon className="size-4" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      <div className="pointer-events-auto justify-self-end">{children}</div>
    </header>
  );
}

export default Header;
