"use client";

import { useEffect, useState } from "react";

/** Returns a counter that increments every `ms`. Stays at 0 when the user prefers reduced motion. */
export function useTick(ms: number, startAt = 0) {
  const [n, setN] = useState(startAt);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setN((v) => v + 1), ms);
    return () => clearInterval(id);
  }, [ms]);
  return n;
}
