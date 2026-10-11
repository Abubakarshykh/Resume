import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "../styles/sections.css";

// Fonts are self-hosted (from the @fontsource packages) so the build works offline.
// To switch to next/font/google, replace these three with Bricolage_Grotesque,
// Instrument_Sans and DM_Mono from "next/font/google" using the same CSS variables.
const display = localFont({
  src: "../fonts/Bricolage.woff2",
  variable: "--font-display",
  weight: "200 800",
  display: "swap",
});
const body = localFont({
  src: "../fonts/InstrumentSans.woff2",
  variable: "--font-body",
  weight: "400 700",
  display: "swap",
});
const mono = localFont({
  src: [
    { path: "../fonts/DMMono-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/DMMono-500.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Muhammad Abubakar · Full Stack Engineer",
  description:
    "Full-stack engineer building AI-powered products. Next.js and TypeScript on the front, FastAPI and Node.js behind it, Python wherever the models live.",
};

const themeScript = `try{var t=localStorage.getItem('theme');if(t==='dark'||t==='light'){document.documentElement.dataset.theme=t}}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
