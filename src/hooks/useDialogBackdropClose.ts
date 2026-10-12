import { useRef, type PointerEvent } from "react";

function outsideDialog(event: PointerEvent<HTMLDialogElement>) {
  const bounds = event.currentTarget.getBoundingClientRect();
  return (
    event.target === event.currentTarget &&
    (event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom)
  );
}

export function useDialogBackdropClose() {
  const backdropPointer = useRef<number | null>(null);
  return {
    onPointerDown: (event: PointerEvent<HTMLDialogElement>) => {
      backdropPointer.current =
        event.button === 0 && outsideDialog(event) ? event.pointerId : null;
    },
    onPointerUp: (event: PointerEvent<HTMLDialogElement>) => {
      const startedOutside = backdropPointer.current === event.pointerId;
      backdropPointer.current = null;
      if (startedOutside && outsideDialog(event)) event.currentTarget.close();
    },
    onPointerCancel: () => {
      backdropPointer.current = null;
    },
  };
}
