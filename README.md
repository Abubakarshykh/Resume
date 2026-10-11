# Muhammad Abubakar · Portfolio

Next.js 14 (App Router) + TypeScript + Tailwind CSS.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Where things are
- `src/lib/data.ts` – all copy (projects, experience, stack, story slides). Items marked `TODO` were not in the design screenshots, so edit them.
- `src/app/globals.css` – design tokens (CSS variables), glass, buttons, cursor.
- `src/styles/sections.css` – section layout and responsive rules.
- `src/components/` – `ui/` (GlassCard, Button, Tag, Eyebrow, SectionHeader, TechChip, StoryRing, Blobs), `sections/` (Nav, Hero, Showcase, Stack, Journey, Contact, Footer), `demos/`, `StoryViewer.tsx`, `Cursor.tsx`.
- `src/fonts/` – self-hosted Bricolage Grotesque, Instrument Sans, DM Mono (from @fontsource). To use `next/font/google` instead, swap the three `localFont` calls in `src/app/layout.tsx`.

## Handy switches
- Section padding: `--section-py` in `globals.css` (128px desktop, 64px mobile).
- Side margin: `--margin` (80px desktop, 24px tablet/mobile).
- Scripted chat replies: `REPLY` in `src/components/sections/Contact.tsx`.

## Where to change things

- **Cursor size**: `src/app/globals.css`, top `:root` block (`--cursor-ring-play`, `--cursor-chip`, `--cursor-dot`, `--cursor-link`, `--cursor-ring-drag`).
- **Hero name size**: `--hero-name-size` in the same block.
- **Button lean toward cursor**: `PULL` / `MAX_PULL` in `src/components/Cursor.tsx` (`PULL = 0` turns it off).
- **Chatbot**: `src/lib/chatbot.ts` (name, greeting, quick replies, typing delay, answers). It answers from `src/lib/data.ts`.
- **Real AI answers (optional)**: copy `.env.example` to `.env.local` and add `ANTHROPIC_API_KEY`. Without it the local engine is used.
