"use client";

import type { ButtonHTMLAttributes } from "react";

/**
 * Buttons targeted by password-manager / form-filler extensions often get
 * `fdprocessedid` injected before hydration — suppress the mismatch warning.
 */
export function SafeButton({
  type = "button",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} suppressHydrationWarning {...props}>
      {children}
    </button>
  );
}
