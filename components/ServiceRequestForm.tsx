"use client";

import { contact, type ServiceSlug } from "@/lib/data";
import { motion, useReducedMotion } from "@/components/ClientMotion";
import { revealInView } from "@/lib/motion-viewport";
import { useState } from "react";

const fieldClass =
  "w-full rounded-xl border border-gold/15 bg-bg-primary/85 px-4 py-3 text-sm text-ink-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition-[border-color,box-shadow,background-color] placeholder:text-ink-muted focus:border-gold/45 focus:bg-bg-primary focus:ring-1 focus:ring-gold/20";

const selectClass = `${fieldClass} cursor-pointer appearance-none bg-[length:0.65rem] bg-[right_1rem_center] bg-no-repeat pr-11 [background-image:url("data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20fill%3D%27none%27%20viewBox%3D%270%200%2020%2012%27%3E%3Cpath%20stroke%3D%27%23c9a962%27%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%20stroke-width%3D%272%27%20d%3D%27M2%203l8%206%208-6%27/%3E%3C/svg%3E")]`;

const labelClass = "mb-1.5 block font-outfit text-[11px] font-medium uppercase tracking-[0.14em] text-ink-muted";

const sectionTitleClass =
  "mb-5 border-b border-white/[0.08] pb-3 font-outfit text-[10px] font-semibold uppercase tracking-[0.2em] text-gold/85";

const budgets = [
  "",
  "Under $100k",
  "$100k – $500k",
  "$500k – $2M",
  "$2M+",
  "Prefer to discuss",
] as const;

const timelines = ["", "Under 3 months", "3–6 months", "6–12 months", "12+ months", "Flexible"] as const;

export function ServiceRequestForm({
  serviceTitle,
  serviceSlug,
}: {
  serviceTitle: string;
  serviceSlug: ServiceSlug;
}) {
  const reduceMotion = useReducedMotion();
  const email = contact.items.find((i) => i.label === "Email")?.value ?? "hello@odstudio.com";

  const [fullName, setFullName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [summary, setSummary] = useState("");
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!fullName.trim() || !userEmail.trim() || !summary.trim()) {
      setError("Please fill in your name, email, and project summary.");
      return;
    }
    const body = [
      `Service: ${serviceTitle} (${serviceSlug})`,
      "",
      `Name: ${fullName.trim()}`,
      `Email: ${userEmail.trim()}`,
      `Phone: ${phone.trim() || "—"}`,
      `Company: ${company.trim() || "—"}`,
      `Budget: ${budget || "—"}`,
      `Timeline: ${timeline || "—"}`,
      "",
      "Project summary:",
      summary.trim(),
      "",
      "Additional notes:",
      message.trim() || "—",
    ].join("\n");

    window.location.href = `mailto:${email}?subject=${encodeURIComponent(`Service request: ${serviceTitle}`)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <motion.form
      onSubmit={onSubmit}
      className="space-y-10"
      initial={{ opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={revealInView}
      transition={{ duration: reduceMotion ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <input type="hidden" name="serviceSlug" value={serviceSlug} readOnly />

      <section aria-labelledby="sr-section-contact">
        <h2 id="sr-section-contact" className={sectionTitleClass}>
          Contact details
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="sr-name">
              Full name
            </label>
            <input
              id="sr-name"
              className={fieldClass}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="name"
              required
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="sr-email">
              Email
            </label>
            <input
              id="sr-email"
              type="email"
              className={fieldClass}
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="sr-phone">
              Phone
            </label>
            <input
              id="sr-phone"
              type="tel"
              className={fieldClass}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="sr-company">
              Developer / company
            </label>
            <input
              id="sr-company"
              className={fieldClass}
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              autoComplete="organization"
            />
          </div>
        </div>
      </section>

      <section aria-labelledby="sr-section-brief">
        <h2 id="sr-section-brief" className={sectionTitleClass}>
          Project brief
        </h2>
        <div>
          <label className={labelClass} htmlFor="sr-summary">
            Project summary
          </label>
          <textarea
            id="sr-summary"
            className={`${fieldClass} min-h-[128px] resize-y leading-relaxed`}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            required
            placeholder="Site location, scale, goals, and any authority or investor constraints."
          />
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="sr-budget">
              Indicative budget
            </label>
            <select id="sr-budget" className={selectClass} value={budget} onChange={(e) => setBudget(e.target.value)}>
              {budgets.map((b) => (
                <option key={b || "unset"} value={b}>
                  {b || "Select range"}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="sr-timeline">
              Target timeline
            </label>
            <select
              id="sr-timeline"
              className={selectClass}
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
            >
              {timelines.map((t) => (
                <option key={t || "unset-t"} value={t}>
                  {t || "Select timeline"}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5">
          <label className={labelClass} htmlFor="sr-message">
            Additional notes
          </label>
          <textarea
            id="sr-message"
            className={`${fieldClass} min-h-[96px] resize-y leading-relaxed`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Optional: references, competitors, or delivery preferences."
          />
        </div>
      </section>

      {error && (
        <p className="rounded-lg border border-red-400/25 bg-red-950/30 px-4 py-3 text-sm text-red-200/95">{error}</p>
      )}

      <div className="flex flex-col gap-4 border-t border-white/[0.08] pt-8 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <button
          type="submit"
          className="label-upper inline-flex shrink-0 items-center justify-center rounded-full border border-gold/50 bg-gold/15 px-8 py-3.5 text-ink-primary transition-[background-color,border-color,transform] hover:bg-gold/25 active:scale-[0.99]"
        >
          Submit request
        </button>
        <p className="max-w-md text-xs leading-relaxed text-ink-muted sm:text-right">
          Opens your email client with a pre-filled message. We respond within two business days.
        </p>
      </div>
    </motion.form>
  );
}
