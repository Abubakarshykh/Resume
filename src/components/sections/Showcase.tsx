"use client";

import { useEffect, useState } from "react";
import { PROJECTS } from "@/lib/data";
import { Eyebrow, GlassCard, Tag } from "../ui";
import { DEMOS } from "../demos/Demos";

export default function Showcase() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduce, setReduce] = useState(false);
  const p = PROJECTS[i];
  const Demo = DEMOS[p.id];

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  return (
    <section
      id="builds"
      className={`section band showcase ${paused ? "is-paused" : ""}`}
      aria-labelledby="builds-title"
    >
      <span className="band__glow" aria-hidden="true" style={{ right: "-8%", top: "-18%", width: 760, height: 620, background: "radial-gradient(closest-side, rgba(120,84,48,0.55), transparent)" }} />
      <span className="band__glow" aria-hidden="true" style={{ left: "-6%", bottom: "-12%", width: 640, height: 520, background: "radial-gradient(closest-side, rgba(110,72,38,0.4), transparent)" }} />
      <div className="wrap">
        <header className="section-head">
          <div>
            <Eyebrow>Selected work</Eyebrow>
            <h2 className="h-section" id="builds-title">
              Seven builds.
              <br />
              All of them running.
            </h2>
            <p className="showcase__sub">
              Each demo is a small simulation of how the project behaves. Hover a stage to pause it.
            </p>
          </div>
        </header>

        <div className="showcase__grid">
          <div
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <ul className="plist" aria-label="Projects">
              {PROJECTS.map((pr, idx) => {
                const on = idx === i;
                return (
                  <li key={pr.id}>
                    <button
                      type="button"
                      className={`plist__item ${on ? "is-active" : ""}`}
                      aria-current={on ? "true" : undefined}
                      onClick={() => setI(idx)}
                    >
                      <span className="plist__title">{pr.title}</span>
                      <span className="plist__meta">{pr.meta}</span>
                      {on && !reduce ? (
                        <span
                          key={`${pr.id}-bar`}
                          className="plist__bar"
                          onAnimationEnd={() => setI((v) => (v + 1) % PROJECTS.length)}
                        />
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>
            <p className="showcase__caption">Hover pauses · Advances every 9 s</p>
          </div>

          <GlassCard
            dark
            className="demo"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            role="region"
            aria-label={`${p.title} demo`}
          >
            <div className="demo__top">
              <span className="demo__dot" style={{ background: "#e0826a" }} />
              <span className="demo__dot" style={{ background: "#e0b45f" }} />
              <span className="demo__dot" style={{ background: "#8fbf7a" }} />
              <span className="demo__title">{p.title}</span>
              <span className="demo__badge">Illustrative demo</span>
            </div>
            <div className="demo__canvas">
              <Demo key={p.id} />
            </div>
            <h3 className="demo__name">{p.title}</h3>
            <p className="demo__desc">{p.desc}</p>
            <div className="demo__tags">
              {p.tags.map((t) => (
                <Tag key={t} dark>
                  {t}
                </Tag>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
