"use client";

import { submitContactForm } from "@/lib/contact-form";
import {
  serviceRequestConfigs,
  type ServiceRequestConfig,
  type ServiceRequestField,
  type ServiceSlug,
} from "@/lib/data";
import { openServiceRequestWhatsApp } from "@/lib/whatsapp";
import { motion, useReducedMotion } from "@/components/ClientMotion";
import { revealInView } from "@/lib/motion-viewport";
import { MessageCircle } from "lucide-react";
import { useMemo, useState } from "react";

const fieldClass =
  "w-full rounded-xl border border-gold/15 bg-bg-primary/85 px-4 py-3 text-sm text-ink-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition-[border-color,box-shadow,background-color] placeholder:text-ink-muted focus:border-gold/45 focus:bg-bg-primary focus:ring-1 focus:ring-gold/20";

const selectClass = `${fieldClass} cursor-pointer appearance-none bg-[length:0.65rem] bg-[right_1rem_center] bg-no-repeat pr-11 [background-image:url("data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20fill%3D%27none%27%20viewBox%3D%270%200%2020%2012%27%3E%3Cpath%20stroke%3D%27%23f5c518%27%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%20stroke-width%3D%272%27%20d%3D%27M2%203l8%206%208-6%27/%3E%3C/svg%3E")]`;

const labelClass = "mb-1.5 block font-outfit text-[11px] font-medium uppercase tracking-[0.14em] text-ink-muted";

const sectionTitleClass =
  "mb-5 border-b border-white/[0.08] pb-3 font-outfit text-[10px] font-semibold uppercase tracking-[0.2em] text-gold/85";

const fileFieldClass =
  "w-full rounded-xl border border-dashed border-gold/25 bg-bg-primary/60 px-4 py-3 text-sm text-ink-secondary file:mr-4 file:rounded-lg file:border-0 file:bg-gold/15 file:px-3 file:py-2 file:text-[11px] file:font-medium file:uppercase file:tracking-wider file:text-ink-primary hover:file:bg-gold/22";

const budgets = [
  "",
  "Under $100k",
  "$100k – $500k",
  "$500k – $2M",
  "$2M+",
  "Prefer to discuss",
] as const;

const timelines = ["", "Under 3 months", "3–6 months", "6–12 months", "12+ months", "Flexible"] as const;

function fieldMap(fields: ServiceRequestField[]) {
  return Object.fromEntries(fields.map((f) => [f.id, f])) as Record<string, ServiceRequestField>;
}

function HoneypotField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <input
      type="text"
      name="_gotcha"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      tabIndex={-1}
      autoComplete="off"
      aria-hidden
      className="pointer-events-none absolute left-[-9999px] h-0 w-0 opacity-0"
    />
  );
}

function FieldLabel({
  field,
  showOptional,
}: {
  field: ServiceRequestField;
  showOptional?: boolean;
}) {
  const optional = showOptional ?? !field.required;
  return (
    <label className={labelClass} htmlFor={`sr-${field.id}`}>
      {field.label}
      {optional ? (
        <span className="ml-1.5 font-normal normal-case tracking-normal text-ink-muted/70">(optional)</span>
      ) : null}
    </label>
  );
}

function ConfiguredServiceRequestForm({
  serviceTitle,
  serviceSlug,
  config,
}: {
  serviceTitle: string;
  serviceSlug: ServiceSlug;
  config: ServiceRequestConfig;
}) {
  const { fields, sections, requireOneOf } = config;
  const fieldsById = useMemo(() => fieldMap(fields), [fields]);

  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.filter((f) => f.type !== "file").map((f) => [f.id, ""])),
  );
  const [fileLists, setFileLists] = useState<Record<string, File[]>>(() =>
    Object.fromEntries(fields.filter((f) => f.type === "file").map((f) => [f.id, []])),
  );
  const [honeypot, setHoneypot] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function setValue(id: string, value: string) {
    setValues((prev) => ({ ...prev, [id]: value }));
  }

  function hasFiles(id: string) {
    return (fileLists[id]?.length ?? 0) > 0;
  }

  function isInOneOfGroup(fieldId: string) {
    return requireOneOf?.some((rule) => rule.fieldIds.includes(fieldId)) ?? false;
  }

  function isOneOfSatisfied(rule: { fieldIds: string[] }) {
    return rule.fieldIds.some((id) => hasFiles(id));
  }

  function showOptionalForField(field: ServiceRequestField) {
    if (field.required) return false;
    const rule = requireOneOf?.find((r) => r.fieldIds.includes(field.id));
    if (!rule) return true;
    const others = rule.fieldIds.filter((id) => id !== field.id);
    return others.some((id) => hasFiles(id));
  }

  function isHtmlRequired(field: ServiceRequestField) {
    if (field.required) return true;
    const rule = requireOneOf?.find((r) => r.fieldIds.includes(field.id));
    if (!rule) return false;
    return !isOneOfSatisfied(rule);
  }

  function renderField(field: ServiceRequestField) {
    const id = `sr-${field.id}`;
    const showOptional = showOptionalForField(field);
    const htmlRequired = isHtmlRequired(field);

    if (field.type === "file") {
      const list = fileLists[field.id] ?? [];
      return (
        <div key={field.id}>
          <FieldLabel field={field} showOptional={showOptional} />
          <input
            id={id}
            type="file"
            className={fileFieldClass}
            accept={field.accept}
            multiple={field.multiple}
            required={htmlRequired && !field.multiple}
            onChange={(e) => {
              const next = Array.from(e.target.files ?? []);
              setFileLists((prev) => ({ ...prev, [field.id]: next }));
            }}
          />
          {list.length > 0 ? (
            <ul className="mt-2 space-y-1 text-xs text-ink-secondary">
              {list.map((file) => (
                <li key={`${field.id}-${file.name}-${file.size}`}>
                  <span className="text-ink-primary">{file.name}</span>
                </li>
              ))}
            </ul>
          ) : null}
          {field.helperText ? (
            <p className="mt-2 text-xs leading-relaxed text-ink-muted">{field.helperText}</p>
          ) : null}
        </div>
      );
    }

    if (field.type === "textarea") {
      return (
        <div key={field.id}>
          <FieldLabel field={field} showOptional={showOptional} />
          <textarea
            id={id}
            className={`${fieldClass} min-h-[96px] resize-y leading-relaxed`}
            style={{ minHeight: field.rows ? `${field.rows * 1.5}rem` : undefined }}
            value={values[field.id] ?? ""}
            onChange={(e) => setValue(field.id, e.target.value)}
            placeholder={field.placeholder}
            rows={field.rows ?? 3}
            required={htmlRequired}
          />
        </div>
      );
    }

    return (
      <div key={field.id}>
        <FieldLabel field={field} showOptional={showOptional} />
        <input
          id={id}
          type={field.type}
          className={fieldClass}
          value={values[field.id] ?? ""}
          onChange={(e) => setValue(field.id, e.target.value)}
          placeholder={field.placeholder}
          autoComplete={field.autoComplete}
          required={htmlRequired}
        />
      </div>
    );
  }

  function collectFieldEntries(): Record<string, string> {
    const fieldEntries: Record<string, string> = {};
    for (const field of fields) {
      if (field.type === "file") {
        const names = fileLists[field.id]?.map((f) => f.name) ?? [];
        fieldEntries[field.label] = names.length ? names.join(", ") : "—";
      } else {
        fieldEntries[field.label] = values[field.id]?.trim() || "—";
      }
    }
    return fieldEntries;
  }

  function validateForm(): string | null {
    const missing: string[] = [];
    for (const field of fields) {
      if (field.required && field.type !== "file") {
        if (!values[field.id]?.trim()) missing.push(field.label);
      }
      if (field.required && field.type === "file" && !isInOneOfGroup(field.id)) {
        if (!hasFiles(field.id)) missing.push(field.label);
      }
    }

    for (const rule of requireOneOf ?? []) {
      if (!isOneOfSatisfied(rule)) missing.push(rule.message);
    }

    if (missing.length > 0) {
      return `Please complete: ${Array.from(new Set(missing)).join(", ")}.`;
    }

    return null;
  }

  function onWhatsApp() {
    setError(null);
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    openServiceRequestWhatsApp(serviceTitle, collectFieldEntries());
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isSubmitting || submitted) return;
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const fieldEntries = collectFieldEntries();

    setIsSubmitting(true);
    const result = await submitContactForm({
      type: "service-request",
      subject: `Service request: ${serviceTitle}`,
      serviceTitle,
      serviceSlug,
      customerName: values.name?.trim() || values.fullName?.trim(),
      customerEmail: values.email?.trim(),
      fields: fieldEntries,
      _gotcha: honeypot,
    });
    setIsSubmitting(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setSubmitted(true);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-10">
      <input type="hidden" name="serviceSlug" value={serviceSlug} readOnly />
      <HoneypotField value={honeypot} onChange={setHoneypot} />

      {sections.map((section) => {
        const sectionFields = section.fieldIds.map((id) => fieldsById[id]).filter(Boolean);
        const isContact = section.id === "contact";

        return (
          <section key={section.id} aria-labelledby={`sr-section-${section.id}`}>
            <h2 id={`sr-section-${section.id}`} className={sectionTitleClass}>
              {section.title}
            </h2>
            {section.id === "photos" && requireOneOf?.length ? (
              <p className="mb-5 text-xs leading-relaxed text-ink-muted">
                Attach final render images, real photos, or both. If you provide one type, the other becomes optional.
              </p>
            ) : null}
            <div className={isContact ? "grid gap-5 sm:grid-cols-2" : "space-y-5"}>
              {sectionFields.map(renderField)}
            </div>
          </section>
        );
      })}

      {error && (
        <p className="rounded-lg border border-red-400/25 bg-red-950/30 px-4 py-3 text-sm text-red-200/95">{error}</p>
      )}

      {submitted && (
        <p className="rounded-lg border border-emerald-400/25 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-100/95">
          Thank you — your request was sent. We respond within two business days.
        </p>
      )}

      <SubmitFooter isSubmitting={isSubmitting} submitted={submitted} onWhatsApp={onWhatsApp} />
    </form>
  );
}

function DefaultServiceRequestForm({
  serviceTitle,
  serviceSlug,
}: {
  serviceTitle: string;
  serviceSlug: ServiceSlug;
}) {
  const [fullName, setFullName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [summary, setSummary] = useState("");
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function collectFieldEntries(): Record<string, string> {
    return {
      "Full name": fullName.trim(),
      Email: userEmail.trim(),
      Phone: phone.trim() || "—",
      "Developer / company": company.trim() || "—",
      Budget: budget || "—",
      Timeline: timeline || "—",
      "Project summary": summary.trim(),
      "Additional notes": message.trim() || "—",
    };
  }

  function validateForm(): string | null {
    if (!fullName.trim() || !userEmail.trim() || !summary.trim()) {
      return "Please fill in your name, email, and project summary.";
    }
    return null;
  }

  function onWhatsApp() {
    setError(null);
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    openServiceRequestWhatsApp(serviceTitle, collectFieldEntries());
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isSubmitting || submitted) return;
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const fieldEntries = collectFieldEntries();

    setIsSubmitting(true);
    const result = await submitContactForm({
      type: "service-request",
      subject: `Service request: ${serviceTitle}`,
      serviceTitle,
      serviceSlug,
      customerName: fullName.trim(),
      customerEmail: userEmail.trim(),
      fields: fieldEntries,
      _gotcha: honeypot,
    });
    setIsSubmitting(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setSubmitted(true);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-10">
      <input type="hidden" name="serviceSlug" value={serviceSlug} readOnly />
      <HoneypotField value={honeypot} onChange={setHoneypot} />

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

      {submitted && (
        <p className="rounded-lg border border-emerald-400/25 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-100/95">
          Thank you — your request was sent. We respond within two business days.
        </p>
      )}

      <SubmitFooter isSubmitting={isSubmitting} submitted={submitted} onWhatsApp={onWhatsApp} />
    </form>
  );
}

function SubmitFooter({
  isSubmitting,
  submitted,
  onWhatsApp,
}: {
  isSubmitting: boolean;
  submitted: boolean;
  onWhatsApp: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 border-t border-white/[0.08] pt-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <button
          type="submit"
          disabled={isSubmitting || submitted}
          className="btn btn--primary shrink-0"
        >
          {isSubmitting ? "Sending…" : submitted ? "Email sent" : "Submit via email"}
        </button>
        <button
          type="button"
          onClick={onWhatsApp}
          className="btn shrink-0 border-emerald-400/45 bg-emerald-500/15 text-ink-primary hover:border-emerald-400/60 hover:bg-emerald-500/25"
        >
          <MessageCircle className="btn__icon" aria-hidden />
          Send via WhatsApp
        </button>
      </div>
      <p className="max-w-xl text-xs leading-relaxed text-ink-muted">
        Send your request by email or WhatsApp. We respond within two business days.
      </p>
    </div>
  );
}

export function ServiceRequestForm({
  serviceTitle,
  serviceSlug,
}: {
  serviceTitle: string;
  serviceSlug: ServiceSlug;
}) {
  const reduceMotion = useReducedMotion();
  const requestConfig = serviceRequestConfigs[serviceSlug];

  return (
    <motion.div
      initial={{ opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={revealInView}
      transition={{ duration: reduceMotion ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      {requestConfig ? (
        <ConfiguredServiceRequestForm
          serviceTitle={serviceTitle}
          serviceSlug={serviceSlug}
          config={requestConfig}
        />
      ) : (
        <DefaultServiceRequestForm serviceTitle={serviceTitle} serviceSlug={serviceSlug} />
      )}
    </motion.div>
  );
}
