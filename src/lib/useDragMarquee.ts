import { useEffect, useRef } from "react";

/**
 * Drag-enabled infinite marquee.
 *
 * The track element must contain its items rendered TWICE (the content
 * duplicated) so we can seamlessly wrap by taking `scrollWidth / 2`.
 *
 * - Auto-scrolls continuously to the left at `speed` px/sec.
 * - Pointer/touch drag pauses auto-scroll and lets the user scrub.
 * - On release, auto-scroll resumes from the current offset.
 */
export function useDragMarquee(speed = 40) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const offsetRef = useRef(0);
  const draggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, offset: 0 });
  const lastTsRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const activePointerRef = useRef<number | null>(null);

  useEffect(() => {
    const tick = (ts: number) => {
      const track = trackRef.current;
      if (track) {
        const half = track.scrollWidth / 2;
        if (lastTsRef.current != null && !draggingRef.current && half > 0) {
          const dt = (ts - lastTsRef.current) / 1000;
          offsetRef.current += speed * dt;
        }
        if (half > 0) {
          let off = offsetRef.current;
          if (off >= half) off -= half * Math.floor(off / half);
          if (off < 0) off += half * (Math.floor(-off / half) + 1);
          offsetRef.current = off;
          track.style.transform = `translate3d(${-off}px, 0, 0)`;
        }
      }
      lastTsRef.current = ts;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTsRef.current = null;
    };
  }, [speed]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerRef.current !== null) return;
    activePointerRef.current = e.pointerId;
    draggingRef.current = true;
    dragStartRef.current = { x: e.clientX, offset: offsetRef.current };
    try {
      (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current || activePointerRef.current !== e.pointerId)
      return;
    const dx = e.clientX - dragStartRef.current.x;
    offsetRef.current = dragStartRef.current.offset - dx;
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerRef.current !== e.pointerId) return;
    draggingRef.current = false;
    activePointerRef.current = null;
    try {
      (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  return {
    trackRef,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
      onPointerLeave: endDrag,
    },
  };
}
