import type { ReactNode } from "react";
import { DOCK_NOTICE_ANIMATION_DURATION } from "../../hooks/useDockNotice";
import type { DockNotice } from "../../types/dockNotice";

interface DockFeedbackProps {
  bottom: string;
  hidden: boolean;
  notices: readonly DockNotice[];
  children: ReactNode;
}

function DockFeedback({
  bottom,
  hidden,
  notices,
  children,
}: DockFeedbackProps) {
  return (
    <div
      aria-hidden={hidden}
      className="pointer-events-none absolute left-1/2 z-10 flex w-max max-w-[calc(100%-2rem)] -translate-x-1/2 flex-col items-center"
      style={{ bottom }}
    >
      <div
        role="log"
        aria-live="polite"
        aria-relevant="additions"
        className={`w-full ${hidden ? "invisible" : ""}`}
      >
        {notices.map((notice) => (
          <div
            key={notice.id}
            aria-hidden={notice.leaving}
            className={`dock-notice ${notice.leaving ? "dock-notice-leaving" : ""}`}
            style={{ animationDuration: `${DOCK_NOTICE_ANIMATION_DURATION}ms` }}
          >
            <div className="min-h-0 overflow-hidden">
              <p className="panel mb-2 rounded-full px-3 py-2 text-center text-[13px] font-medium wrap-break-word shadow-none">
                {notice.message}
              </p>
            </div>
          </div>
        ))}
      </div>
      {notices.length === 0 && children}
    </div>
  );
}

export default DockFeedback;
