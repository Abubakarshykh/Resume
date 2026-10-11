"use client";

import { useEffect, useRef } from "react";
import { CHIPS, STACK_COLUMNS } from "@/lib/data";
import { CHIP_ICONS } from "../icons";
import { Blobs, SectionHeader, TechChip } from "../ui";

const SIZE = 72;
const R = SIZE / 2;
const GAP = 24;

type Body = {
  el: HTMLDivElement;
  x: number; // centre
  y: number;
  vx: number;
  vy: number;
  rot: number;
  baseRot: number;
  drag: boolean;
};

/** Small deterministic PRNG so the first layout is stable between loads. */
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

export default function Stack() {
  const panel = useRef<HTMLDivElement>(null);
  const mark = useRef<HTMLDivElement>(null);
  const chipEls = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const host = panel.current;
    if (!host) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const bodies: Body[] = [];
    let W = host.clientWidth;
    let H = host.clientHeight;
    let raf = 0;
    const ptr = { x: -9999, y: -9999, inside: false };
    const REPEL = 120;

    /* ---------- initial layout: 24px apart, away from edges and the watermark ---------- */
    const layout = () => {
      W = host.clientWidth;
      const narrow = W < 700;
      const pitch = SIZE + GAP;
      const cols = Math.max(1, Math.floor((W - 2 * GAP + GAP) / pitch));
      if (narrow) {
        const rows = Math.ceil(CHIPS.length / cols);
        host.style.height = `${rows * pitch + GAP * 2}px`;
      } else {
        host.style.height = "520px";
      }
      H = host.clientHeight;
      const rand = rng(11);

      const m = mark.current?.getBoundingClientRect();
      const hr = host.getBoundingClientRect();
      const wm = m && !narrow
        ? { l: m.left - hr.left - 12, r: m.right - hr.left + 12, t: m.top - hr.top + 24, b: m.bottom - hr.top - 24 }
        : null;

      const slots: { x: number; y: number }[] = [];
      const gx = (W - (cols * pitch - GAP)) / 2 + R;
      const rowsFit = Math.max(1, Math.floor((H - GAP * 2 + GAP) / pitch));
      const gy = (H - (rowsFit * pitch - GAP)) / 2 + R;
      for (let r = 0; r < rowsFit; r++) {
        for (let c = 0; c < cols; c++) {
          const x = gx + c * pitch;
          const y = gy + r * pitch;
          if (wm && x + R > wm.l && x - R < wm.r && y + R > wm.t && y - R < wm.b) continue;
          slots.push({ x, y });
        }
      }
      // shuffle, then pick enough slots
      for (let i = slots.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [slots[i], slots[j]] = [slots[j], slots[i]];
      }
      const pick = slots.length >= CHIPS.length ? slots.slice(0, CHIPS.length) : null;

      CHIPS.forEach((_, i) => {
        const el = chipEls.current[i];
        if (!el) return;
        const base = pick ? pick[i] : { x: gx + (i % cols) * pitch, y: gy + Math.floor(i / cols) * pitch };
        // jitter stays inside the 24px gap budget (max 10px each way is 20px, plus gap 24 => >= 4px between chips worst case,
        // so keep jitter small to preserve the spacing rule)
        const jx = (rand() - 0.5) * 8;
        const jy = (rand() - 0.5) * 8;
        const rot = (rand() - 0.5) * 16;
        const existing = bodies[i];
        if (existing) {
          existing.x = base.x + jx;
          existing.y = base.y + jy;
          existing.vx = existing.vy = 0;
          existing.baseRot = existing.rot = rot;
        } else {
          bodies[i] = { el, x: base.x + jx, y: base.y + jy, vx: 0, vy: 0, rot, baseRot: rot, drag: false };
        }
      });
      draw();
    };

    const draw = () => {
      bodies.forEach((b) => {
        b.el.style.transform = `translate3d(${b.x - R}px, ${b.y - R}px, 0) rotate(${b.rot}deg)`;
      });
    };

    /* ---------- physics ---------- */
    const step = () => {
      for (const b of bodies) {
        if (b.drag) continue;
        if (ptr.inside) {
          const dx = b.x - ptr.x;
          const dy = b.y - ptr.y;
          const d = Math.hypot(dx, dy);
          if (d < REPEL && d > 0.01) {
            const f = ((REPEL - d) / REPEL) * 1.1;
            b.vx += (dx / d) * f;
            b.vy += (dy / d) * f;
          }
        }
        b.vx *= 0.965;
        b.vy *= 0.965;
        b.x += b.vx;
        b.y += b.vy;
        // walls
        if (b.x < R) { b.x = R; b.vx = Math.abs(b.vx) * 0.7; }
        if (b.x > W - R) { b.x = W - R; b.vx = -Math.abs(b.vx) * 0.7; }
        if (b.y < R) { b.y = R; b.vy = Math.abs(b.vy) * 0.7; }
        if (b.y > H - R) { b.y = H - R; b.vy = -Math.abs(b.vy) * 0.7; }
        // ease rotation back, nudged by speed
        b.rot += (b.baseRot + b.vx * 2.5 - b.rot) * 0.08;
      }
      // chip vs chip
      for (let i = 0; i < bodies.length; i++) {
        for (let j = i + 1; j < bodies.length; j++) {
          const a = bodies[i];
          const c = bodies[j];
          const dx = c.x - a.x;
          const dy = c.y - a.y;
          const d = Math.hypot(dx, dy);
          const min = SIZE - 4;
          if (d < min && d > 0.01) {
            const push = (min - d) / 2;
            const nx = dx / d;
            const ny = dy / d;
            if (!a.drag) { a.x -= nx * push; a.y -= ny * push; a.vx -= nx * 0.3; a.vy -= ny * 0.3; }
            if (!c.drag) { c.x += nx * push; c.y += ny * push; c.vx += nx * 0.3; c.vy += ny * 0.3; }
          }
        }
      }
      draw();
      raf = requestAnimationFrame(step);
    };

    /* ---------- pointer: drag + throw ---------- */
    let dragging: Body | null = null;
    let offX = 0;
    let offY = 0;
    let lastX = 0;
    let lastY = 0;
    let lastT = 0;

    const local = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onDown = (e: PointerEvent) => {
      const t = (e.target as HTMLElement).closest(".tech-chip") as HTMLDivElement | null;
      if (!t) return;
      const b = bodies.find((q) => q.el === t);
      if (!b) return;
      const p = local(e);
      dragging = b;
      b.drag = true;
      b.vx = b.vy = 0;
      offX = b.x - p.x;
      offY = b.y - p.y;
      lastX = p.x;
      lastY = p.y;
      lastT = performance.now();
      t.classList.add("is-dragging");
      t.setPointerCapture(e.pointerId);
      e.preventDefault();
    };
    const onMove = (e: PointerEvent) => {
      const p = local(e);
      ptr.x = p.x;
      ptr.y = p.y;
      ptr.inside = true;
      if (!dragging) return;
      const now = performance.now();
      const dt = Math.max(1, now - lastT);
      dragging.vx = ((p.x - lastX) / dt) * 16;
      dragging.vy = ((p.y - lastY) / dt) * 16;
      lastX = p.x;
      lastY = p.y;
      lastT = now;
      dragging.x = Math.min(W - R, Math.max(R, p.x + offX));
      dragging.y = Math.min(H - R, Math.max(R, p.y + offY));
      if (reduce) draw();
    };
    const onUp = () => {
      if (!dragging) return;
      dragging.el.classList.remove("is-dragging");
      dragging.drag = false;
      const cap = 28;
      dragging.vx = Math.max(-cap, Math.min(cap, dragging.vx));
      dragging.vy = Math.max(-cap, Math.min(cap, dragging.vy));
      if (reduce) { dragging.vx = dragging.vy = 0; }
      dragging = null;
    };
    const onLeave = () => {
      ptr.inside = false;
    };

    layout();
    if (!reduce) raf = requestAnimationFrame(step);
    host.addEventListener("pointerdown", onDown);
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerup", onUp);
    host.addEventListener("pointercancel", onUp);
    host.addEventListener("pointerleave", onLeave);
    const ro = new ResizeObserver(() => {
      if (Math.abs(host.clientWidth - W) > 1) layout();
    });
    ro.observe(host);
    document.fonts?.ready.then(() => layout());

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      host.removeEventListener("pointerdown", onDown);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerup", onUp);
      host.removeEventListener("pointercancel", onUp);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <section id="stack" className="section" aria-labelledby="stack-title">
      <Blobs
        items={[
          { color: "caramel", x: "-10%", y: "30%", size: 760 },
          { color: "stone", x: "62%", y: "-6%", size: 720 },
          { color: "honey", x: "40%", y: "70%", size: 460 },
        ]}
      />
      <div className="wrap">
        <SectionHeader
          eyebrow="The stack"
          title="Everything I ship with"
          caption="Push them. Drag them. Throw them."
          id="stack-title"
        />
        <div
          className="glass stack-panel"
          data-cursor="drag"
          role="group"
          aria-label="Tech chips you can drag and throw. The same list is written out below."
          ref={panel}
        >
          <div className="stack-panel__mark" ref={mark} aria-hidden="true">
            STACK
          </div>
          {CHIPS.map((c, i) => (
            <TechChip
              key={c}
              label={c}
              icon={CHIP_ICONS[c]}
              ref={(el) => {
                chipEls.current[i] = el;
              }}
            />
          ))}
        </div>
        <div className="stack-cols">
          {STACK_COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="stack-cols__title">{col.title}</h3>
              <ul>
                {col.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
