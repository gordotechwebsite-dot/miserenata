import { useEffect, useRef } from "react";

/**
 * Drag-enabled infinite marquee with momentum.
 *
 * Usage:
 *   const { containerRef, trackRef } = useDragMarquee(80);
 *   <div ref={containerRef} style={{ touchAction: "pan-y" }}>
 *     <div ref={trackRef}>...items rendered TWICE (duplicated)...</div>
 *   </div>
 *
 * - Auto-scrolls continuously to the left at `speed` px/sec.
 * - Pointer/touch drag pauses auto-scroll and lets the user scrub.
 * - On release, pointer velocity decays smoothly (inertia) before blending
 *   back into the base auto-scroll.
 * - Uses native listeners with passive:false so horizontal drags don't fight
 *   the browser's touch-action heuristics.
 */
export function useDragMarquee(speed = 80) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const offsetRef = useRef(0);
  const velocityRef = useRef(0); // extra track velocity from drag inertia (px/s)
  const draggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, offset: 0 });
  const lastMoveRef = useRef({ x: 0, t: 0 });
  const directionLockedRef = useRef<null | "h" | "v">(null);
  const lastTsRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const activePointerRef = useRef<number | null>(null);

  useEffect(() => {
    const tick = (ts: number) => {
      const track = trackRef.current;
      if (track) {
        const half = track.scrollWidth / 2;
        if (lastTsRef.current != null && half > 0) {
          const dt = Math.min((ts - lastTsRef.current) / 1000, 0.05);
          if (!draggingRef.current) {
            const effective = speed + velocityRef.current;
            offsetRef.current += effective * dt;
            velocityRef.current *= Math.max(0, 1 - dt * 2.2);
            if (Math.abs(velocityRef.current) < 1) velocityRef.current = 0;
          }
          let off = offsetRef.current;
          off = ((off % half) + half) % half;
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

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onDown = (e: PointerEvent) => {
      if (activePointerRef.current !== null) return;
      activePointerRef.current = e.pointerId;
      draggingRef.current = false;
      directionLockedRef.current = null;
      velocityRef.current = 0;
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        offset: offsetRef.current,
      };
      lastMoveRef.current = { x: e.clientX, t: performance.now() };
      try {
        el.setPointerCapture(e.pointerId);
      } catch {
        /* noop */
      }
    };

    const onMove = (e: PointerEvent) => {
      if (activePointerRef.current !== e.pointerId) return;

      const dxTotal = e.clientX - dragStartRef.current.x;
      const dyTotal = e.clientY - dragStartRef.current.y;

      if (directionLockedRef.current == null) {
        const THRESHOLD = 6;
        if (Math.abs(dxTotal) < THRESHOLD && Math.abs(dyTotal) < THRESHOLD)
          return;
        directionLockedRef.current =
          Math.abs(dxTotal) > Math.abs(dyTotal) ? "h" : "v";
        if (directionLockedRef.current === "h") {
          draggingRef.current = true;
        } else {
          try {
            el.releasePointerCapture(e.pointerId);
          } catch {
            /* noop */
          }
          activePointerRef.current = null;
          return;
        }
      }

      if (!draggingRef.current) return;
      e.preventDefault();
      offsetRef.current = dragStartRef.current.offset - dxTotal;

      const now = performance.now();
      const dt = (now - lastMoveRef.current.t) / 1000;
      if (dt > 0.004) {
        const fingerV = (e.clientX - lastMoveRef.current.x) / dt;
        const trackV = -fingerV;
        velocityRef.current = velocityRef.current * 0.35 + trackV * 0.65;
        lastMoveRef.current = { x: e.clientX, t: now };
      }
    };

    const onEnd = (e: PointerEvent) => {
      if (activePointerRef.current !== e.pointerId) return;
      if (draggingRef.current) {
        velocityRef.current = velocityRef.current - speed;
        const MAX = 2400;
        if (velocityRef.current > MAX) velocityRef.current = MAX;
        if (velocityRef.current < -MAX) velocityRef.current = -MAX;
      }
      draggingRef.current = false;
      directionLockedRef.current = null;
      activePointerRef.current = null;
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {
        /* noop */
      }
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove, { passive: false });
    el.addEventListener("pointerup", onEnd);
    el.addEventListener("pointercancel", onEnd);

    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onEnd);
      el.removeEventListener("pointercancel", onEnd);
    };
  }, [speed]);

  return { containerRef, trackRef };
}
