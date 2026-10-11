"use client";

import { useEffect, useRef, useState } from "react";
import { PROFILE, RINGS } from "@/lib/data";
import { Blobs, Button, Eyebrow, GlassCard, StoryRing } from "../ui";
import StoryViewer from "../StoryViewer";

/* Live Islamabad time, updates every second */
function Clock() {
  const [t, setT] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Karachi",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const tick = () => setT(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="chip chip--clock glass glass--full" role="group" aria-label="Local time in Islamabad">
      <span className="live-dot" aria-hidden="true" />
      <span>Islamabad</span>
      <span className="chip__time">{t || "--:--:--"}</span>
      <span>PKT</span>
    </div>
  );
}

/* Hero name: letter weight swells near the cursor */
function HeroName() {
  const letters = useRef<(HTMLSpanElement | null)[]>([]);
  const wrap = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    const BASE = 300;
    const MAX = 800;
    // follows the cursor ring size set in globals.css (--cursor-ring-play)
    const ringPx = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--cursor-ring-play")) || 240;
    const RING = ringPx / 2;
    const REACH = ringPx * 0.9;
    let raf = 0;
    let px = -9999;
    let py = -9999;

    const apply = () => {
      raf = 0;
      letters.current.forEach((el) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const d = Math.hypot(r.left + r.width / 2 - px, r.top + r.height / 2 - py);
        const t = Math.max(0, 1 - d / REACH);
        const w = Math.round(BASE + (MAX - BASE) * t * t);
        el.style.fontWeight = String(w);
        el.style.color = d < RING ? "var(--copper)" : "";
      });
    };
    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      px = -9999;
      py = -9999;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  let idx = 0;
  const line = (text: string) => (
    <span className="hero-name__line" aria-hidden="true">
      {text.split("").map((ch) => {
        const i = idx++;
        return (
          <span
            key={i}
            ref={(el) => {
              letters.current[i] = el;
            }}
            className="hero-name__letter"
          >
            {ch}
          </span>
        );
      })}
    </span>
  );

  return (
    <h1
      ref={wrap}
      className="hero-name"
      data-cursor="play"
      aria-label={PROFILE.name}
    >
      {line(PROFILE.firstLine)}
      {line(PROFILE.secondLine)}
    </h1>
  );
}

export default function Hero() {
  const [story, setStory] = useState<number | null>(null);

  return (
    <section id="top" className="hero" aria-label="Introduction">
      <Blobs
        items={[
          { color: "caramel", x: "-12%", y: "-18%", size: 780 },
          { color: "stone", x: "62%", y: "-12%", size: 700 },
          { color: "honey", x: "78%", y: "52%", size: 560 },
          { color: "caramel", x: "-6%", y: "62%", size: 520 },
        ]}
      />
      <div className="wrap hero__inner">
        <div className="hero__chips">
          <span className="chip glass glass--full">Full Stack Engineer</span>
          <span className="chip glass glass--full">Python &amp; AI automation</span>
          <Clock />
        </div>

        <Eyebrow muted className="hero__tap">
          Tap a ring for the quick tour
        </Eyebrow>
        <div className="hero__tour">
          <div className="hero__rings">
            {RINGS.map((r, i) => (
              <StoryRing key={r.key} short={r.short} label={r.label} onClick={() => setStory(i)} />
            ))}
          </div>
          <p className="hero__hint chip glass glass--full">Letters swell near the cursor</p>
        </div>

        <HeroName />

        <div className="hero__bottom">
          <div className="hero__copy">
            <p className="lead">{PROFILE.lead}</p>
            <div className="hero__buttons">
              <Button href="#builds">Watch the builds</Button>
              <Button href="#contact" variant="secondary">
                Start a conversation
              </Button>
            </div>
          </div>
          <GlassCard className="availability">
            <p className="availability__eyebrow">
              <span className="live-dot" aria-hidden="true" /> Availability
            </p>
            <p className="availability__title">Open to full-time or contract</p>
            <p className="availability__meta">
              {PROFILE.location}
              <span aria-hidden="true">·</span>
              {PROFILE.school}
            </p>
          </GlassCard>
        </div>
      </div>

      {story !== null ? (
        <StoryViewer
          ringIndex={story}
          onClose={() => setStory(null)}
          onRing={(i) => setStory(i)}
        />
      ) : null}
    </section>
  );
}
