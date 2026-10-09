"use client";

import { submitContactForm } from "@/lib/contact-form";
import { X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

const fieldClass =
  "w-full rounded-xl border border-gold/15 bg-bg-primary/85 px-4 py-3 text-sm text-ink-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition-[border-color,box-shadow,background-color] placeholder:text-ink-muted focus:border-gold/45 focus:bg-bg-primary focus:ring-1 focus:ring-gold/20";

const labelClass =
  "mb-1.5 block font-ui text-xs font-medium uppercase tracking-[0.14em] text-ink-muted";

type StartProjectModalProps = {
  open: boolean;
  onClose: () => void;
};

export function StartProjectModal({ open, onClose }: StartProjectModalProps) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setError(null);
      setIsSubmitting(false);
      setSubmitted(false);
      setFullName("");
      setPhone("");
      setNotes("");
      setHoneypot("");
    }
  }, [open]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (isSubmitting || submitted) return;

    setError(null);
    if (!fullName.trim() || !phone.trim()) {
      setError("Please enter your full name and phone number.");
      return;
    }

    setIsSubmitting(true);
    const result = await submitContactForm({
      type: "service-request",
      subject: "Start Your Project — OD Architects",
      serviceTitle: "Start Your Project",
      serviceSlug: "start-project",
      customerName: fullName.trim(),
      fields: {
        "Full name": fullName.trim(),
        Phone: phone.trim(),
        Notes: notes.trim() || "—",
      },
      _gotcha: honeypot,
    });
    setIsSubmitting(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setSubmitted(true);
  }

  if (!mounted || !open) return null;

  return createPortal(
    <div className="start-project-modal" role="presentation">
      <button
        type="button"
        className="start-project-modal__backdrop"
        aria-label="Close form"
        onClick={onClose}
      />
      <div
        className="start-project-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="start-project-modal__header">
          <div>
            <p className="start-project-modal__eyebrow">Get in touch</p>
            <h2 id={titleId} className="start-project-modal__title">
              Start Your Project
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            className="start-project-modal__close"
            aria-label="Close"
            onClick={onClose}
          >
            <X className="h-5 w-5" strokeWidth={1.75} aria-hidden />
          </button>
        </div>

        {submitted ? (
          <div className="start-project-modal__success">
            <p className="font-display text-xl italic text-white">Thank you.</p>
            <p className="mt-2 text-sm text-white/60">
              Your request was sent. We will get back to you shortly.
            </p>
            <button type="button" className="btn btn--primary mt-6" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="start-project-modal__form">
            <input
              type="text"
              name="_gotcha"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
              className="pointer-events-none absolute left-[-9999px] h-0 w-0 opacity-0"
            />

            <div>
              <label className={labelClass} htmlFor="start-project-name">
                Full name
              </label>
              <input
                id="start-project-name"
                className={fieldClass}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
                required
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="start-project-phone">
                Phone
              </label>
              <input
                id="start-project-phone"
                type="tel"
                className={fieldClass}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
                required
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="start-project-notes">
                Notes
                <span className="ml-1.5 font-normal normal-case tracking-normal text-ink-muted/70">
                  (optional)
                </span>
              </label>
              <textarea
                id="start-project-notes"
                className={`${fieldClass} min-h-[7.5rem] resize-y`}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </div>

            {error ? (
              <p className="text-sm text-red-300/90" role="alert">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              className="btn btn--primary w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending…" : "Send request"}
            </button>
          </form>
        )}
      </div>
    </div>,
    document.body,
  );
}
