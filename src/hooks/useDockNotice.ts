import { useCallback, useEffect, useRef, useState } from "react";
import type { DockNotice } from "../types/dockNotice";

const NOTICE_DURATION = 3000;
export const DOCK_NOTICE_ANIMATION_DURATION = 240;

export function useDockNotice() {
  const [notices, setNotices] = useState<DockNotice[]>([]);
  const nextId = useRef(0);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const showNotice = useCallback((message: string) => {
    const id = nextId.current++;
    setNotices((current) => [...current, { id, message, leaving: false }]);
    timers.current.set(
      id,
      setTimeout(() => {
        setNotices((current) =>
          current.map((notice) =>
            notice.id === id ? { ...notice, leaving: true } : notice,
          ),
        );
        timers.current.set(
          id,
          setTimeout(() => {
            setNotices((current) =>
              current.filter((notice) => notice.id !== id),
            );
            timers.current.delete(id);
          }, DOCK_NOTICE_ANIMATION_DURATION),
        );
      }, NOTICE_DURATION),
    );
  }, []);

  useEffect(() => {
    const activeTimers = timers.current;
    return () => {
      activeTimers.forEach(clearTimeout);
      activeTimers.clear();
    };
  }, []);

  return { notices, showNotice };
}
