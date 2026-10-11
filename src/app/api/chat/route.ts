import { NextResponse } from "next/server";
import { CHATBOT, buildSystemPrompt } from "@/lib/chatbot";

export const runtime = "nodejs";

// Tiny in-memory rate limit: 15 messages per minute per IP.
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  list.push(now);
  hits.set(ip, list);
  return list.length > 15;
}

type In = { role: "user" | "assistant"; content: string };

export async function POST(req: Request) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return NextResponse.json({ error: "no key" }, { status: 503 });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (limited(ip)) return NextResponse.json({ error: "slow down" }, { status: 429 });

  let body: { messages?: In[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }

  const clean: In[] = [];
  for (const m of (body.messages ?? []).slice(-8)) {
    if (!m || (m.role !== "user" && m.role !== "assistant") || typeof m.content !== "string") continue;
    const content = m.content.trim().slice(0, CHATBOT.maxInputChars);
    if (!content) continue;
    const last = clean[clean.length - 1];
    if (last && last.role === m.role) last.content += "\n" + content;
    else clean.push({ role: m.role, content });
  }
  while (clean.length && clean[0].role !== "user") clean.shift();
  if (!clean.length || clean[clean.length - 1].role !== "user")
    return NextResponse.json({ error: "no message" }, { status: 400 });

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: process.env.CHAT_MODEL || CHATBOT.model,
        max_tokens: CHATBOT.maxTokens,
        system: buildSystemPrompt(),
        messages: clean,
      }),
    });
    if (!r.ok) return NextResponse.json({ error: "upstream" }, { status: 502 });
    const data = await r.json();
    const text = (data.content ?? []).map((c: { text?: string }) => c.text ?? "").join("").trim();
    if (!text) return NextResponse.json({ error: "empty" }, { status: 502 });
    return NextResponse.json({ text });
  } catch {
    return NextResponse.json({ error: "failed" }, { status: 502 });
  }
}
