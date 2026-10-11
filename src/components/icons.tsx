import type { ReactNode } from "react";

const S = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

function Svg({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...S}>
      {children}
    </svg>
  );
}

const t = (s: string) => <span>{s}</span>;

/** Simple stroke icons / text marks, all drawn in currentColor (#5E5043, no copper). */
export const CHIP_ICONS: Record<string, ReactNode> = {
  React: (
    <Svg>
      <circle cx="12" cy="12" r="1.6" />
      <ellipse cx="12" cy="12" rx="9" ry="3.6" />
      <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(120 12 12)" />
    </Svg>
  ),
  "Next.js": (
    <Svg>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 16V8l7 8V8" />
    </Svg>
  ),
  TypeScript: t("TS"),
  JavaScript: t("JS"),
  Tailwind: (
    <Svg>
      <path d="M3 10c1.5-3 3.5-4 6-3 2 1 3 3 6 2s3.500-2 6-3M3 17c1.500-3 3.500-4 6-3 2 1 3 3 6 2s3.500-2 6-3" />
    </Svg>
  ),
  "Node.js": (
    <Svg>
      <path d="M12 3l8 4.500v9L12 21l-8-4.500v-9z" />
      <circle cx="12" cy="12" r="2.500" />
    </Svg>
  ),
  Express: t("Ex"),
  FastAPI: (
    <Svg>
      <path d="M13 3L5 14h6l-1 7 8-11h-6z" />
    </Svg>
  ),
  Django: t("dj"),
  Python: (
    <Svg>
      <rect x="4" y="4" width="10" height="10" rx="4" />
      <rect x="10" y="10" width="10" height="10" rx="4" />
    </Svg>
  ),
  TensorFlow: (
    <Svg>
      <circle cx="5" cy="12" r="2" />
      <circle cx="12" cy="6" r="2" />
      <circle cx="12" cy="18" r="2" />
      <circle cx="19" cy="12" r="2" />
      <path d="M7 11l3-4M7 13l3 4M14 7l3 4M14 17l3-4" />
    </Svg>
  ),
  PyTorch: (
    <Svg>
      <path d="M12 3c3 3.500 5 6 5 9.500a5 5 0 01-10 0C7 9 9 6.500 12 3z" />
    </Svg>
  ),
  OpenCV: (
    <Svg>
      <path d="M2.500 12S6 5.500 12 5.500 21.500 12 21.500 12 18 18.500 12 18.500 2.500 12 2.500 12z" />
      <circle cx="12" cy="12" r="3" />
    </Svg>
  ),
  MongoDB: (
    <Svg>
      <path d="M12 2.500c3.500 3.500 5.500 6.500 5.500 10A5.500 5.500 0 0112 18a5.500 5.500 0 01-5.500-5.500c0-3.500 2-6.500 5.500-10zM12 18v3.500" />
    </Svg>
  ),
  PostgreSQL: (
    <Svg>
      <ellipse cx="12" cy="6" rx="7" ry="3" />
      <path d="M5 6v12c0 1.700 3.100 3 7 3s7-1.300 7-3V6M5 12c0 1.700 3.100 3 7 3s7-1.300 7-3" />
    </Svg>
  ),
  MySQL: (
    <Svg>
      <rect x="4" y="5" width="16" height="14" rx="3" />
      <path d="M4 10h16M4 14.500h16" />
    </Svg>
  ),
  Docker: (
    <Svg>
      <rect x="4" y="11" width="4" height="4" />
      <rect x="9" y="11" width="4" height="4" />
      <rect x="14" y="11" width="4" height="4" />
      <rect x="9" y="6" width="4" height="4" />
      <path d="M3 16.500c1 3 4 4.500 8 4.500 5 0 8-2.500 9-6-1-.5-2-.5-3 0" />
    </Svg>
  ),
  Git: (
    <Svg>
      <circle cx="6" cy="5.500" r="2" />
      <circle cx="6" cy="18.500" r="2" />
      <circle cx="18" cy="9" r="2" />
      <path d="M6 7.500v9M18 11c0 4-6 3-12 6" />
    </Svg>
  ),
  "Socket.io": (
    <Svg>
      <circle cx="12" cy="12" r="2" />
      <path d="M7.500 7.500a6 6 0 000 9M16.500 7.500a6 6 0 010 9M4.500 4.500a10 10 0 000 15M19.500 4.500a10 10 0 010 15" />
    </Svg>
  ),
  Groq: t("Gq"),
  Gemini: (
    <Svg>
      <path d="M12 3c.500 5 4 8.500 9 9-5 .500-8.500 4-9 9-.500-5-4-8.500-9-9 5-.500 8.500-4 9-9z" />
    </Svg>
  ),
  Vercel: (
    <Svg>
      <path d="M12 4l9 16H3z" />
    </Svg>
  ),
  Postman: (
    <Svg>
      <circle cx="12" cy="12" r="8.500" />
      <path d="M8.500 15.500l5.500-5.500M13 9l2.500 2.500" />
    </Svg>
  ),
  "C++": t("C++"),
  PHP: t("php"),
};
