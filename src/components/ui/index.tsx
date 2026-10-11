import { forwardRef } from "react";
import type { CSSProperties, ElementType, ReactNode } from "react";

/* ---------- Eyebrow ---------- */
export function Eyebrow({
  children,
  muted,
  className = "",
}: {
  children: ReactNode;
  muted?: boolean;
  className?: string;
}) {
  return <p className={`eyebrow ${muted ? "eyebrow--muted" : ""} ${className}`}>{children}</p>;
}

/* ---------- GlassCard (one reusable glass surface) ---------- */
type GlassProps = {
  as?: ElementType;
  radius?: "lg" | "sm" | "full";
  dark?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
} & Record<string, unknown>;

export function GlassCard({
  as: Tag = "div",
  radius = "lg",
  dark,
  className = "",
  style,
  children,
  ...rest
}: GlassProps) {
  const r = radius === "sm" ? "glass--sm" : radius === "full" ? "glass--full" : "";
  return (
    <Tag className={`glass ${r} ${dark ? "glass--dark" : ""} ${className}`} style={style} {...rest}>
      {children}
    </Tag>
  );
}

/* ---------- Button ---------- */
type ButtonProps = {
  variant?: "primary" | "secondary";
  size?: "md" | "sm" | "nav";
  href?: string;
  className?: string;
  children: ReactNode;
} & Record<string, unknown>;

export function Button({
  variant = "primary",
  size = "md",
  href,
  className = "",
  children,
  ...rest
}: ButtonProps) {
  const cls = [
    "btn",
    variant === "primary" ? "btn--primary" : "btn--secondary glass glass--full",
    size === "sm" ? "btn--sm" : size === "nav" ? "btn--nav" : "",
    className,
  ].join(" ");
  if (href) {
    return (
      <a href={href} className={cls} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" className={cls} {...rest}>
      {children}
    </button>
  );
}

/* ---------- Tag ---------- */
export function Tag({
  children,
  dark,
  className = "",
}: {
  children: ReactNode;
  dark?: boolean;
  className?: string;
}) {
  return <span className={`tag ${dark ? "tag--dark" : ""} ${className}`}>{children}</span>;
}

/* ---------- SectionHeader (eyebrow + heading + optional right caption on same baseline) ---------- */
export function SectionHeader({
  eyebrow,
  title,
  caption,
  id,
}: {
  eyebrow: string;
  title: ReactNode;
  caption?: string;
  id?: string;
}) {
  return (
    <header className="section-head">
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="h-section" id={id}>
          {title}
        </h2>
      </div>
      {caption ? <p className="section-head__caption">{caption}</p> : null}
    </header>
  );
}

/* ---------- Blobs (soft blurred background colour) ---------- */
export type BlobSpec = {
  color: "caramel" | "stone" | "honey";
  x: string;
  y: string;
  size: number;
};
const BLOB_COLOR = {
  caramel: "rgba(216, 185, 143, 0.6)",
  stone: "rgba(184, 177, 164, 0.55)",
  honey: "rgba(199, 154, 99, 0.45)",
} as const;

export function Blobs({ items }: { items: BlobSpec[] }) {
  return (
    <div className="blobs" aria-hidden="true">
      {items.map((b, i) => (
        <span
          key={i}
          className="blob"
          style={{
            left: b.x,
            top: b.y,
            width: b.size,
            height: b.size,
            background: `radial-gradient(closest-side, ${BLOB_COLOR[b.color]}, transparent)`,
            opacity: "var(--blob-opacity, 1)" as unknown as number,
          }}
        />
      ))}
    </div>
  );
}

/* ---------- TechChip (72x72) ---------- */
export const TechChip = forwardRef<
  HTMLDivElement,
  { label: string; icon: ReactNode; style?: CSSProperties; className?: string }
>(function TechChip({ label, icon, style, className = "" }, ref) {
  return (
    <div ref={ref} aria-hidden="true" className={`tech-chip glass glass--sm ${className}`} style={style}>
      <span className="tech-chip__icon">{icon}</span>
      <span className="tech-chip__label">{label}</span>
    </div>
  );
});

/* ---------- StoryRing ---------- */
export function StoryRing({
  short,
  label,
  onClick,
}: {
  short: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <div className="story-ring-wrap">
      <button
        type="button"
        className="story-ring"
        onClick={onClick}
        aria-label={`Open the quick tour: ${label}`}
        aria-haspopup="dialog"
      >
        <span className="story-ring__inner">{short}</span>
      </button>
      <span className="story-ring__label" aria-hidden="true">
        {label}
      </span>
    </div>
  );
}
