import { useEffect, useState, type ReactNode } from "react";
import { ArrowLeft, Leaf, Hammer } from "lucide-react";
import type { WorldMode } from "../../types";

interface HeaderProps {
  children: ReactNode;
  mode: WorldMode;
  onBack: () => void;
  onModeChange: (mode: WorldMode) => void;
}

const MODES = [
  { id: "build", label: "建造", Icon: Hammer },
  { id: "relax", label: "放鬆", Icon: Leaf },
] as const;

function Header({ children, mode, onBack, onModeChange }: HeaderProps) {
  const [showLabels, setShowLabels] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setShowLabels(false), 3000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <header className="pointer-events-none absolute inset-x-4 top-4 z-20 grid grid-cols-[1fr_auto] items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
      <div className="panel pointer-events-auto flex items-center gap-2 justify-self-start rounded-xl p-1 sm:pr-3.5">
        <button
          aria-label="返回首頁"
          className="text-muted hover:text-foreground hover:bg-hover grid size-9 place-items-center rounded-lg transition-colors"
          onClick={onBack}
          type="button"
        >
          <ArrowLeft className="size-4.5" />
        </button>
        <img
          alt=""
          className="size-7 object-contain"
          src={`${import.meta.env.BASE_URL}images/logo.webp`}
        />
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
                ? "bg-primary text-on-primary"
                : "text-muted hover:text-foreground hover:bg-hover"
            }`}
            key={id}
            onClick={() => onModeChange(id)}
            type="button"
          >
            <Icon className="size-4" />
            <span className={showLabels ? "inline" : "hidden sm:inline"}>
              {label}
            </span>
          </button>
        ))}
      </div>

      <div className="pointer-events-auto col-span-2 justify-self-end sm:col-span-1">
        {children}
      </div>
    </header>
  );
}

export default Header;
