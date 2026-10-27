"use client";

import { useEffect, useState } from "react";

/** Returns a counter that increments every `ms`. Stays at 0 when the user prefers reduced motion. */
export function useTick(ms: number, startAt = 0) {
  const [n, setN] = useState(startAt);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tick = () => setN((v) => v + 1);
    let gap = document.documentElement.dataset.mix === "on" ? Math.max(16, ms / 3) : ms;
    let id = setInterval(tick, gap);
    const sync = () => {
      const next = document.documentElement.dataset.mix === "on" ? Math.max(16, ms / 3) : ms;
      if (next === gap) return;
      gap = next;
      clearInterval(id);
      id = setInterval(tick, gap);
    };
    const obs = new MutationObserver(sync);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-mix"] });
    return () => {
      clearInterval(id);
      obs.disconnect();
    };
  }, [ms]);
  return n;
}
