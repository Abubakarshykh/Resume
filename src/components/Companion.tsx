"use client";

import { useEffect, useRef, useState } from "react";
import { PROFILE } from "@/lib/data";
import { CHATBOT, guideSection, localAnswer } from "@/lib/chatbot";

type Mode = "wander" | "wake" | "talk";
type Mood = "calm" | "hype" | "think";
type Msg = { id: number; from: "them" | "me"; text?: string; card?: boolean };

const SIZE = 72;
const MIX_MS = 2800;
const IDLE_MS = 14000;
const GREETING = [
  "Hey. I'm Normie — the studio AI on this page.",
  "Ask about the builds, stack, or work. Pick a chip or type.",
];

function playMixPad(ms: number) {
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AC) return () => {};
  const ctx = new AC();
  const master = ctx.createGain();
  master.gain.value = 0.05;
  master.connect(ctx.destination);
  const notes = [196, 247, 294, 392];
  const now = ctx.currentTime;
  const dur = ms / 1000;
  notes.forEach((f, i) => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = i % 2 ? "triangle" : "sine";
    o.frequency.value = f;
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.12, now + 0.18);
    g.gain.exponentialRampToValueAtTime(0.001, now + dur);
    o.connect(g).connect(master);
    o.start(now);
    o.stop(now + dur + 0.05);
  });
  return () => {
    master.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    window.setTimeout(() => ctx.close().catch(() => {}), 200);
  };
}

function Face({ mood }: { mood: Mood }) {
  const smile = mood === "hype" ? "M28 44 Q36 52 44 44" : mood === "think" ? "M30 44 Q36 46 42 44" : "M30 44 Q36 50 42 44";
  return (
    <svg className="companion__face" viewBox="0 0 72 72" aria-hidden="true">
      <path d="M18 30 Q36 10 54 30" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <rect x="8" y="26" width="14" height="20" rx="7" fill="currentColor" />
      <rect x="50" y="26" width="14" height="20" rx="7" fill="currentColor" />
      <circle className="companion__cup-glow" cx="15" cy="36" r="5" />
      <circle className="companion__cup-glow" cx="57" cy="36" r="5" />
      <circle cx="30" cy="34" r={mood === "hype" ? 3.2 : 2.6} fill="currentColor" />
      <circle cx="42" cy="34" r={mood === "think" ? 2 : 2.6} fill="currentColor" />
      {mood === "hype" ? (
        <>
          <ellipse cx="24" cy="40" rx="4" ry="2.2" fill="#e0826a" opacity="0.55" />
          <ellipse cx="48" cy="40" rx="4" ry="2.2" fill="#e0826a" opacity="0.55" />
        </>
      ) : null}
      <path d={smile} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export default function Companion() {
  const orb = useRef<HTMLButtonElement>(null);
  const log = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const nextId = useRef(10);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const modeRef = useRef<Mode>("wander");
  const lastAct = useRef(0);
  const pointer = useRef({ x: -9999, y: -9999 });
  const pulse = useRef(0);

  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState<Mode>("wander");
  const [mood, setMood] = useState<Mood>("calm");
  const [docked, setDocked] = useState(false);
  const [hint, setHint] = useState(true);
  const [msgs, setMsgs] = useState<Msg[]>(GREETING.map((text, i) => ({ id: i + 1, from: "them" as const, text })));
  const [used, setUsed] = useState<string[]>([]);
  const [typing, setTyping] = useState(false);
  const [text, setText] = useState("");

  const setModeBoth = (m: Mode) => {
    modeRef.current = m;
    setMode(m);
  };

  useEffect(() => {
    setReady(true);
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setDocked(!fine || reduce);
    lastAct.current = performance.now();
    const hide = window.setTimeout(() => setHint(false), 7000);
    return () => clearTimeout(hide);
  }, []);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    const el = log.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs, typing, mode]);

  useEffect(() => {
    if (mode === "talk") {
      const id = window.setTimeout(() => input.current?.focus(), 80);
      return () => clearTimeout(id);
    }
  }, [mode]);

  useEffect(() => {
    if (!ready) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const html = document.documentElement;
    const el = orb.current;
    if (!el) return;

    const w = () => window.innerWidth;
    const h = () => window.innerHeight;
    const park = () => ({ x: w() - SIZE - 20, y: h() - SIZE - 20 });
    const start = park();
    let x = start.x;
    let y = Math.max(120, h() * 0.28);
    let vx = 0.45;
    let vy = 0.28;
    let tx = x;
    let ty = y;
    let raf = 0;
    let retargetAt = 0;

    const clamp = () => {
      const maxX = w() - SIZE - 12;
      const maxY = h() - SIZE - 12;
      if (x < 12) {
        x = 12;
        vx = Math.abs(vx);
      }
      if (y < 96) {
        y = 96;
        vy = Math.abs(vy);
      }
      if (x > maxX) {
        x = maxX;
        vx = -Math.abs(vx);
      }
      if (y > maxY) {
        y = maxY;
        vy = -Math.abs(vy);
      }
    };

    const paint = () => {
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      el.style.setProperty("--pulse", pulse.current.toFixed(3));
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      pointer.current = { x: e.clientX, y: e.clientY };
    };
    const onScroll = () => {
      pulse.current = Math.min(1, pulse.current + 0.35);
      lastAct.current = performance.now();
    };

    const loop = (t: number) => {
      pulse.current *= 0.92;
      const m = modeRef.current;
      const laidOut = m === "talk" || !fine || reduce;

      if (laidOut) {
        el.style.transform = "";
      } else if (m === "wake") {
        const cx = (w() - SIZE) / 2;
        const cy = (h() - SIZE) / 2 - 24;
        x += (cx - x) * 0.12;
        y += (cy - y) * 0.12;
        paint();
      } else {
        if (t > retargetAt) {
          tx = 24 + Math.random() * (w() - SIZE - 48);
          ty = 110 + Math.random() * (h() - SIZE - 140);
          retargetAt = t + 3500 + Math.random() * 3500;
        }
        const idle = t - lastAct.current > IDLE_MS;
        const goal = idle ? park() : { x: tx, y: ty };
        vx += (goal.x - x) * 0.0016;
        vy += (goal.y - y) * 0.0016;

        const px = pointer.current.x;
        const py = pointer.current.y;
        const dx = px - (x + SIZE / 2);
        const dy = py - (y + SIZE / 2);
        const dist = Math.hypot(dx, dy);
        if (dist < 220 && dist > 1) {
          lastAct.current = t;
          vx += (dx / dist) * 0.045 + (-dy / dist) * 0.03;
          vy += (dy / dist) * 0.045 + (dx / dist) * 0.03;
        }

        vx *= 0.96;
        vy *= 0.96;
        const speed = Math.hypot(vx, vy);
        if (speed > 3.2) {
          vx *= 3.2 / speed;
          vy *= 3.2 / speed;
        }
        x += vx;
        y += vy;
        clamp();
        paint();
      }
      raf = requestAnimationFrame(loop);
    };

    if (!fine || reduce) {
      el.style.transform = "";
    } else {
      paint();
      raf = requestAnimationFrame(loop);
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      delete html.dataset.mix;
      delete html.dataset.guide;
    };
  }, [ready]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && modeRef.current === "talk") closeTalk();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  };

  const flyTo = (id: string | null) => {
    if (!id) return;
    const html = document.documentElement;
    html.dataset.guide = id;
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    later(() => {
      if (html.dataset.guide === id) delete html.dataset.guide;
    }, 2400);
  };

  const deliver = (bubble: string, withCard: boolean, wait: number, question: string) => {
    later(() => {
      setTyping(false);
      setMood("hype");
      setMsgs((m) => [...m, { id: nextId.current++, from: "them", text: bubble }]);
      if (withCard) {
        later(() => setMsgs((m) => [...m, { id: nextId.current++, from: "them", card: true }]), 400);
      }
      flyTo(guideSection(question));
    }, wait);
  };

  const ask = async (question: string, history: Msg[]) => {
    setTyping(true);
    setMood("think");
    const started = Date.now();
    const local = localAnswer(question);
    let out = local;
    if (CHATBOT.useLLM) {
      try {
        const messages = history
          .filter((m) => m.text)
          .map((m) => ({ role: m.from === "me" ? "user" : "assistant", content: m.text as string }));
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ messages }),
        });
        if (res.ok) {
          const data = (await res.json()) as { text?: string };
          if (data.text) out = { text: data.text, card: local.card };
        }
      } catch {
        /* local fallback */
      }
    }
    deliver(out.text, out.card, Math.max(0, CHATBOT.typingMs - (Date.now() - started)), question);
  };

  const pick = (q: (typeof CHATBOT.quickReplies)[number]) => {
    if (typing) return;
    setUsed((u) => [...u, q.id]);
    const mine: Msg = { id: nextId.current++, from: "me", text: q.label };
    setMsgs((m) => [...m, mine]);
    if (q.reply) {
      setTyping(true);
      setMood("think");
      deliver(q.reply, q.card, CHATBOT.typingMs, q.label);
    } else {
      const a = localAnswer(q.label);
      setTyping(true);
      setMood("think");
      deliver(a.text, a.card, CHATBOT.typingMs, q.label);
    }
  };

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const v = text.trim().slice(0, CHATBOT.maxInputChars);
    if (!v || typing) return;
    setText("");
    const mine: Msg = { id: nextId.current++, from: "me", text: v };
    setMsgs((m) => [...m, mine]);
    void ask(v, [...msgs, mine]);
  };

  const openTalk = () => {
    setMood("hype");
    setModeBoth("talk");
    lastAct.current = performance.now();
  };

  const closeTalk = () => {
    delete document.documentElement.dataset.mix;
    setMood("calm");
    setModeBoth("wander");
    lastAct.current = performance.now();
  };

  const onOrb = () => {
    setHint(false);
    lastAct.current = performance.now();
    if (modeRef.current === "talk") {
      input.current?.focus();
      return;
    }
    if (modeRef.current === "wake") return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || docked) {
      openTalk();
      return;
    }

    setMood("hype");
    setModeBoth("wake");
    document.documentElement.dataset.mix = "on";
    const stop = playMixPad(MIX_MS);
    later(() => {
      stop();
      delete document.documentElement.dataset.mix;
      openTalk();
    }, MIX_MS);
  };

  if (!ready) return null;

  const remaining = CHATBOT.quickReplies.filter((q) => !used.includes(q.id));
  const laidOut = mode === "talk" || docked;
  const status = mood === "think" ? "thinking…" : mood === "hype" ? "in the mix" : "listening";

  return (
    <div className={`companion-root ${laidOut ? "is-docked" : ""} ${mode === "talk" ? "is-open" : ""}`}>
      {mode === "wake" ? <div className="companion-veil" aria-hidden="true" /> : null}

      <button
        ref={orb}
        type="button"
        className={`companion ${mode === "wake" ? "is-awake" : ""} mood-${mood}`}
        aria-label={mode === "talk" ? "Normie is listening" : "Open Normie, the studio AI"}
        aria-expanded={mode === "talk"}
        aria-controls="companion-panel"
        onClick={onOrb}
      >
        <span className="companion__ring" aria-hidden="true" />
        <span className="companion__glass">
          <Face mood={mood} />
        </span>
        {hint && mode === "wander" ? <span className="companion__hint">Tap me</span> : null}
      </button>

      {mode === "talk" ? (
        <div className="companion-panel glass" id="companion-panel" role="dialog" aria-label="Chat with Normie">
          <div className="companion-panel__head">
            <div>
              <p className="chat__name">Normie</p>
              <p className="chat__status">
                <span className="live-dot" aria-hidden="true" />
                {status}
              </p>
            </div>
            <button type="button" className="companion-panel__close" onClick={closeTalk} aria-label="Close Normie">
              Close
            </button>
          </div>

          <div className="chat__log companion-panel__log" ref={log} role="log" aria-live="polite">
            {msgs.map((m) =>
              m.card ? (
                <div key={m.id} className="msg msg--them msg--card">
                  <dl style={{ margin: 0, display: "grid", gap: 8 }}>
                    <div className="msg__row">
                      <dt>Email</dt>
                      <dd>{PROFILE.email}</dd>
                    </div>
                    <div className="msg__row">
                      <dt>GitHub</dt>
                      <dd>Abubakarshykh</dd>
                    </div>
                    <div className="msg__row">
                      <dt>LinkedIn</dt>
                      <dd>ab-bakar</dd>
                    </div>
                  </dl>
                </div>
              ) : (
                <div key={m.id} className={`msg ${m.from === "me" ? "msg--me" : "msg--them"}`}>
                  {m.text}
                </div>
              ),
            )}
            {typing ? (
              <div className="msg msg--them msg--typing" aria-label="Normie is typing">
                <span />
                <span />
                <span />
              </div>
            ) : null}
          </div>

          <div className="chat__foot companion-panel__foot">
            <div className="chat__quick">
              {remaining.map((q) => (
                <button key={q.id} type="button" className="quick" onClick={() => pick(q)}>
                  {q.label}
                </button>
              ))}
            </div>
            <form className="chat__input" onSubmit={send}>
              <input
                ref={input}
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={CHATBOT.placeholder}
                aria-label="Message Normie"
                maxLength={CHATBOT.maxInputChars}
                disabled={typing}
                autoComplete="off"
              />
              <button type="submit" className="chat__send" aria-label="Send message">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <path d="M3 9h12M10 4l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
