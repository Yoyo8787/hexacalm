import {
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";

const MOBILE_QUERY = "(max-width: 639px)";
const MENU_ANIMATION_DURATION = 240;
const FOCUSABLE =
  'button:not(:disabled), input:not(:disabled):not([type="radio"]), input[type="radio"]:checked, [tabindex="0"]';

function subscribeMobile(listener: () => void) {
  const query = window.matchMedia(MOBILE_QUERY);
  query.addEventListener("change", listener);
  return () => query.removeEventListener("change", listener);
}

interface ResponsiveMenuProps {
  open: boolean;
  id?: string;
  label: string;
  trigger: RefObject<HTMLButtonElement | null>;
  onClose: () => void;
  desktopClassName: string;
  children: ReactNode;
}

function ResponsiveMenu({
  open,
  id,
  label,
  trigger,
  onClose,
  desktopClassName,
  children,
}: ResponsiveMenuProps) {
  const mobile = useSyncExternalStore(
    subscribeMobile,
    () => window.matchMedia(MOBILE_QUERY).matches,
  );
  const panel = useRef<HTMLElement>(null);
  const close = useEffectEvent(onClose);
  const [present, setPresent] = useState(open);

  useEffect(() => {
    if (open) {
      setPresent(true);
      return;
    }
    const timer = setTimeout(() => setPresent(false), MENU_ANIMATION_DURATION);
    return () => clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open || !present) return;
    const element = panel.current;
    const button = trigger.current;
    if (!element) return;
    const previousOverflow = document.body.style.overflow;
    if (mobile) document.body.style.overflow = "hidden";
    const selected = element.querySelector<HTMLInputElement>(
      'input[type="radio"]:checked',
    );
    (
      selected ??
      element.querySelector<HTMLElement>(FOCUSABLE) ??
      element
    ).focus();
    const outsideEvent = mobile ? "click" : "pointerdown";
    const onOutsideInteraction = (event: MouseEvent) => {
      if (
        event.target instanceof Node &&
        !element.contains(event.target) &&
        !button?.contains(event.target)
      )
        close();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        close();
      }
      if (!mobile || event.key !== "Tab") return;
      const items = Array.from(
        element.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((item) => item.getClientRects().length > 0);
      const first = items[0];
      const last = items.at(-1);
      if (!first) {
        event.preventDefault();
        element.focus();
      } else if (
        event.shiftKey &&
        (document.activeElement === first || document.activeElement === element)
      ) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener(outsideEvent, onOutsideInteraction);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener(outsideEvent, onOutsideInteraction);
      document.removeEventListener("keydown", onKeyDown);
      if (mobile) document.body.style.overflow = previousOverflow;
      button?.focus();
    };
  }, [open, present, mobile, trigger]);

  if (!present) return null;

  const content = (
    <section
      ref={panel}
      id={id}
      role="dialog"
      aria-modal={(mobile && open) || undefined}
      aria-hidden={!open}
      inert={!open}
      aria-label={label}
      data-mobile={mobile}
      data-above={desktopClassName.includes("bottom-full")}
      data-open={open}
      style={{ animationDuration: `${MENU_ANIMATION_DURATION}ms` }}
      tabIndex={-1}
      className={
        mobile
          ? "responsive-menu popover absolute inset-x-0 bottom-0 max-h-[85svh] overflow-y-auto rounded-t-[20px] px-5 pt-2.5 pb-[max(16px,env(safe-area-inset-bottom))] outline-none"
          : `responsive-menu popover outline-none ${desktopClassName}`
      }
    >
      {mobile && (
        <span className="bg-line mx-auto mb-4 block h-1 w-9 rounded-xs" />
      )}
      {children}
    </section>
  );
  return mobile
    ? createPortal(
        <div
          className="responsive-menu-scrim text-foreground fixed inset-0 z-40 bg-black/30"
          aria-hidden={!open}
          data-open={open}
          style={{ animationDuration: `${MENU_ANIMATION_DURATION}ms` }}
        >
          {content}
        </div>,
        document.body,
      )
    : content;
}

export default ResponsiveMenu;
