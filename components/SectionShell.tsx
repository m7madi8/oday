import type { ReactNode } from "react";

type SectionShellProps = {
  id: string;
  children: ReactNode;
  className?: string;
  /** Full-bleed hero — skips default content padding rhythm */
  variant?: "content" | "hero" | "media";
  snap?: boolean;
  /** Keep section overflow visible so page scroll is not trapped (e.g. Services cards). */
  containOverflow?: boolean;
};

export function SectionShell({
  id,
  children,
  className = "",
  variant = "content",
  snap = true,
  containOverflow = true,
}: SectionShellProps) {
  const overflowClass = containOverflow ? "overflow-hidden" : "overflow-visible";
  const base =
    variant === "hero"
      ? "section-hero relative flex w-full flex-col bg-bg-primary"
      : variant === "media"
        ? "section-media relative isolate overflow-hidden bg-bg-primary"
        : `section-page relative flex flex-col justify-center ${overflowClass} bg-bg-primary`;

  return (
    <section id={id} className={`${base}${snap ? " section-snap" : ""} ${className}`.trim()}>
      {children}
    </section>
  );
}

type SectionInnerProps = {
  children: ReactNode;
  className?: string;
};

export function SectionInner({ children, className = "" }: SectionInnerProps) {
  return <div className={`section-inner ${className}`.trim()}>{children}</div>;
}

type SectionHeaderProps = {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "start";
  className?: string;
  /** Add a scale modifier such as `section-title--lead` for full-viewport media sections. */
  titleClassName?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  className = "",
  titleClassName = "",
}: SectionHeaderProps) {
  const alignClass = align === "center" ? "section-header--center" : "section-header--start";

  return (
    <header className={`section-header ${alignClass} ${className}`.trim()}>
      <p className="label-upper text-gold/90">{eyebrow}</p>
      <h2 className={`section-title mt-2 ${titleClassName}`.trim()}>{title}</h2>
      {description ? <p className="section-lead mt-2">{description}</p> : null}
    </header>
  );
}
