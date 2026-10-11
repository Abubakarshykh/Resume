"use client";

import { useEffect, useState } from "react";
import { Button, GlassCard } from "../ui";

const LINKS = [
  { id: "builds", label: "Builds" },
  { id: "stack", label: "Stack" },
  { id: "journey", label: "Journey" },
  { id: "contact", label: "Contact" },
];

export default function Nav() {
  const [active, setActive] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
  }, []);

  useEffect(() => {
    const els = LINKS.map((l) => document.getElementById(l.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* storage unavailable */
    }
  };

  return (
    <nav className="nav" aria-label="Main">
      <GlassCard radius="full" className="nav__pill">
        <a href="#top" className="nav__logo" aria-label="Muhammad Abubakar, back to top">
          M.A
        </a>
        <ul className="nav__links">
          {LINKS.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                className={`nav__link ${active === l.id ? "is-active" : ""}`}
                aria-current={active === l.id ? "true" : undefined}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="nav__theme glass glass--full"
          onClick={toggle}
          aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          aria-pressed={theme === "dark"}
        >
          <span className="nav__theme-dot" />
        </button>
        <Button href="#contact" size="nav">
          Say hi
        </Button>
      </GlassCard>
    </nav>
  );
}
