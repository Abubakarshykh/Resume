"use client";

import { useEffect, useRef } from "react";

/**
 * Copper custom cursor. Fine pointers only.
 *  - data-cursor="play" / "drag" zones show the ring + chip.
 *  - Over buttons and links a soft ring grows around the pointer, and the
 *    button leans toward the pointer (magnetic). Sizes: --cursor-* in globals.css.
 * The ring never tints or hides content, and the native cursor stays on buttons.
 */
const INTERACTIVE = "a[href], button:not([disabled]), .btn, [role='button']";
const MAGNETIC = ".btn, .quick, .nav__theme, .story-ring, .chat__send, .plist__item, .nav__link, .companion-panel__close";
const PULL = 0.2; // how far a button leans toward the pointer (0 = off)
const MAX_PULL = 8; // px

export default function Cursor() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const html = document.documentElement;
    html.classList.add("has-cursor");

    let tx = -999;
    let ty = -999;
    let x = -999;
    let y = -999;
    let mode = "";
    let hover = "";
    let magnet: HTMLElement | null = null;
    let raf = 0;
    let sraf = 0;

    const setMode = (m: string) => {
      if (m === mode) return;
      mode = m;
      html.dataset.cursor = m;
    };
    const setHover = (h: string) => {
      if (h === hover) return;
      hover = h;
      html.dataset.hover = h;
    };
    const release = () => {
      if (!magnet) return;
      magnet.style.removeProperty("--mx");
      magnet.style.removeProperty("--my");
      magnet.style.removeProperty("--ms");
      magnet = null;
    };

    const inspect = (target: Element | null) => {
      let zone = target?.closest?.("[data-cursor]") as HTMLElement | null;
      if (zone === html) zone = null; // <html> carries the current mode itself
      setMode(zone?.dataset.cursor ?? "");
      const hit = target?.closest?.(INTERACTIVE) as HTMLElement | null;
      setHover(hit ? "link" : "");
      if (!reduce && hit) {
        const m = (hit.matches(MAGNETIC) ? hit : (hit.closest(MAGNETIC) as HTMLElement | null)) ?? null;
        if (m !== magnet) release();
        if (m) {
          magnet = m;
          const r = m.getBoundingClientRect();
          const dx = Math.max(-MAX_PULL, Math.min(MAX_PULL, (tx - (r.left + r.width / 2)) * PULL));
          const dy = Math.max(-MAX_PULL, Math.min(MAX_PULL, (ty - (r.top + r.height / 2)) * PULL));
          m.style.setProperty("--mx", `${dx.toFixed(1)}px`);
          m.style.setProperty("--my", `${dy.toFixed(1)}px`);
          m.style.setProperty("--ms", "1.04");
        }
      } else {
        release();
      }
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      tx = e.clientX;
      ty = e.clientY;
      inspect(e.target as Element | null);
    };
    const onLeave = () => {
      setMode("");
      setHover("");
      release();
    };
    // The pointer does not move while the page scrolls, so re-check what is under it.
    const refresh = () => {
      sraf = 0;
      if (tx < -900) return;
      inspect(document.elementFromPoint(tx, ty));
    };
    const onScroll = () => {
      if (!sraf) sraf = requestAnimationFrame(refresh);
    };

    const loop = () => {
      const k = reduce ? 1 : 0.22;
      if (x < -900) {
        x = tx;
        y = ty;
      }
      x += (tx - x) * k;
      y += (ty - y) * k;
      if (root.current) root.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(sraf);
      release();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      html.classList.remove("has-cursor");
      delete html.dataset.cursor;
      delete html.dataset.hover;
    };
  }, []);

  return (
    <div className="cursor" ref={root} aria-hidden="true">
      <div className="cursor__ring-play" />
      <div className="cursor__dot" />
      <div className="cursor__play">Play</div>
      <div className="cursor__ring-drag" />
      <div className="cursor__drag">Drag</div>
      <div className="cursor__link" />
    </div>
  );
}
