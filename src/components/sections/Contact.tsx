"use client";

import { useEffect, useRef, useState } from "react";
import { PROFILE } from "@/lib/data";
import { CHATBOT, localAnswer } from "@/lib/chatbot";
import { Blobs, Button, Eyebrow, GlassCard } from "../ui";

type Msg = { id: number; from: "them" | "me"; text?: string; card?: boolean; liked?: boolean };

function Row({ label, value, action }: { label: string; value: string; action: React.ReactNode }) {
  return (
    <GlassCard radius="sm" className="crow">
      <span className="crow__label">{label}</span>
      <span className="crow__value">{value}</span>
      {action}
    </GlassCard>
  );
}

export default function Contact() {
  const [msgs, setMsgs] = useState<Msg[]>(
    CHATBOT.greeting.map((text, i) => ({ id: i + 1, from: "them" as const, text })),
  );
  const [used, setUsed] = useState<string[]>([]);
  const [typing, setTyping] = useState(false);
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const log = useRef<HTMLDivElement>(null);
  const nextId = useRef(10);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => {
    const el = log.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs, typing]);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  };

  const deliver = (bubble: string, withCard: boolean, wait: number) => {
    later(() => {
      setTyping(false);
      setMsgs((m) => [...m, { id: nextId.current++, from: "them", text: bubble }]);
      if (withCard) {
        later(() => setMsgs((m) => [...m, { id: nextId.current++, from: "them", card: true }]), 450);
      }
    }, wait);
  };

  // Ask the AI route first (if enabled), otherwise use the local engine.
  const ask = async (question: string, history: Msg[]) => {
    setTyping(true);
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
        /* fall back to the local answer */
      }
    }
    deliver(out.text, out.card, Math.max(0, CHATBOT.typingMs - (Date.now() - started)));
  };

  const pick = (q: (typeof CHATBOT.quickReplies)[number]) => {
    if (typing) return;
    setUsed((u) => [...u, q.id]);
    const mine: Msg = { id: nextId.current++, from: "me", text: q.label };
    setMsgs((m) => [...m, mine]);
    if (q.reply) {
      setTyping(true);
      deliver(q.reply, q.card, CHATBOT.typingMs);
    } else {
      const a = localAnswer(q.label);
      setTyping(true);
      deliver(a.text, a.card, CHATBOT.typingMs);
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

  const like = (id: number) =>
    setMsgs((m) => m.map((x) => (x.id === id ? { ...x, liked: !x.liked } : x)));

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      later(() => setCopied(false), 1600);
    } catch {
      window.location.href = `mailto:${PROFILE.email}`;
    }
  };

  const remaining = CHATBOT.quickReplies.filter((q) => !used.includes(q.id));

  return (
    <section id="contact" className="section" aria-labelledby="contact-title">
      <Blobs
        items={[
          { color: "caramel", x: "-8%", y: "10%", size: 760 },
          { color: "honey", x: "62%", y: "-10%", size: 640 },
          { color: "stone", x: "76%", y: "58%", size: 560 },
        ]}
      />
      <div className="wrap">
        <div className="contact__grid">
          <div>
            <Eyebrow>Contact</Eyebrow>
            <h2 className="h-section" id="contact-title">
              Start a conversation
            </h2>
            <p className="contact__lead">Ask the chat anything, or reach me directly. I read everything.</p>
            <div className="contact__rows">
              <Row
                label="Email"
                value={PROFILE.email}
                action={
                  <Button size="sm" onClick={copy} aria-label="Copy email address">
                    {copied ? "Copied" : "Copy"}
                  </Button>
                }
              />
              <Row
                label="GitHub"
                value={PROFILE.github}
                action={
                  <Button size="sm" href={PROFILE.githubUrl} target="_blank" rel="noopener noreferrer" aria-label="Open GitHub profile">
                    Open
                  </Button>
                }
              />
              <Row
                label="LinkedIn"
                value={PROFILE.linkedin}
                action={
                  <Button size="sm" href={PROFILE.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="Open LinkedIn profile">
                    Open
                  </Button>
                }
              />
            </div>
            <p className="contact__loc">{PROFILE.location} · Open to full-time or contract</p>
            <span className="sr-only-text" aria-live="polite">
              {copied ? "Email address copied" : ""}
            </span>
          </div>

          <div>
            <GlassCard className="chat" role="region" aria-label="Chat with Abubakar">
              <div className="chat__head">
                <div className="chat__avatar" aria-hidden="true">
                  <span>A</span>
                </div>
                <div>
                  <p className="chat__name">{CHATBOT.name}</p>
                  <p className="chat__status">
                    <span className="live-dot" aria-hidden="true" />
                    {CHATBOT.status}
                  </p>
                </div>
              </div>

              <div className="chat__log" ref={log} role="log" aria-live="polite" aria-relevant="additions">
                {msgs.map((m) =>
                  m.card ? (
                    <div
                      key={m.id}
                      className="msg msg--them msg--card"
                      onDoubleClick={() => like(m.id)}
                    >
                      <dl style={{ margin: 0, display: "grid", gap: 8 }}>
                        <div className="msg__row"><dt>Email</dt><dd>{PROFILE.email}</dd></div>
                        <div className="msg__row"><dt>GitHub</dt><dd>Abubakarshykh</dd></div>
                        <div className="msg__row"><dt>LinkedIn</dt><dd>ab-bakar</dd></div>
                      </dl>
                      {m.liked ? <Heart /> : null}
                    </div>
                  ) : (
                    <div
                      key={m.id}
                      className={`msg ${m.from === "me" ? "msg--me" : "msg--them"}`}
                      onDoubleClick={() => like(m.id)}
                    >
                      {m.text}
                      {m.liked ? <Heart /> : null}
                    </div>
                  ),
                )}
                {typing ? (
                  <div className="msg msg--them msg--typing" aria-label="Abubakar is typing">
                    <span /><span /><span />
                  </div>
                ) : null}
              </div>

              <div className="chat__foot">
                <div className="chat__quick">
                  {remaining.map((q) => (
                    <button key={q.id} type="button" className="quick" onClick={() => pick(q)}>
                      {q.label}
                    </button>
                  ))}
                </div>
                <form className="chat__input" onSubmit={send}>
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={CHATBOT.placeholder}
                    aria-label="Message the chatbot"
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
            </GlassCard>
            <p className="chat__hint">Double-tap a message to like it</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Heart() {
  return (
    <span className="msg__like" aria-label="Liked">
      <svg width="12" height="12" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M8 14s-5.500-3.400-5.500-7.300A3 3 0 018 5a3 3 0 015.500 1.700C13.500 10.600 8 14 8 14z" fill="currentColor" />
      </svg>
    </span>
  );
}
