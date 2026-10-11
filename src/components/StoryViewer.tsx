"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { RINGS, STORIES } from "@/lib/data";

const SLIDE_MS = 5000;

export default function StoryViewer({
  ringIndex,
  onClose,
  onRing,
}: {
  ringIndex: number;
  onClose: () => void;
  onRing: (i: number) => void;
}) {
  const ring = RINGS[ringIndex];
  const slides = STORIES[ring.key];
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduce, setReduce] = useState(false);
  const downAt = useRef(0);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const opener = useRef<Element | null>(null);

  useEffect(() => {
    setSlide(0);
  }, [ringIndex]);

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    opener.current = document.activeElement;
    closeBtn.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
      (opener.current as HTMLElement | null)?.focus?.();
    };
  }, []);

  const next = useCallback(() => {
    if (slide < slides.length - 1) setSlide(slide + 1);
    else if (ringIndex < RINGS.length - 1) onRing(ringIndex + 1);
    else onClose();
  }, [slide, slides.length, ringIndex, onRing, onClose]);

  const prev = useCallback(() => {
    if (slide > 0) setSlide(slide - 1);
    else if (ringIndex > 0) onRing(ringIndex - 1);
  }, [slide, ringIndex, onRing]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, onClose]);

  const s = slides[slide];

  const node = (
    <div
      className="story-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={`Quick tour: ${ring.label}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="story">
        <div className="story__bars" aria-hidden="true">
          {slides.map((_, i) => (
            <span key={`${ringIndex}-${i}`} className="story__bar">
              <span
                className={`story__fill ${i < slide ? "is-done" : ""} ${i === slide ? "is-run" : ""} ${
                  paused ? "is-paused" : ""
                }`}
                style={{ animationDuration: `${SLIDE_MS}ms` }}
                onAnimationEnd={i === slide && !reduce ? next : undefined}
              />
            </span>
          ))}
        </div>
        <div className="story__top">
          <span className="story__who">M.A · {ring.label}</span>
          <button ref={closeBtn} type="button" className="story__close" onClick={onClose} aria-label="Close tour">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div
          className="story__body"
          onPointerDown={() => {
            downAt.current = Date.now();
            setPaused(true);
          }}
          onPointerUp={(e) => {
            setPaused(false);
            if (Date.now() - downAt.current < 250) {
              const r = e.currentTarget.getBoundingClientRect();
              if (e.clientX - r.left < r.width / 3) prev();
              else next();
            }
          }}
          onPointerLeave={() => setPaused(false)}
          onPointerCancel={() => setPaused(false)}
        >
          <p className="eyebrow">{s.eyebrow}</p>
          <h2 className="story__title">{s.title}</h2>
          <div className="story__lines" aria-live="polite">
            {s.lines.map((l, i) => (
              <p key={i}>{l}</p>
            ))}
          </div>
        </div>

        <div className="story__nav">
          <button type="button" className="story__arrow" onClick={prev} aria-label="Previous">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M11 3L5 9l6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <span className="story__hint">Tap right or left · hold to pause</span>
          <button type="button" className="story__arrow" onClick={next} aria-label="Next">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M7 3l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document === "undefined" ? null : createPortal(node, document.body);
}
