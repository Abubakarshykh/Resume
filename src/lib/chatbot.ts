// ============================================================
//  CHATBOT SETTINGS: change things here.
//  The bot answers from your profile (data.ts), so editing data.ts
//  also changes its answers. Optional AI mode: see .env.example.
// ============================================================
import { EXPERIENCE, PROFILE, PROJECTS, STACK_COLUMNS } from "./data";

export const CHATBOT = {
  name: "abubakar",
  status: "Islamabad · open to work",
  placeholder: "Ask me anything",
  greeting: ["Hey, I'm Abubakar.", "Ask me about my projects, stack or experience, or pick a reply below."],
  typingMs: 900, // fake "typing" delay
  maxInputChars: 300,

  // true = try the AI route (/api/chat) first, then fall back to local answers.
  // false = local answers only (no API key needed).
  useLLM: true,
  model: "claude-haiku-4-5", // can be overridden with CHAT_MODEL in .env.local
  maxTokens: 300,

  quickReplies: [
    { id: "hiring", label: "I'm hiring", reply: "Great. I'm open to full-time roles and contract work. Here's where to reach me:", card: true },
    { id: "project", label: "I have a project", reply: "Nice. Tell me what you want to build. Here's where to reach me:", card: true },
    { id: "stack", label: "What's your stack?", reply: "", card: false }, // empty reply = answered by the engine
    { id: "projects", label: "Show your projects", reply: "", card: false },
  ] as { id: string; label: string; reply: string; card: boolean }[],

  fallback: "I'm not sure about that one. The best way to ask me directly is here:",
};

export function buildSystemPrompt() {
  const facts = [
    `Name: ${PROFILE.name}. ${PROFILE.lead}`,
    `Location: ${PROFILE.location}. Education: ${PROFILE.school}. Languages: English and Urdu (fluent).`,
    `Email: ${PROFILE.email}. GitHub: ${PROFILE.github}. LinkedIn: ${PROFILE.linkedin}.`,
    "Availability: open to full-time or contract work.",
    "Projects:\n" + PROJECTS.map((p) => `- ${p.title} (${p.meta}): ${p.desc} Tech: ${p.tags.join(", ")}`).join("\n"),
    "Experience:\n" + EXPERIENCE.map((e) => `- ${e.title}, ${e.org.replace(/\s{2,}/g, " ")} (${e.date}): ${e.bullets.join("; ")}`).join("\n"),
    "Stack:\n" + STACK_COLUMNS.map((c) => `- ${c.title}: ${c.items.join(", ")}`).join("\n"),
    "Leadership: led 450+ students on university tours; coordinated a technology summit for 200+ entrepreneurs.",
  ].join("\n");
  return (
    `You are the chat assistant on ${PROFILE.name}'s portfolio site, speaking in first person as him. ` +
    "Answer only from the facts below. If something is not covered, say you are not sure and point to his email. " +
    "Never invent clients, prices, dates or employers. Keep replies to 1-3 short sentences, plain text, friendly.\n\nFACTS:\n" +
    facts
  );
}

const has = (t: string, ...words: string[]) => words.some((w) => t.includes(w));

/** Local keyword engine: works with no API key. */
export function localAnswer(input: string): { text: string; card: boolean } {
  const t = input.toLowerCase();

  const proj = PROJECTS.find(
    (p) => t.includes(p.title.toLowerCase()) || t.includes(p.id.replace(/-/g, " ")),
  );
  if (proj) return { text: `${proj.title}: ${proj.desc} Built with ${proj.tags.join(", ")}.`, card: false };

  if (has(t, "hire", "hiring", "available", "availability", "job", "work with", "freelance", "contract", "full-time", "full time"))
    return { text: "Yes, I'm open to full-time roles and contract work. Here's where to reach me:", card: true };
  if (has(t, "contact", "email", "reach", "linkedin", "github", "phone", "mail"))
    return { text: "Here's where to reach me:", card: true };
  if (has(t, "rate", "price", "cost", "salary", "charge", "budget"))
    return { text: "It depends on the scope. Send me the details and I'll reply with a clear quote:", card: true };
  if (has(t, "project", "built", "build", "portfolio", "made", "work"))
    return { text: "Recent builds: " + PROJECTS.map((p) => p.title).join(", ") + ". Ask about any of them by name.", card: false };
  if (has(t, "language", "speak", "urdu", "english"))
    return { text: "I speak English and Urdu, both fluent.", card: false };
  if (has(t, "ai", "ml", "machine", "llm", "gemini", "groq", "model", "vision", "opencv"))
    return { text: "I build AI features with Python and LLMs (Groq, Gemini), plus computer vision with OpenCV and MediaPipe. At Eveness this cut automation time by about 50%.", card: false };
  if (has(t, "stack", "skill", "tech", "tools", "use", "react", "next", "python", "node", "typescript", "database", "sql", "mongo"))
    return { text: STACK_COLUMNS.map((c) => `${c.title.charAt(0) + c.title.slice(1).toLowerCase()}: ${c.items.slice(0, 3).join(", ")}`).join(". ") + ".", card: false };
  if (has(t, "experience", "intern", "role", "company", "companies", "worked", "career", "eveness"))
    return { text: "I was a Backend & AI Intern at Eveness (2025), then Frontend Developer at Byte Vision Tech, WeTeck and OOPTech.", card: false };
  if (has(t, "study", "education", "university", "degree", "nutech", "school", "student"))
    return { text: "I'm doing a BSCS at NUTECH, Islamabad (2024 to 2028).", card: false };
  if (has(t, "lead", "event", "summit", "tour"))
    return { text: "I led 450+ students on university tours and coordinated a technology summit for 200+ entrepreneurs.", card: false };
  if (has(t, "where", "location", "live", "city", "country", "time", "timezone", "pakistan", "islamabad"))
    return { text: `I'm based in ${PROFILE.location} (PKT).`, card: false };
  if (has(t, "who", "about", "yourself", "introduce"))
    return { text: PROFILE.lead, card: false };
  if (has(t, "thank", "thanks", "bye", "great", "cool"))
    return { text: "Anytime. Say hi on email whenever you like.", card: false };
  if (/\b(hi|hello|hey|salam|assalam)/.test(t))
    return { text: "Hey! Ask me about my projects, stack or experience.", card: false };
  if (has(t, "normie", "headphone", "mascot", "companion", "emoji"))
    return { text: "That's Normie — the studio AI floating on this page. I answer from the same facts as the contact chat.", card: false };

  return { text: CHATBOT.fallback, card: true };
}

/** Section the companion should fly to after an answer. */
export function guideSection(input: string): string | null {
  const t = input.toLowerCase();
  if (has(t, "hire", "hiring", "i have a project", "contact", "email", "reach", "linkedin", "github")) return "contact";
  if (has(t, "stack", "skill", "tech", "tools", "react", "next", "python", "node")) return "stack";
  if (has(t, "experience", "intern", "role", "company", "career", "eveness", "journey")) return "journey";
  if (has(t, "project", "built", "build", "portfolio", "made", "work", "normies", "taskflow", "gesture", "yearbook", "treasure", "scanner", "demo"))
    return "builds";
  return null;
}
