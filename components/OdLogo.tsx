import { OD_FILL, OD_VIEWBOX } from "@/lib/od-logo";

/** Header logo. The intro flies the mark into this element (data-od-nav-logo). */
export function OdLogo({ className = "w-11" }: { className?: string }) {
  return (
    <svg data-od-nav-logo viewBox={OD_VIEWBOX} className={`block overflow-visible ${className}`} role="img" aria-label="OD Architects">
      <path d={OD_FILL} fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}
