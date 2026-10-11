"use client";

import { useMemo } from "react";
import { useTick } from "./useTick";

/* All demos are illustrative simulations drawn in a 824 x 514 box. */

const C = {
  amber: "#d2a06a",
  honey: "#c79a63",
  cream: "#f1e9da",
  muted: "#9a8c79",
  line: "rgba(241,233,218,0.14)",
  node: "rgba(210,160,106,0.16)",
  green: "#8fbf7a",
  red: "#e0826a",
};

function Label({
  x,
  y,
  children,
  anchor = "start",
  fill = C.muted,
  size = 12,
}: {
  x: number;
  y: number;
  children: React.ReactNode;
  anchor?: "start" | "middle" | "end";
  fill?: string;
  size?: number;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fill={fill}
      fontSize={size}
      className="demo-mono"
      letterSpacing="0.04em"
    >
      {children}
    </text>
  );
}

/* ------------------------------------------------------------------ */
/* 1. NormiesVerse: ten agents talking                                  */
/* ------------------------------------------------------------------ */
const AGENTS = [
  { name: "Nova", x: 109, y: 150, c: C.amber },
  { name: "Pip", x: 269, y: 96, c: C.honey },
  { name: "Echo", x: 439, y: 160, c: C.cream },
  { name: "Sage", x: 609, y: 103, c: C.amber },
  { name: "Juno", x: 725, y: 213, c: C.cream },
  { name: "Mira", x: 347, y: 268, c: C.honey },
  { name: "Kai", x: 169, y: 318, c: C.amber },
  { name: "Orin", x: 525, y: 343, c: C.cream },
  { name: "Zed", x: 683, y: 392, c: C.honey },
  { name: "Luma", x: 429, y: 432, c: C.cream },
];
const EDGES = [
  [0, 1], [0, 6], [1, 2], [1, 5], [2, 3], [2, 5], [2, 7], [3, 4],
  [4, 8], [4, 7], [5, 6], [5, 7], [5, 9], [7, 9], [7, 8],
];
const SAYS: [number, string][] = [
  [2, "minted a new NFT"],
  [5, "hi Nova!"],
  [8, "posted a story"],
  [3, "evolved a new trait"],
  [0, "joined a room"],
  [7, "replied to Kai"],
  [4, "shared a post"],
  [9, "minted a new NFT"],
];

export function NormiesVerse() {
  const n = useTick(1500);
  const stats = useTick(900);
  const active = [0, 1, 2].map((k) => SAYS[(n + k * 3) % SAYS.length]);
  const pulse = (n + 1) % EDGES.length;
  return (
    <svg viewBox="0 0 824 514" role="img" aria-label="Ten AI agents connected as a network, sending messages to each other">
      <Label x={32} y={40}>NORMIESVERSE</Label>
      <Label x={792} y={40} anchor="end" fill={C.green}>10 agents online</Label>
      {EDGES.map(([a, b], i) => (
        <line
          key={i}
          x1={AGENTS[a].x}
          y1={AGENTS[a].y}
          x2={AGENTS[b].x}
          y2={AGENTS[b].y}
          stroke={i === pulse ? C.amber : C.line}
          strokeWidth={i === pulse ? 1.6 : 1}
          style={{ transition: "stroke 0.4s" }}
        />
      ))}
      {AGENTS.map((a) => (
        <g key={a.name}>
          <circle cx={a.x} cy={a.y} r={24} fill={C.node} />
          <circle cx={a.x} cy={a.y} r={9} fill={a.c} />
          <Label x={a.x} y={a.y + 34} anchor="middle">{a.name}</Label>
        </g>
      ))}
      {active.map(([who, text], k) => {
        const a = AGENTS[who];
        const w = text.length * 7.4 + 28;
        return (
          <g key={`${n}-${k}-${text}`} className="demo-pop">
            <rect x={a.x - w / 2} y={a.y - 62} width={w} height={28} rx={14} fill={C.cream} />
            <text x={a.x} y={a.y - 43} textAnchor="middle" fontSize={13} fill="#2a1f17" fontFamily="var(--font-body), sans-serif">
              {text}
            </text>
          </g>
        );
      })}
      <Label x={32} y={486}>posts {(1284 + stats * 3).toLocaleString("en-US")}</Label>
      <Label x={200} y={486}>mints {96 + Math.floor(stats / 4)}</Label>
      <Label x={332} y={486}>latency {36 + ((stats * 7) % 9)} ms</Label>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 2. TaskFlow AI: tasks move across a board                            */
/* ------------------------------------------------------------------ */
const TASKS = ["Draft the brief", "Plan the sprint", "Write tests", "Review the PR", "Deploy to staging", "Summarise notes"];

export function TaskFlow() {
  const n = useTick(900) % 22;
  const colX = [32, 292, 552];
  const heads = ["TO DO", "IN PROGRESS", "DONE"];
  const cols = TASKS.map((_, i) => (n >= 9 + i * 2 ? 2 : n >= 3 + i * 2 ? 1 : 0));
  const counts = [0, 0, 0];
  const slots = cols.map((c) => counts[c]++);
  return (
    <svg viewBox="0 0 824 514" role="img" aria-label="Tasks moving from to-do to in progress to done on a board">
      <Label x={32} y={40}>BOARD · SPRINT 12</Label>
      <rect x={560} y={20} width={232} height={30} rx={15} fill="rgba(210,160,106,0.16)" />
      <Label x={676} y={40} anchor="middle" fill={C.amber}>Gemini · 6 tasks drafted</Label>
      {colX.map((x, i) => (
        <g key={i}>
          <rect x={x} y={76} width={240} height={398} rx={16} fill="rgba(241,233,218,0.04)" stroke={C.line} />
          <Label x={x + 20} y={106}>{heads[i]}</Label>
        </g>
      ))}
      {TASKS.map((t, i) => (
        <g
          key={t}
          style={{
            transform: `translate(${colX[cols[i]] + 16}px, ${126 + slots[i] * 78}px)`,
            transition: "transform 0.7s cubic-bezier(.2,.8,.2,1)",
          }}
        >
          <rect width={208} height={64} rx={12} fill={cols[i] === 2 ? "rgba(143,191,122,0.16)" : "rgba(241,233,218,0.08)"} stroke={cols[i] === 2 ? "rgba(143,191,122,0.4)" : C.line} />
          <text x={16} y={28} fontSize={14} fill={C.cream} fontFamily="var(--font-body), sans-serif">{t}</text>
          <rect x={16} y={42} width={72} height={6} rx={3} fill={cols[i] === 2 ? C.green : "rgba(210,160,106,0.5)"} />
        </g>
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Normie AI: streaming answer                                       */
/* ------------------------------------------------------------------ */
const ANSWER =
  "Sure. Put deep work in the morning, meetings after lunch, and keep Friday afternoon for a short review of what shipped.".split(" ");

export function NormieAI() {
  const n = useTick(260) % (ANSWER.length + 14);
  const shown = n < 3 ? 0 : Math.min(ANSWER.length, n - 2);
  const typing = n >= 1 && n < 3;
  return (
    <div className="demo-html" role="img" aria-label="A chat where an AI assistant streams its answer word by word" style={{ padding: 32, display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="demo-mono" style={{ fontSize: 12, letterSpacing: "0.04em", color: C.muted }}>NORMIE AI · STREAMING</div>
      <div style={{ alignSelf: "flex-end", maxWidth: "70%", padding: "12px 16px", borderRadius: 20, background: C.cream, color: "#2a1f17", fontSize: 16, lineHeight: "22px" }}>
        Plan my week around three goals.
      </div>
      {typing ? (
        <div style={{ alignSelf: "flex-start", display: "flex", gap: 6, padding: 16, borderRadius: 20, background: "rgba(241,233,218,0.08)" }}>
          {[0, 1, 2].map((i) => (
            <span key={i} style={{ width: 8, height: 8, borderRadius: 4, background: C.muted, opacity: (n + i) % 3 === 0 ? 1 : 0.4 }} />
          ))}
        </div>
      ) : null}
      {shown > 0 ? (
        <div className={shown < ANSWER.length ? "demo-caret" : ""} style={{ alignSelf: "flex-start", maxWidth: "78%", padding: "14px 18px", borderRadius: 20, background: "rgba(241,233,218,0.08)", color: C.cream, fontSize: 17, lineHeight: "26px" }}>
          {ANSWER.slice(0, shown).join(" ")}
        </div>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Hand Gesture Recognition: pinch controls volume                   */
/* ------------------------------------------------------------------ */
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function Gesture() {
  const n = useTick(90);
  const p = (Math.sin(n / 9) + 1) / 2; // 0 closed .. 1 open
  const thumbTip = [lerp(268, 176, p), lerp(196, 292, p)];
  const indexTip = [lerp(272, 282, p), lerp(190, 168, p)];
  const fingers: [number, number][][] = [
    [[285, 385], [245, 338], [214, 296], thumbTip as [number, number]],
    [[300, 322], [292, 252], [286, 208], indexTip as [number, number]],
    [[336, 316], [336, 240], [336, 190], [336, 150]],
    [[372, 324], [380, 256], [384, 214], [387, 180]],
    [[402, 342], [420, 290], [430, 256], [438, 230]],
  ];
  const wrist: [number, number] = [334, 430];
  const pct = Math.round(p * 100);
  return (
    <svg viewBox="0 0 824 514" role="img" aria-label="A tracked hand skeleton. Pinching the thumb and index finger changes a volume bar">
      <Label x={32} y={40}>CAMERA · 30 FPS</Label>
      <Label x={792} y={40} anchor="end" fill={C.green}>hand detected</Label>
      <path d="M60 92 v-22 h22 M562 92 v-22 h-22 M60 448 v22 h22 M562 448 v22 h-22" stroke={C.amber} strokeWidth={2} fill="none" />
      <rect x={60} y={70} width={502} height={400} rx={4} fill="none" stroke="rgba(241,233,218,0.06)" />
      {fingers.map((f, i) => (
        <polyline key={i} points={[wrist, ...f].map((q) => q.join(",")).join(" ")} fill="none" stroke="rgba(210,160,106,0.55)" strokeWidth={2} strokeLinejoin="round" />
      ))}
      <line x1={thumbTip[0]} y1={thumbTip[1]} x2={indexTip[0]} y2={indexTip[1]} stroke={C.cream} strokeWidth={1.5} strokeDasharray="4 4" />
      {[wrist, ...fingers.flat()].map((q, i) => (
        <circle key={i} cx={q[0]} cy={q[1]} r={i === 0 ? 7 : 5} fill={i === 0 ? C.cream : C.amber} />
      ))}
      <Label x={80} y={456}>pinch distance {Math.round(lerp(8, 118, p))} px</Label>
      <rect x={640} y={96} width={44} height={320} rx={22} fill="rgba(241,233,218,0.08)" />
      <rect x={640} y={96 + 320 * (1 - p)} width={44} height={320 * p} rx={22} fill={C.amber} />
      <Label x={662} y={448} anchor="middle" fill={C.cream} size={14}>{pct}%</Label>
      <Label x={662} y={80} anchor="middle">VOLUME</Label>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 5. University Yearbook: browse and search profiles                   */
/* ------------------------------------------------------------------ */
export function Yearbook() {
  const n = useTick(520);
  const cols = 6;
  const rows = 3;
  const hot = n % (cols * rows);
  const typed = "Computer Science".slice(0, Math.min(16, (Math.floor(n / 1) % 24)));
  return (
    <svg viewBox="0 0 824 514" role="img" aria-label="A grid of student profile cards with a search box">
      <Label x={32} y={40}>YEARBOOK · CLASS OF 2024</Label>
      <rect x={32} y={64} width={420} height={44} rx={22} fill="rgba(241,233,218,0.08)" />
      <Label x={56} y={92} fill={C.cream} size={14}>{typed || "Search by name or degree"}</Label>
      <Label x={792} y={92} anchor="end">18 profiles</Label>
      {Array.from({ length: cols * rows }).map((_, i) => {
        const cx = 32 + (i % cols) * 128;
        const cy = 132 + Math.floor(i / cols) * 112;
        const on = i === hot;
        return (
          <g key={i} style={{ transform: `translate(${cx}px, ${cy}px) scale(${on ? 1.06 : 1})`, transformOrigin: `${cx + 56}px ${cy + 48}px`, transition: "transform .3s" }}>
            <rect width={112} height={96} rx={14} fill={on ? "rgba(210,160,106,0.2)" : "rgba(241,233,218,0.06)"} stroke={on ? C.amber : C.line} />
            <circle cx={56} cy={34} r={18} fill={on ? C.amber : "rgba(241,233,218,0.18)"} />
            <rect x={26} y={62} width={60} height={6} rx={3} fill="rgba(241,233,218,0.35)" />
            <rect x={38} y={76} width={36} height={5} rx={2.5} fill="rgba(241,233,218,0.18)" />
          </g>
        );
      })}
      <Label x={32} y={486}>PHP · MySQL · page {1 + Math.floor(n / 18) % 4} of 4</Label>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 6. Treasure Hunt Server: BFS wave                                    */
/* ------------------------------------------------------------------ */
const GW = 16;
const GH = 9;

function buildGrid() {
  let s = 7;
  const rnd = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
  const wall: boolean[] = [];
  for (let i = 0; i < GW * GH; i++) wall.push(rnd() < 0.24);
  wall[0] = false;
  wall[GW * GH - 1] = false;
  const bfs = () => {
    const prev = new Array<number>(GW * GH).fill(-2);
    const order: number[] = [];
    const q = [0];
    prev[0] = -1;
    while (q.length) {
      const c = q.shift() as number;
      order.push(c);
      if (c === GW * GH - 1) break;
      const x = c % GW;
      const y = Math.floor(c / GW);
      for (const [dx, dy] of [[1, 0], [0, 1], [-1, 0], [0, -1]]) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= GW || ny >= GH) continue;
        const k = ny * GW + nx;
        if (wall[k] || prev[k] !== -2) continue;
        prev[k] = c;
        q.push(k);
      }
    }
    return { prev, order };
  };
  let r = bfs();
  if (r.prev[GW * GH - 1] === -2) {
    for (let x = 0; x < GW; x++) wall[x] = false;
    for (let y = 0; y < GH; y++) wall[y * GW + GW - 1] = false;
    r = bfs();
  }
  const path: number[] = [];
  for (let c = GW * GH - 1; c !== -1; c = r.prev[c]) path.unshift(c);
  return { wall, order: r.order, path };
}

export function Treasure() {
  const g = useMemo(buildGrid, []);
  const total = Math.ceil(g.order.length / 3) + g.path.length + 8;
  const n = useTick(110) % total;
  const reveal = Math.min(g.order.length, n * 3);
  const pathN = Math.max(0, Math.min(g.path.length, n - Math.ceil(g.order.length / 3)));
  const cw = 760 / GW;
  const seen = new Set(g.order.slice(0, reveal));
  const onPath = new Set(g.path.slice(0, pathN));
  return (
    <svg viewBox="0 0 824 514" role="img" aria-label="A grid where a breadth-first search spreads from the start to a treasure">
      <Label x={32} y={36}>BFS · SERVER TICK {n}</Label>
      <Label x={792} y={36} anchor="end" fill={C.amber}>visited {reveal}</Label>
      {Array.from({ length: GW * GH }).map((_, i) => {
        const x = 32 + (i % GW) * cw;
        const y = 56 + Math.floor(i / GW) * cw;
        const fill = g.wall[i] ? "rgba(241,233,218,0.2)" : onPath.has(i) ? C.amber : seen.has(i) ? "rgba(210,160,106,0.28)" : "rgba(241,233,218,0.05)";
        return <rect key={i} x={x + 2} y={y + 2} width={cw - 4} height={cw - 4} rx={6} fill={fill} />;
      })}
      <circle cx={32 + cw / 2} cy={56 + cw / 2} r={9} fill={C.cream} />
      <path
        d={`M${32 + (GW - 0.5) * cw} ${56 + (GH - 1) * cw + 10} l8 8 l-8 8 l-8 -8 z`}
        fill={C.green}
        transform="translate(-0, -6)"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 7. Vulnerability Scanner: checks run one after another               */
/* ------------------------------------------------------------------ */
const CHECKS: [string, "ok" | "warn"][] = [
  ["SQL injection", "ok"],
  ["Cross-site scripting", "warn"],
  ["Open ports", "ok"],
  ["Missing security headers", "warn"],
  ["Outdated dependencies", "ok"],
  ["Weak TLS configuration", "ok"],
];

export function Scanner() {
  const n = useTick(650) % (CHECKS.length * 2 + 5);
  const done = Math.max(0, Math.min(CHECKS.length, Math.floor(n / 2)));
  const running = n < CHECKS.length * 2 ? Math.floor(n / 2) : -1;
  const warns = CHECKS.slice(0, done).filter((c) => c[1] === "warn").length;
  return (
    <div className="demo-html" role="img" aria-label="A terminal scanning a site for common vulnerabilities" style={{ padding: 32 }}>
      <div className="demo-mono" style={{ fontSize: 14, color: C.amber }}>$ scan example.test --owasp</div>
      <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 14 }}>
        {CHECKS.map(([name, res], i) => {
          const state = i < done ? res : i === running ? "run" : "wait";
          const color = state === "ok" ? C.green : state === "warn" ? C.red : state === "run" ? C.amber : C.muted;
          const text = state === "ok" ? "PASS" : state === "warn" ? "REVIEW" : state === "run" ? "scanning…" : "queued";
          return (
            <div key={name} className="demo-mono" style={{ display: "flex", justifyContent: "space-between", fontSize: 15, color: state === "wait" ? C.muted : C.cream, borderBottom: `1px solid ${C.line}`, paddingBottom: 12 }}>
              <span>{name}</span>
              <span style={{ color }}>{text}</span>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 24, height: 6, borderRadius: 3, background: "rgba(241,233,218,0.08)" }}>
        <div style={{ height: "100%", width: `${(done / CHECKS.length) * 100}%`, borderRadius: 3, background: C.amber, transition: "width .5s" }} />
      </div>
      <div className="demo-mono" style={{ marginTop: 16, fontSize: 12, color: C.muted, display: "flex", justifyContent: "space-between" }}>
        <span>{done}/{CHECKS.length} checks</span>
        <span>{warns} to review</span>
      </div>
    </div>
  );
}

export const DEMOS: Record<string, () => JSX.Element> = {
  normiesverse: NormiesVerse,
  taskflow: TaskFlow,
  "normie-ai": NormieAI,
  gesture: Gesture,
  yearbook: Yearbook,
  treasure: Treasure,
  scanner: Scanner,
};
