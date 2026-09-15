import type { ReactNode } from "react";

export { SectionHeader } from "@/components/AnimatedSectionHeader";
export type { SectionHeaderProps } from "@/components/AnimatedSectionHeader";

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
  const justifyClass = snap ? "justify-center" : "justify-start";
  const base =
    variant === "hero"
      ? "section-hero relative flex w-full flex-col bg-bg-primary"
      : variant === "media"
        ? "section-media relative isolate overflow-hidden bg-bg-primary"
        : `section-page relative flex flex-col ${justifyClass} ${overflowClass} bg-bg-primary`;

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

