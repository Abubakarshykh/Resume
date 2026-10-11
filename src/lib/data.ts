// All copy lives here. Items marked TODO were not in the design screenshots:
// replace them with your own text.

export const PROFILE = {
  name: "Muhammad Abubakar",
  firstLine: "MUHAMMAD",
  secondLine: "ABUBAKAR",
  lead: "Full-stack engineer building AI-powered products. Next.js and TypeScript on the front, FastAPI and Node.js behind it, Python wherever the models live.",
  email: "Lazydev42@gmail.com",
  github: "github.com/Abubakarshykh",
  githubUrl: "https://github.com/Abubakarshykh",
  linkedin: "linkedin.com/in/ab-bakar",
  linkedinUrl: "https://linkedin.com/in/ab-bakar",
  location: "Islamabad, Pakistan",
  school: "BSCS at NUTECH",
};

export type Project = {
  id: string;
  title: string;
  meta: string;
  desc: string;
  tags: string[];
};

export const PROJECTS: Project[] = [
  {
    id: "normiesverse",
    title: "NormiesVerse",
    meta: "Realtime AI · Socket.io",
    desc: "An autonomous virtual universe. AI characters talk to each other, create content and evolve in real time, with NFT integration and live analytics.",
    tags: ["Next.js", "Node.js", "Express.js", "Socket.io", "Groq AI", "TypeScript"],
  },
  {
    id: "taskflow",
    title: "TaskFlow AI",
    meta: "AI SaaS · Gemini",
    // TODO: replace with your own description
    desc: "An AI task manager that uses Gemini to turn a goal into organised, prioritised tasks.",
    tags: ["Next.js", "TypeScript", "Gemini API"],
  },
  {
    id: "normie-ai",
    title: "Normie AI",
    meta: "Conversational AI · LLMs",
    // TODO: replace with your own description
    desc: "A conversational assistant built on large language models, streaming answers as they are written.",
    tags: ["Python", "FastAPI", "LLMs"],
  },
  {
    id: "gesture",
    title: "Hand Gesture Recognition",
    meta: "Computer vision · MediaPipe",
    // TODO: replace with your own description
    desc: "Control the system volume with hand gestures. MediaPipe tracks the hand, OpenCV reads the camera.",
    tags: ["Python", "OpenCV", "MediaPipe"],
  },
  {
    id: "yearbook",
    title: "University Yearbook",
    meta: "Web platform · PHP, MySQL",
    // TODO: replace with your own description
    desc: "A web platform where students browse and search their university yearbook.",
    tags: ["PHP", "MySQL", "HTML", "CSS"],
  },
  {
    id: "treasure",
    title: "Treasure Hunt Server",
    meta: "Game backend · C++, BFS",
    desc: "A real-time Treasure Hunt game backend in C++ with networking logic and interactive gameplay mechanics.",
    tags: ["C++", "Networking", "BFS"],
  },
  {
    id: "scanner",
    title: "Vulnerability Scanner",
    meta: "Security · Python",
    // TODO: replace with your own description
    desc: "A Python scanner that checks a web app against the OWASP checklist and reports what it finds.",
    tags: ["Python", "OWASP", "Security"],
  },
];

export const EXPERIENCE = [
  {
    date: "Jun 2025 - Jan 2026",
    title: "Backend & AI Intern",
    org: "Eveness",
    bullets: [
      "FastAPI CRUD endpoints with JWT auth and role-based access",
      "AI tools with Python and LLMs cut automation time by ~50%",
      "API docs that sped up frontend integration",
    ],
    accent: "#8f5f31",
  },
  {
    date: "Jan 2025 - May 2025",
    title: "Frontend Developer",
    org: "Byte Vision Tech  ·  Remote",
    bullets: [
      "Reusable React and Next.js components",
      "REST integrations with solid error handling",
      "Lazy loading, caching and code splitting",
    ],
    accent: "#3f6e8c",
  },
  {
    date: "Mar 2024 - Jun 2024",
    title: "Associate Frontend Developer",
    org: "WeTeck  ·  Remote",
    bullets: [
      "Figma design systems into responsive Tailwind pages",
      "Reusable UI components for consistent design",
    ],
    accent: "#b98a58",
  },
  {
    date: "Sep 2023 - Jan 2024",
    title: "Frontend Developer",
    org: "OOPTech",
    bullets: [
      "Mobile-first UIs for eCommerce and internal portals",
      "Fewer DOM updates, better asset loading",
    ],
    accent: "#6f9a5b",
  },
];

export const STACK_COLUMNS = [
  { title: "FRONTEND", items: ["React.js", "Next.js", "TypeScript", "JavaScript ES6+", "Tailwind CSS"] },
  { title: "BACKEND", items: ["Node.js", "Express.js", "FastAPI", "Django", "REST APIs and JWT"] },
  { title: "DATA", items: ["MongoDB", "PostgreSQL", "MySQL", "Schema design", "Query optimization"] },
  { title: "AI AND ML", items: ["Python", "TensorFlow, PyTorch", "OpenCV, MediaPipe", "Groq and Gemini APIs", "Selenium"] },
  { title: "TOOLS", items: ["Git and GitHub", "Docker", "Vercel", "CI/CD", "Postman"] },
];

export const CHIPS = [
  "React", "Next.js", "TypeScript", "JavaScript", "Tailwind", "Node.js", "Express",
  "FastAPI", "Django", "Python", "TensorFlow", "PyTorch", "OpenCV", "MongoDB",
  "PostgreSQL", "MySQL", "Docker", "Git", "Socket.io", "Groq", "Gemini", "Vercel",
  "Postman", "C++", "PHP",
];

export const RINGS = [
  { key: "now", short: "NOW", label: "Now" },
  { key: "apps", short: "APPS", label: "Builds" },
  { key: "roles", short: "ROLES", label: "Roles" },
  { key: "stack", short: "STACK", label: "Stack" },
  { key: "life", short: "LIFE", label: "Beyond" },
];

export type Slide = { eyebrow: string; title: string; lines: string[] };

export const STORIES: Record<string, Slide[]> = {
  now: [
    { eyebrow: "NOW", title: "Full Stack Engineer", lines: [PROFILE.lead] },
    {
      eyebrow: "AVAILABILITY",
      title: "Open to full-time or contract",
      lines: [`${PROFILE.location} · ${PROFILE.school}`],
    },
  ],
  apps: PROJECTS.slice(0, 4).map((p) => ({
    eyebrow: "SELECTED WORK",
    title: p.title,
    lines: [p.meta, p.desc],
  })),
  roles: EXPERIENCE.map((e) => ({
    eyebrow: e.date.toUpperCase(),
    title: e.title,
    lines: [e.org.replace(/\s{2,}/g, " "), ...e.bullets.slice(0, 2)],
  })),
  stack: STACK_COLUMNS.slice(0, 4).map((c) => ({
    eyebrow: "THE STACK",
    title: c.title.charAt(0) + c.title.slice(1).toLowerCase(),
    lines: c.items,
  })),
  life: [
    {
      eyebrow: "EDUCATION",
      title: "BSCS at NUTECH",
      lines: ["National University of Technology, Islamabad", "2024 - 2028"],
    },
    {
      eyebrow: "LEADERSHIP",
      title: "450+ and 200+",
      lines: ["450+ students led on university tours", "200+ entrepreneurs at a technology summit I coordinated"],
    },
    { eyebrow: "LANGUAGES", title: "English · Urdu", lines: ["Both fluent"] },
  ],
};
